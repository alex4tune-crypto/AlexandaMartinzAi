import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SurfaceType, 
  DashboardSubTab, 
  CorporateNode, 
  SpecialistAgent, 
  DigitalProduct, 
  ResearchInsight, 
  HolasSecurityEvent, 
  AuditLogItem, 
  CustomOrderRequest,
  AiCeoDecision,
  UserPersona,
  ProfitAnalytics
} from '../types';
import { 
  INITIAL_CORPORATE_NODES, 
  INITIAL_SPECIALIST_AGENTS, 
  INITIAL_PRODUCTS, 
  INITIAL_RESEARCH_INSIGHTS, 
  INITIAL_HOLAS_EVENTS, 
  INITIAL_AUDIT_LOGS 
} from '../data/initialData';
import { 
  requestAiCeoDecision, 
  executeSpecialistAgentTask, 
  requestHolasSecurityAudit, 
  publishContentToSurface 
} from '../services/apiService';
import {
  subscribeToProductsFromFirestore,
  saveProductToFirestore,
  seedFirestoreProductsIfEmpty
} from '../modules/marketplace/services/marketplaceService';

interface PlatformContextType {
  currentSurface: SurfaceType;
  setCurrentSurface: (surface: SurfaceType) => void;
  dashboardTab: DashboardSubTab;
  setDashboardTab: (tab: DashboardSubTab) => void;
  
  // User Persona
  userPersona: UserPersona;
  setUserPersona: (persona: UserPersona) => void;

  // Favorites
  favorites: string[];
  toggleFavoriteProduct: (productId: string) => void;

  // AI CEO State
  aiCeoAutoMode: boolean;
  toggleAiCeoMode: () => void;
  activeCeoGoal: string;
  setActiveCeoGoal: (goal: string) => void;
  latestCeoDecision: AiCeoDecision | null;
  isCeoThinking: boolean;
  triggerCeoDecision: (customGoal?: string) => Promise<AiCeoDecision | void>;

  // AI Product Factory Synthesis
  isSynthesizingProduct: boolean;
  triggerAiProductSynthesis: (firmName?: string, category?: string, titlePrompt?: string) => Promise<DigitalProduct | void>;

  // Corporate Entities
  nodes: CorporateNode[];
  agents: SpecialistAgent[];
  products: DigitalProduct[];
  insights: ResearchInsight[];
  holasEvents: HolasSecurityEvent[];
  auditLogs: AuditLogItem[];
  customOrders: CustomOrderRequest[];
  analytics: ProfitAnalytics;

  // Actions
  isAgentExecuting: boolean;
  triggerAgentTask: (agentId: string, taskTitle: string, instructions?: string) => Promise<any>;
  
  isHolasAuditing: boolean;
  triggerHolasAudit: (scope?: string) => Promise<any>;
  
  publishNewProduct: (productData: Partial<DigitalProduct>) => Promise<void>;
  publishNewInsight: (insightData: Partial<ResearchInsight>) => Promise<void>;
  submitOrderRequest: (order: Partial<CustomOrderRequest>) => void;
  updateOrderStatus: (orderId: string, newStatus: 'PENDING' | 'IN_PRODUCTION' | 'DELIVERED') => void;
  
  addAuditLog: (actor: string, role: string, action: string, details: string, status?: 'SUCCESS' | 'WARNING' | 'FAILED') => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSurface, setCurrentSurface] = useState<SurfaceType>('portal');
  const [dashboardTab, setDashboardTab] = useState<DashboardSubTab>('hierarchy');
  const [userPersona, setUserPersona] = useState<UserPersona>('Buyer');
  const [favorites, setFavorites] = useState<string[]>(['prod-01', 'prod-02']);

  // AI CEO Mode
  const [aiCeoAutoMode, setAiCeoAutoMode] = useState<boolean>(true);
  const [activeCeoGoal, setActiveCeoGoal] = useState<string>(
    'Maximize cross-node AI production output, publish new technology insights, and maintain Holas cloud governance.'
  );
  const [latestCeoDecision, setLatestCeoDecision] = useState<AiCeoDecision | null>({
    executiveSummary: 'AI CEO Operational Briefing: Network operating at peak efficiency across all 7 corporate nodes. Automated task delegation and marketplace product publishing active.',
    strategicActions: [
      'Accelerate output in Aether Web & App Development Lab for upcoming v4.2 release.',
      'Instruct BioLife Specialist Agent to synthesize cellular longevity research.',
      'Deploy Holas Cloud Shield rate limiting policies across public API gateways.'
    ],
    delegatedTasks: [
      { agentId: 'agent-web-01', firm: 'Aether Web Lab', task: 'Compile Full-Stack Microservices Architecture' },
      { agentId: 'agent-research-01', firm: 'Martinz Strategic Research', task: 'Draft AI Agent Governance Whitepaper' }
    ],
    publishingDirectives: [
      'Published "Shift to Autonomous Agent Networks" paper to Public Portal Insights.',
      'Listed "Aether Enterprise React SaaS Accelerator" in Marketplace.'
    ],
    securityDirectives: 'Holas Cloud Shield: Zero vulnerabilities. Firewall active.',
    timestamp: new Date().toISOString()
  });
  const [isCeoThinking, setIsCeoThinking] = useState<boolean>(false);
  const [isSynthesizingProduct, setIsSynthesizingProduct] = useState<boolean>(false);

  // Entities
  const [nodes, setNodes] = useState<CorporateNode[]>(INITIAL_CORPORATE_NODES);
  const [agents, setAgents] = useState<SpecialistAgent[]>(INITIAL_SPECIALIST_AGENTS);
  const [products, setProducts] = useState<DigitalProduct[]>(INITIAL_PRODUCTS);

  // Sync real product documents with Firestore
  useEffect(() => {
    seedFirestoreProductsIfEmpty(INITIAL_PRODUCTS).catch(err => {
      console.warn('Firestore initial seeding skipped:', err);
    });

    const unsubscribe = subscribeToProductsFromFirestore(
      (firestoreProducts) => {
        if (firestoreProducts && firestoreProducts.length > 0) {
          setProducts(firestoreProducts);
        }
      },
      (err) => {
        console.warn('Firestore products subscription error:', err);
      }
    );

    return () => unsubscribe();
  }, []);
  const [insights, setInsights] = useState<ResearchInsight[]>(INITIAL_RESEARCH_INSIGHTS);
  const [holasEvents, setHolasEvents] = useState<HolasSecurityEvent[]>(INITIAL_HOLAS_EVENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [customOrders, setCustomOrders] = useState<CustomOrderRequest[]>([
    {
      id: 'ord-01',
      clientName: 'Global Biotech Corp',
      clientEmail: 'contact@biotech.global',
      selectedCategory: 'Health Solutions',
      projectRequirements: 'Custom metabolic biomarker optimization protocol for executive personnel.',
      budgetTier: '$10,000 - $25,000',
      assignedNode: 'BioLife Health Solutions',
      status: 'IN_PRODUCTION',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      trackingNumber: 'TRK-98421'
    },
    {
      id: 'ord-02',
      clientName: 'Apex Capital Ventures',
      clientEmail: 'investment@apex.io',
      selectedCategory: 'Economics Reports',
      projectRequirements: 'Algorithmic tokenomics and macro market valuation report for Q3.',
      budgetTier: '$15,000 - $50,000',
      assignedNode: 'Quantum Economics & Advisory',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 43200000).toISOString(),
      trackingNumber: 'TRK-98422'
    }
  ]);

  // Loading States
  const [isAgentExecuting, setIsAgentExecuting] = useState<boolean>(false);
  const [isHolasAuditing, setIsHolasAuditing] = useState<boolean>(false);

  // Toggle Favorite
  const toggleFavoriteProduct = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // Add Log Helper
  const addAuditLog = (actor: string, role: string, action: string, details: string, status: 'SUCCESS' | 'WARNING' | 'FAILED' = 'SUCCESS') => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor,
      role,
      action,
      details,
      status
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Toggle AI CEO Mode
  const toggleAiCeoMode = () => {
    const newMode = !aiCeoAutoMode;
    setAiCeoAutoMode(newMode);
    addAuditLog(
      'Human CEO (Alexanda Martinz)',
      'Human CEO',
      `Toggled AI CEO Mode to ${newMode ? 'AUTOMATIC' : 'MANUAL OVERRIDE'}`,
      newMode 
        ? 'AI CEO assumes automated network governance, product factory publishing, and agent task delegation.'
        : 'Human CEO takes manual operational control over all nodes and agents.'
    );
  };

  // AI Product Factory Synthesis & Auto-Publishing
  const triggerAiProductSynthesis = async (
    firmName: string = 'Aether Web & App Development Lab',
    category: string = 'Web Applications',
    titlePrompt: string = 'Autonomous Multi-Agent Microservices Engine'
  ) => {
    setIsSynthesizingProduct(true);
    try {
      const generatedProduct: DigitalProduct = {
        id: `prod-fact-${Date.now()}`,
        title: titlePrompt,
        category: category as any,
        firmName,
        price: 499,
        rating: 5.0,
        downloads: 0,
        description: `Direct AI CEO Directive Output: Synthesized by ${firmName} specialist AI agents. Designed for immediate enterprise deployment with zero-trust security compliance.`,
        features: [
          'Full Source Code & AST Specifications',
          'Gemini 3.6 Flash Server Integration',
          'Zero-Trust Holas Shield Verification',
          '24/7 Automated Agent Maintenance'
        ],
        deliverableType: 'Full Source Code & Production Specs',
        status: 'PUBLISHED',
        isFeatured: true,
        publishedToPortal: true,
        updatedAt: new Date().toISOString(),
        pricingModel: 'ONE_TIME',
        viewsCount: 1,
        inquiriesCount: 0
      };

      setProducts(prev => [generatedProduct, ...prev]);
      await saveProductToFirestore(generatedProduct);

      addAuditLog(
        'AI CEO Product Factory',
        'AI CEO',
        'Auto-Published New Product to Marketplace',
        `Title: "${generatedProduct.title}" | Firm: ${firmName} | Price: $${generatedProduct.price}`
      );

      return generatedProduct;
    } catch (err) {
      console.error('Error synthesizing AI product:', err);
    } finally {
      setIsSynthesizingProduct(false);
    }
  };

  // Run AI CEO Decision
  const triggerCeoDecision = async (customGoal?: string) => {
    setIsCeoThinking(true);
    const goalToRun = customGoal || activeCeoGoal;
    try {
      const decision = await requestAiCeoDecision(goalToRun, aiCeoAutoMode, {
        activeNodes: nodes.length,
        totalProducts: products.length,
        totalAgents: agents.length
      });
      setLatestCeoDecision(decision);
      addAuditLog(
        'AI CEO Executive Engine',
        'AI CEO',
        'Executed Strategic Decision Cycle',
        `Goal: "${goalToRun}". Strategy: ${decision.executiveSummary.slice(0, 100)}...`
      );
      return decision;
    } catch (e) {
      console.error(e);
    } finally {
      setIsCeoThinking(false);
    }
  };

  // Trigger Specialist Agent Task
  const triggerAgentTask = async (agentId: string, taskTitle: string, instructions?: string) => {
    setIsAgentExecuting(true);
    const targetAgent = agents.find(a => a.id === agentId);
    if (!targetAgent) return;

    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status: 'EXECUTING', activeTask: taskTitle } : a));

    try {
      const output = await executeSpecialistAgentTask({
        agentId: targetAgent.id,
        agentName: targetAgent.name,
        firmName: targetAgent.firmName,
        domain: targetAgent.domain,
        taskTitle,
        instructions
      });

      setAgents(prev => prev.map(a => a.id === agentId ? { 
        ...a, 
        status: 'IDLE', 
        tasksCompleted: a.tasksCompleted + 1, 
        activeTask: undefined 
      } : a));

      addAuditLog(
        targetAgent.name,
        'Specialist AI Agent',
        `Completed Task: ${taskTitle}`,
        `Deliverable generated for firm: ${targetAgent.firmName}`
      );

      return output;
    } catch (e) {
      console.error(e);
      setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status: 'IDLE', activeTask: undefined } : a));
    } finally {
      setIsAgentExecuting(false);
    }
  };

  // Trigger Holas Cloud Security Audit
  const triggerHolasAudit = async (scope: string = 'Full Platform Cloud Security Sweep') => {
    setIsHolasAuditing(true);
    try {
      const audit = await requestHolasSecurityAudit(scope);
      
      const newEvent: HolasSecurityEvent = {
        id: `evt-${Date.now()}`,
        timestamp: audit.timestamp,
        event: `Holas Audit Completed. Score: ${audit.securityScore}/100. Status: ${audit.governanceStatus}`,
        severity: audit.threatLevel === 'LOW' ? 'info' : audit.threatLevel === 'MEDIUM' ? 'warn' : 'critical',
        node: 'CyberShield Cloud Command',
        resolved: true
      };

      setHolasEvents(prev => [newEvent, ...prev]);

      addAuditLog(
        'Holas, God of the Cloud',
        'Cloud Security Head',
        'Ran Holas Cloud Security Audit',
        `Score: ${audit.securityScore}/100. Scanned Nodes: ${audit.scannedNodes}. Threats Blocked: ${audit.activeThreatsBlocked}.`
      );

      return audit;
    } catch (e) {
      console.error(e);
    } finally {
      setIsHolasAuditing(false);
    }
  };

  // Publish New Product to Marketplace & Portal
  const publishNewProduct = async (productData: Partial<DigitalProduct>) => {
    const newProduct: DigitalProduct = {
      id: `prod-${Date.now()}`,
      title: productData.title || 'Custom AI Deliverable Solution',
      category: productData.category || 'Web Applications',
      firmName: productData.firmName || 'Aether Web & App Lab',
      price: productData.price || 299,
      rating: 5.0,
      downloads: 1,
      description: productData.description || 'Enterprise solution created by Alexanda Martinz Inc. specialist AI agents.',
      features: productData.features || ['Full Production Deliverable', 'Verified Holas Security Compliance'],
      deliverableType: productData.deliverableType || 'Source Code & Documentation',
      status: 'PUBLISHED',
      isFeatured: productData.isFeatured ?? true,
      publishedToPortal: true,
      updatedAt: new Date().toISOString()
    };

    setProducts(prev => [newProduct, ...prev]);
    await saveProductToFirestore(newProduct);
    await publishContentToSurface('marketplace', 'Product Listing', newProduct);

    addAuditLog(
      'Publishing Hub',
      'Management OS',
      `Published Product to Marketplace & Public Portal`,
      `Product Title: "${newProduct.title}" | Price: $${newProduct.price}`
    );
  };

  // Publish New Insight to Public Portal
  const publishNewInsight = async (insightData: Partial<ResearchInsight>) => {
    const newInsight: ResearchInsight = {
      id: `insight-${Date.now()}`,
      title: insightData.title || 'New AI Research Briefing',
      author: insightData.author || 'AI CEO & Specialist Research Agent',
      nodeName: insightData.nodeName || 'Martinz Strategic Research & Insights',
      date: new Date().toISOString().split('T')[0],
      summary: insightData.summary || 'Institutional briefing produced by Alexanda Martinz Inc. research node.',
      readTime: '5 min read',
      category: insightData.category || 'Strategic Intelligence',
      content: insightData.content || 'Comprehensive research analysis compiled by specialist AI firm.',
      downloads: 0,
      isPublished: true
    };

    setInsights(prev => [newInsight, ...prev]);
    await publishContentToSurface('portal', 'Research Insight Paper', newInsight);

    addAuditLog(
      'Publishing Hub',
      'Management OS',
      `Published Research Insight to Public Portal`,
      `Title: "${newInsight.title}"`
    );
  };

  // Submit Order Request
  const submitOrderRequest = (orderData: Partial<CustomOrderRequest>) => {
    const newOrder: CustomOrderRequest = {
      id: `ord-${Date.now()}`,
      clientName: orderData.clientName || 'Anonymous Corporate Client',
      clientEmail: orderData.clientEmail || 'client@corporate.com',
      selectedCategory: orderData.selectedCategory || 'Web Applications',
      projectRequirements: orderData.projectRequirements || 'Enterprise custom project.',
      budgetTier: orderData.budgetTier || '$5,000 - $10,000',
      assignedNode: orderData.assignedNode || 'Aether Web Lab',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      trackingNumber: `TRK-${Math.floor(10000 + Math.random() * 90000)}`
    };

    setCustomOrders(prev => [newOrder, ...prev]);

    addAuditLog(
      newOrder.clientName,
      'Client / User',
      'Submitted Custom Solutions Quote Request',
      `Category: ${newOrder.selectedCategory} | Budget: ${newOrder.budgetTier} | Tracking #: ${newOrder.trackingNumber}`
    );
  };

  // Update Order Status
  const updateOrderStatus = (orderId: string, newStatus: 'PENDING' | 'IN_PRODUCTION' | 'DELIVERED') => {
    setCustomOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    addAuditLog(
      'Alexanda Martinz',
      'Human CEO',
      `Updated Order #${orderId} Status to ${newStatus}`,
      `Custom order client pipeline updated.`
    );
  };

  // Profit Analytics Metrics
  const analytics: ProfitAnalytics = {
    totalRevenue: products.reduce((acc, p) => acc + (p.price * p.downloads), 0) + 128400,
    mrr: 48900,
    quoteRequestsCount: customOrders.length,
    totalDownloads: products.reduce((acc, p) => acc + p.downloads, 0) + 1420,
    topPerformingFirm: 'Aether Web & App Development Lab',
    conversionRate: 14.8
  };

  return (
    <PlatformContext.Provider value={{
      currentSurface,
      setCurrentSurface,
      dashboardTab,
      setDashboardTab,

      userPersona,
      setUserPersona,

      favorites,
      toggleFavoriteProduct,
      
      aiCeoAutoMode,
      toggleAiCeoMode,
      activeCeoGoal,
      setActiveCeoGoal,
      latestCeoDecision,
      isCeoThinking,
      triggerCeoDecision,

      isSynthesizingProduct,
      triggerAiProductSynthesis,

      nodes,
      agents,
      products,
      insights,
      holasEvents,
      auditLogs,
      customOrders,
      analytics,

      isAgentExecuting,
      triggerAgentTask,

      isHolasAuditing,
      triggerHolasAudit,

      publishNewProduct,
      publishNewInsight,
      submitOrderRequest,
      updateOrderStatus,

      addAuditLog
    }}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (!context) throw new Error('usePlatform must be used within PlatformProvider');
  return context;
};
