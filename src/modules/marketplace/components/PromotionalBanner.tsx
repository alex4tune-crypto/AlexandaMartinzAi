import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  Award,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';
import { DigitalProduct } from '../../../types';

interface PromotionalBannerProps {
  featuredProducts: DigitalProduct[];
  onSelectProduct: (product: DigitalProduct) => void;
  onRequestQuote: () => void;
}

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({
  featuredProducts,
  onSelectProduct,
  onRequestQuote
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      badge: 'FEATURED SOLUTION OF THE DAY',
      title: 'Enterprise Full-Stack React SaaS Accelerator v4.2',
      subtitle: 'Published by Aether Web & App Development Lab. Certified source integrity.',
      cta: 'Inspect Deliverable',
      tagline: 'Instant Source Code Download + Enterprise License',
      category: 'Web Applications',
      price: '$499',
      origPrice: '$899',
      product: featuredProducts.find(p => p.id === 'prod-01') || featuredProducts[0]
    },
    {
      badge: 'LIMITED TIME FLASH DEAL',
      title: 'Q3 Global Tech & AI Macroeconomic Outlook Report',
      subtitle: '68-Page Executive PDF Briefing + Interactive Forecast Data Tables.',
      cta: 'View Report',
      tagline: '38% Off Verified Deliverable',
      category: 'Economics Reports',
      price: '$299',
      origPrice: '$499',
      product: featuredProducts.find(p => p.id === 'prod-02') || featuredProducts[1]
    },
    {
      badge: 'BESPOKE CUSTOM COMMISSION',
      title: 'Bespoke Web App, AI Models & Custom Deliverables',
      subtitle: 'Direct custom commission to 7 specialist vendor firms with guaranteed delivery terms.',
      cta: 'Request Custom Solution',
      tagline: 'Guaranteed 48-Hour Production Cycle',
      category: 'Custom AI Services',
      price: '$1,500',
      origPrice: '$2,500',
      product: null
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const activeBanner = banners[currentSlide];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Hero Slider (3 Cols on Large Screens) */}
        <div className="lg:col-span-3 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[260px]">
          {/* Background Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Row: Badge & Counter */}
          <div className="flex items-center justify-between mb-4 z-10">
            <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold text-amber-400">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeBanner.badge}</span>
            </div>

            <div className="flex items-center space-x-1.5">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === idx ? 'w-6 bg-emerald-400' : 'w-2 bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="z-10 my-2 space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              {activeBanner.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {activeBanner.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {activeBanner.subtitle}
            </p>
          </div>

          {/* Bottom Actions Row */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-amber-400">{activeBanner.price}</span>
              <span className="text-xs text-slate-500 line-through font-mono">{activeBanner.origPrice}</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 ml-2">
                {activeBanner.tagline}
              </span>
            </div>

            <button
              onClick={() => {
                if (activeBanner.product) {
                  onSelectProduct(activeBanner.product);
                } else {
                  onRequestQuote();
                }
              }}
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-lg shadow-emerald-950/50 transition-all border border-emerald-500/30"
            >
              <span>{activeBanner.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Side Cards (Jumia-style Deals of the Day / Trust Badges) */}
        <div className="lg:col-span-1 space-y-4 flex flex-col justify-between">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Flash Drops</span>
              </span>
              <span className="text-[10px] text-amber-400 font-mono font-semibold">Ends in 08h 24m</span>
            </div>

            {featuredProducts.slice(0, 2).map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-semibold text-emerald-400">{p.category}</span>
                  <span className="font-mono text-amber-400 font-bold">${p.price}</span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 line-clamp-1">
                  {p.title}
                </h4>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{p.firmName}</p>
              </div>
            ))}
          </div>

          <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-emerald-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Holas Cloud Shield Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Every deliverable product undergoes zero-trust security audits, AST checks, and licensing validation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
