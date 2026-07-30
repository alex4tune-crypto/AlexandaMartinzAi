import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Sparkles, TrendingUp, Cpu, Shield, Zap, ArrowRight, BarChart3, Globe } from 'lucide-react';

export const PublicPortalModule: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/marketplace/products');
      const data = await response.json();
      if (data.success) setProducts(data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-obsidian overflow-y-auto pt-24">
      {/* Cinematic Hero Section */}
      <div className="relative py-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-150" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Operational Network Node v4.2
            </div>
            
            <h2 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-[-0.04em] leading-[0.9]">
              THE FUTURE OF <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-blue-400">
                AI PRODUCTION
              </span>
            </h2>
            
            <p className="text-xl text-slate-400 mb-14 font-medium max-w-2xl mx-auto leading-relaxed tracking-wide">
              Harness an elite network of 7 specialist AI firms. Precision-engineered assets, real-time synchronization, and military-grade cloud security.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-24">
              <button className="px-10 py-5 bg-white text-obsidian font-black rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] text-xs uppercase tracking-[0.2em]">
                Enter Exchange
              </button>
              <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl transition-all duration-300 hover:bg-white/10 text-xs uppercase tracking-[0.2em] backdrop-blur-md">
                View Governance
              </button>
            </div>

            {/* Quick Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
              {[
                { label: 'Network Assets', value: '1,429', icon: BarChart3, color: 'text-emerald-400' },
                { label: 'Active Specialists', value: '7 Units', icon: Cpu, color: 'text-blue-400' },
                { label: 'Cloud Shield', value: 'Maximum', icon: Shield, color: 'text-cyan-400' },
                { label: 'Global Uptime', value: '99.99%', icon: Globe, color: 'text-purple-400' }
              ].map((stat, i) => (
                <div key={i} className="glass-card p-6 rounded-3xl text-left hover:border-white/20 transition-all group">
                  <stat.icon size={20} className={`${stat.color} mb-4 opacity-50 group-hover:opacity-100 transition-opacity`} />
                  <div className="text-2xl font-black text-white mb-1 tracking-tight">{stat.value}</div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Asset Explorer Section */}
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">
              <Zap size={14} className="fill-emerald-400" /> Production Output
            </div>
            <h3 className="text-4xl font-black text-white tracking-tight leading-tight">
              Elite Digital Asset Dossiers
            </h3>
            <p className="text-slate-500 mt-4 font-medium leading-relaxed">
              Explore the latest deliverables from our specialist firms. Each asset is verified for production quality and cloud security compliance.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 text-xs font-black text-white/50 hover:text-emerald-400 transition-all uppercase tracking-widest bg-white/5 px-6 py-3 rounded-xl border border-white/5">
            Access Full Catalog <ArrowRight size={14} />
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="glass-card rounded-[2rem] hover:border-emerald-500/50 transition-all duration-700 hover:shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden group cursor-pointer"
              >
                <div className="h-64 bg-white/5 flex items-center justify-center relative overflow-hidden p-12">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <Cpu size={64} className="text-white opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-700" />
                  
                  {/* Status Indicator Overlay */}
                  <div className="absolute top-6 right-6">
                    <div className="flex items-center gap-2 bg-obsidian/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">{product.status}</span>
                    </div>
                  </div>
                </div>

                <div className="p-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-lg">{product.category}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Unit: {product.firmName.split(' ')[0]}</span>
                  </div>

                  <h4 className="font-black text-white text-2xl mb-4 group-hover:text-emerald-400 transition-colors leading-tight tracking-tight">
                    {product.title}
                  </h4>
                  
                  <p className="text-slate-500 text-sm mb-10 line-clamp-2 leading-relaxed font-medium">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-10 pt-8 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Asset Value</span>
                      <span className="text-3xl font-black text-white tracking-tighter">${product.price.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Trust Rating</span>
                      <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                        <span className="text-amber-500 text-xs font-black">★</span>
                        <span className="text-white text-xs font-black">{product.rating}</span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-white text-obsidian font-black py-5 rounded-2xl transition-all duration-300 hover:bg-emerald-500 hover:text-white group-hover:emerald-glow text-[10px] uppercase tracking-[0.2em]">
                    Initiate Acquisition
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Corporate Trust Banner */}
      <div className="bg-white/5 border-y border-white/5 py-20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center gap-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
           {['FORBES', 'TECHCRUNCH', 'BLOOMBERG', 'REUTERS', 'WIRED'].map(partner => (
             <span key={partner} className="text-xl font-black tracking-[0.4em] text-white">{partner}</span>
           ))}
        </div>
      </div>
    </div>
  );
};
