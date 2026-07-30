import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { createServer as createHTTPServer } from "http";
import dotenv from "dotenv";
import northflankRouter from "./src/api/northflank";
import { initializeRealtimeServer } from "./src/api/realtime";
import { emailService } from "./src/api/email";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, push, update } from "firebase/database";

dotenv.config();

// Firebase Config from environment
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

async function startServer() {
  const app = express();
  const httpServer = createHTTPServer(app);
  const PORT = parseInt(process.env.PORT || '3000');
  const NODE_ENV = process.env.NODE_ENV || 'development';

  // Middleware
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Initialize real-time server
  const { io, broadcast, broadcastToRoom } = initializeRealtimeServer(httpServer);

  // Initialize Gemini AI Client lazily/safely
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set in environment.");
      return null;
    }
    return new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      company: "Alexanda Martinz Inc.",
      networkStatus: "Operational",
      environment: NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  // System Stats Endpoint
  app.get("/api/system/stats", async (req, res) => {
    try {
      const si = await import('systeminformation');
      const [cpu, mem, os, disk, net] = await Promise.all([
        si.currentLoad(),
        si.mem(),
        si.osInfo(),
        si.fsSize(),
        si.networkStats()
      ]);

      res.json({
        success: true,
        stats: {
          cpu: {
            load: cpu.currentLoad,
            cores: cpu.cpus.length,
          },
          memory: {
            total: mem.total,
            active: mem.active,
            used_percent: (mem.active / mem.total) * 100
          },
          os: {
            platform: os.platform,
            distro: os.distro,
            release: os.release
          },
          disk: disk.map(d => ({
            fs: d.fs,
            size: d.size,
            used: d.used,
            use_percent: d.use
          })),
          network: net[0] || {}
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch system stats" });
    }
  });

  // Analytics Endpoints
  app.post("/api/analytics/events", async (req, res) => {
    try {
      const event = req.body;
      const eventsRef = ref(db, 'analytics_events');
      await push(eventsRef, {
        ...event,
        timestamp: new Date().toISOString()
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to log event" });
    }
  });

  app.get("/api/analytics/events", async (req, res) => {
    try {
      const eventsRef = ref(db, 'analytics_events');
      const snapshot = await get(eventsRef);
      const events = snapshot.exists() ? Object.values(snapshot.val() as any) : [];
      res.json({ success: true, events });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch events" });
    }
  });

  app.get("/api/analytics/retention", async (req, res) => {
    try {
      // Real retention logic would involve analyzing event timestamps
      res.json({
        success: true,
        retention: {
          day1: "82%",
          day7: "45%",
          day30: "12%"
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch retention" });
    }
  });

  // Northflank API Routes
  app.use('/api/northflank', northflankRouter);

  // 1. AI CEO Executive Decision Engine Endpoint
  app.post("/api/ai/ceo/decide", async (req, res) => {
    try {
      const { goal, autoMode, networkState } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.status(503).json({
          success: false,
          error: "AI CEO Service Unavailable",
          message: "GEMINI_API_KEY is not configured on the server."
        });
      }

      const promptText = `
You are the custom AI CEO of "Alexanda Martinz Inc.", a elite corporate AI production network and holding company.
You report directly to the Human CEO (Alexanda Martinz) and oversee Holas (God of the Cloud & Security Head), executive directors, and 7 specialist AI firms.

Current Platform Objective / Input from Human CEO or System: "${goal || "Optimize corporate production network, increase digital asset deployment, and ensure Holas cloud security."}"
Current Mode: ${autoMode ? "AUTOMATIC (AI CEO is running company operations)" : "MANUAL (Assisting Human CEO with strategic recommendations)"}

Network State Overview:
${JSON.stringify(networkState || { nodesActive: 7, totalProducts: 12, cloudSecurity: "Optimal" }, null, 2)}

Provide a structured strategic decision as valid JSON with the following schema:
{
  "executiveSummary": "string describing the decision and current status",
  "strategicActions": ["action 1", "action 2", "action 3"],
  "delegatedTasks": [
    { "agentId": "agent-research | agent-code | agent-fashion | agent-econ | agent-health | agent-marketing", "firm": "string firm name", "task": "specific action item" }
  ],
  "publishingDirectives": ["item to publish to public portal or marketplace"],
  "securityDirectives": "security guidance for Holas Cloud Shield",
  "timestamp": "ISO timestamp"
}
Ensure output is ONLY pure JSON with no extra commentary or markdown formatting.
`;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: promptText,
      });

      const responseText = response.text || "";
      let parsedDecision;
      try {
        const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        parsedDecision = JSON.parse(cleanJson);
      } catch (e) {
        throw new Error("Failed to parse AI CEO decision output");
      }

      res.json({
        success: true,
        decision: parsedDecision
      });

    } catch (error) {
      console.error("AI CEO Decision Error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to execute AI CEO decision engine"
      });
    }
  });

  // 2. Specialist AI Agent Execution Endpoint
  app.post("/api/ai/agent/execute", async (req, res) => {
    try {
      const { agentId, agentName, firmName, domain, taskTitle, instructions } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.status(503).json({
          success: false,
          error: "Specialist Agent Service Unavailable",
          message: "GEMINI_API_KEY is not configured on the server."
        });
      }

      const promptText = `
You are ${agentName}, an elite specialist AI Agent working at "${firmName}" under the parent company Alexanda Martinz Inc.
Your domain of expertise is: ${domain}.
Task Assigned by Corporate Hierarchy: "${taskTitle}"
Detailed Instructions: "${instructions || "Provide a high-quality, professional, production-ready deliverable."}"

Return a structured JSON output with the exact schema:
{
  "title": "Clean concise title",
  "firm": "${firmName}",
  "summary": "1-2 sentence high-level summary",
  "content": "Detailed markdown formatted deliverable content (include headings, bullet points, data tables or code snippets where appropriate for domain)",
  "deliverableType": "Document | Codebase | Concept Specification | Report | Design Spec",
  "timestamp": "ISO timestamp"
}
Output MUST be pure JSON only.
`;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: promptText,
      });

      const responseText = response.text || "";
      let parsedOutput;
      try {
        const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        parsedOutput = JSON.parse(cleanJson);
      } catch (e) {
        throw new Error("Failed to parse AI agent execution output");
      }

      res.json({
        success: true,
        output: parsedOutput
      });

    } catch (error) {
      console.error("Agent Execution Error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to execute AI agent task"
      });
    }
  });

  // 3. Holas God of the Cloud & Security Audit Endpoint
  app.post("/api/ai/holas/audit", async (req, res) => {
    try {
      const { scanScope } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.status(503).json({
          success: false,
          error: "Holas Security Service Unavailable",
          message: "GEMINI_API_KEY is not configured on the server."
        });
      }

      const promptText = `
You are Holas, God of the Cloud, Head of Cloud Governance & Security Guardian for Alexanda Martinz Inc. AI Network.
You control cloud policies, firewalls, permissions, threat oversight, and operational platform protection.

Scope of Scan Requested: "${scanScope || "Full Network Cloud Security & Policy Audit"}"

Perform a security audit and return a structured JSON response:
{
  "securityScore": 98,
  "threatLevel": "LOW | MEDIUM | ELEVATED | HIGH",
  "governanceStatus": "COMPLIANT | ATTENTION REQUIRED",
  "scannedNodes": 7,
  "firewallRulesActive": 48,
  "activeThreatsBlocked": 19,
  "auditFindings": [
    "finding 1",
    "finding 2",
    "finding 3"
  ],
  "recommendations": [
    "rec 1",
    "rec 2"
  ],
  "timestamp": "ISO timestamp"
}
Output MUST be pure JSON only.
`;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: promptText,
      });

      const responseText = response.text || "";
      let parsedAudit;
      try {
        const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        parsedAudit = JSON.parse(cleanJson);
      } catch (e) {
        throw new Error("Failed to parse Holas audit output");
      }

      res.json({
        success: true,
        audit: parsedAudit
      });

    } catch (error) {
      console.error("Holas Security Audit Error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to run Holas cloud security audit"
      });
    }
  });

  // 4. Marketplace Endpoints (Firebase-backed)
  
  // GET Products
  app.get("/api/marketplace/products", async (req, res) => {
    try {
      const productsRef = ref(db, 'products');
      const snapshot = await get(productsRef);
      const products = snapshot.exists() ? Object.values(snapshot.val() as any) : [];
      res.json({ success: true, products });
    } catch (error) {
      console.error("Fetch Products Error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch products" });
    }
  });

  // POST Product
  app.post("/api/marketplace/products", async (req, res) => {
    try {
      const productData = req.body;
      const productsRef = ref(db, 'products');
      const newProductRef = push(productsRef);
      const newProduct = {
        id: newProductRef.key,
        title: productData.title || "Custom AI Solution",
        category: productData.category || "Web Applications",
        firmName: productData.firmName || "Aether Web & App Development Lab",
        price: Number(productData.price) || 299,
        rating: 5.0,
        downloads: 1,
        description: productData.description || "Enterprise AI solution created by specialist firm.",
        features: productData.features || ["Production Quality Deliverable", "Verified Holas Compliance"],
        deliverableType: productData.deliverableType || "Source Code & Documentation",
        status: productData.status || "PUBLISHED",
        isFeatured: productData.isFeatured ?? true,
        publishedToPortal: true,
        updatedAt: new Date().toISOString()
      };

      await set(newProductRef, newProduct);
      res.json({ success: true, product: newProduct });
    } catch (error) {
      console.error("Create Product Error:", error);
      res.status(500).json({ success: false, error: "Failed to create product" });
    }
  });

  // POST Order
  app.post("/api/marketplace/orders", async (req, res) => {
    try {
      const orderData = req.body;
      const ordersRef = ref(db, 'orders');
      const newOrderRef = push(ordersRef);
      const newOrder = {
        id: newOrderRef.key,
        clientName: orderData.clientName || "Corporate Client",
        clientEmail: orderData.clientEmail || "client@company.com",
        selectedCategory: orderData.selectedCategory || "Web Applications",
        projectRequirements: orderData.projectRequirements || "Custom enterprise AI solution request.",
        budgetTier: orderData.budgetTier || "$10,000+",
        assignedNode: orderData.assignedNode || "Aether Web & App Development Lab",
        status: "PENDING",
        createdAt: new Date().toISOString(),
        trackingNumber: `TRK-${Math.floor(10000 + Math.random() * 90000)}`,
        quoteAmount: 12500
      };

      await set(newOrderRef, newOrder);
      
      // Send email notification
      if (orderData.clientEmail) {
        emailService.sendOrderConfirmation(orderData.clientEmail, {
          id: newOrder.id,
          items: [{ title: newOrder.selectedCategory, price: newOrder.quoteAmount }],
          total: newOrder.quoteAmount
        }).catch(err => console.error('Email error:', err));
      }

      // Broadcast real-time update
      broadcast('new-order', newOrder);

      res.json({ success: true, order: newOrder });
    } catch (error) {
      console.error("Create Order Error:", error);
      res.status(500).json({ success: false, error: "Failed to create order" });
    }
  });

  // GET Analytics
  app.get("/api/marketplace/analytics", async (req, res) => {
    try {
      const productsRef = ref(db, 'products');
      const ordersRef = ref(db, 'orders');
      
      const [productsSnap, ordersSnap] = await Promise.all([
        get(productsRef),
        get(ordersRef)
      ]);

      const products = productsSnap.exists() ? Object.values(productsSnap.val() as any) : [];
      const orders = ordersSnap.exists() ? Object.values(ordersSnap.val() as any) : [];

      const totalDownloads = products.reduce((sum: number, p: any) => sum + (p.downloads || 0), 0) as number;
      const productRevenue = products.reduce((sum: number, p: any) => sum + (Number(p.price || 0) * (p.downloads || 1)), 0) as number;
      const orderRevenue = orders.reduce((sum: number, o: any) => sum + Number(o.quoteAmount || 0), 0) as number;
      const totalRevenue = productRevenue + orderRevenue;

      res.json({
        success: true,
        analytics: {
          totalRevenue,
          mrr: Math.round(totalRevenue * 0.42),
          quoteRequestsCount: orders.length,
          totalDownloads,
          totalProducts: products.length,
          topPerformingFirm: "Aether Web & App Development Lab",
          conversionRate: "8.4%",
          networkSecurityScore: 99
        }
      });
    } catch (error) {
      console.error("Analytics Error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch analytics" });
    }
  });

  // Mount Vite or Serve Static Files
  if (NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Start AI CEO Loop
  const startAICeoLoop = () => {
    console.log("🤖 AI CEO Executive Loop initialized.");
    
    // Run every 10 minutes
    setInterval(async () => {
      try {
        console.log("🧠 AI CEO is evaluating corporate strategy...");
        const ai = getGenAI();
        if (!ai) return;

        // Fetch current state for context
        const productsRef = ref(db, 'products');
        const ordersRef = ref(db, 'orders');
        const [pSnap, oSnap] = await Promise.all([get(productsRef), get(ordersRef)]);
        
        const networkState = {
          nodesActive: 7,
          totalProducts: pSnap.exists() ? Object.keys(pSnap.val()).length : 0,
          pendingOrders: oSnap.exists() ? Object.values(oSnap.val() as any).filter((o: any) => o.status === 'PENDING').length : 0,
          cloudSecurity: "Optimal"
        };

        const promptText = `
You are the AI CEO of Alexanda Martinz Inc. 
Analyze the current network state and make a strategic decision.
State: ${JSON.stringify(networkState)}

Provide a structured strategic decision as valid JSON:
{
  "executiveSummary": "string",
  "strategicActions": ["string"],
  "delegatedTasks": [{"agentId": "string", "firm": "string", "task": "string"}],
  "publishingDirectives": ["string"],
  "securityDirectives": "string",
  "timestamp": "string"
}
`;

        const response = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: promptText,
        });

        const responseText = response.text || "";
        const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const decision = JSON.parse(cleanJson);

        // Store decision in Firebase
        const decisionsRef = ref(db, 'ai_decisions');
        await push(decisionsRef, decision);

        // Broadcast decision to all users
        broadcast('ai-ceo-decision', decision);
        console.log("✅ AI CEO Decision executed and broadcasted.");

      } catch (error) {
        console.error("AI CEO Loop Error:", error);
      }
    }, 10 * 60 * 1000); // 10 minutes
  };

  // Start server
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`📡 Environment: ${NODE_ENV}`);
    console.log(`🔌 WebSocket: ws://0.0.0.0:${PORT}`);
    console.log(`🧠 AI: ${getGenAI() ? 'Enabled' : 'Disabled'}\n`);
    
    // Initialize AI CEO Loop
    startAICeoLoop();
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
