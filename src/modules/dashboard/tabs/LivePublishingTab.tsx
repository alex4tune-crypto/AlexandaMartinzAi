import React, { useState } from 'react';
import { usePlatform } from '../../../context/PlatformContext';
import { Share2, Globe, ShoppingBag, CheckCircle2, Send, Sparkles, Cpu, Play } from 'lucide-react';

export const LivePublishingTab: React.FC = () => {
  const { 
    products, 
    insights, 
    publishNewProduct, 
    publishNewInsight, 
    customOrders, 
    updateOrderStatus,
    triggerAiProductSynthesis,
    isSynthesizingProduct,
    nodes
  } = usePlatform();

  const [publishTarget, setPublishTarget] = useState<'portal' | 'marketplace'>('portal');
  
  // Product Form State
  const [productTitle, setProductTitle] = useState('');
  const [productPrice, setProductPrice] = useState(299);
  const [productCategory, setProductCategory] = useState<string>('Web Applications');
  const [productDescription, setProductDescription] = useState('');
  const [firmName, setFirmName] = useState('Aether Web & App Development Lab');

  // AI Factory Quick Synthesis State
  const [synthCategory, setSynthCategory] = useState<string>('Web Applications');
  const [synthFirm, setSynthFirm] = useState<string>('Aether Web & App Development Lab');
  const [synthPrompt, setSynthPrompt] = useState<string>('Autonomous Microservices Suite');

  // Insight Form State
  const [insightTitle, setInsightTitle] = useState('');
  const [insightCategory, setInsightCategory] = useState('Strategic Intelligence');
  const [insightSummary, setInsightSummary] = useState('');
  const [insightContent, setInsightContent] = useState('');

  const [publishSuccessMessage, setPublishSuccessMessage] = useState<string | null>(null);

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

  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (publishTarget === 'marketplace') {
      if (!productTitle || !productDescription) return;
      await publishNewProduct({
        title: productTitle,
        category: productCategory,
        price: Number(productPrice),
        description: productDescription,
        firmName,
        features: ['Full AI Production Solution', 'Holas Cloud Security Verified']
      });
      setPublishSuccessMessage(`Published "${productTitle}" directly to Surface 2 Marketplace under "${productCategory}"!`);
      setProductTitle('');
      setProductDescription('');
    } else {
      if (!insightTitle || !insightContent) return;
      await publishNewInsight({
        title: insightTitle,
        category: insightCategory,
        summary: insightSummary || insightTitle,
        content: insightContent,
        author: 'AI CEO & Executive Board'
      });
      setPublishSuccessMessage(`Published "${insightTitle}" directly to Surface 1 Public Portal!`);
      setInsightTitle('');
      setInsightSummary('');
      setInsightContent('');
    }

    setTimeout(() => setPublishSuccessMessage(null), 4000);
  };

  const handleQuickSynthAndPublish = async () => {
    if (!synthPrompt) return;
    const generated = await triggerAiProductSynthesis(synthFirm, synthCategory, synthPrompt);
    if (generated) {
      setPublishSuccessMessage(`AI Swarm Factory synthesized and auto-published "${generated.title}" to "${synthCategory}" in Marketplace!`);
      setTimeout(() => setPublishSuccessMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono font-bold uppercase mb-1">
            <Share2 className="w-4 h-4" />
            <span>Live Sync Engine</span>
          </div>
          <h2 className="text-xl font-bold text-white">AI Swarm Factory & Live Publishing Hub</h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage swarm firms to produce and publish deliverables across all 12 categories directly from the backend to Surface 1 (Public Portal) and Surface 2 (Marketplace).
          </p>
        </div>
      </div>

      {publishSuccessMessage && (
        <div className="bg-emerald-950 border border-emerald-700 p-4 rounded-xl text-emerald-300 font-bold text-xs flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{publishSuccessMessage}</span>
        </div>
      )}

      {/* AI Swarm Factory Auto-Production & Publishing Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-800/60 rounded-2xl p-6 space-y-4">
        <div className="flex items-center space-x-2 text-amber-400">
          <Cpu className="w-5 h-5 animate-pulse" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            AI Swarm Factory Quick Production & Direct Publish Engine
          </h3>
        </div>
        <p className="text-xs text-slate-300">
          Instruct swarm firms to autonomously synthesize new deliverables for any of the 12 categories and publish immediately to the frontend.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div>
            <label className="block text-[11px] text-slate-400 font-mono mb-1">Target Category (All 12)</label>
            <select
              value={synthCategory}
              onChange={e => setSynthCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 font-mono mb-1">Producing Swarm Firm</label>
            <select
              value={synthFirm}
              onChange={e => setSynthFirm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {nodes.map(n => (
                <option key={n.id} value={n.name}>{n.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 font-mono mb-1">Deliverable Title / Topic</label>
            <input
              type="text"
              value={synthPrompt}
              onChange={e => setSynthPrompt(e.target.value)}
              placeholder="e.g. Next-Gen Financial Forecast Engine"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleQuickSynthAndPublish}
              disabled={isSynthesizingProduct}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-950/50 transition-all"
            >
              <Sparkles className={`w-4 h-4 ${isSynthesizingProduct ? 'animate-spin' : ''}`} />
              <span>{isSynthesizingProduct ? 'Synthesizing...' : 'Synthesize & Publish Live'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Surface Selector Pills */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setPublishTarget('portal')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
            publishTarget === 'portal'
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg'
              : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Publish to Surface 1: Public AI Portal (Research/News)</span>
        </button>

        <button
          onClick={() => setPublishTarget('marketplace')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
            publishTarget === 'marketplace'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg'
              : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Publish to Surface 2: Solutions Marketplace (Products)</span>
        </button>
      </div>

      {/* Form Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <form onSubmit={handlePublishSubmit} className="space-y-4 text-xs">
          {publishTarget === 'marketplace' ? (
            <>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                Marketplace Solution Manual Publishing Specification
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={productTitle}
                    onChange={e => setProductTitle(e.target.value)}
                    placeholder="e.g. BioLife Rejuvenation Protocol v2.0"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target Category (12 Categories)</label>
                  <select
                    value={productCategory}
                    onChange={e => setProductCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Producing Swarm Firm</label>
                  <select
                    value={firmName}
                    onChange={e => setFirmName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {nodes.map(n => (
                      <option key={n.id} value={n.name}>{n.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Listing Price ($)</label>
                  <input
                    type="number"
                    required
                    value={productPrice}
                    onChange={e => setProductPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Solution Description</label>
                <textarea
                  rows={3}
                  required
                  value={productDescription}
                  onChange={e => setProductDescription(e.target.value)}
                  placeholder="Detailed description of the digital deliverable package..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </>
          ) : (
            <>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                Public Portal Research Insight Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Report / Article Title</label>
                  <input
                    type="text"
                    required
                    value={insightTitle}
                    onChange={e => setInsightTitle(e.target.value)}
                    placeholder="e.g. Macroeconomic GPU Compute Liquidity Report"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={insightCategory}
                    onChange={e => setInsightCategory(e.target.value)}
                    placeholder="e.g. Enterprise Technology"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Executive Summary</label>
                <input
                  type="text"
                  required
                  value={insightSummary}
                  onChange={e => setInsightSummary(e.target.value)}
                  placeholder="1-2 sentence high-level summary..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Article / Report Content (Markdown)</label>
                <textarea
                  rows={5}
                  required
                  value={insightContent}
                  onChange={e => setInsightContent(e.target.value)}
                  placeholder="Comprehensive research findings..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              id="live-publish-submit-button"
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-lg transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Publish Live to Surface</span>
            </button>
          </div>
        </form>
      </div>
      {/* Active Custom Quotes & Orders Pipeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Incoming Custom Quotes & Client Orders Pipeline</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Direct client requests submitted through the Solutions Marketplace & Vendor Storefronts.
            </p>
          </div>
        </div>

        {customOrders.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No custom orders or quote requests in the pipeline.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3">Tracking #</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Category / Assigned Firm</th>
                  <th className="p-3">Budget Tier</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {customOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-emerald-400">{ord.trackingNumber}</td>
                    <td className="p-3">
                      <div className="font-bold text-white">{ord.clientName}</div>
                      <div className="text-[10px] text-slate-400">{ord.clientEmail}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-200">{ord.selectedCategory}</div>
                      <div className="text-[10px] text-indigo-400 font-mono">{ord.assignedNode}</div>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-300">{ord.budgetTier}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        ord.status === 'DELIVERED' 
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : ord.status === 'IN_PRODUCTION'
                          ? 'bg-amber-950 text-amber-400 border-amber-800'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {ord.status === 'PENDING' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'IN_PRODUCTION')}
                            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold rounded-lg transition-all"
                          >
                            Start Production
                          </button>
                        )}
                        {ord.status === 'IN_PRODUCTION' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'DELIVERED')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg transition-all"
                          >
                            Mark Delivered
                          </button>
                        )}
                        {ord.status === 'DELIVERED' && (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Fulfilled
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
