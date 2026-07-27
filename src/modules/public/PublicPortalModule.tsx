import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { CorporateNode, ResearchInsight, DigitalProduct, UserPersona } from '../../types';
import { PublicNodeDetailModal } from './PublicNodeDetailModal';
import { 
  Building2, 
  Bot, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Download, 
  BookOpen, 
  Send, 
  FileText, 
  CheckCircle2, 
  Layers, 
  Activity,
  Globe,
  Cpu,
  UserCheck,
  ShoppingBag,
  Mail,
  TrendingUp,
  Award,
  Users
} from 'lucide-react';

export const PublicPortalModule: React.FC = () => {
  const { 
    nodes, 
    insights, 
    products, 
    setCurrentSurface, 
    setDashboardTab, 
    submitOrderRequest,
    latestCeoDecision,
    aiCeoAutoMode,
    userPersona,
    setUserPersona,
    analytics
  } = usePlatform();

  const [selectedNode, setSelectedNode] = useState<CorporateNode | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<ResearchInsight | null>(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState<boolean>(false);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Inquiry Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Web Applications');
  const [projectRequirements, setProjectRequirements] = useState('');
  const [budgetTier, setBudgetTier] = useState('$5,000 - $15,000');
  const [assignedFirm, setAssignedFirm] = useState('Aether Web & App Development Lab');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const personas: UserPersona[] = ['Buyer', 'Investor', 'Vendor', 'Executive', 'Analyst'];

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !projectRequirements) return;

    submitOrderRequest({
      clientName,
      clientEmail,
      selectedCategory,
      projectRequirements,
      budgetTier,
      assignedNode: assignedFirm
    });

    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setIsInquiryOpen(false);
      setClientName('');
      setClientEmail('');
      setProjectRequirements('');
    }, 2500);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterSubscribed(false);
      setNewsletterEmail('');
    }, 3000);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Surface 1 Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pt-12 pb-20 border-b border-slate-800/80">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Persona Selector Bar */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 backdrop-blur-sm">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Tailor View For:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {personas.map(p => (
                <button
                  key={p}
                  onClick={() => setUserPersona(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                    userPersona === p
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Left Content */}
            <div className="lg:w-7/12 space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping mr-1" />
                <span className="text-amber-400 font-mono uppercase">Alexanda Martinz Inc. Holding</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300">Enterprise AI Production Network</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                AI Production Network & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-400 to-emerald-400">Commercial Solutions Foundry</span>
              </h1>

              <p className="text-slate-300 text-base leading-relaxed">
                Alexanda Martinz Inc. operates as an enterprise AI holding company governing a real corporate hierarchy. Led by Human CEO Alexanda Martinz, custom AI CEO, and Holas God of the Cloud, our 7 specialized digital firms synthesize production codebases, market research, haute fashion design, and health protocols.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => setIsInquiryOpen(true)}
                  id="portal-request-solution-button"
                  className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-6 py-3.5 rounded-xl text-sm shadow-xl shadow-amber-950/50 transition-all hover:scale-105"
                >
                  <Send className="w-4 h-4" />
                  <span>Request Custom AI Solution</span>
                </button>

                <button
                  onClick={() => setCurrentSurface('marketplace')}
                  id="portal-explore-marketplace-button"
                  className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold px-6 py-3.5 rounded-xl text-sm transition-all"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span>Explore Marketplace Catalog ({products.length})</span>
                </button>
              </div>

              {/* Key Commercial Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-left">
                <div>
                  <p className="text-2xl font-black text-amber-400">${(analytics.totalRevenue / 1000).toFixed(1)}k</p>
                  <p className="text-xs text-slate-400">Total Network Revenue</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-indigo-400">7 Mini Firms</p>
                  <p className="text-xs text-slate-400">Specialist Vendor Nodes</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-emerald-400">100% Secure</p>
                  <p className="text-xs text-slate-400">Holas Cloud Shield</p>
                </div>
              </div>
            </div>

            {/* Right Card: Executive Briefing & AI CEO Status */}
            <div className="lg:w-5/12 w-full">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 p-3 bg-indigo-950/80 border-b border-l border-indigo-800/60 rounded-bl-xl text-xs font-mono text-indigo-300 font-semibold flex items-center">
                  <Bot className="w-3.5 h-3.5 mr-1 text-amber-400" />
                  AI CEO: {aiCeoAutoMode ? 'AUTO ACTIVE' : 'MANUAL CONTROL'}
                </div>

                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Corporate Hierarchy Governance</h3>
                    <p className="text-xs text-slate-400">Real-Time Executive Briefing</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Human CEO:</span>
                    <span className="font-semibold text-slate-200 flex items-center">
                      <UserCheck className="w-3.5 h-3.5 text-amber-400 mr-1" />
                      Alexanda Martinz
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Cloud & Security Head:</span>
                    <span className="font-semibold text-emerald-400 flex items-center">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                      Holas, God of the Cloud
                    </span>
                  </div>

                  <div className="pt-1">
                    <p className="text-slate-400 font-mono text-[11px] uppercase mb-1">Latest Strategy Directive:</p>
                    <p className="text-slate-300 italic text-xs leading-relaxed">
                      "{latestCeoDecision?.executiveSummary.slice(0, 140)}..."
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCurrentSurface('dashboard');
                    setDashboardTab('hierarchy');
                  }}
                  id="portal-view-corporate-os-button"
                  className="mt-4 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-800/50 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
                >
                  <Cpu className="w-4 h-4 text-amber-400" />
                  <span>Access Management OS Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURED MARKETPLACE SOLUTIONS SPOTLIGHT */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
              <span>MARKETPLACE HIGHLIGHTS</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white mt-2">
              Featured AI Commercial Solutions
            </h2>
          </div>

          <button
            onClick={() => setCurrentSurface('marketplace')}
            className="flex items-center space-x-2 text-xs font-bold text-amber-400 hover:text-amber-300"
          >
            <span>View Full Marketplace ({products.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.slice(0, 3).map((prod) => (
            <div
              key={prod.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3 inline-block">
                  {prod.category}
                </span>

                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors mb-2">
                  {prod.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                  {prod.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-mono">Specialist Firm</p>
                  <p className="text-xs font-semibold text-slate-200">{prod.firmName}</p>
                </div>

                <div className="text-right">
                  <p className="text-base font-black text-amber-400">${prod.price}</p>
                  <button
                    onClick={() => setCurrentSurface('marketplace')}
                    className="mt-1 px-3 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-xs font-bold rounded-lg"
                  >
                    Buy in Marketplace
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SPECIALIST DIGITAL FIRMS SHOWCASE */}
      <section className="py-16 bg-slate-900/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center space-x-2 bg-indigo-950/80 border border-indigo-800/60 px-3 py-1 rounded-full text-xs font-semibold text-indigo-300">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>SPECIALIST VENDOR FIRMS</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              7 Autonomous Mini Company Storefronts
            </h2>
            <p className="text-slate-400 text-sm">
              Each node behaves as an autonomous digital company with dedicated CEO agents, specialist AI workforces, and domain commercial outputs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nodes.map((node) => (
              <div
                key={node.id}
                className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {node.badge}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                      {node.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors mb-2">
                    {node.name}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                    {node.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>CEO Agent: <strong className="text-slate-200">{node.ceoAgentName}</strong></span>
                    <span className="text-amber-400 font-mono font-bold">${node.revenueMonthly.toLocaleString()}/mo</span>
                  </div>

                  <button
                    onClick={() => setSelectedNode(node)}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
                  >
                    <span>Explore Firm Profile</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESEARCH INSIGHTS & REPORTS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-mono uppercase text-amber-400 font-semibold">Institutional Intelligence</span>
            <h2 className="text-2xl font-bold text-white mt-1">Research & Insights Reports</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            Published directly from Management OS by Alexanda Martinz Inc. research nodes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((paper) => (
            <div 
              key={paper.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all space-y-4"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="bg-indigo-950 text-indigo-300 font-mono px-2.5 py-0.5 rounded border border-indigo-800">
                  {paper.category}
                </span>
                <span>{paper.date} • {paper.readTime}</span>
              </div>

              <h3 className="text-lg font-bold text-white leading-snug">
                {paper.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                {paper.summary}
              </p>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Author: {paper.author}</span>

                <button
                  onClick={() => setSelectedInsight(paper)}
                  className="flex items-center space-x-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read Executive Report</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER & LEAD MAGNET SECTION */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <Mail className="w-10 h-10 text-amber-400 mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Join 12,000+ Enterprise Executives Receiving Weekly AI CEO Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            Get exclusive market demand analysis, newly published AI microservices, and strategic directives delivered directly from Alexanda Martinz Inc.
          </p>

          {newsletterSubscribed ? (
            <div className="bg-emerald-950/60 border border-emerald-800 p-4 rounded-xl text-emerald-300 text-xs font-bold flex items-center justify-center space-x-2 max-w-md mx-auto">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Subscribed! Executive Intelligence Briefings will arrive weekly.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                placeholder="executive@company.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-lg"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* MODAL: INQUIRY / CUSTOM AI SOLUTIONS REQUEST */}
      {isInquiryOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 text-white shadow-2xl relative">
            <button 
              onClick={() => setIsInquiryOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <Building2 className="w-8 h-8 text-amber-400" />
              <div>
                <h3 className="text-lg font-bold">Request Custom AI Solution</h3>
                <p className="text-xs text-slate-400">Engage Alexanda Martinz Inc. specialist AI firms</p>
              </div>
            </div>

            {inquirySubmitted ? (
              <div className="py-12 text-center space-y-3 bg-emerald-950/40 border border-emerald-800 rounded-xl">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white">Solution Request Dispatched</h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  Assigned to <strong className="text-amber-400">{assignedFirm}</strong> under AI CEO supervision.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Your Full Name / Corporate Entity</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder="e.g. Elena Vance, Sovereign Tech Corp"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Corporate Email</label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={e => setClientEmail(e.target.value)}
                      placeholder="vance@sovereign.tech"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Assigned AI Firm</label>
                    <select
                      value={assignedFirm}
                      onChange={e => setAssignedFirm(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                    >
                      {nodes.map(n => (
                        <option key={n.id} value={n.name}>{n.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Project Requirements & Scope</label>
                  <textarea
                    required
                    rows={4}
                    value={projectRequirements}
                    onChange={e => setProjectRequirements(e.target.value)}
                    placeholder="Describe the digital asset, web application, research briefing, or fashion line you require..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsInquiryOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-slate-950 font-bold rounded-lg shadow-lg"
                  >
                    Dispatch Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* READ INSIGHT MODAL */}
      {selectedInsight && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedInsight(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <span className="text-xs font-mono bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded border border-amber-500/20">
              {selectedInsight.category}
            </span>

            <h2 className="text-xl font-bold mt-3 mb-2">{selectedInsight.title}</h2>
            <p className="text-xs text-slate-400 mb-4">By {selectedInsight.author} • {selectedInsight.date}</p>

            <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-3 bg-slate-950 p-5 rounded-xl border border-slate-800 text-slate-300">
              {selectedInsight.content.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedInsight(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Node Detail Modal */}
      <PublicNodeDetailModal 
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onRequestSolution={(firm) => {
          setAssignedFirm(firm);
          setIsInquiryOpen(true);
        }}
      />
    </div>
  );
};
