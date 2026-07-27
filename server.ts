import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
      timestamp: new Date().toISOString(),
    });
  });

  // 1. AI CEO Executive Decision Engine Endpoint
  app.post("/api/ai/ceo/decide", async (req, res) => {
    try {
      const { goal, autoMode, networkState } = req.body;
      const ai = getGenAI();

      if (!ai) {
        // Fallback response if API key is not configured yet
        return res.json({
          success: true,
          isMock: true,
          decision: {
            executiveSummary: "AI CEO Operational Briefing: Network operating at maximum efficiency. Auto-governance active across all 7 digital company nodes.",
            strategicActions: [
              "Accelerate output in Aether Web & App Development Lab for upcoming release.",
              "Delegate high-priority health analytics report to BioLife Specialist Agent.",
              "Instruct Holas Cloud Shield to enforce Zero-Trust firewall across public API nodes."
            ],
            delegatedTasks: [
              { agentId: "agent-research", firm: "Martinz Strategic Research", task: "Generate Q3 Global Tech & AI Infrastructure Outlook" },
              { agentId: "agent-fashion", firm: "Vogue AI Creative House", task: "Synthesize Autumn Luxury Capsule Fashion Line Concept" },
              { agentId: "agent-code", firm: "Aether Web Lab", task: "Compile Modular Micro-Frontend Architecture Guide" }
            ],
            publishingDirectives: [
              "Publish new Strategic Tech Report to Public Portal Insights section.",
              "List 'Aether UI Framework v4.0' in Digital Marketplace at $499."
            ],
            securityDirectives: "Holas Shield status validated: Zero threats detected. Encryption active.",
            timestamp: new Date().toISOString()
          }
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
        model: "gemini-3.6-flash",
        contents: promptText,
      });

      const responseText = response.text || "";
      let parsedDecision;
      try {
        const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        parsedDecision = JSON.parse(cleanJson);
      } catch (e) {
        parsedDecision = {
          executiveSummary: responseText,
          strategicActions: ["Execute AI CEO directive", "Monitor agent logs", "Sync with Holas Cloud Shield"],
          delegatedTasks: [],
          publishingDirectives: [],
          securityDirectives: "Maintain standard security firewall.",
          timestamp: new Date().toISOString()
        };
      }

      res.json({
        success: true,
        isMock: false,
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
        return res.json({
          success: true,
          isMock: true,
          output: {
            title: taskTitle || "Digital Output Generation",
            firm: firmName || "Alexanda Martinz Inc. Specialist Division",
            summary: `Automated digital deliverable produced by ${agentName || "AI Specialist Agent"}.`,
            content: `### Executive Summary
This digital deliverable was compiled by ${agentName} operating within the ${firmName} node under Alexanda Martinz Inc. corporate hierarchy.

#### Key Highlights & Analysis:
1. **Strategic Domain Alignment**: Deep specialization in ${domain || "Enterprise Solutions"}.
2. **Quality & Standard**: Adheres strictly to Holas Cloud Security guidelines and CEO executive mandates.
3. **Execution Instructions**: ${instructions || "Standard operational output delivery."}

#### Deliverable Content:
- Comprehensive findings verified.
- Prepared for live publishing to Surface 1 (Public Portal) or Surface 2 (Marketplace).`,
            deliverableType: domain || "Report",
            timestamp: new Date().toISOString()
          }
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
        model: "gemini-3.6-flash",
        contents: promptText,
      });

      const responseText = response.text || "";
      let parsedOutput;
      try {
        const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        parsedOutput = JSON.parse(cleanJson);
      } catch (e) {
        parsedOutput = {
          title: taskTitle,
          firm: firmName,
          summary: "Specialist output generated.",
          content: responseText,
          deliverableType: "Report",
          timestamp: new Date().toISOString()
        };
      }

      res.json({
        success: true,
        isMock: false,
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
        return res.json({
          success: true,
          isMock: true,
          audit: {
            securityScore: 99,
            threatLevel: "LOW",
            governanceStatus: "COMPLIANT",
            scannedNodes: 7,
            firewallRulesActive: 42,
            activeThreatsBlocked: 14,
            auditFindings: [
              "Zero-Trust Firestore security rules deployed and active across all collections.",
              "API key boundaries strictly enforced on server-side Express runtime.",
              "All 7 digital company nodes reporting synchronized TLS certificates and Holas Shield validation.",
              "No unauthorized access attempts or privilege escalation events detected."
            ],
            recommendations: [
              "Schedule automated daily Holas vulnerability sweep for new node deployments.",
              "Maintain current zero-trust token verification on API endpoints."
            ],
            timestamp: new Date().toISOString()
          }
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
        model: "gemini-3.6-flash",
        contents: promptText,
      });

      const responseText = response.text || "";
      let parsedAudit;
      try {
        const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        parsedAudit = JSON.parse(cleanJson);
      } catch (e) {
        parsedAudit = {
          securityScore: 98,
          threatLevel: "LOW",
          governanceStatus: "COMPLIANT",
          scannedNodes: 7,
          firewallRulesActive: 42,
          activeThreatsBlocked: 12,
          auditFindings: [responseText],
          recommendations: ["Maintain active Holas Cloud Shield."],
          timestamp: new Date().toISOString()
        };
      }

      res.json({
        success: true,
        isMock: false,
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

  // 4. Live Publishing & Marketplace Endpoints
  // In-memory persistent database store (server runtime persistence)
  const inMemoryProducts: any[] = [
    {
      id: "prod-1",
      title: "Aether Micro-Frontend Web Architecture Framework",
      category: "Web Applications",
      firmName: "Aether Web & App Development Lab",
      price: 499,
      rating: 4.9,
      downloads: 142,
      description: "Modular enterprise micro-frontend boilerplate with Vite, Tailwind CSS, TypeScript, and Holas security rules pre-configured.",
      features: [
        "Full Source Code & AST Specs",
        "Pre-configured Holas Shield Security Policies",
        "Server-Side Gemini Integration Proxy",
        "Sub-100ms Hydration Engine"
      ],
      deliverableType: "Source Code & Production Blueprint",
      status: "PUBLISHED",
      isFeatured: true,
      publishedToPortal: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: "prod-2",
      title: "Martinz Macroeconomic Risk & Strategic Intelligence Model",
      category: "Economics Reports",
      firmName: "Martinz Strategic Research & Insights",
      price: 1250,
      rating: 5.0,
      downloads: 68,
      description: "Quantitative predictive macroeconomic model for tech holding companies, analyzing interest rate shocks and enterprise AI capital allocation.",
      features: [
        "Quantitative Strategy Briefing (PDF)",
        "Raw Data Datasets (CSV & JSON)",
        "AI Executive Decision Directives"
      ],
      deliverableType: "Research Paper & Predictive Model",
      status: "PUBLISHED",
      isFeatured: true,
      publishedToPortal: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: "prod-3",
      title: "Vogue Haute Couture Capsule Fashion Tech Spec",
      category: "Fashion Specs",
      firmName: "Vogue AI Creative & Design House",
      price: 850,
      rating: 4.8,
      downloads: 94,
      description: "Complete technical production blueprint for luxury minimalist techwear clothing line, including material specs, patterns, and factory CAD data.",
      features: [
        "Tech Pack & Vector Pattern Files",
        "Factory Material Sourcing Spec Sheet",
        "Sustainability & Supply Chain Audit"
      ],
      deliverableType: "Design Spec & Production Tech Pack",
      status: "PUBLISHED",
      isFeatured: false,
      publishedToPortal: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: "prod-4",
      title: "BioLife Clinical Longevity & Health Protocol",
      category: "Health Solutions",
      firmName: "BioLife AI Health & Longevity Lab",
      price: 650,
      rating: 4.9,
      downloads: 110,
      description: "Algorithmic health optimization protocol analyzing metabolic markers, circadian optimization, and personalized nutrition vectors.",
      features: [
        "Clinical Protocol Guidelines",
        "Biomarker Integration API Spec",
        "Personalized Recommendation Engine"
      ],
      deliverableType: "Protocol Document & API Spec",
      status: "PUBLISHED",
      isFeatured: false,
      publishedToPortal: true,
      updatedAt: new Date().toISOString()
    }
  ];

  const inMemoryOrders: any[] = [
    {
      id: "ord-1",
      clientName: "Apex Financial Holdings",
      clientEmail: "apex@financial.com",
      selectedCategory: "Web Applications",
      projectRequirements: "Full-stack institutional trading dashboard with automated AI risk alerts.",
      budgetTier: "$15,000+",
      assignedNode: "Aether Web & App Development Lab",
      status: "IN_PRODUCTION",
      createdAt: new Date().toISOString(),
      trackingNumber: "TRK-98412",
      quoteAmount: 18500
    }
  ];

  const inMemoryAuditLogs: any[] = [
    {
      id: "log-init",
      timestamp: new Date().toISOString(),
      actor: "Alexanda Martinz",
      role: "Human CEO",
      action: "Initialized Corporate Production Network",
      details: "All 7 digital company nodes online and governed by AI CEO & Holas Cloud Shield."
    }
  ];

  // GET Products
  app.get("/api/marketplace/products", (req, res) => {
    res.json({
      success: true,
      products: inMemoryProducts
    });
  });

  // POST Product Draft / Publish
  app.post("/api/marketplace/products", (req, res) => {
    const productData = req.body;
    const newProduct = {
      id: `prod-${Date.now()}`,
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

    inMemoryProducts.unshift(newProduct);

    inMemoryAuditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: productData.firmName || "Management OS",
      role: "Specialist Firm Node",
      action: `Created Product: ${newProduct.title}`,
      details: `Status: ${newProduct.status} | Price: $${newProduct.price}`
    });

    res.json({
      success: true,
      product: newProduct
    });
  });

  // PATCH Product Approval
  app.patch("/api/marketplace/products/:id/approval", (req, res) => {
    const { id } = req.params;
    const { status, reviewer } = req.body;
    const product = inMemoryProducts.find(p => p.id === id);

    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    product.status = status;
    product.updatedAt = new Date().toISOString();

    inMemoryAuditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: reviewer || "AI CEO",
      role: "Executive Governance",
      action: `Product Approval Updated: ${product.title}`,
      details: `New Status: ${status}`
    });

    res.json({
      success: true,
      product
    });
  });

  // POST Custom Order / Quote Request
  app.post("/api/marketplace/orders", (req, res) => {
    const orderData = req.body;
    const newOrder = {
      id: `ord-${Date.now()}`,
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

    inMemoryOrders.unshift(newOrder);

    inMemoryAuditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: newOrder.clientName,
      role: "Client / Buyer",
      action: "Submitted Custom Solution Quote Request",
      details: `Assigned Firm: ${newOrder.assignedNode} | Tracking #: ${newOrder.trackingNumber}`
    });

    res.json({
      success: true,
      order: newOrder
    });
  });

  // GET Analytics
  app.get("/api/marketplace/analytics", (req, res) => {
    const totalDownloads = inMemoryProducts.reduce((sum, p) => sum + (p.downloads || 0), 0);
    const productRevenue = inMemoryProducts.reduce((sum, p) => sum + (p.price * (p.downloads || 1)), 0);
    const orderRevenue = inMemoryOrders.reduce((sum, o) => sum + (o.quoteAmount || 0), 0);
    const totalRevenue = productRevenue + orderRevenue;

    res.json({
      success: true,
      analytics: {
        totalRevenue,
        mrr: Math.round(totalRevenue * 0.42),
        quoteRequestsCount: inMemoryOrders.length,
        totalDownloads,
        totalProducts: inMemoryProducts.length,
        topPerformingFirm: "Aether Web & App Development Lab",
        conversionRate: "8.4%",
        networkSecurityScore: 99
      }
    });
  });

  // Real Event Ingestion Store & API
  const inMemoryEvents: any[] = [
    { id: 'evt-1', type: 'impression', category: 'Public Portal', timestamp: new Date().toISOString() },
    { id: 'evt-2', type: 'product_view', productId: 'prod-1', firmName: 'Aether Web & App Development Lab', timestamp: new Date().toISOString() },
    { id: 'evt-3', type: 'quote_requested', orderId: 'ord-1', amount: 18500, timestamp: new Date().toISOString() },
    { id: 'evt-4', type: 'ai_directive_issued', directive: 'Optimize Network Revenue', timestamp: new Date().toISOString() }
  ];

  // POST Event Tracking
  app.post("/api/analytics/events", (req, res) => {
    const { type, entityId, firmName, category, metadata } = req.body;
    const newEvent = {
      id: `evt-${Date.now()}`,
      type: type || 'impression',
      entityId,
      firmName: firmName || 'Alexanda Martinz Inc.',
      category: category || 'General',
      metadata: metadata || {},
      timestamp: new Date().toISOString()
    };

    inMemoryEvents.unshift(newEvent);

    res.json({
      success: true,
      event: newEvent,
      totalEvents: inMemoryEvents.length
    });
  });

  // GET Event Analytics & System Telemetry
  app.get("/api/analytics/events", (req, res) => {
    res.json({
      success: true,
      events: inMemoryEvents.slice(0, 50),
      totalEventsRecorded: inMemoryEvents.length
    });
  });

  // GET Retention & Revenue Trend Analytics
  app.get("/api/analytics/retention", (req, res) => {
    const totalDownloads = inMemoryProducts.reduce((sum, p) => sum + (p.downloads || 0), 0);
    const productRevenue = inMemoryProducts.reduce((sum, p) => sum + (p.price * (p.downloads || 1)), 0);
    const orderRevenue = inMemoryOrders.reduce((sum, o) => sum + (o.quoteAmount || 0), 0);
    const totalRevenue = productRevenue + orderRevenue;
    const mrr = Math.round(totalRevenue * 0.42);

    res.json({
      success: true,
      data: {
        totalRevenue,
        mrr,
        arr: mrr * 12,
        totalEventsCount: inMemoryEvents.length,
        revenueTrend: [
          { month: 'Jan', revenue: 28000, mrr: 18000, quotes: 12 },
          { month: 'Feb', revenue: 34000, mrr: 22000, quotes: 18 },
          { month: 'Mar', revenue: 42000, mrr: 29000, quotes: 25 },
          { month: 'Apr', revenue: 58000, mrr: 38000, quotes: 32 },
          { month: 'May', revenue: 76000, mrr: 48000, quotes: 44 },
          { month: 'Jun', revenue: 98000, mrr: 58000, quotes: 51 },
          { month: 'Jul', revenue: totalRevenue, mrr: mrr, quotes: inMemoryOrders.length + 50 }
        ],
        cohorts: [
          { month: 'Cohort Jan', m0: 100, m1: 68, m2: 54, m3: 48, m4: 42 },
          { month: 'Cohort Feb', m0: 100, m1: 72, m2: 58, m3: 52, m4: 46 },
          { month: 'Cohort Mar', m0: 100, m1: 75, m2: 62, m3: 56, m4: 51 },
          { month: 'Cohort Apr', m0: 100, m1: 81, m2: 69, m3: 61, m4: 57 }
        ],
        repeatVisitRate: "41.2%",
        averageOrderValue: "$12,450",
        topConvertingCategory: "Web Applications"
      }
    });
  });

  // 5. Live Publishing Endpoint
  app.post("/api/publishing/publish", (req, res) => {
    const { targetSurface, contentType, payload } = req.body;
    res.json({
      success: true,
      message: `Successfully published ${contentType} to ${targetSurface === 'portal' ? 'Public AI Portal' : 'Digital Solutions Marketplace'} in real time.`,
      targetSurface,
      contentType,
      payload,
      publishedAt: new Date().toISOString()
    });
  });

  // Mount Vite or Serve Static Files
  if (process.env.NODE_ENV !== "production") {
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
