import React, { useState, useEffect } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { BarChart3, Shield, GitBranch, Zap } from 'lucide-react';

export const DashboardModule: React.FC = () => {
  const { dashboardSubTab, setDashboardSubTab } = usePlatform();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/marketplace/analytics');
      const data = await response.json();
      if (data.success) setAnalytics(data.analytics);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'hierarchy' as const, label: 'Corporate Hierarchy', icon: GitBranch },
    { id: 'ai-ceo' as const, label: 'AI CEO', icon: Zap },
    { id: 'holas-shield' as const, label: 'Holas Shield', icon: Shield },
    { id: 'agent-orchestration' as const, label: 'Agents', icon: BarChart3 },
  ];

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setDashboardSubTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                  dashboardSubTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="text-slate-400 text-sm mb-2">Total Revenue</div>
                <div className="text-3xl font-bold text-blue-400">${analytics?.totalRevenue?.toLocaleString() || 0}</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="text-slate-400 text-sm mb-2">MRR</div>
                <div className="text-3xl font-bold text-green-400">${analytics?.mrr?.toLocaleString() || 0}</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="text-slate-400 text-sm mb-2">Total Downloads</div>
                <div className="text-3xl font-bold text-purple-400">{analytics?.totalDownloads || 0}</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="text-slate-400 text-sm mb-2">Products</div>
                <div className="text-3xl font-bold text-yellow-400">{analytics?.totalProducts || 0}</div>
              </div>
            </div>

            {/* Active Tab Content */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              {dashboardSubTab === 'hierarchy' && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Corporate Hierarchy</h3>
                  <div className="space-y-3 text-slate-300">
                    <p>👤 Human CEO: Alexanda Martinz</p>
                    <p>🤖 AI CEO: Executive Decision Engine</p>
                    <p>🛡️ Holas (Cloud Guardian): Security & Governance Head</p>
                    <p>7️⃣ Specialist AI Firms: Operating across Web, Research, Fashion, Health, Economics, Marketing, Automation</p>
                  </div>
                </div>
              )}

              {dashboardSubTab === 'ai-ceo' && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">AI CEO Executive Panel</h3>
                  <div className="space-y-3 text-slate-300">
                    <p>Status: ✅ Operational</p>
                    <p>Network Efficiency: 94.2%</p>
                    <p>Active Directives: {analytics?.quoteRequestsCount || 0}</p>
                    <p>Strategic Actions Executed Today: 12</p>
                    <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                      Issue New Directive
                    </button>
                  </div>
                </div>
              )}

              {dashboardSubTab === 'holas-shield' && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Holas Cloud Shield Security</h3>
                  <div className="space-y-3 text-slate-300">
                    <div className="flex justify-between">
                      <span>Security Score:</span>
                      <span className="font-bold text-green-400">{analytics?.networkSecurityScore || 99}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Threat Level:</span>
                      <span className="font-bold text-green-400">LOW</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Firewalls:</span>
                      <span className="font-bold">42</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Threats Blocked Today:</span>
                      <span className="font-bold text-yellow-400">14</span>
                    </div>
                  </div>
                </div>
              )}

              {dashboardSubTab === 'agent-orchestration' && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Specialist AI Agents</h3>
                  <p className="text-slate-300 mb-4">Top Performing Firm: {analytics?.topPerformingFirm}</p>
                  <p className="text-slate-300">Conversion Rate: {analytics?.conversionRate}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
