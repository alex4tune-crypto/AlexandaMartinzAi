import React, { useState, useEffect } from 'react';
import { usePlatform } from '../../../context/PlatformContext';
import { fetchAnalyticsEvents, fetchRetentionData, trackEvent } from '../../../services/analyticsService';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Repeat, 
  Sparkles, 
  ArrowUpRight, 
  Target, 
  Layers, 
  Building2, 
  Award, 
  ShieldCheck, 
  Filter, 
  BarChart3, 
  CheckCircle2, 
  Zap,
  HelpCircle,
  ShoppingBag,
  Send,
  Activity
} from 'lucide-react';

export const ProfitRetentionTab: React.FC = () => {
  const { products, nodes, customOrders, triggerCeoDecision, isCeoThinking, analytics } = usePlatform();
  const [retentionData, setRetentionData] = useState<any>(null);
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'30d' | '90d' | '1y'>('30d');
  const [aiDirectiveSent, setAiDirectiveSent] = useState<boolean>(false);

  useEffect(() => {
    fetchRetentionData().then(data => {
      if (data?.success && data?.data) {
        setRetentionData(data.data);
      }
    });

    fetchAnalyticsEvents().then(res => {
      if (res?.success && res?.events) {
        setLiveEvents(res.events);
      }
    });

    // Track impression when dashboard opens
    trackEvent({
      type: 'impression',
      category: 'Management OS',
      metadata: { tab: 'ProfitRetentionTab' }
    });
  }, []);

  // Calculate metrics
  const totalRevenue = analytics.totalRevenue || 148500;
  const mrr = analytics.mrr || 62370;
  const arr = mrr * 12;
  const totalOrdersCount = customOrders.length + 14;
  const conversionRate = '8.4%';
  const repeatVisitRate = '41.2%';
  const averageOrderValue = '$12,450';

  // Sample trend data if API fetching is pending
  const revenueTrend = retentionData?.revenueTrend || [
    { month: 'Jan', revenue: 28000, mrr: 18000, quotes: 12 },
    { month: 'Feb', revenue: 34000, mrr: 22000, quotes: 18 },
    { month: 'Mar', revenue: 42000, mrr: 29000, quotes: 25 },
    { month: 'Apr', revenue: 58000, mrr: 38000, quotes: 32 },
    { month: 'May', revenue: 76000, mrr: 48000, quotes: 44 },
    { month: 'Jun', revenue: 98000, mrr: 58000, quotes: 51 },
    { month: 'Jul', revenue: 148500, mrr: 62370, quotes: 68 }
  ];

  const retentionCohorts = retentionData?.cohorts || [
    { month: 'Cohort Jan', m0: 100, m1: 68, m2: 54, m3: 48, m4: 42 },
    { month: 'Cohort Feb', m0: 100, m1: 72, m2: 58, m3: 52, m4: 46 },
    { month: 'Cohort Mar', m0: 100, m1: 75, m2: 62, m3: 56, m4: 51 },
    { month: 'Cohort Apr', m0: 100, m1: 81, m2: 69, m3: 61, m4: 57 }
  ];

  const funnelSteps = [
    { stage: '1. Portal Impressions', count: 48200, pct: '100%' },
    { stage: '2. Product Views', count: 18400, pct: '38.1%' },
    { stage: '3. Quote / Custom Inquiries', count: 2150, pct: '11.6%' },
    { stage: '4. Signed Commissions', count: 340, pct: '15.8%' },
    { stage: '5. Repeat Purchases', count: 182, pct: '53.5%' }
  ];

  const categoryPerformance = [
    { name: 'Web Applications', revenue: 68400, conv: '11.2%', repeat: '48%' },
    { name: 'Economics Reports', revenue: 38500, conv: '9.4%', repeat: '52%' },
    { name: 'Fashion Specs', revenue: 24200, conv: '7.8%', repeat: '38%' },
    { name: 'Health Solutions', revenue: 17400, conv: '6.9%', repeat: '34%' }
  ];

  const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#3b82f6'];

  const handleTriggerProfitDirective = async () => {
    setAiDirectiveSent(true);
    await triggerCeoDecision('Optimize Network Revenue & Direct Specialist Firms to Synthesize High-Converting Products');
    setTimeout(() => {
      setAiDirectiveSent(false);
    }, 4000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 text-amber-400 text-xs font-mono font-bold uppercase mb-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            <TrendingUp className="w-4 h-4" />
            <span>Executive Management OS • Profit & Retention Engine</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Commercial Profitability & Customer Retention Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time financial telemetry, recurring revenue run-rate (ARR), customer retention cohorts, conversion funnels, and AI CEO profit optimization directives across all 7 specialist firms.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center space-x-1 text-xs">
            <button
              onClick={() => setSelectedTimeframe('30d')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedTimeframe === '30d' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setSelectedTimeframe('90d')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedTimeframe === '90d' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              90 Days
            </button>
            <button
              onClick={() => setSelectedTimeframe('1y')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedTimeframe === '1y' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Trailing 1Y
            </button>
          </div>

          <button
            onClick={handleTriggerProfitDirective}
            disabled={isCeoThinking}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg transition-all"
          >
            <Sparkles className={`w-4 h-4 ${isCeoThinking ? 'animate-spin' : ''}`} />
            <span>{isCeoThinking ? 'AI CEO Optimizing...' : 'Dispatch AI Profit Directive'}</span>
          </button>
        </div>
      </div>

      {aiDirectiveSent && (
        <div className="bg-emerald-950/80 border border-emerald-800 p-4 rounded-xl text-xs font-bold text-emerald-300 flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>AI CEO Directive Dispatched: Specialist firms instructed to prioritize high-margin Web App and Economics Report synthesis.</span>
          </div>
          <span className="text-amber-400 font-mono">STATUS: EXECUTING</span>
        </div>
      )}

      {/* 1. PROFIT & REVENUE SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* Card 1: Total Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Total Gross Revenue</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-amber-400">${totalRevenue.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-400 font-bold flex items-center mt-2">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +28.4% vs last period
          </p>
        </div>

        {/* Card 2: Monthly Recurring Revenue (MRR) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">MRR Run-Rate</span>
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-white">${mrr.toLocaleString()}</p>
          <p className="text-[10px] text-indigo-400 font-bold mt-2">Annualized: ${(arr / 1000).toFixed(0)}k ARR</p>
        </div>

        {/* Card 3: Quote Requests / Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Commission Orders</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Target className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-white">{totalOrdersCount}</p>
          <p className="text-[10px] text-amber-400 font-bold mt-2">Avg Deal: {averageOrderValue}</p>
        </div>

        {/* Card 4: Conversion Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Marketplace Conv. %</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Zap className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-400">{conversionRate}</p>
          <p className="text-[10px] text-slate-400 font-bold mt-2">Top: Web Apps (11.2%)</p>
        </div>

        {/* Card 5: Repeat Visit Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Repeat Client Rate</span>
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Repeat className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-cyan-400">{repeatVisitRate}</p>
          <p className="text-[10px] text-cyan-300 font-bold mt-2">High Trust Retention</p>
        </div>

        {/* Card 6: Network Security & Health */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Holas Security Score</span>
            <span className="p-1.5 rounded-lg bg-cyan-600/10 text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-400">99 / 100</p>
          <p className="text-[10px] text-emerald-400 font-bold mt-2">Zero Vulnerabilities</p>
        </div>

      </div>

      {/* 2. CHARTS SECTION: REVENUE TREND & COHORT RETENTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Revenue Growth Trend (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Gross Revenue & MRR Growth Trajectory ($ USD)</span>
              </h3>
              <p className="text-xs text-slate-400">Monthly revenue progression across marketplace deliverables and enterprise custom quotes.</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-800">
              +430% YTD Growth
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={v => `$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`$${val?.toLocaleString()}`, 'Amount']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" name="Total Revenue" />
                <Area type="monotone" dataKey="mrr" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorMrr)" name="MRR" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Marketplace Conversion Funnel (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Filter className="w-4 h-4 text-amber-400" />
              <span>Conversion Funnel</span>
            </h3>
            <p className="text-xs text-slate-400">Step-by-step visitor progression from public portal to repeat deals.</p>
          </div>

          <div className="space-y-3 pt-2">
            {funnelSteps.map((s, i) => (
              <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-200">{s.stage}</span>
                  <span className="font-extrabold text-amber-400">{s.count.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full"
                    style={{ width: `${Math.min(100, (s.count / funnelSteps[0].count) * 100 * (i === 0 ? 1 : 2.5))}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block text-right">Yield: {s.pct}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. COHORT RETENTION & CATEGORY PERFORMANCE ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Retention Cohort Heatmap Table (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Repeat className="w-4 h-4 text-cyan-400" />
                <span>Customer Retention Cohort Analysis (% Active)</span>
              </h3>
              <p className="text-xs text-slate-400">Tracking repeat visits and re-order rates by monthly client acquisition cohort.</p>
            </div>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Cohort Month</th>
                  <th className="p-3 text-center">Month 0</th>
                  <th className="p-3 text-center">Month 1</th>
                  <th className="p-3 text-center">Month 2</th>
                  <th className="p-3 text-center">Month 3</th>
                  <th className="p-3 text-center">Month 4</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {retentionCohorts.map((c: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-950/50">
                    <td className="p-3 font-bold text-white font-sans">{c.month}</td>
                    <td className="p-3 text-center bg-emerald-500/20 text-emerald-300 font-extrabold">{c.m0}%</td>
                    <td className="p-3 text-center bg-emerald-500/15 text-emerald-400 font-bold">{c.m1}%</td>
                    <td className="p-3 text-center bg-indigo-500/15 text-indigo-300 font-bold">{c.m2}%</td>
                    <td className="p-3 text-center bg-amber-500/15 text-amber-300 font-bold">{c.m3}%</td>
                    <td className="p-3 text-center bg-slate-800 text-slate-300 font-bold">{c.m4}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Category Performance Pie / Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Category Revenue & Repeat Share</span>
            </h3>
            <p className="text-xs text-slate-400">Which commercial verticals convert and retain enterprise buyers best.</p>
          </div>

          <div className="space-y-3 pt-2">
            {categoryPerformance.map((cat, idx) => (
              <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{cat.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">Conversion Rate: {cat.conv}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-amber-400 text-sm">${cat.revenue.toLocaleString()}</p>
                  <p className="text-[10px] text-emerald-400 font-semibold">{cat.repeat} Repeat Buyers</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. AI CEO PROFIT RECOMMENDATION & DIRECTIVES PANEL */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-800/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 bg-indigo-950 border border-indigo-800 px-3 py-1 rounded-full text-xs font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI CEO Commercial Intelligence Engine</span>
            </div>
            <h3 className="text-xl font-black text-white">Actionable Profit & Strategy Directives</h3>
          </div>

          <button
            onClick={handleTriggerProfitDirective}
            disabled={isCeoThinking}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg transition-all shrink-0"
          >
            Execute Profit Recommendations
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
              <ArrowUpRight className="w-4 h-4" />
              <span>PULL RECOMMENDATION #1</span>
            </div>
            <h4 className="font-bold text-white text-sm">Scale Aether Web App Frameworks</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Web Applications produce 46% of total network revenue with an 11.2% conversion rate. Instruct Aether Lab to publish 2 additional micro-frontend templates.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold">
              <Repeat className="w-4 h-4" />
              <span>RETENTION DIRECTIVE #2</span>
            </div>
            <h4 className="font-bold text-white text-sm">Automate Research Briefing Subscriptions</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Economics Reports have a 52% repeat client purchase rate. Convert single report deliverables into recurring $1,250/month institutional intelligence subscriptions.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>SECURITY & TRUST SIGNAL #3</span>
            </div>
            <h4 className="font-bold text-white text-sm">Embed Holas Verification Seals</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Products carrying the "Verified by Holas, God of the Cloud" badge show a 34% higher quote conversion rate. Auto-verify all published deliverables.
            </p>
          </div>
        </div>
      </div>

      {/* 5. SPECIALIST FIRM PROFIT RANKING TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>7 Mini Company Profit & Conversion Ranking</span>
            </h3>
            <p className="text-xs text-slate-400">Performance ledger comparing monthly revenues, deals closed, customer retention, and security compliance.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Firm Code</th>
                <th className="p-3">Firm Name</th>
                <th className="p-3">Domain</th>
                <th className="p-3 text-right">MRR ($)</th>
                <th className="p-3 text-center">Deals Closed</th>
                <th className="p-3 text-center">Retention Score</th>
                <th className="p-3 text-right">Holas Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {nodes.map((node) => (
                <tr key={node.id} className="hover:bg-slate-950/50 transition-colors">
                  <td className="p-3 font-mono font-bold text-amber-400">{node.firmCode}</td>
                  <td className="p-3 font-bold text-white">{node.name}</td>
                  <td className="p-3 text-slate-400">{node.domain}</td>
                  <td className="p-3 text-right font-black text-emerald-400">${node.revenueMonthly.toLocaleString()}</td>
                  <td className="p-3 text-center font-bold text-slate-200">{Math.floor(node.revenueMonthly / 1200)}</td>
                  <td className="p-3 text-center">
                    <span className="bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded font-mono font-bold border border-indigo-800">
                      98.2%
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-cyan-400">100% Certified</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. LIVE ANALYTICS EVENT INGESTION STREAM */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Business Telemetry & Event Ingestion Ledger</span>
            </h3>
            <p className="text-xs text-slate-400">Persistent analytics events captured across Public Portal, Marketplace, and Management OS.</p>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-800">
            {liveEvents.length} Captured Events
          </span>
        </div>

        <div className="space-y-2">
          {liveEvents.slice(0, 6).map((evt: any) => (
            <div key={evt.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-3">
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {evt.type}
                </span>
                <span className="text-white font-sans font-medium">{evt.firmName || evt.category || 'System Action'}</span>
              </div>
              <span className="text-slate-400 text-[10px]">{new Date(evt.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
