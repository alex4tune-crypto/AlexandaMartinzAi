export type SurfaceType = 'portal' | 'marketplace' | 'dashboard' | 'account';

export type DashboardSubTab = 
  | 'hierarchy' 
  | 'ai-ceo' 
  | 'holas-shield' 
  | 'agent-orchestration' 
  | 'nodes' 
  | 'publishing' 
  | 'billing' 
  | 'audit';

export type RoleType = 
  | 'Human CEO' 
  | 'AI CEO' 
  | 'Holas (Cloud Security Head)' 
  | 'Director / Executive' 
  | 'Specialist AI Firm' 
  | 'Specialist AI Agent' 
  | 'Client / User' 
  | 'Investor';

export type UserPersona = 'Buyer' | 'Investor' | 'Vendor' | 'Executive' | 'Analyst';

export interface CorporateNode {
  id: string;
  name: string;
  firmCode: string;
  domain: string;
  description: string;
  ceoAgentName: string;
  activeAgentsCount: number;
  productsCount: number;
  status: 'OPERATIONAL' | 'HIGH_DEMAND' | 'MAINTENANCE' | 'PROVISIONING';
  iconName: string;
  revenueMonthly: number;
  badge: string;
  rating?: number;
  verifiedBadge?: string;
  tagline?: string;
}

export interface SpecialistAgent {
  id: string;
  name: string;
  firmId: string;
  firmName: string;
  role: string;
  domain: 'Research' | 'Web Dev' | 'Web App' | 'Fashion' | 'Logo' | 'Economics' | 'Health' | 'Marketing' | 'Consulting' | 'Automation';
  status: 'IDLE' | 'EXECUTING' | 'SYNTHESIZING' | 'OFFLINE';
  tasksCompleted: number;
  activeTask?: string;
  rating: number;
  capabilities: string[];
}

export interface AiCeoDecision {
  executiveSummary: string;
  strategicActions: string[];
  delegatedTasks: {
    agentId: string;
    firm: string;
    task: string;
  }[];
  publishingDirectives: string[];
  securityDirectives: string;
  timestamp: string;
}

export interface DigitalProduct {
  id: string;
  title: string;
  category: 
    | 'Web Applications' 
    | 'Websites' 
    | 'AI Models & APIs' 
    | 'Branding & Logos' 
    | 'Fashion Specs' 
    | 'Research Reports' 
    | 'Economics Reports' 
    | 'Health Solutions' 
    | 'Marketing Assets' 
    | 'Consulting Outputs' 
    | 'Documents' 
    | 'Custom AI Services'
    | string;
  firmName: string;
  price: number;
  rating: number;
  downloads: number;
  description: string;
  features: string[];
  previewContent?: string;
  deliverableType: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' | 'PENDING_REVIEW' | 'REJECTED';
  isFeatured: boolean;
  publishedToPortal: boolean;
  updatedAt: string;
  pricingModel?: 'ONE_TIME' | 'MONTHLY_SAAS' | 'COMMISSION_TIER';
  viewsCount?: number;
  inquiriesCount?: number;
  badgeTag?: string;
  imageUrl?: string;
}

export interface ResearchInsight {
  id: string;
  title: string;
  author: string;
  nodeName: string;
  date: string;
  summary: string;
  readTime: string;
  category: string;
  content: string;
  downloads: number;
  isPublished: boolean;
}

export interface HolasSecurityEvent {
  id: string;
  timestamp: string;
  event: string;
  severity: 'info' | 'warn' | 'critical';
  node: string;
  resolved: boolean;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export interface CustomOrderRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  selectedCategory: string;
  projectRequirements: string;
  budgetTier: string;
  assignedNode: string;
  status: 'PENDING' | 'IN_PRODUCTION' | 'DELIVERED';
  createdAt: string;
  trackingNumber?: string;
}

export interface ProfitAnalytics {
  totalRevenue: number;
  mrr: number;
  quoteRequestsCount: number;
  totalDownloads: number;
  topPerformingFirm: string;
  conversionRate: number;
}

