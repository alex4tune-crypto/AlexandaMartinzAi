import React, { useState } from 'react';
import { usePlatform } from '../../../context/PlatformContext';
import { 
  Bot, 
  Power, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Activity, 
  Zap,
  TrendingUp,
  BrainCircuit,
  Compass,
  FileText,
  Lightbulb
} from 'lucide-react';

const PRESET_PROMPTS = [
  {
    title: "Accelerate Software & React SaaS Production",
    goal: "Accelerate React software shipping in Aether Web Lab, publish new AI research papers, and maintain Holas zero-trust security."
  },
  {
    title: "Optimize Cross-Node Revenue & Agent Allocation",
    goal: "Evaluate cross-node performance across all 7 digital firms, optimize agent token usage, and identify high-margin marketplace opportunities."
  },
  {
    title: "BioLife & Quantum Node Strategic Alignment",
    goal: "Synthesize BioLife Health cellular longevity research with Quantum Economics forecasting models for institutional enterprise clients."
  },
  {
    title: "Holas Zero-Trust Threat & Vulnerability Audit",
    goal: "Conduct a comprehensive security sweep across public API endpoints, isolate server keys, and mandate Holas Cloud Shield rate limits."
  }
];

export const AiCeoTab: React.FC = () => {
  const { 
    aiCeoAutoMode, 
    toggleAiCeoMode, 
    activeCeoGoal, 
    setActiveCeoGoal, 
    latestCeoDecision, 
    isCeoThinking, 
    triggerCeoDecision
  } = usePlatform();

  const [promptInput, setPromptInput] = useState(activeCeoGoal);

  const handleRunDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    setActiveCeoGoal(promptInput);
    await triggerCeoDecision(promptInput);
  };

  const handleApplyPreset = (presetGoal: string) => {
    setPromptInput(presetGoal);
    setActiveCeoGoal(presetGoal);
    triggerCeoDecision(presetGoal);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* AI CEO Status Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xs">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 shrink-0">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-bold text-slate-900">Alexanda AI CEO Control Panel</h2>
              <span className={`text-xs font-mono px-3 py-0.5 rounded-full font-bold border ${
                aiCeoAutoMode 
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {aiCeoAutoMode ? 'AUTO MODE: ACTIVE' : 'MANUAL OVERRIDE'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Custom Gemini Executive AI Engine overseeing platform strategy, autonomous decision cycles, and cross-node firm delegation.
            </p>
          </div>
        </div>

        {/* Governance Mode Switch */}
        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex items-center space-x-4 shrink-0">
          <div>
            <p className="text-xs font-bold text-slate-800">Governance Mode</p>
            <p className="text-[11px] text-slate-500 font-medium">{aiCeoAutoMode ? 'AI CEO governs platform' : 'Human CEO in manual control'}</p>
          </div>
          <button
            onClick={toggleAiCeoMode}
            id="ai-ceo-mode-toggle-tab-button"
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all border ${
              aiCeoAutoMode 
                ? 'bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700 shadow-xs' 
                : 'bg-amber-600 text-white border-amber-700 hover:bg-amber-700 shadow-xs'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{aiCeoAutoMode ? 'AUTO ON' : 'MANUAL'}</span>
          </button>
        </div>
      </div>

      {/* Preset Strategic Prompts Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Quick Strategic Directives & Presets</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRESET_PROMPTS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset.goal)}
              disabled={isCeoThinking}
              className="p-3.5 bg-white border border-slate-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50/50 text-left transition-all group shadow-2xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition-colors flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
                  {preset.title}
                </span>
                <Compass className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {preset.goal}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Strategic Goal Trigger Form / Executive Prompt Interface */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase text-indigo-700">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Executive Business Intelligence Prompting Engine</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Powered by Gemini 3.6 Flash</span>
        </div>

        <form onSubmit={handleRunDecision} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Enter Strategic Query or Business Directive for the AI CEO:
            </label>
            <textarea
              rows={3}
              value={promptInput}
              onChange={e => setPromptInput(e.target.value)}
              placeholder="e.g. Analyze market demand for BioLife longevity products, evaluate Aether web lab sprint progress, and formulate a 30-day expansion plan."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-sans leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
              <span>Real-time Gemini API server-side analysis</span>
            </div>

            <button
              type="submit"
              disabled={isCeoThinking || !promptInput.trim()}
              id="ai-ceo-run-decision-button"
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-lg text-xs shadow-sm transition-all"
            >
              <Send className={`w-3.5 h-3.5 ${isCeoThinking ? 'animate-spin' : ''}`} />
              <span>{isCeoThinking ? 'Generating Executive Briefing...' : 'Ask AI CEO / Execute Directive'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Latest Executive Decision Output */}
      {latestCeoDecision && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Executive Strategic Briefing Output</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {latestCeoDecision.timestamp}
            </span>
          </div>

          {/* Executive Summary */}
          <div className="bg-indigo-50/60 p-4 rounded-lg border border-indigo-100 space-y-1.5">
            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-700" />
              Executive Summary & Business Intelligence Insights
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed font-sans font-medium">
              {latestCeoDecision.executiveSummary}
            </p>
          </div>

          {/* Grid: Actions & Delegated Tasks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Strategic Actions */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                <TrendingUp className="w-4 h-4 mr-1.5 text-indigo-600" />
                Strategic Directives Implemented
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {latestCeoDecision.strategicActions.map((act, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Delegated Tasks */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                <Activity className="w-4 h-4 mr-1.5 text-emerald-600" />
                Delegated Firm Tasks
              </h4>
              <div className="space-y-2 text-xs">
                {latestCeoDecision.delegatedTasks.map((dt, i) => (
                  <div key={i} className="p-2.5 bg-white rounded-md border border-slate-200 flex items-start justify-between shadow-2xs">
                    <div>
                      <p className="font-bold text-slate-900">{dt.task}</p>
                      <p className="text-[11px] text-indigo-600 font-mono font-semibold mt-0.5">Firm: {dt.firm}</p>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                      ASSIGNED
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Security Directive */}
          <div className="bg-cyan-50 border border-cyan-200 p-4 rounded-lg flex items-center space-x-3 text-xs text-cyan-900">
            <ShieldCheck className="w-5 h-5 text-cyan-700 shrink-0" />
            <div>
              <span className="font-bold text-cyan-950">Holas Governance Directive: </span>
              <span className="text-cyan-900 font-medium">{latestCeoDecision.securityDirectives}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

