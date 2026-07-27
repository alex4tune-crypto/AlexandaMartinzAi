import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="h-8 bg-white border-t border-slate-200 flex items-center justify-between px-6 shrink-0 text-[10px] text-slate-500 font-medium">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Cloud Engine: Operational</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
          <span>Holas Encryption: v9.42</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-slate-400">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Zero-Trust Infrastructure Active</span>
        </div>
      </div>
      <div>
        Alexanda Martinz Inc. &copy; {new Date().getFullYear()} AI Production Network | All Nodes Synchronized
      </div>
    </footer>
  );
};

