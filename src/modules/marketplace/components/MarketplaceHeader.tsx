import React from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  SlidersHorizontal, 
  Building2, 
  Zap, 
  ShieldCheck, 
  Send,
  Cpu,
  Layers
} from 'lucide-react';
import { UserPersona } from '../../../types';

interface MarketplaceHeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
  activeTab: 'catalog' | 'storefronts' | 'compare' | 'saved';
  setActiveTab: (tab: 'catalog' | 'storefronts' | 'compare' | 'saved') => void;
  favoritesCount: number;
  compareCount: number;
  onRequestQuote: () => void;
  totalProductsCount: number;
}

export const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  activeTab,
  setActiveTab,
  favoritesCount,
  compareCount,
  onRequestQuote,
  totalProductsCount
}) => {
  return (
    <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-2xl">
      {/* Top Bar Customer Trust Announcement */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border-b border-slate-800/80 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-300">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
              Verified Commercial Hub
            </span>
            <span className="font-medium text-slate-200 truncate">
              Alexanda Martinz Inc. Digital Solutions & Specialist Vendor Marketplace
            </span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span className="flex items-center text-emerald-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              100% Guaranteed Source License & Security Audit
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-amber-400 font-mono">
              24/7 Verified Instant Deliveries
            </span>
          </div>
        </div>
      </div>

      {/* Main Search & Actions Header */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Surface Tag */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-950/50">
            <ShoppingBag className="w-5 h-5 font-black text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-white text-base tracking-tight">SOLUTIONS MARKETPLACE</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Digital Products & Specialist Vendor Storefronts</p>
          </div>
        </div>

        {/* Global Search Bar (Jumia style with category selector) */}
        <div className="w-full md:w-1/2 flex items-center">
          <div className="relative w-full flex items-center bg-slate-950 border border-slate-800 rounded-xl focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all shadow-inner">
            <div className="hidden sm:flex items-center border-r border-slate-800 px-3 py-2 text-xs text-slate-400 bg-slate-900/60 rounded-l-xl">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer pr-1"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <Search className="w-4 h-4 absolute left-3 sm:left-auto text-slate-400 sm:relative sm:ml-3 shrink-0" />
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search web apps, research reports, AI models, fashion specs, health solutions..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 pl-9 sm:pl-3 pr-4 py-2.5 focus:outline-none"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="pr-3 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Navigation & Request Custom Solution Button */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onRequestQuote}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-950/50 transition-all border border-emerald-500/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Request Custom Solution</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Bar */}
      <div className="border-t border-slate-800/80 bg-slate-950/60 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar py-2 text-xs">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'catalog'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Products & Services ({totalProductsCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('storefronts')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'storefronts'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Vendor Storefronts (7)</span>
            </button>

            {compareCount > 0 && (
              <button
                onClick={() => setActiveTab('compare')}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                  activeTab === 'compare'
                    ? 'bg-amber-600 text-slate-950 shadow-md'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Compare ({compareCount})</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 shrink-0 pl-4">
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 text-xs ${
                activeTab === 'saved'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'text-slate-400 hover:text-rose-400 hover:bg-slate-900'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>Wishlist</span>
              {favoritesCount > 0 && (
                <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
