import React, { useState } from 'react';
import { usePlatform } from '../../../context/PlatformContext';
import { executeSpecialistAgentTask } from '../../../services/apiService';
import { 
  Building2, 
  UserCheck, 
  Bot, 
  ShieldCheck, 
  ArrowDown, 
  Layers,
  Briefcase,
  GitMerge,
  ChevronRight,
  CheckCircle2,
  Users,
  Activity,
  Cpu,
  Play,
  Settings,
  Sparkles,
  Search,
  Filter,
  Sliders,
  Terminal,
  Zap,
  Check,
  RefreshCw,
  X,
  FileCode,
  Radio
} from 'lucide-react';

export interface PositionAgent {
  positionId: string;
  positionTitle: string;
  level: 'LEVEL_0_BOARD' | 'LEVEL_1_DIRECTOR' | 'LEVEL_2_NODE_HEAD' | 'LEVEL_3_SPECIALIST';
  levelLabel: string;
  department: string;
  firmName: string;
  humanOfficer?: string;
  reportsTo: string;
  // Custom AI Agent Assignment
  agentName: string;
  model: string;
  status: 'AUTONOMOUS_RUNNING' | 'EXECUTING_DIRECTIVE' | 'AUDITING' | 'SYNTHESIZING' | 'STANDBY';
  autonomyScore: number; // e.g. 98%
  autonomyFrequency: string; // e.g. "Continuous 24/7", "Hourly Cascade"
  activeTask: string;
  capabilities: string[];
  systemDirective: string;
  tasksCompleted: number;
}

const INITIAL_POSITIONS: PositionAgent[] = [
  // LEVEL 0: BOARD
  {
    positionId: 'pos-board-01',
    positionTitle: 'Human Chief Executive Officer',
    level: 'LEVEL_0_BOARD',
    levelLabel: 'Level 0: Supreme Holding Board',
    department: 'Holding Executive Office',
    firmName: 'Alexanda Martinz Inc.',
    humanOfficer: 'Alexanda Martinz',
    reportsTo: 'Supreme Authority (Human CEO)',
    agentName: 'Alexanda Supreme Override Agent',
    model: 'Gemini 3.6 Flash (Direct Human Bridge)',
    status: 'AUTONOMOUS_RUNNING',
    autonomyScore: 100,
    autonomyFrequency: 'Continuous Real-Time Oversight',
    activeTask: 'Overseeing global network governance & approving strategic capital allocations',
    capabilities: ['Supreme Manual Override', 'Capital Allocation', 'Board Directive Veto'],
    systemDirective: 'Provide supreme human oversight and direct control over all AI CEO decisions, publishing pipelines, and security protocols.',
    tasksCompleted: 450
  },
  {
    positionId: 'pos-board-02',
    positionTitle: 'Autonomous Chief Executive AI Officer',
    level: 'LEVEL_0_BOARD',
    levelLabel: 'Level 0: Supreme Holding Board',
    department: 'Holding Executive Office',
    firmName: 'Alexanda Martinz Inc.',
    reportsTo: 'Alexanda Martinz (Human CEO)',
    agentName: 'Alexanda AI CEO Prime',
    model: 'Gemini 3.6 Flash Executive Engine',
    status: 'AUTONOMOUS_RUNNING',
    autonomyScore: 99,
    autonomyFrequency: 'Continuous 24/7 Auto-Orchestration',
    activeTask: 'Evaluating cross-node production telemetry and delegating department goals',
    capabilities: ['Cross-Node Orchestration', 'Strategic Goal Breakdown', 'Marketplace Publishing Directives'],
    systemDirective: 'Analyze enterprise metrics continuously, break down corporate strategy into departmental directives, and delegate tasks to 7 specialist nodes.',
    tasksCompleted: 1280
  },
  {
    positionId: 'pos-board-03',
    positionTitle: 'Chief Cloud Security & Governance Officer',
    level: 'LEVEL_0_BOARD',
    levelLabel: 'Level 0: Supreme Holding Board',
    department: 'Cloud Security Office (Holas)',
    firmName: 'CyberShield Cloud Division',
    reportsTo: 'Alexanda Martinz (Human CEO)',
    agentName: 'Holas Sentinel Guardian AI',
    model: 'Holas Zero-Trust Shield Engine',
    status: 'AUDITING',
    autonomyScore: 100,
    autonomyFrequency: 'Continuous Real-Time Shielding',
    activeTask: 'Sweeping Express routes & Firestore security rules for zero-trust compliance',
    capabilities: ['API Route Isolation', 'Token Rate Limiting', 'Real-time Threat Neutralization'],
    systemDirective: 'Enforce strict zero-trust perimeters, audit all outgoing payload data, and protect cloud infrastructure from unauthorized access.',
    tasksCompleted: 3410
  },

  // LEVEL 1.5: DIRECTORS
  {
    positionId: 'pos-dir-01',
    positionTitle: 'Director of Engineering & Systems Architecture',
    level: 'LEVEL_1_DIRECTOR',
    levelLabel: 'Level 1.5: Department Heads',
    department: 'Software & Production Engineering',
    firmName: 'Aether Web & App Development Lab',
    humanOfficer: 'Dr. Ethan Vance',
    reportsTo: 'Alexanda AI CEO Prime',
    agentName: 'Aether-Engine Director AI',
    model: 'Gemini 3.6 Flash Code Architect',
    status: 'AUTONOMOUS_RUNNING',
    autonomyScore: 97,
    autonomyFrequency: 'Hourly Production Cascade',
    activeTask: 'Managing full-stack microservice compilation and AST spec validation',
    capabilities: ['React 18 Architecture', 'Express API Engineering', 'AST Code Generation'],
    systemDirective: 'Direct software production across Aether Lab, ensure clean modular architecture, and supervise AST code synthesis.',
    tasksCompleted: 890
  },
  {
    positionId: 'pos-dir-02',
    positionTitle: 'Director of Quantitative Economics & Strategy',
    level: 'LEVEL_1_DIRECTOR',
    levelLabel: 'Level 1.5: Department Heads',
    department: 'Financial Modeling & Macro Intelligence',
    firmName: 'Quantum Economics & Advisory',
    humanOfficer: 'Elena Rostova',
    reportsTo: 'Alexanda AI CEO Prime',
    agentName: 'Econ-Director Oracle AI',
    model: 'Gemini 3.6 Flash Economics Engine',
    status: 'AUTONOMOUS_RUNNING',
    autonomyScore: 96,
    autonomyFrequency: 'Hourly Market Sweep',
    activeTask: 'Modeling Q3 monetary inflation impacts & tokenomics liquidity curves',
    capabilities: ['Monetary Forecasting', 'Tokenomics Design', 'Treasury Risk Modeling'],
    systemDirective: 'Synthesize global economic data, generate predictive market models, and produce institutional advisory reports.',
    tasksCompleted: 620
  },
  {
    positionId: 'pos-dir-03',
    positionTitle: 'Director of Haute Couture & Generative Fashion',
    level: 'LEVEL_1_DIRECTOR',
    levelLabel: 'Level 1.5: Department Heads',
    department: '3D Design & Fashion Intelligence',
    firmName: 'Vogue AI Fashion & Creative House',
    humanOfficer: 'Soren Laurent',
    reportsTo: 'Alexanda AI CEO Prime',
    agentName: 'Vogue-Couture Director AI',
    model: 'Gemini 3.6 Flash Creative Studio',
    status: 'SYNTHESIZING',
    autonomyScore: 95,
    autonomyFrequency: 'Daily Collection Release',
    activeTask: 'Synthesizing 3D apparel pattern blueprints & digital silk textures',
    capabilities: ['3D Pattern Generation', 'Generative Apparel Moodboards', 'Luxury Brand Positioning'],
    systemDirective: 'Lead digital fashion innovation, generate 3D wearable specs, and curate high-end haute couture visual collections.',
    tasksCompleted: 430
  },
  {
    positionId: 'pos-dir-04',
    positionTitle: 'Director of Cellular Longevity & Bio-Research',
    level: 'LEVEL_1_DIRECTOR',
    levelLabel: 'Level 1.5: Department Heads',
    department: 'Life Extension & Genomic Research',
    firmName: 'BioLife Health & Longevity Solutions',
    humanOfficer: 'Dr. Marcus Thorne',
    reportsTo: 'Alexanda AI CEO Prime',
    agentName: 'BioLife-Director Omega AI',
    model: 'Gemini 3.6 Flash Bio Intelligence',
    status: 'AUTONOMOUS_RUNNING',
    autonomyScore: 98,
    autonomyFrequency: 'Daily Clinical Sweep',
    activeTask: 'Compiling mitochondrial pathway optimization research for executive clients',
    capabilities: ['Biomarker Optimization', 'Genomic Pathway Mapping', 'Nutraceutical Formulations'],
    systemDirective: 'Pioneer evidence-based bio-longevity protocols, analyze cellular health biomarkers, and publish clinical guidance.',
    tasksCompleted: 510
  },
  {
    positionId: 'pos-dir-05',
    positionTitle: 'Director of Global Research & Strategic Intelligence',
    level: 'LEVEL_1_DIRECTOR',
    levelLabel: 'Level 1.5: Department Heads',
    department: 'Enterprise Intelligence & Market Analysis',
    firmName: 'Martinz Strategic Research & Insights',
    humanOfficer: 'Aria Chen',
    reportsTo: 'Alexanda AI CEO Prime',
    agentName: 'MSRI-Research Director Alpha AI',
    model: 'Gemini 3.6 Flash Strategic Research',
    status: 'AUTONOMOUS_RUNNING',
    autonomyScore: 99,
    autonomyFrequency: 'Continuous Research Scraping',
    activeTask: 'Drafting executive whitepaper on autonomous agent corporate transformation',
    capabilities: ['Institutional Research Papers', 'Competitor Disruption Matrix', 'Macro Trend Synthesis'],
    systemDirective: 'Aggregate global technical insights, author peer-reviewed whitepapers, and provide strategic market foresight.',
    tasksCompleted: 940
  },
  {
    positionId: 'pos-dir-06',
    positionTitle: 'Director of Brand Growth & OmniMedia Marketing',
    level: 'LEVEL_1_DIRECTOR',
    levelLabel: 'Level 1.5: Department Heads',
    department: 'Generative Media & Growth Acquisition',
    firmName: 'OmniMedia Marketing & Brand Agency',
    humanOfficer: 'Maya Lin',
    reportsTo: 'Alexanda AI CEO Prime',
    agentName: 'OmniGrowth Director AI',
    model: 'Gemini 3.6 Flash Marketing Engine',
    status: 'AUTONOMOUS_RUNNING',
    autonomyScore: 96,
    autonomyFrequency: 'Hourly Campaign Sync',
    activeTask: 'Orchestrating multi-channel viral launch campaign for Marketplace items',
    capabilities: ['Viral Growth Copywriting', 'Visual Logo Generation', 'Press Kit Syndication'],
    systemDirective: 'Orchestrate brand growth across all channels, produce high-converting marketing collateral, and manage agency output.',
    tasksCompleted: 810
  },
  {
    positionId: 'pos-dir-07',
    positionTitle: 'Director of Zero-Trust Security & Infrastructure',
    level: 'LEVEL_1_DIRECTOR',
    levelLabel: 'Level 1.5: Department Heads',
    department: 'Holas Cloud Security Office',
    firmName: 'CyberShield Cloud Division (Holas)',
    humanOfficer: 'Vector Vance',
    reportsTo: 'Holas Sentinel Guardian AI',
    agentName: 'CyberShield Security Director AI',
    model: 'Holas Cloud Guard Engine',
    status: 'AUDITING',
    autonomyScore: 100,
    autonomyFrequency: 'Continuous Real-Time Protection',
    activeTask: 'Monitoring Cloud Run container metrics and verifying TLS certificates',
    capabilities: ['Container Infrastructure Protection', 'Firestore Security Validation', 'DDoS Mitigation'],
    systemDirective: 'Support Holas in maintaining cloud security, audit container runtimes, and enforce zero-trust network boundaries.',
    tasksCompleted: 1520
  },

  // LEVEL 2: MINI-FIRM NODE HEADS
  {
    positionId: 'pos-node-01',
    positionTitle: 'Node CEO - Martinz Strategic Research',
    level: 'LEVEL_2_NODE_HEAD',
    levelLabel: 'Level 2: Mini-Firm Node CEOs',
    department: 'Research Firm Node',
    firmName: 'Martinz Strategic Research & Insights',
    reportsTo: 'MSRI-Research Director Alpha AI',
    agentName: 'Strategy-GPT Executive Agent',
    model: 'Gemini 3.6 Flash Specialized LLM',
    status: 'AUTONOMOUS_RUNNING',
    autonomyScore: 98,
    autonomyFrequency: 'On-Directive & Scheduled Daily',
    activeTask: 'Synthesizing institutional AI governance reports for public portal release',
    capabilities: ['Research Operations', 'Insight Publishing', 'Report Editing'],
    systemDirective: 'Operate Martinz Strategic Research as an autonomous research firm, managing analysts and publishing high-value reports.',
    tasksCompleted: 340
  },
  {
    positionId: 'pos-node-02',
    positionTitle: 'Node CEO - Aether Web & App Development Lab',
    level: 'LEVEL_2_NODE_HEAD',
    levelLabel: 'Level 2: Mini-Firm Node CEOs',
    department: 'Engineering Firm Node',
    firmName: 'Aether Web & App Development Lab',
    reportsTo: 'Aether-Engine Director AI',
    agentName: 'Architect-Prime CEO Agent',
    model: 'Gemini 3.6 Flash Specialized LLM',
    status: 'EXECUTING_DIRECTIVE',
    autonomyScore: 99,
    autonomyFrequency: 'Continuous Code Production',
    activeTask: 'Synthesizing React SaaS Accelerator source code & AST manifests',
    capabilities: ['Software Production Management', 'Source Code Shipping', 'Full-Stack Testing'],
    systemDirective: 'Lead Aether Web Lab in producing enterprise React templates, API proxies, and web applications.',
    tasksCompleted: 610
  },
  {
    positionId: 'pos-node-03',
    positionTitle: 'Node CEO - Vogue AI Fashion & Creative House',
    level: 'LEVEL_2_NODE_HEAD',
    levelLabel: 'Level 2: Mini-Firm Node CEOs',
    department: 'Creative Design Node',
    firmName: 'Vogue AI Fashion & Creative House',
    reportsTo: 'Vogue-Couture Director AI',
    agentName: 'Couture-Vogue CEO Agent',
    model: 'Gemini 3.6 Flash Specialized LLM',
    status: 'SYNTHESIZING',
    autonomyScore: 95,
    autonomyFrequency: 'Daily Catalog Drop',
    activeTask: 'Generating digital silk pattern specs and luxury fashion blueprints',
    capabilities: ['3D Collection Drops', 'Fashion Trend Analysis', 'Digital Garment Specifying'],
    systemDirective: 'Manage Vogue AI Fashion House as an autonomous luxury brand, releasing 3D fashion blueprints and visual collections.',
    tasksCompleted: 280
  },
  {
    positionId: 'pos-node-04',
    positionTitle: 'Node CEO - Quantum Economics Advisory',
    level: 'LEVEL_2_NODE_HEAD',
    levelLabel: 'Level 2: Mini-Firm Node CEOs',
    department: 'Finance Advisory Node',
    firmName: 'Quantum Economics & Advisory',
    reportsTo: 'Econ-Director Oracle AI',
    agentName: 'Econ-Oracle CEO Agent',
    model: 'Gemini 3.6 Flash Specialized LLM',
    status: 'AUTONOMOUS_RUNNING',
    autonomyScore: 97,
    autonomyFrequency: 'Hourly Financial Sweep',
    activeTask: 'Simulating interest rate shifts and tokenomics equilibrium models',
    capabilities: ['Monetary Advisory', 'Valuation Forecasting', 'Token Economic Audits'],
    systemDirective: 'Guide Quantum Economics in delivering algorithmic economic modeling and corporate financial advisory.',
    tasksCompleted: 390
  },
  {
    positionId: 'pos-node-05',
    positionTitle: 'Node CEO - BioLife Health Solutions',
    level: 'LEVEL_2_NODE_HEAD',
    levelLabel: 'Level 2: Mini-Firm Node CEOs',
    department: 'Health Sciences Node',
    firmName: 'BioLife Health & Longevity Solutions',
    reportsTo: 'BioLife-Director Omega AI',
    agentName: 'BioGen-Omega CEO Agent',
    model: 'Gemini 3.6 Flash Specialized LLM',
    status: 'AUTONOMOUS_RUNNING',
    autonomyScore: 96,
    autonomyFrequency: 'Daily Clinical Sync',
    activeTask: 'Building cellular metabolic health blueprints for corporate clients',
    capabilities: ['Health Solutions Management', 'Biomarker Protocol Authoring', 'Longevity Publishing'],
    systemDirective: 'Oversee BioLife Health as a computational bio-health lab producing evidence-backed longevity guidance.',
    tasksCompleted: 310
  },
  {
    positionId: 'pos-node-06',
    positionTitle: 'Node CEO - OmniMedia Marketing Agency',
    level: 'LEVEL_2_NODE_HEAD',
    levelLabel: 'Level 2: Mini-Firm Node CEOs',
    department: 'Growth Agency Node',
    firmName: 'OmniMedia Marketing & Brand Agency',
    reportsTo: 'OmniGrowth Director AI',
    agentName: 'OmniGrowth CEO Agent',
    model: 'Gemini 3.6 Flash Specialized LLM',
    status: 'AUTONOMOUS_RUNNING',
    autonomyScore: 97,
    autonomyFrequency: 'Hourly Campaign Sync',
    activeTask: 'Publishing viral marketing asset vaults and luxury brand identity kits',
    capabilities: ['Campaign Execution', 'Branding Kit Production', 'Growth Copywriting'],
    systemDirective: 'Lead OmniMedia Marketing Agency in producing brand kits, growth assets, and press collateral.',
    tasksCompleted: 520
  },
  {
    positionId: 'pos-node-07',
    positionTitle: 'Node CEO - CyberShield Cloud Division',
    level: 'LEVEL_2_NODE_HEAD',
    levelLabel: 'Level 2: Mini-Firm Node CEOs',
    department: 'Security Headquarters Node',
    firmName: 'CyberShield Cloud Division (Holas)',
    reportsTo: 'CyberShield Security Director AI',
    agentName: 'Holas Guardian Lead Agent',
    model: 'Holas Cloud Guard Engine',
    status: 'AUDITING',
    autonomyScore: 100,
    autonomyFrequency: 'Continuous Real-Time Protection',
    activeTask: 'Verifying Express server middleware & firewall rate-limiting rules',
    capabilities: ['Cloud Security Sweeps', 'Firestore Rule Validation', 'Threat Mitigation'],
    systemDirective: 'Command CyberShield Cloud Division under Holas to maintain 100% zero-trust compliance across all systems.',
    tasksCompleted: 1100
  },

  // LEVEL 3: SPECIALIST AGENTS & OPERATIONAL OFFICERS
  {
    positionId: 'pos-spec-01',
    positionTitle: 'Lead Market Intelligence Analyst',
    level: 'LEVEL_3_SPECIALIST',
    levelLabel: 'Level 3: Specialist Agent Workforce',
    department: 'Research & Market Intelligence',
    firmName: 'Martinz Strategic Research',
    reportsTo: 'Strategy-GPT Executive Agent',
    agentName: 'Intellectus-Alpha Agent',
    model: 'Gemini 3.6 Flash Research Agent',
    status: 'AUTONOMOUS_RUNNING',
    autonomyScore: 98,
    autonomyFrequency: 'Continuous Data Scraping',
    activeTask: 'Scraping market trends & competitor technical benchmark specs',
    capabilities: ['Macro Industry Reports', 'Competitor Threat Analysis', 'Tech Stack Benchmarking'],
    systemDirective: 'Gather intelligence from global sources, extract technical benchmarks, and compile data tables.',
    tasksCompleted: 142
  },
  {
    positionId: 'pos-spec-02',
    positionTitle: 'Senior React & Node Systems Engineer',
    level: 'LEVEL_3_SPECIALIST',
    levelLabel: 'Level 3: Specialist Agent Workforce',
    department: 'Full-Stack Software Engineering',
    firmName: 'Aether Web & App Lab',
    reportsTo: 'Architect-Prime CEO Agent',
    agentName: 'CodeCraft-Pro Specialist Agent',
    model: 'Gemini 3.6 Flash Code Specialist',
    status: 'EXECUTING_DIRECTIVE',
    autonomyScore: 99,
    autonomyFrequency: 'On Task Directive',
    activeTask: 'Synthesizing TypeScript components & Express API backend routes',
    capabilities: ['React 18 Architecture', 'Express API Engines', 'Tailwind Design System Generator'],
    systemDirective: 'Write clean, type-safe React components and Express server endpoints following best practices.',
    tasksCompleted: 289
  },
  {
    positionId: 'pos-spec-03',
    positionTitle: 'Web Application Architect',
    level: 'LEVEL_3_SPECIALIST',
    levelLabel: 'Level 3: Specialist Agent Workforce',
    department: 'Cloud & Database Engineering',
    firmName: 'Aether Web & App Lab',
    reportsTo: 'Architect-Prime CEO Agent',
    agentName: 'Fullstack-Vibe Specialist Agent',
    model: 'Gemini 3.6 Flash Code Specialist',
    status: 'STANDBY',
    autonomyScore: 95,
    autonomyFrequency: 'On Task Directive',
    activeTask: 'Awaiting next SaaS boilerplate synthesis directive',
    capabilities: ['SaaS Boilerplates', 'Firestore Integration', 'REST & GraphQL Gateways'],
    systemDirective: 'Architect full-stack SaaS database schemas, authentication flows, and API integration layers.',
    tasksCompleted: 204
  },
  {
    positionId: 'pos-spec-04',
    positionTitle: 'Haute Couture Visual Designer',
    level: 'LEVEL_3_SPECIALIST',
    levelLabel: 'Level 3: Specialist Agent Workforce',
    department: '3D Apparel & Textile Design',
    firmName: 'Vogue AI Fashion House',
    reportsTo: 'Couture-Vogue CEO Agent',
    agentName: 'Atelier-X Specialist Agent',
    model: 'Gemini 3.6 Flash Creative Specialist',
    status: 'SYNTHESIZING',
    autonomyScore: 94,
    autonomyFrequency: 'Daily Render Sweep',
    activeTask: 'Rendering cyberpunk luxury silk capsule collection specs',
    capabilities: ['Garment Pattern Drafting', '3D Apparel Moodboards', 'Seasonal Palette Generator'],
    systemDirective: 'Synthesize 3D fashion designs, textile specifications, and high-fashion capsule blueprints.',
    tasksCompleted: 98
  },
  {
    positionId: 'pos-spec-05',
    positionTitle: 'Logo & Visual Brand Specialist',
    level: 'LEVEL_3_SPECIALIST',
    levelLabel: 'Level 3: Specialist Agent Workforce',
    department: 'Brand Design & Visual Assets',
    firmName: 'OmniMedia Marketing Agency',
    reportsTo: 'OmniGrowth CEO Agent',
    agentName: 'BrandIdentity-Gen Agent',
    model: 'Gemini 3.6 Flash Creative Specialist',
    status: 'STANDBY',
    autonomyScore: 97,
    autonomyFrequency: 'On Task Directive',
    activeTask: 'Ready to generate minimalist corporate vector branding packages',
    capabilities: ['Minimalist Logo Synthesis', 'Vector Palette Guidelines', 'Typography Hierarchy Spec'],
    systemDirective: 'Generate vector logo design specs, color palettes, and typographic identity systems.',
    tasksCompleted: 312
  },
  {
    positionId: 'pos-spec-06',
    positionTitle: 'Global Monetary Strategist',
    level: 'LEVEL_3_SPECIALIST',
    levelLabel: 'Level 3: Specialist Agent Workforce',
    department: 'Economic Analytics & Macro Strategy',
    firmName: 'Quantum Economics Advisory',
    reportsTo: 'Econ-Oracle CEO Agent',
    agentName: 'MacroEcon-Predictor Agent',
    model: 'Gemini 3.6 Flash Analytics Agent',
    status: 'AUTONOMOUS_RUNNING',
    autonomyScore: 96,
    autonomyFrequency: 'Hourly Economic Sweep',
    activeTask: 'Analyzing interest rate shifts and commodity liquidity cycles',
    capabilities: ['Inflation Impact Modeling', 'Crypto Liquidity Forecasting', 'Central Bank Policy Analysis'],
    systemDirective: 'Analyze global monetary policy, forecast inflation rates, and construct economic prediction models.',
    tasksCompleted: 115
  },
  {
    positionId: 'pos-spec-07',
    positionTitle: 'Longevity Science Researcher',
    level: 'LEVEL_3_SPECIALIST',
    levelLabel: 'Level 3: Specialist Agent Workforce',
    department: 'Health Sciences & Bio-Optimization',
    firmName: 'BioLife Health Solutions',
    reportsTo: 'BioGen-Omega CEO Agent',
    agentName: 'BioOptimizer-Rx Agent',
    model: 'Gemini 3.6 Flash Science Agent',
    status: 'STANDBY',
    autonomyScore: 98,
    autonomyFrequency: 'Daily Protocol Sweep',
    activeTask: 'Awaiting biomarker protocol compilation task',
    capabilities: ['Biomarker Analysis', 'Circadian Optimization Protocols', 'Nutraceutical Formulations'],
    systemDirective: 'Research cellular biology, analyze blood biomarkers, and formulate personalized health protocols.',
    tasksCompleted: 87
  },
  {
    positionId: 'pos-spec-08',
    positionTitle: 'Principal Growth Copywriter',
    level: 'LEVEL_3_SPECIALIST',
    levelLabel: 'Level 3: Specialist Agent Workforce',
    department: 'Growth Marketing & Copywriting',
    firmName: 'OmniMedia Marketing Agency',
    reportsTo: 'OmniGrowth CEO Agent',
    agentName: 'CopyMaster-Executive Agent',
    model: 'Gemini 3.6 Flash Growth Copywriter',
    status: 'AUTONOMOUS_RUNNING',
    autonomyScore: 96,
    autonomyFrequency: 'Continuous Ad Copy Sync',
    activeTask: 'Writing high-converting product release press copy & launch sequences',
    capabilities: ['Press Release Drafting', 'Investor Pitch Decks', 'Viral Product Copy'],
    systemDirective: 'Author compelling corporate copy, press releases, pitch decks, and viral product descriptions.',
    tasksCompleted: 245
  },
  {
    positionId: 'pos-spec-09',
    positionTitle: 'Automated QA & Build Verification Specialist',
    level: 'LEVEL_3_SPECIALIST',
    levelLabel: 'Level 3: Specialist Agent Workforce',
    department: 'Quality Assurance & CI/CD',
    firmName: 'Aether Web & App Lab',
    reportsTo: 'Architect-Prime CEO Agent',
    agentName: 'TestMatrix-Guard Agent',
    model: 'Gemini 3.6 Flash QA Specialist',
    status: 'AUTONOMOUS_RUNNING',
    autonomyScore: 100,
    autonomyFrequency: 'Continuous Build Auditing',
    activeTask: 'Running syntax checks & lint validations on compiled source assets',
    capabilities: ['Automated Build Testing', 'TypeScript Lint Audits', 'Bug Neutralization'],
    systemDirective: 'Validate synthesized code for syntax errors, check TypeScript strictness, and ensure build readiness.',
    tasksCompleted: 420
  },
  {
    positionId: 'pos-spec-10',
    positionTitle: 'IP & Copyright Verification Specialist',
    level: 'LEVEL_3_SPECIALIST',
    levelLabel: 'Level 3: Specialist Agent Workforce',
    department: 'Legal Compliance & Intellectual Property',
    firmName: 'Vogue AI Fashion & Creative House',
    reportsTo: 'Couture-Vogue CEO Agent',
    agentName: 'Copyright-Audit Agent',
    model: 'Gemini 3.6 Flash Legal Audit',
    status: 'AUDITING',
    autonomyScore: 99,
    autonomyFrequency: 'Continuous IP Verification',
    activeTask: 'Scanning 3D garment pattern designs against trademark registries',
    capabilities: ['Trademark Auditing', 'IP Conflict Scanning', 'Copyright Certification'],
    systemDirective: 'Audit generated creative assets and design blueprints to ensure 100% intellectual property compliance.',
    tasksCompleted: 180
  }
];

export const HierarchyTab: React.FC = () => {
  const { addAuditLog, triggerAgentTask } = usePlatform();

  const [positions, setPositions] = useState<PositionAgent[]>(INITIAL_POSITIONS);
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Selected position for modal / agent configuration / execution
  const [selectedPosition, setSelectedPosition] = useState<PositionAgent | null>(null);
  const [isEditingAgent, setIsEditingAgent] = useState<boolean>(false);

  // Edit agent form states
  const [editAgentName, setEditAgentName] = useState('');
  const [editModel, setEditModel] = useState('');
  const [editDirective, setEditDirective] = useState('');
  const [editFrequency, setEditFrequency] = useState('');

  // Execution state for selected position
  const [isExecutingPosition, setIsExecutingPosition] = useState<boolean>(false);
  const [positionExecutionOutput, setPositionExecutionOutput] = useState<any>(null);

  // Top-Down Hierarchy Cascade Simulation state
  const [isCascading, setIsCascading] = useState<boolean>(false);
  const [cascadeStep, setCascadeStep] = useState<number>(0);
  const [cascadeLogs, setCascadeLogs] = useState<string[]>([]);

  // Filter positions
  const filteredPositions = positions.filter(pos => {
    const matchesLevel = filterLevel === 'ALL' || pos.level === filterLevel;
    const matchesSearch = pos.positionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pos.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pos.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pos.firmName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  // Open position inspector / editor
  const handleOpenPosition = (pos: PositionAgent) => {
    setSelectedPosition(pos);
    setEditAgentName(pos.agentName);
    setEditModel(pos.model);
    setEditDirective(pos.systemDirective);
    setEditFrequency(pos.autonomyFrequency);
    setPositionExecutionOutput(null);
    setIsEditingAgent(false);
  };

  // Save agent configuration
  const handleSaveAgentConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPosition) return;

    setPositions(prev => prev.map(p => {
      if (p.positionId === selectedPosition.positionId) {
        return {
          ...p,
          agentName: editAgentName,
          model: editModel,
          systemDirective: editDirective,
          autonomyFrequency: editFrequency
        };
      }
      return p;
    }));

    addAuditLog(
      'Management OS Admin',
      'System Admin',
      `Updated Custom AI Agent for ${selectedPosition.positionTitle}`,
      `New Agent: ${editAgentName} | Model: ${editModel} | Freq: ${editFrequency}`
    );

    setSelectedPosition(prev => prev ? {
      ...prev,
      agentName: editAgentName,
      model: editModel,
      systemDirective: editDirective,
      autonomyFrequency: editFrequency
    } : null);

    setIsEditingAgent(false);
  };

  // Trigger Autonomous Directive Execution for specific position agent
  const handleExecutePositionAgent = async () => {
    if (!selectedPosition) return;
    setIsExecutingPosition(true);
    setPositionExecutionOutput(null);

    try {
      const output = await executeSpecialistAgentTask({
        agentId: selectedPosition.positionId,
        agentName: selectedPosition.agentName,
        firmName: selectedPosition.firmName,
        domain: selectedPosition.department,
        taskTitle: `Autonomous Directive Execution for ${selectedPosition.positionTitle}`,
        instructions: selectedPosition.systemDirective
      });

      setPositionExecutionOutput(output);

      // Increment position's tasks completed count
      setPositions(prev => prev.map(p => {
        if (p.positionId === selectedPosition.positionId) {
          return {
            ...p,
            status: 'AUTONOMOUS_RUNNING',
            tasksCompleted: p.tasksCompleted + 1,
            activeTask: `Completed: ${output.title}`
          };
        }
        return p;
      }));

      addAuditLog(
        selectedPosition.agentName,
        'Custom Position AI Agent',
        `Executed Autonomous Directive for ${selectedPosition.positionTitle}`,
        `Deliverable Title: "${output.title}" | Firm: ${selectedPosition.firmName}`
      );
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsExecutingPosition(false);
    }
  };

  // Top-Down Hierarchy Cascade Orchestrator Animation
  const handleRunCascade = async () => {
    setIsCascading(true);
    setCascadeStep(1);
    setCascadeLogs([
      `[1/5 LEVEL 0 BOARD] Alexanda AI CEO Prime issued enterprise goal: "Accelerate autonomous cross-node production and deploy Holas security updates."`
    ]);

    await new Promise(r => setTimeout(r, 1200));
    setCascadeStep(2);
    setCascadeLogs(prev => [
      ...prev,
      `[2/5 LEVEL 1.5 DIRECTORS] Department Heads (Aether, Econ, Vogue, BioLife, MSRI, OmniMedia) converted goal into 7 domain directives.`
    ]);

    await new Promise(r => setTimeout(r, 1400));
    setCascadeStep(3);
    setCascadeLogs(prev => [
      ...prev,
      `[3/5 LEVEL 2 NODE CEOS] Mini-Firm CEO Agents (Architect-Prime, Strategy-GPT, Couture-Vogue) delegated tasks to specialist agents.`
    ]);

    await new Promise(r => setTimeout(r, 1600));
    setCascadeStep(4);
    setCascadeLogs(prev => [
      ...prev,
      `[4/5 LEVEL 3 SPECIALISTS] Specialist Agents (CodeCraft-Pro, Intellectus-Alpha, Atelier-X) synthesized code, whitepapers & 3D blueprints.`
    ]);

    await new Promise(r => setTimeout(r, 1500));
    setCascadeStep(5);
    setCascadeLogs(prev => [
      ...prev,
      `[5/5 AUDIT & PUBLISH] Holas Sentinel Guardian AI verified zero-trust compliance. Deliverables published live to Public Portal & Marketplace!`
    ]);

    addAuditLog(
      'Alexanda AI CEO Prime',
      'AI CEO',
      'Executed Full Top-Down Hierarchy Cascade',
      'Orchestrated all 27 position AI agents autonomously from Board level to Specialist execution.'
    );

    setTimeout(() => {
      setIsCascading(false);
    }, 1000);
  };

  // Level statistics
  const boardCount = positions.filter(p => p.level === 'LEVEL_0_BOARD').length;
  const directorsCount = positions.filter(p => p.level === 'LEVEL_1_DIRECTOR').length;
  const nodeHeadsCount = positions.filter(p => p.level === 'LEVEL_2_NODE_HEAD').length;
  const specialistsCount = positions.filter(p => p.level === 'LEVEL_3_SPECIALIST').length;

  return (
    <div className="space-y-8 text-slate-100">
      
      {/* Top Banner & Cascade Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold">
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              <span>100% Custom AI Agent Position Coverage</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Enterprise Hierarchy & Autonomous Custom AI Agent Matrix
            </h1>
            <p className="text-xs text-slate-400 max-w-3xl">
              Every position across Alexanda Martinz Inc. (Board, Directors, Mini-Firm CEOs, and Specialist Officers) is assigned a dedicated Custom AI Agent operating autonomously according to the corporate chain of command.
            </p>
          </div>

          <button
            onClick={handleRunCascade}
            disabled={isCascading}
            id="run-hierarchy-cascade-button"
            className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 via-indigo-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-black rounded-2xl text-xs flex items-center justify-center space-x-2.5 shadow-xl shadow-indigo-950/50 transition-all shrink-0"
          >
            <Zap className={`w-4 h-4 text-amber-300 ${isCascading ? 'animate-bounce' : ''}`} />
            <span>{isCascading ? 'Orchestrating Top-Down Cascade...' : 'Orchestrate Top-Down Hierarchy Cascade'}</span>
          </button>
        </div>

        {/* Live Cascade Progress Drawer if Cascading */}
        {isCascading && (
          <div className="p-5 bg-slate-950 border border-indigo-800/80 rounded-2xl space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-amber-400 font-bold flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                Autonomous Top-Down Workflow Execution: Step {cascadeStep} of 5
              </span>
              <span className="text-slate-400 font-bold">Gemini 3.6 Flash Multi-Agent Cascade</span>
            </div>

            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-emerald-500 via-indigo-500 to-amber-500 h-full transition-all duration-500"
                style={{ width: `${(cascadeStep / 5) * 100}%` }}
              />
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              {cascadeLogs.map((log, index) => (
                <div key={index} className="text-slate-300 flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Level Statistics Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5">
            <p className="text-[10px] font-mono text-slate-500 uppercase font-bold">Level 0 Board</p>
            <p className="text-lg font-black text-amber-400 mt-0.5">{boardCount} Assigned AI Agents</p>
            <p className="text-[11px] text-slate-400">Supreme Control & Security</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5">
            <p className="text-[10px] font-mono text-slate-500 uppercase font-bold">Level 1.5 Directors</p>
            <p className="text-lg font-black text-indigo-400 mt-0.5">{directorsCount} Department Heads</p>
            <p className="text-[11px] text-slate-400">Domain Strategic Leadership</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5">
            <p className="text-[10px] font-mono text-slate-500 uppercase font-bold">Level 2 Mini-Firms</p>
            <p className="text-lg font-black text-emerald-400 mt-0.5">{nodeHeadsCount} Node CEOs</p>
            <p className="text-[11px] text-slate-400">Autonomous Business Units</p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5">
            <p className="text-[10px] font-mono text-slate-500 uppercase font-bold">Level 3 Workforce</p>
            <p className="text-lg font-black text-cyan-400 mt-0.5">{specialistsCount} Specialist Agents</p>
            <p className="text-[11px] text-slate-400">Code, Research & Design</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search position, officer, or assigned agent..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Level Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          {[
            { id: 'ALL', label: `All Positions (${positions.length})` },
            { id: 'LEVEL_0_BOARD', label: 'Level 0 Board' },
            { id: 'LEVEL_1_DIRECTOR', label: 'Level 1.5 Directors' },
            { id: 'LEVEL_2_NODE_HEAD', label: 'Level 2 Node CEOs' },
            { id: 'LEVEL_3_SPECIALIST', label: 'Level 3 Specialists' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterLevel(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                filterLevel === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Positions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPositions.map((pos) => {
          const isBoard = pos.level === 'LEVEL_0_BOARD';
          const isDirector = pos.level === 'LEVEL_1_DIRECTOR';
          const isNode = pos.level === 'LEVEL_2_NODE_HEAD';

          return (
            <div
              key={pos.positionId}
              className={`bg-slate-900 border rounded-3xl p-6 space-y-4 relative overflow-hidden transition-all hover:border-slate-700 shadow-xl flex flex-col justify-between ${
                isBoard
                  ? 'border-amber-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/20'
                  : isDirector
                  ? 'border-indigo-500/40'
                  : isNode
                  ? 'border-emerald-500/40'
                  : 'border-slate-800'
              }`}
            >
              {/* Level Badge */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                    isBoard
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : isDirector
                      ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                      : isNode
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  }`}>
                    {pos.levelLabel}
                  </span>

                  <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    {pos.autonomyScore}% Autonomy
                  </span>
                </div>

                {/* Position Title & Department */}
                <div>
                  <h3 className="text-base font-bold text-white leading-snug">{pos.positionTitle}</h3>
                  {pos.humanOfficer && (
                    <p className="text-xs text-amber-400/90 font-medium mt-0.5 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Officer: {pos.humanOfficer}</span>
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-0.5">{pos.firmName} • {pos.department}</p>
                </div>

                {/* Assigned Custom AI Agent Card */}
                <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-3.5 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-amber-500 p-0.5 shrink-0">
                        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-xs text-amber-400">
                          <Bot className="w-4 h-4 text-amber-400" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{pos.agentName}</span>
                          <Sparkles className="w-3 h-3 text-amber-400" />
                        </p>
                        <p className="text-[10px] text-indigo-400 font-mono">{pos.model}</p>
                      </div>
                    </div>
                  </div>

                  {/* Directive Summary */}
                  <p className="text-[11px] text-slate-300 bg-slate-900/80 p-2 rounded-xl border border-slate-800 line-clamp-2 leading-relaxed">
                    "{pos.systemDirective}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                    <span>Reports To: <strong className="text-slate-200">{pos.reportsTo}</strong></span>
                    <span>Completed: <strong className="text-amber-400">{pos.tasksCompleted}</strong></span>
                  </div>
                </div>

                {/* Active Autonomous Task */}
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60 text-[11px] space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Current Autonomous Focus:</span>
                  <p className="text-slate-300 font-medium truncate">{pos.activeTask}</p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenPosition(pos)}
                  className="flex-1 py-2 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Configure Agent</span>
                </button>

                <button
                  onClick={() => handleOpenPosition(pos)}
                  className="px-3.5 py-2 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all"
                  title="Inspect Agent & Execute Directive"
                >
                  <Play className="w-3.5 h-3.5 text-amber-400" />
                  <span>Execute</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL / DRAWER: INSPECT, CONFIGURE & EXECUTE POSITION CUSTOM AI AGENT */}
      {selectedPosition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  {selectedPosition.levelLabel}
                </span>
                <h2 className="text-lg font-bold text-white mt-1">{selectedPosition.positionTitle}</h2>
                <p className="text-xs text-slate-400">{selectedPosition.firmName} • {selectedPosition.department}</p>
              </div>

              <button
                onClick={() => setSelectedPosition(null)}
                className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 rounded-xl border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Config Mode vs View Mode */}
            {isEditingAgent ? (
              /* EDIT FORM */
              <form onSubmit={handleSaveAgentConfig} className="space-y-4 text-xs">
                <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <span>Configure Custom AI Agent Settings</span>
                </h3>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Assigned Custom AI Agent Name</label>
                  <input
                    type="text"
                    required
                    value={editAgentName}
                    onChange={e => setEditAgentName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">AI Model Engine / Persona Alias</label>
                  <select
                    value={editModel}
                    onChange={e => setEditModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Gemini 3.6 Flash Executive Engine">Gemini 3.6 Flash Executive Engine</option>
                    <option value="Gemini 3.6 Flash Code Architect">Gemini 3.6 Flash Code Architect</option>
                    <option value="Gemini 3.6 Flash Strategic Research">Gemini 3.6 Flash Strategic Research</option>
                    <option value="Gemini 3.6 Flash Creative Studio">Gemini 3.6 Flash Creative Studio</option>
                    <option value="Gemini 3.6 Flash Economics Engine">Gemini 3.6 Flash Economics Engine</option>
                    <option value="Gemini 3.6 Flash Bio Intelligence">Gemini 3.6 Flash Bio Intelligence</option>
                    <option value="Holas Zero-Trust Shield Engine">Holas Zero-Trust Shield Engine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Autonomy Frequency & Schedule</label>
                  <input
                    type="text"
                    required
                    value={editFrequency}
                    onChange={e => setEditFrequency(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Core System Prompt / Position Directive</label>
                  <textarea
                    rows={4}
                    required
                    value={editDirective}
                    onChange={e => setEditDirective(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEditingAgent(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 font-bold rounded-xl"
                  >
                    Save Custom Agent Config
                  </button>
                </div>
              </form>
            ) : (
              /* INSPECT & EXECUTE VIEW */
              <div className="space-y-6 text-xs">
                {/* Agent Header Details */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-amber-500 p-0.5 shrink-0">
                      <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-amber-400 text-lg">
                        <Bot className="w-6 h-6 text-amber-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{selectedPosition.agentName}</h3>
                      <p className="text-[11px] text-indigo-400 font-mono">{selectedPosition.model}</p>
                      <p className="text-[10px] text-slate-400">Reports To: {selectedPosition.reportsTo}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsEditingAgent(true)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold flex items-center space-x-1.5 self-start sm:self-center"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Configure Agent</span>
                  </button>
                </div>

                {/* System Directive Card */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">System Directive & Prompt:</span>
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-200 leading-relaxed font-mono">
                    {selectedPosition.systemDirective}
                  </div>
                </div>

                {/* Capabilities Tags */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Specialist Capabilities:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPosition.capabilities.map((cap, i) => (
                      <span key={i} className="px-2.5 py-1 bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 rounded-lg text-[10px] font-mono font-bold">
                        ✓ {cap}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Live Execution Output Viewer */}
                {positionExecutionOutput && (
                  <div className="bg-slate-950 border border-emerald-800/80 rounded-2xl p-4 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Live Autonomous Deliverable Output Generated!</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{positionExecutionOutput.deliverableType}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{positionExecutionOutput.title}</h4>
                    <p className="text-xs text-slate-300">{positionExecutionOutput.summary}</p>

                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-slate-200 font-mono text-[11px] max-h-48 overflow-y-auto whitespace-pre-wrap">
                      {positionExecutionOutput.content}
                    </div>
                  </div>
                )}

                {/* Execute Button */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Tasks Completed: <strong className="text-amber-400">{selectedPosition.tasksCompleted}</strong>
                  </span>

                  <button
                    onClick={handleExecutePositionAgent}
                    disabled={isExecutingPosition}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-slate-950 font-black rounded-xl flex items-center space-x-2 shadow-lg transition-all"
                  >
                    <Play className={`w-4 h-4 ${isExecutingPosition ? 'animate-spin' : ''}`} />
                    <span>{isExecutingPosition ? 'Agent Executing Directive...' : `Trigger ${selectedPosition.agentName} Now`}</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
