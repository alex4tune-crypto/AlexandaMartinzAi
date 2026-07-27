import React from 'react';
import { CorporateNode } from '../../types';
import { X, Building2, Users, ShoppingBag, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

interface Props {
  node: CorporateNode | null;
  onClose: () => void;
  onRequestSolution: (firmName: string) => void;
}

export const PublicNodeDetailModal: React.FC<Props> = ({ node, onClose, onRequestSolution }) => {
  if (!node) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl relative overflow-hidden">
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-indigo-500 to-emerald-500" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400 font-bold text-lg">
            {node.firmCode.slice(0, 4)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {node.badge}
              </span>
              <span className="text-xs text-emerald-400 flex items-center font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                {node.status}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight mt-1">{node.name}</h2>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          {node.description}
        </p>

        {/* Node Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
            <Cpu className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
            <p className="text-[11px] text-slate-400">CEO Agent</p>
            <p className="text-xs font-semibold text-slate-200 truncate">{node.ceoAgentName}</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
            <Users className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <p className="text-[11px] text-slate-400">Specialist Agents</p>
            <p className="text-xs font-semibold text-slate-200">{node.activeAgentsCount} Active</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
            <ShoppingBag className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <p className="text-[11px] text-slate-400">Published Products</p>
            <p className="text-xs font-semibold text-slate-200">{node.productsCount} Solutions</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
            <ShieldCheck className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <p className="text-[11px] text-slate-400">Holas Shield</p>
            <p className="text-xs font-semibold text-emerald-400">Protected</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-400 font-mono">Domain Code: {node.firmCode}</p>

          <button
            onClick={() => {
              onClose();
              onRequestSolution(node.name);
            }}
            className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-amber-950/50 transition-all"
          >
            <span>Request Custom Solution</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
