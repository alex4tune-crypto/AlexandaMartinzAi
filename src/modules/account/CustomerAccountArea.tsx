import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { InvoiceItem } from '../../services/billingService';
import { InvoiceReceiptModal } from '../../components/billing/InvoiceReceiptModal';
import { 
  User, 
  CreditCard, 
  Receipt, 
  Package, 
  Bookmark, 
  Settings, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  ArrowUpRight, 
  Download, 
  ShieldCheck, 
  Building, 
  Mail, 
  Sparkles, 
  Lock,
  ExternalLink,
  ChevronRight,
  LogOut,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';

export const CustomerAccountArea: React.FC = () => {
  const { 
    currentUser, 
    userProfile, 
    invoices, 
    subscriptions, 
    orders, 
    signOut, 
    payInvoice, 
    changeSubscriptionPlan,
    updateProfileInfo
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'subscriptions' | 'orders' | 'wishlist' | 'settings'>('overview');
  
  // Selected Invoice for Receipt Modal
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);

  // Payment Feedback
  const [isPaying, setIsPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState<string | null>(null);

  // Profile Edit State
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [companyName, setCompanyName] = useState(userProfile?.companyName || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  const handlePayInvoice = async (invoiceId: string) => {
    setIsPaying(true);
    setPaySuccess(null);
    try {
      await payInvoice(invoiceId, 'Corporate Visa (**** 4892)');
      setPaySuccess(`Invoice #${invoiceId} marked as PAID in real time!`);
      if (selectedInvoice && selectedInvoice.id === invoiceId) {
        setSelectedInvoice({ ...selectedInvoice, status: 'paid', paidAt: new Date().toISOString() });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPaying(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMsg(null);
    try {
      await updateProfileInfo({ displayName, companyName });
      setProfileMsg('Profile updated successfully in Firestore.');
    } catch (err: any) {
      setProfileMsg('Failed to update profile: ' + err.message);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const activeSubscription = subscriptions.find(s => s.status === 'active') || subscriptions[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-500 p-0.5 shadow-lg shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl font-black text-emerald-400">
                  {userProfile?.displayName ? userProfile.displayName.slice(0, 2).toUpperCase() : 'AM'}
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-black text-white">{userProfile?.displayName || 'Enterprise Member'}</h1>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                    userProfile?.role === 'admin'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    ● {userProfile?.role === 'admin' ? 'Network Admin' : 'Verified Customer'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    {userProfile?.companyName || 'Alexanda Martinz Enterprise Network'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    {userProfile?.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Quick Metrics & Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-left">
                <p className="text-[10px] font-mono text-slate-500 uppercase font-bold">Account Balance</p>
                <p className="text-base font-black text-amber-400">${(userProfile?.accountBalance || 0).toLocaleString()} USD</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-left">
                <p className="text-[10px] font-mono text-slate-500 uppercase font-bold">Current Tier</p>
                <p className="text-base font-bold text-emerald-400">{userProfile?.plan || 'Pro Foundry'}</p>
              </div>

              <button
                onClick={signOut}
                className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-2xl text-slate-400 hover:text-rose-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Status Alert */}
        {paySuccess && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-2xl text-xs text-emerald-300 font-medium flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{paySuccess}</span>
            </div>
            <button onClick={() => setPaySuccess(null)} className="text-emerald-400 hover:underline text-[11px]">Dismiss</button>
          </div>
        )}

        {/* Enterprise Navigation Tabs */}
        <div className="border-b border-slate-800 flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'overview', label: 'Account Overview', icon: User },
            { id: 'invoices', label: `Invoices & Billing (${invoices.length})`, icon: Receipt },
            { id: 'subscriptions', label: 'Subscriptions & Plan', icon: CreditCard },
            { id: 'orders', label: `Orders & Deliverables (${orders.length})`, icon: Package },
            { id: 'settings', label: 'Profile & Security', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shrink-0 ${
                  isActive
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ACCOUNT OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick KPI Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <p className="text-[10px] font-mono text-slate-500 uppercase font-bold">Total Invoices</p>
                <p className="text-2xl font-black text-white mt-1">{invoices.length}</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {invoices.filter(i => i.status === 'paid').length} Paid • {invoices.filter(i => i.status === 'pending').length} Pending
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <p className="text-[10px] font-mono text-slate-500 uppercase font-bold">Pending Balance Due</p>
                <p className="text-2xl font-black text-amber-400 mt-1">
                  ${invoices.filter(i => i.status === 'pending').reduce((acc, i) => acc + i.amount, 0).toLocaleString()} USD
                </p>
                <p className="text-[11px] text-amber-500/80 mt-1">Real-time payment available</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <p className="text-[10px] font-mono text-slate-500 uppercase font-bold">Active Deliverables</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">{orders.length}</p>
                <p className="text-[11px] text-emerald-500/80 mt-1">Ready for download & specs</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <p className="text-[10px] font-mono text-slate-500 uppercase font-bold">Subscription Status</p>
                <p className="text-2xl font-black text-indigo-400 mt-1 uppercase">{activeSubscription?.status || 'Active'}</p>
                <p className="text-[11px] text-slate-400 mt-1">{activeSubscription?.planName || 'Pro Foundry'}</p>
              </div>
            </div>

            {/* Recent Invoices Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">Recent Invoices & Payment Ledger</h3>
                  <p className="text-xs text-slate-400">Real-time Firestore synchronization</p>
                </div>
                <button
                  onClick={() => setActiveTab('invoices')}
                  className="text-xs font-semibold text-emerald-400 hover:underline flex items-center space-x-1"
                >
                  <span>View All Invoices</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {invoices.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">No invoice records found in account.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-500 font-mono text-[10px] uppercase border-b border-slate-800">
                        <th className="pb-3 font-bold">Invoice #</th>
                        <th className="pb-3 font-bold">Description</th>
                        <th className="pb-3 font-bold">Amount</th>
                        <th className="pb-3 font-bold">Due Date</th>
                        <th className="pb-3 font-bold">Status</th>
                        <th className="pb-3 font-bold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {invoices.slice(0, 5).map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                          <td className="py-3 text-slate-300 max-w-xs truncate">{inv.description}</td>
                          <td className="py-3 font-mono font-bold text-amber-400">${inv.amount} USD</td>
                          <td className="py-3 text-slate-400">{new Date(inv.dueDate).toLocaleDateString()}</td>
                          <td className="py-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                              inv.status === 'paid'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => setSelectedInvoice(inv)}
                              className="px-3 py-1 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-[11px] font-semibold transition-colors"
                            >
                              Inspect Receipt
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: INVOICES & REAL-TIME BILLING */}
        {activeTab === 'invoices' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white">Invoices & Billing Statements</h2>
                <p className="text-xs text-slate-400">All customer invoice records with real-time status updates and receipt specs.</p>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Total Unpaid: <span className="font-bold text-amber-400">${invoices.filter(i => i.status === 'pending').reduce((a, b) => a + b.amount, 0)} USD</span>
              </div>
            </div>

            {invoices.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500">No invoices issued for this account yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-500 font-mono text-[10px] uppercase border-b border-slate-800">
                      <th className="pb-3 font-bold">Invoice Number</th>
                      <th className="pb-3 font-bold">Deliverable Spec</th>
                      <th className="pb-3 font-bold">Issued Date</th>
                      <th className="pb-3 font-bold">Due Date</th>
                      <th className="pb-3 font-bold">Total Amount</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                        <td className="py-4 text-slate-200 font-semibold">{inv.deliverableName}</td>
                        <td className="py-4 text-slate-400">{new Date(inv.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 text-slate-400">{new Date(inv.dueDate).toLocaleDateString()}</td>
                        <td className="py-4 font-mono font-black text-amber-400">${inv.amount.toLocaleString()} USD</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${
                            inv.status === 'paid'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : inv.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            ● {inv.status}
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-2">
                          {inv.status === 'pending' && (
                            <button
                              onClick={() => handlePayInvoice(inv.id)}
                              disabled={isPaying}
                              className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 rounded-lg text-xs font-semibold transition-all"
                            >
                              Pay Now
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Inspect & Print
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SUBSCRIPTIONS & PLANS */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div>
                <h2 className="text-base font-bold text-white">Production & Advisory Subscription Plans</h2>
                <p className="text-xs text-slate-400">Select an enterprise plan tier to unlock specialist AI agent nodes and direct CEO execution.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: 'Free Tier',
                    price: 0,
                    period: 'Monthly',
                    features: ['Browse Marketplace Catalog', 'Public Portal Access', 'Standard Custom Quotes']
                  },
                  {
                    name: 'Pro Foundry',
                    price: 299,
                    period: 'Monthly',
                    popular: true,
                    features: [
                      'Full Access to 7 Corporate Firm Nodes',
                      'Unlimited AI CEO Decision Cycles',
                      'Priority AI Code Factory Synthesis',
                      'Holas Security Cloud Shield'
                    ]
                  },
                  {
                    name: 'Enterprise Network',
                    price: 999,
                    period: 'Monthly',
                    features: [
                      'Dedicated Specialist Agent Allocation',
                      'Custom AI Model Grounding & RAG',
                      '1-on-1 Founder Consultation',
                      '24/7 SLA Guarantee & SLA Hotline'
                    ]
                  }
                ].map((plan) => {
                  const isCurrent = userProfile?.plan === plan.name;
                  return (
                    <div
                      key={plan.name}
                      className={`bg-slate-950 border rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden transition-all ${
                        isCurrent 
                          ? 'border-emerald-500 shadow-xl shadow-emerald-950/30' 
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-slate-950 font-black text-[10px] uppercase px-3 py-1 rounded-bl-xl">
                          RECOMMENDED
                        </div>
                      )}

                      <div>
                        <h3 className="text-base font-bold text-white">{plan.name}</h3>
                        <div className="mt-3 flex items-baseline">
                          <span className="text-3xl font-black text-amber-400">${plan.price}</span>
                          <span className="text-xs text-slate-500 font-mono ml-1">/ {plan.period}</span>
                        </div>

                        <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                          {plan.features.map((f, i) => (
                            <li key={i} className="flex items-center space-x-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => changeSubscriptionPlan(plan.name, plan.price)}
                        disabled={isCurrent}
                        className={`w-full mt-8 py-3 rounded-xl text-xs font-bold transition-all ${
                          isCurrent
                            ? 'bg-slate-800 text-slate-500 cursor-default'
                            : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 shadow-lg'
                        }`}
                      >
                        {isCurrent ? 'Active Current Plan' : `Switch to ${plan.name}`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS & DELIVERABLES */}
        {activeTab === 'orders' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-white">Purchased Deliverables & Custom Orders</h2>
              <p className="text-xs text-slate-400">Track and download source code, AST specs, and strategic briefings.</p>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500">No purchased deliverables found in this account.</div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div key={ord.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-slate-500">{ord.trackingNumber}</span>
                        <span>•</span>
                        <span className="text-xs font-bold text-emerald-400">{ord.firmName}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white mt-1">{ord.productTitle}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Format: {ord.deliverableType} • Price: ${ord.amount} USD</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-mono font-bold">
                        {ord.status}
                      </span>

                      {ord.downloadUrl && (
                        <a
                          href={ord.downloadUrl}
                          download
                          className="px-4 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Deliverable Specs</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PROFILE & SECURITY SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl max-w-2xl space-y-6">
            <div>
              <h2 className="text-base font-bold text-white">Profile & Account Security Settings</h2>
              <p className="text-xs text-slate-400">Update corporate identity and authentication parameters stored in Firestore.</p>
            </div>

            {profileMsg && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-emerald-300 font-medium">
                {profileMsg}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Company / Firm Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Registered Email (Read-Only)</label>
                <input
                  type="email"
                  disabled
                  value={userProfile?.email || ''}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="px-6 py-2.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 rounded-xl text-xs font-bold transition-all"
                >
                  {isUpdatingProfile ? 'Saving Changes...' : 'Save Profile Settings'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal Invoice Receipt Component */}
        <InvoiceReceiptModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onPay={(id) => handlePayInvoice(id)}
        />
      </div>
    </div>
  );
};
