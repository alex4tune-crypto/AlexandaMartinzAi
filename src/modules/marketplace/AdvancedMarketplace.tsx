import React, { useState, useEffect } from 'react';
import { useRealtimeProducts, useRealtimeOrders } from '../../hooks/useRealtime';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useToast } from '../../components/Toast';
import { ShoppingCart, Plus, Search, Filter, Star, Download, Eye } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export const AdvancedMarketplace: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { products, loading: productsLoading } = useRealtimeProducts();
  const { orders, loading: ordersLoading } = useRealtimeOrders(user?.id || '');
  const [activeTab, setActiveTab] = useState<'browse' | 'orders' | 'analytics'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(products.map((p) => p.category))];
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: any) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
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

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-700">
          {['browse', 'orders', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <div>
            {/* Search and Filter */}
            <div className="flex gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <ShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Cart Drawer */}
            {showCart && (
              <div className="fixed inset-0 bg-black/50 z-40 flex justify-end">
                <div className="bg-slate-800 w-96 border-l border-slate-700 p-6 overflow-y-auto">
                  <h3 className="text-2xl font-bold text-white mb-6">Shopping Cart</h3>
                  {cart.length === 0 ? (
                    <p className="text-slate-400">Your cart is empty</p>
                  ) : (
                    <>
                      <div className="space-y-4 mb-6">
                        {cart.map((item) => (
                          <div key={item.id} className="bg-slate-700 rounded p-3">
                            <div className="flex justify-between mb-2">
                              <h4 className="font-bold text-white line-clamp-1">{item.title}</h4>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-400 hover:text-red-600"
                              >
                                ×
                              </button>
                            </div>
                            <div className="flex justify-between text-sm text-slate-300">
                              <span>${item.price}</span>
                              <span>×{item.quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-slate-700 pt-4 mb-4">
                        <div className="flex justify-between text-white mb-4">
                          <span>Total:</span>
                          <span className="text-2xl font-bold text-blue-400">${cartTotal.toLocaleString()}</span>
                        </div>
                        <button
                          onClick={handleCheckout}
                          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors mb-2"
                        >
                          Checkout
                        </button>
                        <button
                          onClick={() => setShowCart(false)}
                          className="w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                        >
                          Continue Shopping
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden hover:border-blue-500 transition-all group"
                >
                  <div className="h-40 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center relative group-hover:opacity-90 transition-opacity">
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors">
                        <Eye size={20} className="text-white" />
                      </button>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-green-600 p-2 rounded-full hover:bg-green-700 transition-colors"
                      >
                        <ShoppingCart size={20} className="text-white" />
                      </button>
                    </div>
                    <p className="text-white font-bold text-sm opacity-50">{product.category}</p>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400">{product.title}</h4>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-blue-400">${product.price}</span>
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-slate-300">{product.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Download size={14} /> {product.downloads}
                      </span>
                      <span>{product.firmName}</span>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {ordersLoading ? (
              <LoadingSpinner />
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-slate-400">No orders yet</div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-white">{order.title || 'Order'}</h3>
                      <p className="text-slate-400 text-sm">{order.createdAt}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                      order.status === 'completed' ? 'bg-green-600' :
                      order.status === 'pending' ? 'bg-yellow-600' :
                      'bg-blue-600'
                    }`}>
                      {order.status?.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-300">{order.description || order.projectRequirements}</p>
                  <div className="mt-4 flex justify-between text-sm">
                    <span className="text-slate-400">Total</span>
                    <span className="text-blue-400 font-bold">${order.quoteAmount || order.price}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Products by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={categoryDistribution} cx="50%" cy="50%" labelLine={false} label={() => null} outerRadius={80}>
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Top Products</h3>
              <div className="space-y-3">
                {[...products].sort((a, b) => b.downloads - a.downloads).slice(0, 5).map((product) => (
                  <div key={product.id} className="flex justify-between items-center">
                    <span className="text-slate-300">{product.title}</span>
                    <span className="text-blue-400 font-bold">{product.downloads}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
