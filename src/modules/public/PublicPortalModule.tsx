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
      <div className="bg-white border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-4 flex items-center justify-center gap-2">
            <Sparkles className="text-emerald-500" /> Alexanda Martinz AI Factory
          </h2>
          <p className="text-xl text-slate-500 mb-8 font-medium">
            Premium AI-Generated Digital Products & Custom Solutions
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="text-3xl font-black text-emerald-600 mb-2">12+</div>
              <div className="text-slate-500 font-bold text-sm uppercase tracking-wider">Featured Products</div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="text-3xl font-black text-blue-600 mb-2">7</div>
              <div className="text-slate-500 font-bold text-sm uppercase tracking-wider">Specialist Firms</div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="text-3xl font-black text-amber-600 mb-2">99%</div>
              <div className="text-slate-500 font-bold text-sm uppercase tracking-wider">Security Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-2">
          <TrendingUp className="text-emerald-500" /> Top Commercial Assets
        </h3>
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 transition-all hover:shadow-2xl hover:shadow-emerald-500/10 overflow-hidden group"
              >
                <div className="h-40 bg-slate-50 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-blue-600/5" />
                  <Sparkles size={32} className="text-emerald-600 opacity-30" />
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {product.title}
                  </h4>
                  <p className="text-slate-500 text-xs mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-black text-slate-900">${product.price}</span>
                    <span className="text-amber-500 text-sm font-bold">★ {product.rating}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                    <span>{product.downloads} sales</span>
                    <span>{product.firmName}</span>
                  </div>
                  <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20">
                    View Details
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
