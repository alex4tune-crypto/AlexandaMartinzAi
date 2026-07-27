import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createAdminInvoice, updateInvoiceStatusAdmin, InvoiceItem } from '../../services/billingService';
import { 
  Receipt, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Building, 
  ShieldCheck, 
  Filter, 
  Search,
  ArrowRight
} from 'lucide-react';

export const AdminBillingManager: React.FC = () => {
  const { invoices, subscriptions, orders, isAdmin } = useAuth();

  // Create Invoice Modal/Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [targetUserEmail, setTargetUserEmail] = useState('');
  const [targetUserName, setTargetUserName] = useState('');
  const [amount, setAmount] = useState<number>(500);
  const [deliverableName, setDeliverableName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDateDays, setDueDateDays] = useState<number>(14);

  const [isCreating, setIsCreating] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Filter State
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'overdue' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserEmail || !deliverableName || !amount) return;

    setIsCreating(true);
    setFeedbackMsg(null);

    try {
      const invNum = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
      const dueDate = new Date(Date.now() + dueDateDays * 86400000).toISOString();

      await createAdminInvoice({
        invoiceNumber: invNum,
        userId: 'usr-customer-' + Date.now().toString().slice(-4),
        userEmail: targetUserEmail,
        userName: targetUserName || targetUserEmail.split('@')[0],
        amount,
        currency: 'USD',
        status: 'pending',
        description: description || `Enterprise solution deliverable for ${targetUserEmail}`,
        deliverableName,
        dueDate
      });

      setFeedbackMsg(`Invoice ${invNum} successfully issued to ${targetUserEmail} in real time!`);
      setShowCreateModal(false);
      setTargetUserEmail('');
      setDeliverableName('');
      setDescription('');
    } catch (err: any) {
      console.error(err);
      setFeedbackMsg('Failed to issue invoice: ' + err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleStatusUpdate = async (invoiceId: string, newStatus: 'pending' | 'paid' | 'overdue' | 'cancelled') => {
    try {
      await updateInvoiceStatusAdmin(invoiceId, newStatus);
      setFeedbackMsg(`Invoice #${invoiceId} status updated to ${newStatus.toUpperCase()}!`);
    } catch (err) {
      console.error(err);
    }
  };

  // Metrics
  const totalRevenueCollected = invoices.filter(i => i.status === 'paid').reduce((a, b) => a + b.amount, 0);
  const totalPendingBalance = invoices.filter(i => i.status === 'pending').reduce((a, b) => a + b.amount, 0);
  const totalInvoicesCount = invoices.length;

  const filteredInvoices = invoices.filter(inv => {
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inv.deliverableName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md text-center space-y-4">
          <ShieldCheck className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Administrator Access Required</h2>
          <p className="text-xs text-slate-400">You must be logged in as a Network Administrator to access the billing management console.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Billing & Revenue Oversight</span>
            </div>
            <h1 className="text-xl font-black text-white">Billing Management & Invoice Engine</h1>
            <p className="text-xs text-slate-400 mt-1">Issue real-time custom invoices, approve client payments, and manage subscription receivables.</p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-2xl text-xs flex items-center space-x-2 shadow-lg shadow-emerald-950/40 transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create & Issue Custom Invoice</span>
          </button>
        </div>

        {/* Feedback Bar */}
        {feedbackMsg && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-2xl text-xs text-emerald-300 font-medium flex items-center justify-between">
            <span>{feedbackMsg}</span>
            <button onClick={() => setFeedbackMsg(null)} className="text-emerald-400 hover:underline text-[11px]">Dismiss</button>
          </div>
        )}

        {/* Billing Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] font-mono uppercase font-bold">Collected Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-emerald-400">${totalRevenueCollected.toLocaleString()} USD</p>
            <p className="text-[11px] text-slate-500 mt-1">Verified Real-Time Collections</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] font-mono uppercase font-bold">Pending Receivables</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-amber-400">${totalPendingBalance.toLocaleString()} USD</p>
            <p className="text-[11px] text-slate-500 mt-1">{invoices.filter(i => i.status === 'pending').length} Invoices Outstanding</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] font-mono uppercase font-bold">Active Subscriptions</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-black text-indigo-400">{subscriptions.length}</p>
            <p className="text-[11px] text-slate-500 mt-1">Foundry & Enterprise Tiers</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] font-mono uppercase font-bold">Total Invoices Issued</span>
              <Receipt className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-2xl font-black text-white">{totalInvoicesCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">Stored in Firestore Ledger</p>
          </div>
        </div>

        {/* Invoice Management Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search invoice #, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-500 font-mono text-[10px] uppercase border-b border-slate-800">
                  <th className="pb-3 font-bold">Invoice #</th>
                  <th className="pb-3 font-bold">Customer Account</th>
                  <th className="pb-3 font-bold">Deliverable</th>
                  <th className="pb-3 font-bold">Amount</th>
                  <th className="pb-3 font-bold">Due Date</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                    <td className="py-4">
                      <p className="font-bold text-slate-200">{inv.userName}</p>
                      <p className="text-[11px] text-slate-500">{inv.userEmail}</p>
                    </td>
                    <td className="py-4 text-slate-300 max-w-xs truncate">{inv.deliverableName}</td>
                    <td className="py-4 font-mono font-black text-amber-400">${inv.amount.toLocaleString()} USD</td>
                    <td className="py-4 text-slate-400">{new Date(inv.dueDate).toLocaleDateString()}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${
                        inv.status === 'paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : inv.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <select
                        value={inv.status}
                        onChange={(e) => handleStatusUpdate(inv.id, e.target.value as any)}
                        className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-emerald-500"
                      >
                        <option value="pending">Mark Pending</option>
                        <option value="paid">Mark Paid</option>
                        <option value="overdue">Mark Overdue</option>
                        <option value="cancelled">Mark Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Invoice Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6">
              <h2 className="text-lg font-bold text-white">Create & Issue Enterprise Invoice</h2>

              <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Customer Corporate Email</label>
                  <input
                    type="email"
                    required
                    placeholder="client@corporate.com"
                    value={targetUserEmail}
                    onChange={(e) => setTargetUserEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Customer / Organization Name</label>
                  <input
                    type="text"
                    placeholder="Apex Ventures Ltd."
                    value={targetUserName}
                    onChange={(e) => setTargetUserName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Deliverable Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Custom AI Agent Integration & Security Audit"
                    value={deliverableName}
                    onChange={(e) => setDeliverableName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Amount ($ USD)</label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Payment Term (Days)</label>
                    <select
                      value={dueDateDays}
                      onChange={(e) => setDueDateDays(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                    >
                      <option value={7}>Due in 7 Days</option>
                      <option value={14}>Due in 14 Days</option>
                      <option value={30}>Due in 30 Days</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Invoice Description</label>
                  <textarea
                    rows={3}
                    placeholder="Scope details and AST deliverables provided..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-5 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 font-bold rounded-xl"
                  >
                    {isCreating ? 'Issuing...' : 'Issue Invoice Realtime'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
