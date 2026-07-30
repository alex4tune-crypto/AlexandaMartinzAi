import React, { useState, useEffect } from 'react';
import { useRealtimeProducts, useRealtimeOrders } from '../../hooks/useRealtime';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useToast } from '../../components/Toast';
import { MarketplaceHeader } from './components/MarketplaceHeader';
import { PromotionalBanner } from './components/PromotionalBanner';
import { CategoryGrid } from './components/CategoryGrid';
import { ShoppingCart, Star, Download, Eye, LayoutGrid, List } from 'lucide-react';
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
    showToast('Added to cart!', 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      showToast('Cart is empty', 'error');
      return;
    }
    showToast('Order placed successfully!', 'success');
    setCart([]);
    setShowCart(false);
  };

  if (productsLoading) return <LoadingSpinner />;

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
    <div className="flex-1 bg-slate-50 overflow-y-auto">
      <MarketplaceHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        activeTab={activeTab as any}
        setActiveTab={setActiveTab as any}
        favoritesCount={0}
        compareCount={0}
        onRequestQuote={() => setActiveTab('catalog')}
        totalProductsCount={products.length}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'catalog' && (
          <div className="space-y-8">
            <PromotionalBanner 
              featuredProducts={products.filter(p => p.isFeatured)} 
              onSelectProduct={addToCart}
              onRequestQuote={() => setActiveTab('catalog')}
            />
            <CategoryGrid 
              selectedCategory={selectedCategory === 'All Categories' ? 'All' : selectedCategory} 
              onSelectCategory={(cat) => setSelectedCategory(cat === 'All' ? 'All Categories' : cat)}
              categoryCounts={categoryCounts}
            />

            {/* Catalog Controls */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800">
                {selectedCategory} <span className="text-slate-400 font-normal ml-2">({filteredProducts.length} items)</span>
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-emerald-100 text-emerald-600' : 'text-slate-400'}`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-emerald-100 text-emerald-600' : 'text-slate-400'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 group ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <div className={`bg-slate-50 flex items-center justify-center relative overflow-hidden ${viewMode === 'list' ? 'w-64 h-full' : 'h-52'}`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-blue-600/5 group-hover:scale-110 transition-transform duration-500" />
                    <ShoppingCart size={48} className="text-emerald-600 opacity-10 group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black text-emerald-700 shadow-sm border border-emerald-100 uppercase tracking-wider">
                      {product.status}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">{product.category}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.firmName.split(' ')[0]}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-emerald-600 transition-colors">
                        {product.title}
                      </h4>
                    </div>

                    <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 flex-1">{product.description}</p>

                    <div className="flex items-center justify-between mb-6 pt-4 border-t border-slate-100">
                      <div className="flex flex-col">
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">Price</span>
                        <span className="text-xl font-black text-slate-900">${product.price}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-lg">
                          <Star size={14} className="text-amber-500 fill-amber-500" />
                          <span className="text-xs font-black text-amber-700">{product.rating}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium mt-1.5">{product.downloads} units deployed</span>
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-slate-900/10 hover:shadow-emerald-600/20 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={18} />
                      Purchase License
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab (Previously visible, now hidden behind activeTab) */}
        {activeTab === 'catalog' && (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Category Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Top Specialists</h3>
              <div className="space-y-4">
                {products.slice(0, 5).map((p, i) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                        {i + 1}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{p.firmName}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">{p.downloads} sales</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cart Button Fixed */}
      {cartItemsCount > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-8 right-8 bg-emerald-600 text-white p-4 rounded-full shadow-2xl shadow-emerald-600/40 flex items-center gap-2 hover:scale-110 transition-transform z-50"
        >
          <ShoppingCart size={24} />
          <span className="font-bold">{cartItemsCount}</span>
        </button>
      )}

      {/* Cart Drawer Overlay */}
      {showCart && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Your Cart</h3>
              <button onClick={() => setShowCart(false)} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                    <ShoppingCart size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{item.title}</h4>
                    <p className="text-slate-500 text-xs">{item.category}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-emerald-600">${item.price}</span>
                      <div className="flex items-center gap-2">
                        <button className="text-slate-400 hover:text-slate-600">×</button>
                        <span className="text-sm font-bold text-slate-700">{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <span className="text-slate-500 font-medium">Total Amount</span>
                <span className="text-2xl font-black text-slate-900">${cartTotal.toLocaleString()}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
              >
                Complete Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

