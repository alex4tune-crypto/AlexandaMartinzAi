import React from 'react';
import { InvoiceItem } from '../../services/billingService';
import { X, Printer, Download, CheckCircle2, Building, ShieldCheck, Clock, FileText } from 'lucide-react';

interface InvoiceReceiptModalProps {
  invoice: InvoiceItem | null;
  onClose: () => void;
  onPay?: (invoiceId: string) => void;
}

export const InvoiceReceiptModal: React.FC<InvoiceReceiptModalProps> = ({ invoice, onClose, onPay }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in print:p-0 print:bg-white print:static">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-100 print:bg-white print:text-slate-900 print:border-none print:shadow-none">
        
        {/* Controls - Hidden on Print */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold text-white">Official Tax Invoice & Receipt Spec</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 mr-1" />
              <span>Print PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/50 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Body */}
        <div className="space-y-6">
          {/* Header Branding */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 print:border-slate-300">
            <div>
              <h1 className="text-xl font-black text-white print:text-slate-900">ALEXANDA MARTINZ INC.</h1>
              <p className="text-xs text-slate-400 print:text-slate-600">AI Production Network & Solutions Foundry</p>
              <p className="text-[11px] text-slate-500 font-mono mt-1">Tax ID: AM-8942-CORP • Cloud Ingress Node 07</p>
            </div>

            <div className="text-left sm:text-right">
              <span className={`inline-block text-xs font-mono font-bold px-3 py-1 rounded-full uppercase border ${
                invoice.status === 'paid'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 print:bg-emerald-100 print:text-emerald-800'
                  : invoice.status === 'pending'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 print:bg-amber-100 print:text-amber-800'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30 print:bg-rose-100 print:text-rose-800'
              }`}>
                ● Status: {invoice.status.toUpperCase()}
              </span>
              <p className="text-xs font-mono font-bold text-slate-300 print:text-slate-800 mt-2">
                Invoice #: {invoice.invoiceNumber}
              </p>
              <p className="text-[11px] text-slate-400 print:text-slate-600">
                Issued: {new Date(invoice.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Customer & Billing Details */}
          <div className="grid grid-cols-2 gap-6 bg-slate-950 p-4 rounded-2xl border border-slate-800 print:bg-slate-50 print:border-slate-200">
            <div>
              <p className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider mb-1">Billed To</p>
              <p className="text-xs font-bold text-white print:text-slate-900">{invoice.userName}</p>
              <p className="text-xs text-slate-400 print:text-slate-600">{invoice.userEmail}</p>
              <p className="text-[11px] text-slate-500 font-mono">User ID: {invoice.userId}</p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider mb-1">Payment Specs</p>
              <p className="text-xs text-slate-300 print:text-slate-800">
                Due Date: <span className="font-semibold text-white print:text-slate-900">{new Date(invoice.dueDate).toLocaleDateString()}</span>
              </p>
              {invoice.paidAt && (
                <p className="text-xs text-emerald-400 print:text-emerald-700">
                  Paid On: {new Date(invoice.paidAt).toLocaleDateString()}
                </p>
              )}
              {invoice.paymentMethodUsed && (
                <p className="text-[11px] text-slate-400 print:text-slate-600">
                  Method: {invoice.paymentMethodUsed}
                </p>
              )}
            </div>
          </div>

          {/* Itemized Line Items */}
          <div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase print:border-slate-300">
                  <th className="py-2 font-bold">Deliverable / Description</th>
                  <th className="py-2 font-bold text-center">Qty</th>
                  <th className="py-2 font-bold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-slate-200">
                <tr>
                  <td className="py-3 pr-4">
                    <p className="font-bold text-white print:text-slate-900">{invoice.deliverableName}</p>
                    <p className="text-[11px] text-slate-400 print:text-slate-600 mt-0.5">{invoice.description}</p>
                  </td>
                  <td className="py-3 text-center text-slate-300 print:text-slate-800 font-mono">1</td>
                  <td className="py-3 text-right font-mono font-bold text-white print:text-slate-900">${invoice.amount.toLocaleString()} USD</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary Totals */}
          <div className="pt-4 border-t border-slate-800 flex justify-end print:border-slate-300">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400 print:text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono text-slate-200 print:text-slate-800">${invoice.amount.toLocaleString()} USD</span>
              </div>
              <div className="flex justify-between text-slate-400 print:text-slate-600">
                <span>Tax (0% Enterprise Export):</span>
                <span className="font-mono text-slate-200 print:text-slate-800">$0.00 USD</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold text-white print:border-slate-300 print:text-slate-900">
                <span>Total Amount Due:</span>
                <span className="font-mono text-amber-400 print:text-emerald-700">${invoice.amount.toLocaleString()} USD</span>
              </div>
            </div>
          </div>

          {/* Pay Button Action if Pending */}
          {invoice.status === 'pending' && onPay && (
            <div className="pt-4 print:hidden">
              <button
                onClick={() => onPay(invoice.id)}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/40 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Pay Invoice Realtime (${invoice.amount} USD)</span>
              </button>
            </div>
          )}

          {/* Security Compliance Footer */}
          <div className="pt-6 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono text-center print:border-slate-300 print:text-slate-600">
            Holas Cloud Shield Verified • Immutable Ledger Timestamp • Alexanda Martinz Inc. Billing Service
          </div>
        </div>
      </div>
    </div>
  );
};
