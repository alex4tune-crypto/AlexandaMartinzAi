import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, Send } from 'lucide-react';
import { CorporateNode, DigitalProduct } from '../../../types';
import { trackEvent } from '../../../services/analyticsService';

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: CorporateNode[];
  initialProduct?: DigitalProduct | null;
  submitOrderRequest: (order: any) => void;
}

export const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({
  isOpen,
  onClose,
  nodes,
  initialProduct,
  submitOrderRequest
}) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [category, setCategory] = useState(initialProduct?.category || 'Web Applications');
  const [assignedFirm, setAssignedFirm] = useState(initialProduct?.firmName || 'Aether Web & App Development Lab');
  const [budgetTier, setBudgetTier] = useState('$10,000 - $25,000');
  const [requirements, setRequirements] = useState(
    initialProduct ? `Requesting custom variant or enterprise customization for: "${initialProduct.title}".` : ''
  );
  const [receipt, setReceipt] = useState<{ trackingNumber: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !requirements) return;

    const trackingNumber = `TRK-${Math.floor(10000 + Math.random() * 90000)}`;
    
    submitOrderRequest({
      clientName,
      clientEmail,
      selectedCategory: category,
      projectRequirements: requirements,
      budgetTier,
      assignedNode: assignedFirm,
      trackingNumber
    });

    // Track analytics event
    trackEvent({
      type: 'quote_requested',
      firmName: assignedFirm,
      category,
      metadata: {
        clientName,
        budgetTier,
        trackingNumber
      }
    });

    setReceipt({ trackingNumber });
    setTimeout(() => {
      setReceipt(null);
      setClientName('');
      setClientEmail('');
      setRequirements('');
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Commission Custom Solution</h3>
            <p className="text-xs text-slate-400">Direct production directive to Alexanda Martinz Inc. specialist firms</p>
          </div>
        </div>

        {receipt ? (
          <div className="py-10 text-center space-y-3 bg-emerald-950/40 border border-emerald-800/80 rounded-2xl">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-white text-base">Commission Dispatched to Network</h4>
            <p className="text-xs text-slate-300">
              Tracking Number: <strong className="text-amber-400 font-mono">{receipt.trackingNumber}</strong>
            </p>
            <p className="text-xs text-slate-400">Assigned Vendor Node: {assignedFirm}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Your Name / Corporate Entity</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Apex Financial Group"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Contact Email</label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="contact@apex.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Budget Allocation</label>
                <select
                  value={budgetTier}
                  onChange={(e) => setBudgetTier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                  <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                  <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                  <option value="$50,000+">$50,000+ Enterprise</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Select Vendor Firm Node</label>
              <select
                value={assignedFirm}
                onChange={(e) => setAssignedFirm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
              >
                {nodes.map((n) => (
                  <option key={n.id} value={n.name}>
                    {n.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Detailed Technical Scope & Requirements</label>
              <textarea
                required
                rows={4}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Detail the web application, custom AI model, macroeconomic report, fashion specs, or health solution required..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <span className="text-[11px] text-emerald-400 flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Guaranteed Holas Security Compliance
              </span>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white font-bold rounded-xl shadow-lg flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5 mr-1" />
                  <span>Dispatch Commission</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
