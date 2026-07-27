import React, { useState, useEffect } from 'react';
import { LoadingSpinner, LoadingButton } from '../../components/LoadingSpinner';
import { ShoppingCart, Plus } from 'lucide-react';
import { useToast } from '../../components/Toast';

export const MarketplaceModule: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/marketplace/products'),
        fetch('/api/marketplace/orders'),
      ]);
      
      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      
      if (productsData.success) setProducts(productsData.products);
      if (ordersData.success) setOrders(ordersData.orders || []);
    } catch (error) {
      showToast('Failed to fetch marketplace data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNewOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const response = await fetch('/api/marketplace/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: formData.get('clientName'),
          clientEmail: formData.get('clientEmail'),
          selectedCategory: formData.get('category'),
          projectRequirements: formData.get('requirements'),
          budgetTier: formData.get('budget'),
          assignedNode: formData.get('node'),
        }),
      });
      const data = await response.json();
      if (data.success) {
        showToast('Order created successfully!', 'success');
        setShowNewOrderForm(false);
        fetchData();
      }
    } catch (error) {
      showToast('Failed to create order', 'error');
    }
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'products'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingCart size={18} className="inline mr-2" /> Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus size={18} className="inline mr-2" /> Custom Orders
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden hover:border-blue-500 transition-all"
                  >
                    <div className="h-32 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg opacity-50">{product.category}</span>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-white mb-2">{product.title}</h4>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                      <div className="mb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-slate-400 text-sm">Price</span>
                          <span className="text-blue-400 font-bold">${product.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-sm">Downloads</span>
                          <span className="text-slate-300">{product.downloads}</span>
                        </div>
                      </div>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors">
                        Purchase
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <div className="mb-6">
                  <button
                    onClick={() => setShowNewOrderForm(!showNewOrderForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus size={20} /> New Quote Request
                  </button>
                </div>

                {showNewOrderForm && (
                  <form onSubmit={handleNewOrder} className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        name="clientName"
                        placeholder="Your Name"
                        className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400"
                        required
                      />
                      <input
                        type="email"
                        name="clientEmail"
                        placeholder="Your Email"
                        className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400"
                        required
                      />
                    </div>
                    <select
                      name="category"
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white mb-4"
                      required
                    >
                      <option>Select Category</option>
                      <option>Web Applications</option>
                      <option>Websites</option>
                      <option>Research Reports</option>
                      <option>Fashion Specs</option>
                    </select>
                    <textarea
                      name="requirements"
                      placeholder="Project Requirements"
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 mb-4 h-24"
                      required
                    />
                    <select
                      name="budget"
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white mb-4"
                      required
                    >
                      <option>Select Budget</option>
                      <option>$1,000 - $5,000</option>
                      <option>$5,000 - $15,000</option>
                      <option>$15,000+</option>
                    </select>
                    <button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors"
                    >
                      Submit Quote Request
                    </button>
                  </form>
                )}

                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      No orders yet. Create your first custom order request!
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-white">{order.clientName}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            order.status === 'PENDING' ? 'bg-yellow-600' :
                            order.status === 'IN_PRODUCTION' ? 'bg-blue-600' :
                            'bg-green-600'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm mb-2">{order.clientEmail}</p>
                        <p className="text-slate-300 text-sm mb-2">{order.projectRequirements}</p>
                        <div className="flex justify-between text-sm text-slate-400">
                          <span>Tracking: {order.trackingNumber}</span>
                          <span>Quote: ${order.quoteAmount}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
