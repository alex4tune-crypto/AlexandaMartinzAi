import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquare, Building2, ShieldCheck } from 'lucide-react';
import { trackEvent } from '../../../services/analyticsService';

interface VendorInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  firmName: string;
  productTitle?: string;
  addAuditLog: (actor: string, role: string, action: string, details: string) => void;
}

export const VendorInquiryModal: React.FC<VendorInquiryModalProps> = ({
  isOpen,
  onClose,
  firmName,
  productTitle,
  addAuditLog
}) => {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [inquiryId, setInquiryId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderEmail || !message) return;

    const id = `inq-${Math.floor(10000 + Math.random() * 90000)}`;
    setInquiryId(id);

    // Track analytics event for inquiry_created
    trackEvent({
      type: 'inquiry_created',
      firmName,
      category: 'Vendor Messaging',
      metadata: {
        productTitle: productTitle || 'General Storefront Inquiry',
        senderEmail,
        inquiryId: id
      }
    });

    addAuditLog(
      senderName,
      'Buyer / Corporate Client',
      `Sent Direct Message Inquiry to Vendor: ${firmName}`,
      `Subject: Inquiry regarding ${productTitle || 'Firm Storefront Services'}`
    );

    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setMessage('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Contact Specialist Vendor</h3>
            <p className="text-xs text-amber-400 font-mono">Specialist Firm: {firmName}</p>
          </div>
        </div>

        {productTitle && (
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4 text-xs text-slate-300">
            <span>Regarding Deliverable: </span>
            <strong className="text-white">{productTitle}</strong>
          </div>
        )}

        {isSent ? (
          <div className="py-10 text-center space-y-3 bg-emerald-950/40 border border-emerald-800/80 rounded-2xl">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-white text-base">Inquiry Dispatched to Vendor CEO Agent</h4>
            <p className="text-xs text-slate-300">
              Tracking Reference: <strong className="text-amber-400 font-mono">{inquiryId}</strong>
            </p>
            <p className="text-xs text-slate-400">The firm's AI CEO agent will review requirements and respond instantly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Your Name / Organization</label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Apex Financial Corp"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Work Email</label>
              <input
                type="email"
                required
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="contact@apex.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Inquiry / Technical Requirements</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Inquire about custom licensing, technical integration, source code modifications, or delivery timelines..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero-Trust Holas Encrypted</span>
              </div>

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
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white font-bold rounded-xl shadow-lg flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
