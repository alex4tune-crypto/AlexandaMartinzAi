import React, { useState } from 'react';
import { usePlatform } from '../../../context/PlatformContext';
import { 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Server, 
  Database, 
  Key, 
  Activity,
  FileCode2,
  Terminal
} from 'lucide-react';

export const HolasShieldTab: React.FC = () => {
  const { holasEvents, triggerHolasAudit, isHolasAuditing } = usePlatform();

  const [auditResult, setAuditResult] = useState<any>(null);

  const handleRunAudit = async () => {
    const res = await triggerHolasAudit('Full Network Cloud Security & Zero-Trust Rule Sweep');
    setAuditResult(res);
  };

  return (
    <div className="space-y-8">
      {/* Holas Command Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-800/80 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/80 shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-white">Holas, God of the Cloud & Security Head</h2>
              <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-3 py-0.5 rounded-full font-bold border border-emerald-500/20">
                ACTIVE CLOUD GUARDIAN
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Enforces cloud governance, zero-trust firewalls, ABAC Firestore security rules, and server-side API secret isolation across all 7 digital company nodes.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunAudit}
          disabled={isHolasAuditing}
          id="holas-run-audit-button"
          className="shrink-0 flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-lg shadow-emerald-950/60 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isHolasAuditing ? 'animate-spin' : ''}`} />
          <span>{isHolasAuditing ? 'Holas Scanning Cloud...' : 'Run Holas Cloud Security Audit'}</span>
        </button>
      </div>

      {/* Security Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-center space-y-1">
          <p className="text-xs text-slate-400 font-mono">Security Score</p>
          <p className="text-3xl font-black text-emerald-400">
            {auditResult?.securityScore || 99}/100
          </p>
          <p className="text-[11px] text-slate-300 font-semibold">Zero Vulnerabilities</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-center space-y-1">
          <p className="text-xs text-slate-400 font-mono">Threat Level</p>
          <p className="text-2xl font-extrabold text-emerald-400 uppercase">
            {auditResult?.threatLevel || 'LOW'}
          </p>
          <p className="text-[11px] text-slate-300 font-semibold">Protected by Holas</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-center space-y-1">
          <p className="text-xs text-slate-400 font-mono">Active Nodes Monitored</p>
          <p className="text-3xl font-black text-indigo-400">
            {auditResult?.scannedNodes || 7} Nodes
          </p>
          <p className="text-[11px] text-slate-300 font-semibold">100% Synchronized</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-center space-y-1">
          <p className="text-xs text-slate-400 font-mono">Active Firewall Rules</p>
          <p className="text-3xl font-black text-amber-400">
            {auditResult?.firewallRulesActive || 48} Rules
          </p>
          <p className="text-[11px] text-slate-300 font-semibold">ABAC Policy Deployed</p>
        </div>
      </div>

      {/* Audit Findings & Recommendations */}
      {auditResult && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Holas Security Audit Results ({auditResult.timestamp})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] text-amber-400">Audit Findings</h4>
              <ul className="space-y-1.5 text-slate-300">
                {auditResult.auditFindings.map((f: string, i: number) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] text-indigo-400">Holas Recommendations</h4>
              <ul className="space-y-1.5 text-slate-300">
                {auditResult.recommendations.map((r: string, i: number) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Cloud Security Policy Pillars */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Holas Cloud Governance & Security Policies
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
              <Key className="w-4 h-4" />
              <span>Server-Side Secret Isolation</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Gemini API keys and database credentials are stored strictly in server environment variables. Never exposed to browser JavaScript.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-semibold">
              <Database className="w-4 h-4" />
              <span>ABAC Firestore Rules</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              `firestore.rules` enforces Attribute-Based Access Control and default-deny catchall on all database collections.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-400 font-semibold">
              <Lock className="w-4 h-4" />
              <span>Human CEO Hierarchy Lock</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Human CEO override logic is preserved at the system level. AI CEO auto-decisions cannot bypass security policies.
            </p>
          </div>
        </div>
      </div>

      {/* Security Incident Log Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center justify-between">
          <span>Holas Security Incident & Audit Log Stream</span>
          <span className="text-xs font-mono text-slate-400">{holasEvents.length} Events Logged</span>
        </h3>

        <div className="space-y-2 text-xs">
          {holasEvents.map((evt) => (
            <div key={evt.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-200">{evt.event}</p>
                  <p className="text-[11px] text-slate-400 font-mono">Node: {evt.node}</p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">{evt.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
