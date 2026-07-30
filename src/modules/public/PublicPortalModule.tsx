import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Sparkles, TrendingUp, Users } from 'lucide-react';

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
    <div className="flex-1 bg-slate-50 overflow-y-auto">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-50/50 via-transparent to-transparent opacity-70" />
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full text-emerald-700 text-xs font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
            <Sparkles size={14} className="animate-pulse" /> Alexanda Martinz Ecosystem
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            The Digital <span className="text-emerald-600">Production</span> Factory
          </h2>
          <p className="text-xl text-slate-500 mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
            Harness the power of 7 specialist AI firms. Authentic assets, real-time synchronization, and enterprise-grade security.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { label: 'Featured Assets', value: '12+', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Specialist Firms', value: '7', color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Security Status', value: 'OPERATIONAL', color: 'text-amber-600', bg: 'bg-amber-50' }
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className={`text-3xl font-black ${stat.color} mb-2 tracking-tighter`}>{stat.value}</div>
                <div className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] mb-3">
              <TrendingUp size={14} /> Market Trends
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
              Premium Digital Assets
            </h3>
          </div>
          <button className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">
            View All Assets →
          </button>
        </div>
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-slate-100 hover:border-emerald-500 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20 overflow-hidden group relative"
              >
                <div className="h-48 bg-slate-50 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-blue-600/5 group-hover:scale-110 transition-transform duration-700" />
                  <Sparkles size={40} className="text-emerald-600 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{product.category}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.firmName.split(' ')[0]}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-tight">
                    {product.title}
                  </h4>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">{product.description}</p>
                  <div className="flex items-center justify-between mb-8 pt-6 border-t border-slate-50">
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">${product.price}</span>
                    <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg">
                      <span className="text-amber-500 text-xs">★</span>
                      <span className="text-amber-700 text-xs font-black">{product.rating}</span>
                    </div>
                  </div>
                  <button className="w-full bg-slate-900 group-hover:bg-emerald-600 text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-slate-900/10 group-hover:shadow-emerald-600/20 text-xs uppercase tracking-widest">
                    Request Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
