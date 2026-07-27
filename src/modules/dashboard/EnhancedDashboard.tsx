import React, { useState, useEffect } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { northflankService } from '../../services/northflank';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Package, Activity, Cloud } from 'lucide-react';

export const EnhancedDashboard: React.FC = () => {
  const { dashboardSubTab, setDashboardSubTab } = usePlatform();
  const [analytics, setAnalytics] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenueData] = useState([
    { month: 'Jan', revenue: 28000, expenses: 18000 },
    { month: 'Feb', revenue: 34000, expenses: 22000 },
    { month: 'Mar', revenue: 42000, expenses: 29000 },
    { month: 'Apr', revenue: 58000, expenses: 38000 },
    { month: 'May', revenue: 76000, expenses: 48000 },
    { month: 'Jun', revenue: 98000, expenses: 58000 },
    { month: 'Jul', revenue: 124000, expenses: 72000 },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const projectsData = await northflankService.getProjects();
      setProjects(projectsData);
      
      // Calculate analytics
      const totalRevenue = 124000;
      const totalExpenses = 72000;
      setAnalytics({
        totalRevenue,
        profit: totalRevenue - totalExpenses,
        profitMargin: Math.round(((totalRevenue - totalExpenses) / totalRevenue) * 100),
        totalProjects: projectsData.length,
        activeServices: projectsData.reduce((sum: number, p: any) => sum + (p.services?.length || 0), 0),
        deployments: 42,
        uptime: 99.95,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const pieData = [
    { name: 'Revenue', value: analytics.totalRevenue, fill: '#3b82f6' },
    { name: 'Expenses', value: analytics.profit, fill: '#10b981' },
  ];

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: TrendingUp, label: 'Total Revenue', value: `$${analytics.totalRevenue.toLocaleString()}`, color: 'from-blue-600 to-blue-400' },
            { icon: Activity, label: 'Profit', value: `$${analytics.profit.toLocaleString()}`, color: 'from-green-600 to-green-400' },
            { icon: Cloud, label: 'Active Services', value: analytics.activeServices, color: 'from-purple-600 to-purple-400' },
            { icon: Package, label: 'Uptime', value: `${analytics.uptime}%`, color: 'from-yellow-600 to-yellow-400' },
          ].map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div key={idx} className={`bg-gradient-to-br ${metric.color} rounded-lg p-6 text-white shadow-lg`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80 mb-1">{metric.label}</p>
                    <p className="text-3xl font-bold">{metric.value}</p>
                  </div>
                  <Icon size={40} className="opacity-50" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Revenue vs Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Profit Breakdown */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Profit Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={() => null} outerRadius={80}>
                  {pieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Profit Margin</span>
                <span className="text-green-400 font-bold">{analytics.profitMargin}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Overview */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Cloud className="text-blue-400" /> Active Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="bg-slate-700 rounded p-4 border border-slate-600">
                <h4 className="font-bold text-white mb-2">{project.name}</h4>
                <div className="space-y-1 text-sm text-slate-300">
                  <p>Status: <span className={project.status === 'active' ? 'text-green-400' : 'text-yellow-400'}>{project.status}</span></p>
                  <p>Services: {project.services?.length || 0}</p>
                  <p>Region: {project.environment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
