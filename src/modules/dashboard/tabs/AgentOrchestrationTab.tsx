import React, { useState } from 'react';
import { usePlatform } from '../../../context/PlatformContext';
import { SpecialistAgent } from '../../../types';
import { 
  Cpu, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Code, 
  Shirt, 
  TrendingUp, 
  HeartPulse, 
  Megaphone,
  Globe,
  Share2,
  Copy,
  Check
} from 'lucide-react';

export const AgentOrchestrationTab: React.FC = () => {
  const { 
    agents, 
    triggerAgentTask, 
    isAgentExecuting, 
    publishNewProduct, 
    publishNewInsight 
  } = usePlatform();

  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || '');
  const [taskTitle, setTaskTitle] = useState<string>('Compile Micro-Frontend Architecture Specification');
  const [taskInstructions, setTaskInstructions] = useState<string>(
    'Synthesize a full production guide for modular React 18 micro-frontends with server-side Express API integration and Tailwind CSS.'
  );

  const [lastOutput, setLastOutput] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [publishSuccess, setPublishSuccess] = useState<boolean>(false);
  const [publishCategory, setPublishCategory] = useState<string>('Web Applications');

  const categoriesList = [
    'Web Applications',
    'Websites',
    'AI Models & APIs',
    'Branding & Logos',
    'Fashion Specs',
    'Research Reports',
    'Economics Reports',
    'Health Solutions',
    'Marketing Assets',
    'Consulting Outputs',
    'Documents',
    'Custom AI Services'
  ];

  const activeAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAgent || !taskTitle) return;

    const res = await triggerAgentTask(activeAgent.id, taskTitle, taskInstructions);
    setLastOutput(res);
  };

  const handleCopyContent = () => {
    if (!lastOutput?.content) return;
    navigator.clipboard.writeText(lastOutput.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePublishToMarketplace = async () => {
    if (!lastOutput) return;
    await publishNewProduct({
      title: lastOutput.title,
      category: publishCategory as any,
      firmName: activeAgent.firmName,
      price: 299,
      description: lastOutput.summary,
      features: ['Full AI Generated Deliverable', 'Verified Holas Security Compliance'],
      deliverableType: lastOutput.deliverableType || 'Document'
    });
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 3000);
  };

  const handlePublishToPortal = async () => {
    if (!lastOutput) return;
    await publishNewInsight({
      title: lastOutput.title,
      author: activeAgent.name,
      nodeName: activeAgent.firmName,
      summary: lastOutput.summary,
      category: activeAgent.domain,
      content: lastOutput.content
    });
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono font-bold uppercase mb-1">
            <Cpu className="w-4 h-4" />
            <span>Specialist AI Agent Workbench</span>
          </div>
          <h2 className="text-xl font-bold text-white">Agent Task Orchestration Matrix</h2>
          <p className="text-xs text-slate-400 mt-1">
            Directly commission specialist AI agents across 7 digital firms to synthesize codebases, research, fashion specs, and economic reports via Gemini API.
          </p>
        </div>

        <span className="text-xs font-mono bg-indigo-950 text-indigo-300 px-3 py-1.5 rounded-xl border border-indigo-800">
          {agents.length} Domain Specialist Agents
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Agent Selection & Task Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              1. Select Specialist Agent
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {agents.map((ag) => (
                <div
                  key={ag.id}
                  onClick={() => {
                    setSelectedAgentId(ag.id);
                    setTaskTitle(`Generate ${ag.domain} Deliverable for ${ag.firmName}`);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedAgentId === ag.id
                      ? 'bg-indigo-950 border-indigo-600 shadow-md shadow-indigo-950/50'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <p className="font-bold text-slate-200 text-xs">{ag.name}</p>
                    <p className="text-[11px] text-slate-400">{ag.role}</p>
                    <p className="text-[10px] text-amber-400 font-mono mt-0.5">{ag.firmName}</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {ag.domain}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleExecute} className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                2. Task Prompt & Instructions
              </h3>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">Deliverable Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">Detailed Instructions for {activeAgent.name}</label>
                <textarea
                  rows={4}
                  value={taskInstructions}
                  onChange={e => setTaskInstructions(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isAgentExecuting}
                id="agent-trigger-execute-button"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-950/50 transition-all"
              >
                <Play className={`w-4 h-4 ${isAgentExecuting ? 'animate-spin' : ''}`} />
                <span>{isAgentExecuting ? `${activeAgent.name} Executing...` : `Commission ${activeAgent.name}`}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Live Output Viewer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[500px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">
                    {lastOutput ? lastOutput.title : 'Generated Digital Deliverable Output'}
                  </h3>
                </div>

                {lastOutput && (
                  <button
                    onClick={handleCopyContent}
                    className="flex items-center space-x-1 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>

              {lastOutput ? (
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-slate-400">
                    <span>Firm: <strong className="text-amber-400">{lastOutput.firm}</strong></span>
                    <span>Type: <strong className="text-indigo-400">{lastOutput.deliverableType}</strong></span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-200 leading-relaxed font-mono whitespace-pre-wrap max-h-96 overflow-y-auto">
                    {lastOutput.content}
                  </div>
                </div>
              ) : (
                <div className="py-24 text-center text-slate-500 space-y-2">
                  <Cpu className="w-12 h-12 mx-auto text-slate-700" />
                  <p className="text-xs">No active agent task executed yet.</p>
                  <p className="text-[11px] text-slate-600">Select a specialist agent on the left and click Commission.</p>
                </div>
              )}
            </div>

            {/* Live Publishing Controls for Output */}
            {lastOutput && (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                {publishSuccess && (
                  <p className="text-xs text-emerald-400 font-semibold text-center bg-emerald-950/50 p-2 rounded border border-emerald-800">
                    ✓ Deliverable Published Live in Real-Time!
                  </p>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <label className="text-[11px] text-slate-400 font-mono shrink-0">Publish Category:</label>
                    <select
                      value={publishCategory}
                      onChange={e => setPublishCategory(e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg p-1.5 focus:outline-none focus:border-emerald-500"
                    >
                      {categoriesList.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={handlePublishToPortal}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5"
                    >
                      <Globe className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Surface 1 (Portal)</span>
                    </button>

                    <button
                      onClick={handlePublishToMarketplace}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 shadow-lg"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>List on Surface 2 (Marketplace)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
