import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Download, 
  Heart, 
  Send, 
  Eye, 
  Star, 
  Building2, 
  Tag, 
  Sparkles,
  MessageSquare,
  Share2,
  FileText
} from 'lucide-react';
import { DigitalProduct } from '../../../types';
import { trackEvent } from '../../../services/analyticsService';

interface ListingDetailModalProps {
  product: DigitalProduct | null;
  onClose: () => void;
  onDownload: (prod: DigitalProduct) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onRequestQuoteForProduct: (prod: DigitalProduct) => void;
  onContactVendor: (firmName: string, productTitle: string) => void;
  relatedProducts: DigitalProduct[];
  onSelectProduct: (prod: DigitalProduct) => void;
  downloading: boolean;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  product,
  onClose,
  onDownload,
  isFavorite,
  onToggleFavorite,
  onRequestQuoteForProduct,
  onContactVendor,
  relatedProducts,
  onSelectProduct,
  downloading
}) => {
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 text-white shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pr-8">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {product.category}
            </span>
            {product.badgeTag && (
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {product.badgeTag}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <span className="flex items-center text-amber-400 font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
              {product.rating} / 5.0
            </span>
            <span>•</span>
            <span className="font-mono">{product.downloads} Orders / Deliveries</span>
          </div>
        </div>

        {/* Product Title & Firm Info */}
        <h2 className="text-2xl font-black text-white mb-2 leading-tight">
          {product.title}
        </h2>

        <div className="flex items-center space-x-2 text-xs text-slate-300 mb-6 pb-4 border-b border-slate-800">
          <Building2 className="w-4 h-4 text-emerald-400" />
          <span>Specialist Vendor: <strong className="text-white">{product.firmName}</strong></span>
          <span className="text-emerald-400 font-bold ml-2">• Verified Holas Node</span>
        </div>

        {/* Description Box */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 mb-6 space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Solution Overview & Specification</h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
            Deliverable Features & Included Specifications
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {product.features.map((feat, i) => (
              <div key={i} className="flex items-center space-x-2.5 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deliverable Format & Price Card */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/60 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs text-slate-400 font-mono">Deliverable Asset Format</p>
            <p className="text-sm font-bold text-white mt-0.5">{product.deliverableType}</p>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              100% Guaranteed Source Integrity & License
            </p>
          </div>

          <div className="text-center sm:text-right">
            <p className="text-xs text-slate-400 font-mono">Enterprise License Price</p>
            <p className="text-3xl font-black text-amber-400">${product.price}</p>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800 mb-8">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleFavorite(product.id)}
              className={`p-3 rounded-xl border transition-colors ${
                isFavorite
                  ? 'bg-rose-950 text-rose-400 border-rose-800'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-xl bg-slate-950 text-slate-400 border border-slate-800 hover:text-white transition-colors"
              title="Share Listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copied && <span className="text-xs text-emerald-400 font-mono">Link Copied!</span>}

            <button
              onClick={() => onContactVendor(product.firmName, product.title)}
              className="px-4 py-3 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Contact Vendor</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => onRequestQuoteForProduct(product)}
              className="flex-1 sm:flex-none px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
            >
              Request Custom Variant
            </button>

            <button
              onClick={() => onDownload(product)}
              disabled={downloading}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-xl shadow-emerald-950/50 transition-all border border-emerald-500/30"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Preparing Package...' : 'Buy & Download Deliverable'}</span>
            </button>
          </div>
        </div>

        {/* Related / Recommended Items (Jumia discovery style) */}
        {relatedProducts.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Buyers Who Viewed This Also Considered
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedProducts.slice(0, 3).map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectProduct(rel)}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all space-y-1.5 group"
                >
                  <span className="text-[10px] text-emerald-400 font-semibold">{rel.category}</span>
                  <h5 className="text-xs font-bold text-white group-hover:text-emerald-400 truncate">{rel.title}</h5>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 text-[10px] truncate">{rel.firmName}</span>
                    <span className="font-extrabold text-amber-400">${rel.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
