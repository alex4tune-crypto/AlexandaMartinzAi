import React from 'react';
import { usePlatform } from '../../../context/PlatformContext';
import { Building2, Cpu, Users, ShoppingBag, ShieldCheck, DollarSign, Activity } from 'lucide-react';

export const NodeManagementTab: React.FC = () => {
  const { nodes } = usePlatform();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono font-bold uppercase mb-1">
            <Building2 className="w-4 h-4" />
            <span>Digital Node Directory</span>
          </div>
          <h2 className="text-xl font-bold text-white">7 Specialist Digital Company Nodes</h2>
          <p className="text-xs text-slate-400 mt-1">
            Each digital company node operates as a mini digital enterprise under Alexanda Martinz Inc. holding governance.
          </p>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
          <p className="text-slate-400">Total Network Revenue (Monthly):</p>
          <p className="text-lg font-black text-amber-400">
            ${nodes.reduce((acc, n) => acc + n.revenueMonthly, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Nodes Cards Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nodes.map((node) => (
          <div key={node.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded border border-amber-500/20 font-bold">
                {node.firmCode}
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                {node.status}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-white text-base">{node.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{node.domain}</p>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
              {node.description}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <p className="text-[10px] text-slate-400">CEO Agent</p>
                <p className="font-semibold text-slate-200 truncate">{node.ceoAgentName}</p>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <p className="text-[10px] text-slate-400">Monthly Revenue</p>
                <p className="font-bold text-amber-400">${node.revenueMonthly.toLocaleString()}</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span>{node.activeAgentsCount} Agents</span>
              <span>{node.productsCount} Products Published</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
