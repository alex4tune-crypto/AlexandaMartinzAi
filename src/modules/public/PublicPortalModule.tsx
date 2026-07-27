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
    <div className="flex-1 bg-slate-950 overflow-y-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-700 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-2">
            <Sparkles className="text-blue-400" /> Alexanda Martinz AI Factory
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Premium AI-Generated Digital Products & Custom Solutions
          </p>
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="text-3xl font-bold text-blue-400 mb-2">12+</div>
              <div className="text-slate-400">Featured Products</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="text-3xl font-bold text-green-400 mb-2">7</div>
              <div className="text-slate-400">Digital Company Nodes</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="text-3xl font-bold text-purple-400 mb-2">99%</div>
              <div className="text-slate-400">Security Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <TrendingUp className="text-blue-400" /> Featured Products
        </h3>
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-slate-800 rounded-lg border border-slate-700 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20 overflow-hidden group"
              >
                <div className="h-40 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Sparkles size={32} className="text-white opacity-50" />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400">
                    {product.title}
                  </h4>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-blue-400">${product.price}</span>
                    <span className="text-yellow-400 text-sm">★ {product.rating}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <span>{product.downloads} downloads</span>
                    <span>{product.firmName}</span>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors">
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
