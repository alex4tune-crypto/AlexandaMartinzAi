import React, { useState, useEffect } from 'react';
import { useRealtimeProducts, useRealtimeOrders } from '../../hooks/useRealtime';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useToast } from '../../components/Toast';
import { MarketplaceHeader } from './components/MarketplaceHeader';
import { PromotionalBanner } from './components/PromotionalBanner';
import { CategoryGrid } from './components/CategoryGrid';
import { ShoppingCart, Star, Download, Eye, LayoutGrid, List, Zap, Cpu, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const AdvancedMarketplace: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { products, loading: productsLoading } = useRealtimeProducts();
  const { orders, loading: ordersLoading } = useRealtimeOrders(user?.id || '');
  const [activeTab, setActiveTab] = useState<'catalog' | 'storefronts' | 'compare' | 'saved' | 'analytics'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All Categories', ...new Set(products.map((p) => p.category))];
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: any) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
      setCart([...cart]);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    showToast('Asset added to queue', 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      showToast('Queue is empty', 'error');
      return;
    }
    showToast('Acquisition protocol initiated', 'success');
    setCart([]);
    setShowCart(false);
  };

  if (productsLoading) return <div className="flex-1 bg-obsidian flex items-center justify-center"><LoadingSpinner /></div>;

  const categoryDistribution = Object.entries(
    products.reduce((acc: any, p: any) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const categoryCounts = products.reduce((acc: Record<string, number>, p: any) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, { 'All': products.length });

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4'];

  return (
    <div className="flex-1 bg-obsidian overflow-y-auto pt-24">
      {/* Exchange Header */}
      <div className="max-w-[1600px] mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/5 pb-12 gap-8">
           <div>
             <div className="flex items-center gap-3 text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">
               <Zap size={14} className="fill-emerald-400" /> Global Asset Exchange
             </div>
             <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
               AI Production <span className="text-slate-500">Marketplace</span>
             </h2>
           </div>
           <div className="flex items-center gap-4">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Search network assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all w-80"
                />
                <ShoppingCart className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-emerald-400 transition-colors" size={18} />
              </div>
           </div>
        </div>

        {activeTab === 'catalog' && (
          <div className="space-y-16">
            <PromotionalBanner 
              featuredProducts={products.filter(p => p.isFeatured)} 
              onSelectProduct={addToCart}
              onRequestQuote={() => setActiveTab('catalog')}
            />

            {/* Catalog Controls */}
            <div className="flex justify-between items-center glass-card p-6 rounded-3xl">
              <div className="flex items-center gap-8">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-[10px] font-black uppercase tracking-widest transition-all ${
                      selectedCategory === cat ? 'text-emerald-400' : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white/10 text-emerald-400' : 'text-slate-600 hover:text-white'}`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white/10 text-emerald-400' : 'text-slate-600 hover:text-white'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            {/* Assets Grid */}
            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`glass-card rounded-[2.5rem] overflow-hidden hover:border-emerald-500/50 transition-all duration-500 group ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <div className={`bg-white/5 flex items-center justify-center relative overflow-hidden ${viewMode === 'list' ? 'w-80 h-full' : 'h-64'}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <Cpu size={52} className="text-white opacity-5 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-obsidian/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">{product.status}</span>
                    </div>
                  </div>

                  <div className="p-10 flex-1 flex flex-col">
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] bg-emerald-400/10 px-2 py-1 rounded-lg">{product.category}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Unit: {product.firmName.split(' ')[0]}</span>
                      </div>
                      <h4 className="font-black text-white text-xl leading-tight group-hover:text-emerald-400 transition-colors tracking-tight">
                        {product.title}
                      </h4>
                    </div>

                    <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-2 flex-1 font-medium">{product.description}</p>

                    <div className="flex items-center justify-between mb-8 pt-8 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-slate-600 text-[9px] font-bold uppercase tracking-widest mb-1">Asset Value</span>
                        <span className="text-2xl font-black text-white tracking-tighter">${product.price.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 mb-2">
                          <Star size={14} className="text-amber-500 fill-amber-500" />
                          <span className="text-xs font-black text-white">{product.rating}</span>
                        </div>
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{product.downloads} deployments</span>
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-white text-obsidian hover:bg-emerald-500 hover:text-white font-black py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em]"
                    >
                      Acquire License <ArrowUpRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modern Cart Drawer Overlay */}
      {showCart && (
        <div className="fixed inset-0 bg-obsidian/80 backdrop-blur-md z-[100] flex justify-end">
          <div className="bg-obsidian w-full max-w-xl h-full shadow-2xl border-l border-white/10 flex flex-col p-12">
            <div className="flex justify-between items-center mb-16">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-2">Acquisition Queue</span>
                <h3 className="text-3xl font-black text-white tracking-tight">System Cart</h3>
              </div>
              <button 
                onClick={() => setShowCart(false)} 
                className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-all text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-6 pr-4">
              {cart.map((item) => (
                <div key={item.id} className="glass-card p-6 rounded-3xl flex gap-6 group hover:border-white/20 transition-all">
                  <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center text-white/50 group-hover:text-emerald-400 transition-colors">
                    <Cpu size={32} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="font-black text-white text-lg tracking-tight leading-none">{item.title}</h4>
                       <button onClick={() => removeFromCart(item.id)} className="text-slate-600 hover:text-red-400 transition-colors">×</button>
                    </div>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">{item.category}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-black text-white text-xl tracking-tight">${item.price.toLocaleString()}</span>
                      <div className="flex items-center gap-4 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Qty</span>
                        <span className="text-sm font-black text-white">{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-12 border-t border-white/10">
              <div className="flex justify-between items-center mb-10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Acquisition Value</span>
                  <span className="text-4xl font-black text-white tracking-tighter">${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Items</span>
                   <span className="text-xl font-black text-emerald-400 tracking-tighter">{cartItemsCount}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-emerald-900/40 transition-all text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4"
              >
                Initiate Secure Protocol <ShieldCheck size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Asset Status Indicator */}
      {cartItemsCount > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-12 right-12 bg-emerald-600 text-white p-6 rounded-full shadow-[0_0_50px_rgba(16,185,129,0.4)] flex items-center gap-4 hover:scale-105 transition-all z-50 group"
        >
          <div className="relative">
            <ShoppingCart size={28} />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-white text-obsidian rounded-full flex items-center justify-center text-[10px] font-black group-hover:scale-110 transition-transform">
              {cartItemsCount}
            </div>
          </div>
          <span className="font-black text-[10px] uppercase tracking-widest hidden md:block pr-2 border-l border-white/20 pl-4 ml-2">Open Acquisition Console</span>
        </button>
      )}
    </div>
  );
};

