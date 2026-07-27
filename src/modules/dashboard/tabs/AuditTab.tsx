import React from 'react';
import { usePlatform } from '../../../context/PlatformContext';
import { ShieldCheck, UserCheck, Bot, Cpu, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export const AuditTab: React.FC = () => {
  const { auditLogs } = usePlatform();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono font-bold uppercase mb-1">
            <Clock className="w-4 h-4" />
            <span>Immutable Executive Log</span>
          </div>
          <h2 className="text-xl font-bold text-white">Corporate Audit Trail Monitor</h2>
          <p className="text-xs text-slate-400 mt-1">
            Auditable record of all Human CEO, AI CEO, Holas Cloud Shield, and Specialist Agent operations.
          </p>
        </div>

        <span className="text-xs font-mono bg-indigo-950 text-indigo-300 px-3 py-1.5 rounded-xl border border-indigo-800">
          {auditLogs.length} Events Logged
        </span>
      </div>

      {/* Audit Logs List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="space-y-3">
          {auditLogs.map((log) => (
            <div key={log.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    log.role === 'Human CEO' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    log.role === 'AI CEO' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                    log.role === 'Cloud Security Head' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {log.role}
                  </span>
                  <span className="font-bold text-slate-200">{log.actor}</span>
                </div>

                <span className="text-[11px] text-slate-400 font-mono">{log.timestamp}</span>
              </div>

              <p className="font-semibold text-indigo-300">{log.action}</p>
              <p className="text-slate-400 leading-relaxed">{log.details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
