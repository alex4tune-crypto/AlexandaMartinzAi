import React, { useState } from 'react';
import { AdminBillingManager } from '../../billing/AdminBillingManager';
import { usePlatform } from '../../../context/PlatformContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { DollarSign, Receipt, BarChart3, ShieldCheck } from 'lucide-react';

export const BillingTab: React.FC = () => {
  const { nodes } = usePlatform();
  const [subView, setSubView] = useState<'manager' | 'analytics'>('manager');

  const chartData = nodes.map(n => ({
    name: n.firmCode,
    revenue: n.revenueMonthly,
    fullName: n.name
  }));

  const COLORS = ['#f59e0b', '#6366f1', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6'];
  const totalMonthlyRevenue = nodes.reduce((acc, n) => acc + n.revenueMonthly, 0);

  return (
    <div className="space-y-6">
      {/* View Switcher Bar */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSubView('manager')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              subView === 'manager'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span>Invoice & Real-Time Billing Engine</span>
          </button>

          <button
            onClick={() => setSubView('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              subView === 'analytics'
                ? 'bg-amber-950 text-amber-300 border border-amber-800/80 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>Node Revenue & Token Computing Ledger</span>
          </button>
        </div>

        <div className="text-xs font-mono text-slate-400 pr-3 hidden md:block">
          Run-Rate: <span className="font-bold text-amber-400">${(totalMonthlyRevenue * 12).toLocaleString()} / yr</span>
        </div>
      </div>

      {subView === 'manager' && <AdminBillingManager />}

      {subView === 'analytics' && (
        <div className="space-y-8">
          {/* Recharts Analytics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Bar Chart: Node Revenue Breakdown (8 cols) */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Monthly Revenue by Digital Company Node ($ USD)</span>
                <span className="text-xs font-mono text-emerald-400 font-semibold">${totalMonthlyRevenue.toLocaleString()} / mo</span>
              </h3>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={v => `$${v/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
                      formatter={(val: any) => [`$${val?.toLocaleString()}`, 'Monthly Revenue']}
                    />
                    <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart: Revenue Share Distribution (4 cols) */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Revenue Share Distribution</h3>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="revenue"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      paddingAngle={4}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Node Revenue Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Node Billing Ledger Breakdown
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Node Code</th>
                    <th className="p-3">Firm Name</th>
                    <th className="p-3">Domain</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Monthly Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {nodes.map((n) => (
                    <tr key={n.id} className="hover:bg-slate-950/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-amber-400">{n.firmCode}</td>
                      <td className="p-3 font-semibold text-white">{n.name}</td>
                      <td className="p-3 text-slate-400">{n.domain}</td>
                      <td className="p-3 font-semibold text-emerald-400">{n.status}</td>
                      <td className="p-3 text-right font-bold text-slate-100">${n.revenueMonthly.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
