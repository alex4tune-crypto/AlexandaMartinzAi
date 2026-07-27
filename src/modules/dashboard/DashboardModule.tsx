import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { HierarchyTab } from './tabs/HierarchyTab';
import { AiCeoTab } from './tabs/AiCeoTab';
import { AgentOrchestrationTab } from './tabs/AgentOrchestrationTab';
import { NodeManagementTab } from './tabs/NodeManagementTab';
import { LivePublishingTab } from './tabs/LivePublishingTab';
import { HolasShieldTab } from './tabs/HolasShieldTab';
import { BillingTab } from './tabs/BillingTab';
import { AuditTab } from './tabs/AuditTab';
import { ProfitRetentionTab } from './tabs/ProfitRetentionTab';
import { 
  Building2, 
  Layers, 
  Bot, 
  Cpu, 
  Share2, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  Power, 
  Sparkles,
  AlertTriangle,
  Globe,
  TrendingUp,
  BarChart2
} from 'lucide-react';

export const DashboardModule: React.FC = () => {
  const { 
    dashboardTab, 
    setDashboardTab, 
    aiCeoAutoMode, 
    toggleAiCeoMode, 
    nodes,
    setCurrentSurface,
    triggerCeoDecision,
    isCeoThinking,
    activeCeoGoal
  } = usePlatform();

  const renderActiveTabContent = () => {
    switch (dashboardTab) {
      case 'profit-analytics':
        return <ProfitRetentionTab />;
      case 'hierarchy':
        return <HierarchyTab />;
      case 'ai-ceo':
        return <AiCeoTab />;
      case 'agent-orchestration':
        return <AgentOrchestrationTab />;
      case 'nodes':
        return <NodeManagementTab />;
      case 'live-publishing':
        return <LivePublishingTab />;
      case 'holas-shield':
        return <HolasShieldTab />;
      case 'billing':
        return <BillingTab />;
      case 'audit':
        return <AuditTab />;
      default:
        return <ProfitRetentionTab />;
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden bg-[#F1F5F9] text-slate-900 font-sans min-h-[calc(100vh-4rem)]">
      {/* Sidebar Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-sm">
        <div className="p-4 flex-1 flex flex-col gap-6 overflow-y-auto">
          {/* Executive & Profit Intelligence */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">
              Executive Profit OS
            </label>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setDashboardTab('profit-analytics')}
                  className={`w-full flex items-center gap-3 p-2 rounded-md font-medium text-xs text-left transition-colors ${
                    dashboardTab === 'profit-analytics'
                      ? 'bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Profit & Retention OS</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Section 1: System Architecture */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">
              System Architecture
            </label>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setDashboardTab('hierarchy')}
                  className={`w-full flex items-center gap-3 p-2 rounded-md font-medium text-xs text-left transition-colors ${
                    dashboardTab === 'hierarchy'
                      ? 'bg-indigo-50 text-indigo-700 font-bold border-l-4 border-indigo-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>Corporate Hierarchy</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => setDashboardTab('nodes')}
                  className={`w-full flex items-center gap-3 p-2 rounded-md font-medium text-xs text-left transition-colors ${
                    dashboardTab === 'nodes'
                      ? 'bg-indigo-50 text-indigo-700 font-bold border-l-4 border-indigo-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Layers className="w-4 h-4 text-slate-500" />
                  <span>Node Management</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => setDashboardTab('billing')}
                  className={`w-full flex items-center gap-3 p-2 rounded-md font-medium text-xs text-left transition-colors ${
                    dashboardTab === 'billing'
                      ? 'bg-indigo-50 text-indigo-700 font-bold border-l-4 border-indigo-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Billing & Token Ledger</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => setDashboardTab('audit')}
                  className={`w-full flex items-center gap-3 p-2 rounded-md font-medium text-xs text-left transition-colors ${
                    dashboardTab === 'audit'
                      ? 'bg-indigo-50 text-indigo-700 font-bold border-l-4 border-indigo-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Audit Log Trail</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Section 2: AI Orchestration */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">
              AI Orchestration
            </label>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setDashboardTab('ai-ceo')}
                  className={`w-full flex items-center gap-3 p-2 rounded-md font-medium text-xs text-left transition-colors ${
                    dashboardTab === 'ai-ceo'
                      ? 'bg-indigo-50 text-indigo-700 font-bold border-l-4 border-indigo-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
                  <span>AI CEO Control Panel</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => setDashboardTab('agent-orchestration')}
                  className={`w-full flex items-center gap-3 p-2 rounded-md font-medium text-xs text-left transition-colors ${
                    dashboardTab === 'agent-orchestration'
                      ? 'bg-indigo-50 text-indigo-700 font-bold border-l-4 border-indigo-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Specialist Agent Workbench</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => setDashboardTab('holas-shield')}
                  className={`w-full flex items-center gap-3 p-2 rounded-md font-medium text-xs text-left transition-colors ${
                    dashboardTab === 'holas-shield'
                      ? 'bg-indigo-50 text-indigo-700 font-bold border-l-4 border-indigo-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shrink-0" />
                  <span>Holas Cloud Guardian</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => setDashboardTab('live-publishing')}
                  className={`w-full flex items-center gap-3 p-2 rounded-md font-medium text-xs text-left transition-colors ${
                    dashboardTab === 'live-publishing'
                      ? 'bg-indigo-50 text-indigo-700 font-bold border-l-4 border-indigo-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span>Live Publishing Hub</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Holas Security Guardian Footer Box */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded bg-cyan-600 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">HOLAS GUARDIAN</p>
              <p className="text-[10px] text-slate-500 font-medium">Cloud Security Officer</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded p-2.5 shadow-2xs">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-slate-500 font-medium">Shield Status</span>
              <span className="text-cyan-600 font-bold">99.9% SECURE</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 w-[99.9%]" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* OS Control Bar */}
        <div className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-6 sm:gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI CEO Governance Mode</span>
              <div className="flex items-center gap-2 mt-0.5">
                <button 
                  onClick={toggleAiCeoMode}
                  className={`w-8 h-4 rounded-full relative transition-colors ${aiCeoAutoMode ? 'bg-indigo-600' : 'bg-amber-600'}`}
                >
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${aiCeoAutoMode ? 'right-0.5' : 'left-0.5'}`} />
                </button>
                <span className={`text-xs font-bold ${aiCeoAutoMode ? 'text-indigo-700' : 'text-amber-700'}`}>
                  {aiCeoAutoMode ? 'AUTO-PILOT ACTIVE' : 'MANUAL OVERRIDE'}
                </span>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200 hidden sm:block" />

            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network Nodes</span>
              <div className="flex items-center gap-1.5 mt-0.5 font-mono text-xs">
                <span className="text-slate-900 font-bold">{nodes.length} Nodes</span>
                <span className="text-emerald-600 font-bold">• Operational</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => triggerCeoDecision(activeCeoGoal)}
              disabled={isCeoThinking}
              id="os-trigger-decision-button"
              className="px-3.5 py-1.5 border border-slate-300 rounded-md text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Bot className={`w-3.5 h-3.5 text-indigo-600 ${isCeoThinking ? 'animate-spin' : ''}`} />
              <span>{isCeoThinking ? 'AI CEO Thinking...' : 'Trigger CEO Cycle'}</span>
            </button>

            <button
              onClick={() => setCurrentSurface('portal')}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>View Portal</span>
            </button>
          </div>
        </div>

        {/* Dashboard Active Tab View Wrapper */}
        <div className="p-6 sm:p-8 flex-1">
          {renderActiveTabContent()}
        </div>
      </main>
    </div>
  );
};
