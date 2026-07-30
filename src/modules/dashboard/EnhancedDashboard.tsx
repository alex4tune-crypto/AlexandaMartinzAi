import React, { useState, useEffect } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { northflankService } from '../../services/northflank';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Activity, Cloud, ShieldCheck, Zap, Server, BarChart3, PieChart as PieIcon } from 'lucide-react';

export const EnhancedDashboard: React.FC = () => {
  const { dashboardSubTab, setDashboardSubTab } = usePlatform();
  const [analytics, setAnalytics] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenueData] = useState([
    { month: 'JAN', revenue: 28000, expenses: 18000 },
    { month: 'FEB', revenue: 34000, expenses: 22000 },
    { month: 'MAR', revenue: 42000, expenses: 29000 },
    { month: 'APR', revenue: 58000, expenses: 38000 },
    { month: 'MAY', revenue: 76000, expenses: 48000 },
    { month: 'JUN', revenue: 98000, expenses: 58000 },
    { month: 'JUL', revenue: 124000, expenses: 72000 },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsData, analyticsRes] = await Promise.all([
        northflankService.getProjects(),
        fetch('/api/marketplace/analytics').then(res => res.json())
      ]);

      setProjects(projectsData);
      
      if (analyticsRes.success) {
        const data = analyticsRes.analytics;
        const totalRevenue = data.totalRevenue || 0;
        const totalExpenses = Math.round(totalRevenue * 0.58);
        
        setAnalytics({
          totalRevenue,
          profit: totalRevenue - totalExpenses,
          profitMargin: Math.round(((totalRevenue - totalExpenses) / totalRevenue) * 100) || 0,
          totalProjects: projectsData.length,
          activeServices: projectsData.reduce((sum: number, p: any) => sum + (p.services?.length || 0), 0),
          deployments: data.quoteRequestsCount || 0,
          uptime: data.networkSecurityScore || 99.95,
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex-1 bg-obsidian flex items-center justify-center"><LoadingSpinner /></div>;

  const pieData = [
    { name: 'Revenue', value: analytics.totalRevenue },
    { name: 'Profit', value: analytics.profit },
  ];

  const COLORS = ['#3b82f6', '#10b981'];

  return (
    <div className="flex-1 bg-obsidian overflow-y-auto pt-28">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">
              <Zap size={14} className="fill-emerald-400" /> Operational Overview
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
              Network Operations <span className="text-slate-500">Terminal</span>
            </h2>
          </div>
          <div className="flex gap-4">
             <div className="glass-card px-6 py-3 rounded-2xl flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black text-white uppercase tracking-widest">LIVE SYNC ACTIVE</span>
             </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: TrendingUp, label: 'Capital Throughput', value: `$${analytics.totalRevenue.toLocaleString()}`, color: 'text-blue-400' },
            { icon: Activity, label: 'Net Profit Yield', value: `$${analytics.profit.toLocaleString()}`, color: 'text-emerald-400' },
            { icon: Server, label: 'Active Service Nodes', value: analytics.activeServices, color: 'text-purple-400' },
            { icon: ShieldCheck, label: 'Platform Stability', value: `${analytics.uptime}%`, color: 'text-cyan-400' },
          ].map((metric, idx) => (
            <div key={idx} className="glass-card p-8 rounded-[2rem] hover:border-white/20 transition-all group">
              <div className="flex items-center justify-between mb-6">
                <metric.icon size={24} className={`${metric.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className="h-1 w-12 bg-white/5 rounded-full" />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">{metric.label}</p>
              <p className="text-3xl font-black text-white tracking-tighter">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Terminal */}
          <div className="glass-card rounded-[2.5rem] p-10">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                <BarChart3 className="text-blue-400" size={20} /> Revenue Performance
              </h3>
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border border-white/5 px-3 py-1 rounded-lg">Last 7 Months</div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="month" stroke="#475569" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', fontSize: '12px' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Allocation Breakdown */}
          <div className="glass-card rounded-[2.5rem] p-10">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                <PieIcon className="text-emerald-400" size={20} /> Capital Allocation
              </h3>
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest border border-white/5 px-3 py-1 rounded-lg">Current Portfolio</div>
            </div>
            <div className="h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value">
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Efficiency</span>
                 <span className="text-3xl font-black text-emerald-400 tracking-tighter">{analytics.profitMargin}%</span>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
               {pieData.map((d, i) => (
                 <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                   <div className="flex items-center gap-2 mb-2">
                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{d.name}</span>
                   </div>
                   <div className="text-lg font-black text-white">${d.value.toLocaleString()}</div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Project Deployment Grid */}
        <div className="glass-card rounded-[2.5rem] p-10">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
              <Cloud className="text-blue-400" size={20} /> Active Network Projects
            </h3>
            <button className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-xl">Initialize New Node</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="bg-white/5 rounded-3xl p-6 border border-white/5 hover:border-white/10 transition-all group">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/50 group-hover:text-blue-400 transition-colors">
                    <Server size={20} />
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                    project.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {project.status}
                  </div>
                </div>
                <h4 className="font-black text-white text-lg mb-4 tracking-tight">{project.name}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-500">Service Nodes</span>
                    <span className="text-white">{project.services?.length || 0}</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '75%' }} />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-500">Region Scope</span>
                    <span className="text-blue-400">{project.environment}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
