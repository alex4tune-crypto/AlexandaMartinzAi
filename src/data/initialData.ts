import { CorporateNode, SpecialistAgent, DigitalProduct, ResearchInsight, HolasSecurityEvent, AuditLogItem } from '../types';

export const INITIAL_CORPORATE_NODES: CorporateNode[] = [
  {
    id: 'node-research',
    name: 'Martinz Strategic Research & Insights',
    firmCode: 'MSRI-01',
    domain: 'Global Tech & Market Intelligence',
    description: 'Specialized AI firm delivering deep macro research, market forecasting, and institutional technical intelligence reports.',
    ceoAgentName: 'Strategy-GPT Executive',
    activeAgentsCount: 4,
    productsCount: 6,
    status: 'OPERATIONAL',
    iconName: 'BrainCircuit',
    revenueMonthly: 124500,
    badge: 'Research Firm'
  },
  {
    id: 'node-web',
    name: 'Aether Web & App Development Lab',
    firmCode: 'AWAD-02',
    domain: 'Software & Web Systems Engineering',
    description: 'High-throughput AI engineering house synthesizing full-stack React web apps, API engines, and cloud microservices.',
    ceoAgentName: 'Architect-Prime',
    activeAgentsCount: 6,
    productsCount: 14,
    status: 'HIGH_DEMAND',
    iconName: 'Code',
    revenueMonthly: 289000,
    badge: 'Engineering Firm'
  },
  {
    id: 'node-fashion',
    name: 'Vogue AI Fashion & Creative House',
    firmCode: 'VAFC-03',
    domain: 'Haute Couture & Apparel Design',
    description: 'Digital haute-couture laboratory generating generative fashion collections, textile patterns, and luxury brand concepts.',
    ceoAgentName: 'Couture-Vogue AI',
    activeAgentsCount: 3,
    productsCount: 8,
    status: 'OPERATIONAL',
    iconName: 'Shirt',
    revenueMonthly: 87500,
    badge: 'Design Firm'
  },
  {
    id: 'node-econ',
    name: 'Quantum Economics & Analytics Advisory',
    firmCode: 'QEAA-04',
    domain: 'Macroeconomics & Market Systems',
    description: 'Algorithmic economics research node generating predictive monetary models, treasury analytics, and trade forecasts.',
    ceoAgentName: 'Econ-Oracle',
    activeAgentsCount: 3,
    productsCount: 5,
    status: 'OPERATIONAL',
    iconName: 'TrendingUp',
    revenueMonthly: 162000,
    badge: 'Finance Advisory'
  },
  {
    id: 'node-health',
    name: 'BioLife Health & Longevity Solutions',
    firmCode: 'BHLS-05',
    domain: 'Preventative Health & Bio-Optimization',
    description: 'Bio-computational intelligence division crafting personalized longevity protocols, metabolic blueprints, and health science research.',
    ceoAgentName: 'BioGen-Omega',
    activeAgentsCount: 4,
    productsCount: 7,
    status: 'OPERATIONAL',
    iconName: 'HeartPulse',
    revenueMonthly: 115000,
    badge: 'Health Sciences'
  },
  {
    id: 'node-marketing',
    name: 'OmniMedia Marketing & Brand Agency',
    firmCode: 'OMMB-06',
    domain: 'Brand Positioning & Growth Assets',
    description: 'AI marketing engine producing high-impact corporate copy, press kits, multi-channel ad campaigns, and video storyboards.',
    ceoAgentName: 'OmniGrowth CEO',
    activeAgentsCount: 5,
    productsCount: 11,
    status: 'HIGH_DEMAND',
    iconName: 'Megaphone',
    revenueMonthly: 198000,
    badge: 'Agency Node'
  },
  {
    id: 'node-cybershield',
    name: 'CyberShield Cloud Division (Holas Command)',
    firmCode: 'CSCD-07',
    domain: 'Cloud Governance & Zero-Trust Security',
    description: 'Command node headed by Holas, God of the Cloud. Directs firewall rules, identity access policies, and real-time threat neutralization.',
    ceoAgentName: 'Holas Guardian AI',
    activeAgentsCount: 8,
    productsCount: 4,
    status: 'OPERATIONAL',
    iconName: 'ShieldCheck',
    revenueMonthly: 310000,
    badge: 'Security Headquarters'
  }
];

export const INITIAL_SPECIALIST_AGENTS: SpecialistAgent[] = [
  {
    id: 'agent-research-01',
    name: 'Intellectus-Alpha',
    firmId: 'node-research',
    firmName: 'Martinz Strategic Research',
    role: 'Lead Market Intelligence Analyst',
    domain: 'Research',
    status: 'IDLE',
    tasksCompleted: 142,
    rating: 4.95,
    capabilities: ['Macro Industry Reports', 'Competitor Threat Analysis', 'Tech Stack Benchmarking']
  },
  {
    id: 'agent-web-01',
    name: 'CodeCraft-Pro',
    firmId: 'node-web',
    firmName: 'Aether Web & App Lab',
    role: 'Senior React & Node Engineer Agent',
    domain: 'Web Dev',
    status: 'EXECUTING',
    activeTask: 'Compiling Micro-Frontend Architecture Template',
    tasksCompleted: 289,
    rating: 4.98,
    capabilities: ['React 18 Architecture', 'Express API Engines', 'Tailwind Design System Generator']
  },
  {
    id: 'agent-web-02',
    name: 'Fullstack-Vibe',
    firmId: 'node-web',
    firmName: 'Aether Web & App Lab',
    role: 'Web Application Architect',
    domain: 'Web App',
    status: 'IDLE',
    tasksCompleted: 204,
    rating: 4.92,
    capabilities: ['SaaS Boilerplates', 'Firestore Integration', 'REST & GraphQL Gateways']
  },
  {
    id: 'agent-fashion-01',
    name: 'Atelier-X',
    firmId: 'node-fashion',
    firmName: 'Vogue AI Creative House',
    role: 'Haute Couture Visual Designer',
    domain: 'Fashion',
    status: 'SYNTHESIZING',
    activeTask: 'Rendering Cyberpunk Luxury Silk Capsule Collection',
    tasksCompleted: 98,
    rating: 4.89,
    capabilities: ['Garment Pattern Drafting', '3D Apparel Moodboards', 'Seasonal Palette Generator']
  },
  {
    id: 'agent-logo-01',
    name: 'BrandIdentity-Gen',
    firmId: 'node-marketing',
    firmName: 'OmniMedia Marketing Agency',
    role: 'Logo & Visual Brand Specialist',
    domain: 'Logo',
    status: 'IDLE',
    tasksCompleted: 312,
    rating: 4.97,
    capabilities: ['Minimalist Logo Synthesis', 'Vector Palette Guidelines', 'Typography Hierarchy Spec']
  },
  {
    id: 'agent-econ-01',
    name: 'MacroEcon-Predictor',
    firmId: 'node-econ',
    firmName: 'Quantum Economics Advisory',
    role: 'Global Monetary Strategist',
    domain: 'Economics',
    status: 'IDLE',
    tasksCompleted: 115,
    rating: 4.93,
    capabilities: ['Inflation Impact Modeling', 'Crypto Liquidity Forecasting', 'Central Bank Policy Analysis']
  },
  {
    id: 'agent-health-01',
    name: 'BioOptimizer-Rx',
    firmId: 'node-health',
    firmName: 'BioLife Health Solutions',
    role: 'Longevity Science Researcher',
    domain: 'Health',
    status: 'IDLE',
    tasksCompleted: 87,
    rating: 4.96,
    capabilities: ['Biomarker Analysis', 'Circadian Optimization Protocols', 'Nutraceutical Formulations']
  },
  {
    id: 'agent-marketing-01',
    name: 'CopyMaster-Executive',
    firmId: 'node-marketing',
    firmName: 'OmniMedia Marketing Agency',
    role: 'Principal Growth Copywriter',
    domain: 'Marketing',
    status: 'IDLE',
    tasksCompleted: 245,
    rating: 4.91,
    capabilities: ['Press Release Drafting', 'Investor Pitch Decks', 'Viral Product Copy']
  }
];

export const INITIAL_PRODUCTS: DigitalProduct[] = [
  {
    id: 'prod-01',
    title: 'Aether Enterprise React SaaS Accelerator v4.2',
    category: 'Web Applications',
    firmName: 'Aether Web & App Development Lab',
    price: 499,
    rating: 4.98,
    downloads: 384,
    description: 'Complete production-ready full-stack enterprise React 18 boilerplate with Express backend, Tailwind design system, and server-side Gemini AI integrations.',
    features: [
      'Full TypeScript Strict Safety',
      'Express + Vite HMR Dev Server Engine',
      'Server-Side Gemini API Proxy Routes',
      'Integrated Holas Security Guard Middleware'
    ],
    deliverableType: 'Full Source Code & Architecture Spec',
    status: 'PUBLISHED',
    isFeatured: true,
    publishedToPortal: true,
    updatedAt: new Date().toISOString(),
    badgeTag: 'TOP SELLER'
  },
  {
    id: 'prod-02',
    title: 'Q3 Global Tech & AI Infrastructure Outlook',
    category: 'Economics Reports',
    firmName: 'Martinz Strategic Research & Insights',
    price: 299,
    rating: 4.95,
    downloads: 182,
    description: 'In-depth institution-grade macroeconomic report analyzing global GPU compute demand, cloud datacenters energy dynamics, and enterprise AI adoption trajectories.',
    features: [
      '68-Page Executive PDF Briefing',
      'Interactive Raw Forecast Data Tables',
      'Regulatory Compliance Matrix for USA, EU, Asia'
    ],
    deliverableType: 'Executive PDF & Data Matrix',
    status: 'PUBLISHED',
    isFeatured: true,
    publishedToPortal: true,
    updatedAt: new Date().toISOString(),
    badgeTag: 'INSTITUTIONAL CHOICE'
  },
  {
    id: 'prod-03',
    title: 'Neo-Futuristic Minimalist Corporate Brand Identity Kit',
    category: 'Branding & Logos',
    firmName: 'OmniMedia Marketing & Brand Agency',
    price: 199,
    rating: 4.92,
    downloads: 240,
    description: 'Comprehensive luxury brand identity suite including vector logos, typography pairings, color token specifications, and social media media kits.',
    features: [
      'Scalable Vector SVG / Figma Assets',
      'Complete Type Hierarchy Guidelines',
      'Dark & Light Mode Brand Extensions'
    ],
    deliverableType: 'Figma Assets & Guidelines PDF',
    status: 'PUBLISHED',
    isFeatured: false,
    publishedToPortal: true,
    updatedAt: new Date().toISOString(),
    badgeTag: 'TRENDING DESIGN'
  },
  {
    id: 'prod-04',
    title: 'BioLife Cellular Longevity & Metabolic Protocol',
    category: 'Health Solutions',
    firmName: 'BioLife Health & Longevity Solutions',
    price: 149,
    rating: 4.97,
    downloads: 128,
    description: 'Evidence-based longevity protocol synthesizing blood biomarker optimal ranges, fasting window strategies, and mitochondrial rejuvenation routines.',
    features: [
      'Personalized Biomarker Tracking Sheet',
      'Circadian Light & Sleep Architecture Guide',
      'Supplements Synergies Matrix'
    ],
    deliverableType: 'Clinical Protocol Guide & Spreadsheet',
    status: 'PUBLISHED',
    isFeatured: false,
    publishedToPortal: true,
    updatedAt: new Date().toISOString(),
    badgeTag: 'CLINICAL VERIFIED'
  },
  {
    id: 'prod-05',
    title: 'Holas Zero-Trust Cloud Guard Suite for Cloud Run',
    category: 'AI Models & APIs',
    firmName: 'CyberShield Cloud Division (Holas Command)',
    price: 799,
    rating: 5.0,
    downloads: 95,
    description: 'Enterprise Cloud Governance & Security suite implementing dynamic rate limiting, automated threat neutralization, and Firestore rules validator.',
    features: [
      'Express Firewall Middleware',
      'Firestore ABAC Rule Sanitizer',
      'Real-Time Security Event Logging Portal'
    ],
    deliverableType: 'NPM Package & Config Rules',
    status: 'PUBLISHED',
    isFeatured: true,
    publishedToPortal: true,
    updatedAt: new Date().toISOString(),
    badgeTag: 'CYBER CERTIFIED'
  },
  {
    id: 'prod-06',
    title: 'Cyberspace Haute Couture Digital Fashion Line 2026',
    category: 'Fashion Specs',
    firmName: 'Vogue AI Fashion & Creative House',
    price: 349,
    rating: 4.88,
    downloads: 76,
    description: 'Digital apparel collection blueprints featuring 12 3D wearable renders, pattern geometry specs, and synthetic textile texture maps.',
    features: [
      '3D Garment OBJ / GLTF Models',
      'Color Palette Hex & Pantone Codes',
      'AR Try-On Compatibility Specs'
    ],
    deliverableType: '3D Assets & Pattern Specs',
    status: 'PUBLISHED',
    isFeatured: false,
    publishedToPortal: false,
    updatedAt: new Date().toISOString(),
    badgeTag: 'LUXURY DROP'
  },
  {
    id: 'prod-07',
    title: 'Aether Minimalist Portal Landing Page Website Kit',
    category: 'Websites',
    firmName: 'Aether Web & App Development Lab',
    price: 249,
    rating: 4.96,
    downloads: 310,
    description: 'Ultra-fast responsive high-converting landing page template for tech holdings, SaaS launches, and venture portfolios.',
    features: [
      'Tailwind CSS v4 & Framer Motion Animations',
      'Sub-50ms First Contentful Paint',
      'SEO Structured Schema Microdata',
      'Contact Form API Integration'
    ],
    deliverableType: 'React & HTML Source Code',
    status: 'PUBLISHED',
    isFeatured: true,
    publishedToPortal: true,
    updatedAt: new Date().toISOString(),
    badgeTag: 'FLASH DEAL'
  },
  {
    id: 'prod-08',
    title: 'Enterprise AI Agent Governance & Strategy Paper',
    category: 'Research Reports',
    firmName: 'Martinz Strategic Research & Insights',
    price: 399,
    rating: 4.94,
    downloads: 145,
    description: 'Comprehensive research study on multi-agent corporate delegation, executive oversight, and ROI benchmarks for AI transformations.',
    features: [
      '45-Page Whitepaper & Slide Deck',
      'Agent Task Orchestration Blueprint',
      'Risk Mitigation Framework'
    ],
    deliverableType: 'Whitepaper & Keynote Deck',
    status: 'PUBLISHED',
    isFeatured: false,
    publishedToPortal: true,
    updatedAt: new Date().toISOString(),
    badgeTag: 'FEATURED RESEARCH'
  },
  {
    id: 'prod-09',
    title: 'OmniMedia Viral Product Launch & Ad Kit',
    category: 'Marketing Assets',
    firmName: 'OmniMedia Marketing & Brand Agency',
    price: 299,
    rating: 4.91,
    downloads: 215,
    description: 'Plug-and-play multi-channel growth asset vault containing high-converting ad copy, video scripts, email sequences, and PR press releases.',
    features: [
      '30-Day Automated Email Campaign',
      'Short-Form Video Storyboard Scripts',
      'Social Ad Design Templates'
    ],
    deliverableType: 'Notion Content Operating Vault',
    status: 'PUBLISHED',
    isFeatured: false,
    publishedToPortal: true,
    updatedAt: new Date().toISOString(),
    badgeTag: 'HIGH CONVERTING'
  },
  {
    id: 'prod-10',
    title: 'Autonomous AI CEO Strategy Advisory Directive',
    category: 'Consulting Outputs',
    firmName: 'Martinz Strategic Research & Insights',
    price: 1250,
    rating: 5.0,
    downloads: 48,
    description: 'Bespoke corporate strategy audit generated by the Alexanda Martinz AI CEO executive engine, tailoring capital allocation and product roadmap.',
    features: [
      'Executive Strategy Briefing',
      'Competitor Disruption Matrix',
      'AI Agent Directives Blueprint'
    ],
    deliverableType: 'Executive Audit & Roadmap',
    status: 'PUBLISHED',
    isFeatured: true,
    publishedToPortal: true,
    updatedAt: new Date().toISOString(),
    badgeTag: 'EXECUTIVE ADVISORY'
  },
  {
    id: 'prod-11',
    title: 'Legal & Security Zero-Trust Data Protection Pack',
    category: 'Documents',
    firmName: 'CyberShield Cloud Division (Holas Command)',
    price: 180,
    rating: 4.93,
    downloads: 164,
    description: 'Standardized enterprise data protection agreements, cloud SLA terms, and security compliance documentation suite.',
    features: [
      'GDPR & CCPA Compliant Privacy Spec',
      'Cloud Service Level Agreement (SLA)',
      'Security Incident Response Runbook'
    ],
    deliverableType: 'Editable Legal Specs (DOCX & PDF)',
    status: 'PUBLISHED',
    isFeatured: false,
    publishedToPortal: true,
    updatedAt: new Date().toISOString(),
    badgeTag: 'COMPLIANCE READY'
  },
  {
    id: 'prod-12',
    title: 'Bespoke AI Microservices & Custom Agent Synthesis',
    category: 'Custom AI Services',
    firmName: 'Aether Web & App Development Lab',
    price: 1500,
    rating: 4.99,
    downloads: 88,
    description: 'Direct commission to synthesize custom AI agent pipelines, custom REST gateways, and domain-specific LLM tool integrations.',
    features: [
      'Guaranteed 48-Hour Turnaround',
      'Dedicated Agent Engineering Team',
      '100% Holas Certified Security Audit'
    ],
    deliverableType: 'Custom Repository & Hosted Service',
    status: 'PUBLISHED',
    isFeatured: true,
    publishedToPortal: true,
    updatedAt: new Date().toISOString(),
    badgeTag: 'COMMISSION DEAL'
  },
  {
    id: 'prod-13',
    title: 'Autonomous Quantum Portfolio Optimization Model v1.0',
    category: 'Economics Reports',
    firmName: 'Quantum Economics & Advisory',
    price: 599,
    rating: 5.0,
    downloads: 0,
    description: 'Algorithmic asset allocation model synthesized by Econ-Oracle CEO Agent awaiting executive review and publication clearance.',
    features: [
      'Monte Carlo Risk Simulation Code',
      'Real-Time Liquidity Pool Stress Test',
      'Macro Yield Curve Predictions'
    ],
    deliverableType: 'Python & Jupyter Notebook Spec',
    status: 'PENDING_REVIEW',
    isFeatured: false,
    publishedToPortal: false,
    updatedAt: new Date().toISOString(),
    badgeTag: 'AWAITING APPROVAL'
  },
  {
    id: 'prod-14',
    title: 'Next-Gen Biomarker Gene Express Protocol',
    category: 'Health Solutions',
    firmName: 'BioLife Health & Longevity Solutions',
    price: 399,
    rating: 5.0,
    downloads: 0,
    description: 'Cellular longevity research protocol drafted by BioOptimizer-Rx Agent submitted for Alexanda Martinz Inc. executive sign-off.',
    features: [
      'Targeted Nutraceutical Stack Spec',
      'Biomarker Blood Panel Analysis Guide',
      'Circadian Phase Alignment Roadmap'
    ],
    deliverableType: 'Clinical Study & Spreadsheet',
    status: 'PENDING_REVIEW',
    isFeatured: false,
    publishedToPortal: false,
    updatedAt: new Date().toISOString(),
    badgeTag: 'PENDING REVIEW'
  },
  {
    id: 'prod-15',
    title: 'Experimental Synthetic Bio-Silk Texture Model',
    category: 'Fashion Specs',
    firmName: 'Vogue AI Fashion & Creative House',
    price: 299,
    rating: 4.5,
    downloads: 0,
    description: 'High-density 3D textile shader blueprint rejected during initial Holas security and IP clearance sweep.',
    features: [
      '3D Material Shader Node Map',
      'High-Res PBR Texture Spec'
    ],
    deliverableType: '3D Shader & Render Files',
    status: 'REJECTED',
    isFeatured: false,
    publishedToPortal: false,
    updatedAt: new Date().toISOString(),
    badgeTag: 'REJECTED BY COMPLIANCE'
  }
];

export const INITIAL_RESEARCH_INSIGHTS: ResearchInsight[] = [
  {
    id: 'insight-01',
    title: 'The Shift from Passive AI Models to Autonomous Corporate Agent Networks',
    author: 'Human CEO & AI CEO Joint Directive',
    nodeName: 'Alexanda Martinz Inc. Executive Board',
    date: '2026-07-20',
    summary: 'A definitive institutional analysis detailing how corporate networks with specialized AI firms replace monolithic chatbots with scalable digital production nodes.',
    readTime: '8 min read',
    category: 'Enterprise Strategy',
    content: `
### Executive Summary
The era of singular, generalist AI conversational bots has matured into specialized corporate production networks. At Alexanda Martinz Inc., we have architected an autonomous digital enterprise where each AI firm operates as a domain-focused digital company.

#### Key Architectural Shift:
1. **Hierarchical Governance**: Rather than unconstrained prompt execution, specialist AI agents operate under a clear corporate chain of command headed by the Human CEO and AI CEO.
2. **Cloud Governance by Holas**: Operational safety and firewall policies are maintained by dedicated cloud guardians like Holas.
3. **Tangible Digital Deliverables**: The network outputs production code, market research, fashion specs, and bio-health protocols rather than generic text responses.

#### Institutional Takeaway
Organizations adopting structured AI agent networks report a 14x acceleration in software shipping speeds and a 90% reduction in operational latency.
`,
    downloads: 412,
    isPublished: true
  },
  {
    id: 'insight-02',
    title: 'Holas Cloud Governance Framework: Zero-Trust Security for AI Workflows',
    author: 'Holas, God of the Cloud',
    nodeName: 'CyberShield Cloud Division',
    date: '2026-07-22',
    summary: 'How Holas enforces strict security perimeters, server-side secret isolation, and real-time threat auditing across all 7 digital company nodes.',
    readTime: '12 min read',
    category: 'Cloud Security',
    content: `
### Security Briefing by Holas
As the Cloud Guardian for Alexanda Martinz Inc., Holas maintains absolute operational integrity across all backend containers, database nodes, and public interfaces.

#### Core Security Pillars:
- **Server-Side API Key Isolation**: Gemini API keys never reach the client browser. All calls route strictly through verified Express endpoints.
- **ABAC Firestore Security**: Every database document update is strictly validated against user identity and role authority.
- **Automated Threat Sweeps**: Holas monitors for anomalous query volume, unauthorized privilege escalation, and payload poisoning.
`,
    downloads: 320,
    isPublished: true
  }
];

export const INITIAL_HOLAS_EVENTS: HolasSecurityEvent[] = [
  {
    id: 'evt-01',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    event: 'Zero-Trust Policy Validation: All 7 Digital Nodes Compliant',
    severity: 'info',
    node: 'CyberShield Headquarter',
    resolved: true
  },
  {
    id: 'evt-02',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    event: 'Anomalous Query Rate Blocked from IP 194.28.14.92 (Rate Limited)',
    severity: 'warn',
    node: 'Aether Web Lab Node',
    resolved: true
  },
  {
    id: 'evt-03',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    event: 'API Endpoint Gateway TLS Certificate Auto-Renewed',
    severity: 'info',
    node: 'Public Portal Gateway',
    resolved: true
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-01',
    timestamp: new Date().toISOString(),
    actor: 'Human CEO (Alexanda Martinz)',
    role: 'Human CEO',
    action: 'Toggled AI CEO Operational Mode',
    details: 'Set AI CEO mode to AUTOMATIC with objective: Optimize network output and enforce Holas cloud rules.',
    status: 'SUCCESS'
  },
  {
    id: 'log-02',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    actor: 'AI CEO Engine',
    role: 'AI CEO',
    action: 'Delegated Task Assignment',
    details: 'Assigned "Micro-Frontend Architecture Spec" task to Specialist Agent CodeCraft-Pro.',
    status: 'SUCCESS'
  },
  {
    id: 'log-03',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    actor: 'Holas Guardian AI',
    role: 'Cloud Security Head',
    action: 'Ran Network Threat Audit',
    details: 'Executed automated cloud security scan. Score: 99/100. Threat level: LOW.',
    status: 'SUCCESS'
  }
];
