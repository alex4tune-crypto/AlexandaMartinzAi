import React, { useState, useEffect } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { DigitalProduct, CorporateNode } from '../../types';
import { trackEvent } from '../../services/analyticsService';
import { MarketplaceHeader } from './components/MarketplaceHeader';
import { PromotionalBanner } from './components/PromotionalBanner';
import { CategoryGrid } from './components/CategoryGrid';
import { VendorInquiryModal } from './components/VendorInquiryModal';
import { QuoteRequestModal } from './components/QuoteRequestModal';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Download, 
  Star, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  ExternalLink,
  Tag,
  Code,
  FileText,
  DollarSign,
  Layers,
  Building2,
  X,
  Heart,
  ArrowRight,
  TrendingUp,
  Cpu,
  SlidersHorizontal,
  Send,
  Eye,
  CheckCircle2,
  Award,
  MessageSquare,
  ArrowLeft,
  ChevronRight,
  Clock,
  Lock,
  Zap,
  Globe
} from 'lucide-react';

export type SubRouteMode = 'home' | 'product-detail' | 'vendor-storefront' | 'saved' | 'compare';

export interface SubRouteState {
  mode: SubRouteMode;
  productId?: string;
  firmName?: string;
}

export const MarketplaceModule: React.FC = () => {
  const { 
    products, 
    nodes, 
    submitOrderRequest, 
    favorites, 
    toggleFavoriteProduct,
    userPersona,
    addAuditLog
  } = usePlatform();

  // Sub-router state
  const [subRoute, setSubRoute] = useState<SubRouteState>({ mode: 'home' });
  const [activeTab, setActiveTab] = useState<'catalog' | 'storefronts' | 'compare' | 'saved'>('catalog');
  
  // Search & Filtering States
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under-200' | '200-500' | '500-1000' | 'over-1000'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'downloads'>('featured');
  
  // Comparison & Download states
  const [compareProducts, setCompareProducts] = useState<DigitalProduct[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Modal States
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [quoteProduct, setQuoteProduct] = useState<DigitalProduct | null>(null);

  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState<boolean>(false);
  const [inquiryVendorFirm, setInquiryVendorFirm] = useState<string>('Aether Web & App Development Lab');
  const [inquiryProductTitle, setInquiryProductTitle] = useState<string>('');

  const categories = [
    'All',
    'Web Applications',
    'Websites',
    'AI Models & APIs',
    'Branding & Logos',
    'Fashion Specs',
    'Research Reports',
    'Economics Reports',
    'Health Solutions',
    'Marketing Assets',
    'Consulting Outputs',
    'Documents',
    'Custom AI Services'
  ];

  // Track page impression on load
  useEffect(() => {
    trackEvent({
      type: 'impression',
      category: 'Solutions Marketplace',
      metadata: { surface: 'marketplace', persona: userPersona }
    });
  }, [userPersona]);

  // Compute category counts
  const categoryCounts = categories.reduce((acc, cat) => {
    if (cat === 'All') {
      acc[cat] = products.length;
    } else {
      acc[cat] = products.filter(p => p.category === cat).length;
    }
    return acc;
  }, {} as Record<string, number>);

  // Sync header activeTab with subRoute
  const handleTabChange = (tab: 'catalog' | 'storefronts' | 'compare' | 'saved') => {
    setActiveTab(tab);
    if (tab === 'catalog') {
      setSubRoute({ mode: 'home' });
    } else if (tab === 'storefronts') {
      setSubRoute({ mode: 'vendor-storefront', firmName: 'all' });
    } else if (tab === 'compare') {
      setSubRoute({ mode: 'compare' });
    } else if (tab === 'saved') {
      setSubRoute({ mode: 'saved' });
    }
  };

  // Filtering & Sorting
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.firmName.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesPrice = true;
    if (priceFilter === 'under-200') matchesPrice = p.price < 200;
    else if (priceFilter === '200-500') matchesPrice = p.price >= 200 && p.price <= 500;
    else if (priceFilter === '500-1000') matchesPrice = p.price > 500 && p.price <= 1000;
    else if (priceFilter === 'over-1000') matchesPrice = p.price > 1000;

    return matchesCategory && matchesSearch && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'downloads') return b.downloads - a.downloads;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const savedProducts = products.filter(p => favorites.includes(p.id));

  // Navigation Handlers
  const navigateToProduct = (prod: DigitalProduct) => {
    setSubRoute({ mode: 'product-detail', productId: prod.id });
    trackEvent({
      type: 'product_view',
      entityId: prod.id,
      firmName: prod.firmName,
      category: prod.category,
      metadata: { title: prod.title, price: prod.price }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToVendor = (firmName: string) => {
    setSubRoute({ mode: 'vendor-storefront', firmName });
    setActiveTab('storefronts');
    trackEvent({
      type: 'vendor_view',
      firmName,
      category: 'Storefront',
      metadata: { source: 'router_navigation' }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Vendor Contact Handler
  const handleContactVendor = (firmName: string, productTitle: string = '') => {
    setInquiryVendorFirm(firmName);
    setInquiryProductTitle(productTitle);
    setIsInquiryModalOpen(true);
  };

  // Download Deliverable Handler
  const handleDownloadDeliverable = (prod: DigitalProduct) => {
    setDownloadingId(prod.id);

    trackEvent({
      type: 'purchase_completed',
      entityId: prod.id,
      firmName: prod.firmName,
      category: prod.category,
      metadata: { title: prod.title, price: prod.price }
    });

    addAuditLog(
      'Buyer / Corporate User',
      'Buyer',
      `Completed Purchase & Download: "${prod.title}"`,
      `Firm: ${prod.firmName} | Price: $${prod.price}`
    );

    setTimeout(() => {
      setDownloadingId(null);
      const element = document.createElement('a');
      const file = new Blob([`
================================================================================
ALEXANDA MARTINZ INC. DIGITAL SOLUTIONS MARKETPLACE DELIVERY RECEIPT & LICENSE
================================================================================
Title: ${prod.title}
Category: ${prod.category}
Specialist Firm: ${prod.firmName}
Deliverable Format: ${prod.deliverableType}
License Price: $${prod.price}
Verification Hash: SHA256-HOLAS-${Date.now()}
Security & Audit: Certified 100% Zero-Trust Secure by Holas Shield

DESCRIPTION:
${prod.description}

DELIVERABLE FEATURES & SPECIFICATIONS:
${prod.features.map(f => `- ${f}`).join('\n')}

TERMS OF USE:
Enterprise License granted to purchaser under Alexanda Martinz Inc. governance.
      `], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${prod.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_deliverable.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1200);
  };

  const toggleCompare = (product: DigitalProduct) => {
    if (compareProducts.some(p => p.id === product.id)) {
      setCompareProducts(prev => prev.filter(p => p.id !== product.id));
    } else {
      if (compareProducts.length >= 3) {
        alert('You can compare up to 3 products at a time.');
        return;
      }
      setCompareProducts(prev => [...prev, product]);
    }
  };

  // Determine current active product or vendor for sub-views
  const activeProduct = products.find(p => p.id === subRoute.productId) || products[0];
  const activeVendorNode = nodes.find(n => n.name === subRoute.firmName);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-20 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* 1. ENTERPRISE HEADER */}
      <MarketplaceHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={(cat) => {
          setSelectedCategory(cat);
          setSubRoute({ mode: 'home' });
          setActiveTab('catalog');
        }}
        categories={categories}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        favoritesCount={favorites.length}
        compareCount={compareProducts.length}
        onRequestQuote={() => {
          setQuoteProduct(null);
          setIsQuoteModalOpen(true);
        }}
        totalProductsCount={products.length}
      />

      {/* BREADCRUMB NAVIGATION BAR */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 py-2.5 px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 text-slate-400">
          <button 
            onClick={() => {
              setSubRoute({ mode: 'home' });
              setActiveTab('catalog');
            }}
            className="hover:text-emerald-400 transition-colors flex items-center"
          >
            <ShoppingBag className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            <span>Marketplace Home</span>
          </button>

          {subRoute.mode === 'product-detail' && activeProduct && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <button 
                onClick={() => {
                  setSelectedCategory(activeProduct.category);
                  setSubRoute({ mode: 'home' });
                  setActiveTab('catalog');
                }}
                className="hover:text-emerald-400 transition-colors"
              >
                {activeProduct.category}
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-slate-200 font-bold truncate max-w-[200px] sm:max-w-md">
                {activeProduct.title}
              </span>
            </>
          )}

          {subRoute.mode === 'vendor-storefront' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <button 
                onClick={() => handleTabChange('storefronts')}
                className="hover:text-emerald-400 transition-colors"
              >
                Specialist Vendors
              </button>
              {activeVendorNode && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <span className="text-slate-200 font-bold">{activeVendorNode.name}</span>
                </>
              )}
            </>
          )}

          {subRoute.mode === 'saved' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-slate-200 font-bold">Wishlist & Saved Items</span>
            </>
          )}

          {subRoute.mode === 'compare' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-slate-200 font-bold">Side-by-Side Product Comparison</span>
            </>
          )}
        </div>
      </div>

      {/* ================= ROUTED VIEW 1: HOME CATALOG ================= */}
      {subRoute.mode === 'home' && (
        <div>
          {/* PROMOTIONAL HERO BANNER */}
          <PromotionalBanner
            featuredProducts={products.filter(p => p.isFeatured)}
            onSelectProduct={navigateToProduct}
            onRequestQuote={() => {
              setQuoteProduct(null);
              setIsQuoteModalOpen(true);
            }}
          />

          {/* CATEGORY ICONS GRID */}
          <CategoryGrid
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
            }}
            categoryCounts={categoryCounts}
          />

          {/* MAIN CATALOG CONTAINER: ENTERPRISE 12-COLUMN GRID WITH SIDEBAR */}
          <div className="max-w-7xl mx-auto px-4 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT SIDEBAR: CATEGORIES & REFINED ENTERPRISE FILTERS (3 Cols) */}
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl sticky top-24">
                  <div>
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="flex items-center gap-1.5">
                        <Filter className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Filter & Categories</span>
                      </span>
                      {selectedCategory !== 'All' && (
                        <button
                          onClick={() => setSelectedCategory('All')}
                          className="text-[10px] text-emerald-400 hover:underline lowercase font-mono"
                        >
                          reset
                        </button>
                      )}
                    </h3>
                  </div>

                  {/* Category Tree List */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider block mb-2">Category Tree</span>
                    {categories.map((cat) => {
                      const count = categoryCounts[cat] || 0;
                      const isSelected = selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80 font-bold'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                          }`}
                        >
                          <span className="truncate">{cat}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-emerald-900 text-emerald-200' : 'bg-slate-950 text-slate-500'
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Price Tier Select */}
                  <div className="pt-4 border-t border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider block">Price Range</span>
                    <select
                      value={priceFilter}
                      onChange={e => setPriceFilter(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="all">All Prices</option>
                      <option value="under-200">Under $200</option>
                      <option value="200-500">$200 - $500</option>
                      <option value="500-1000">$500 - $1,000</option>
                      <option value="over-1000">$1,000+</option>
                    </select>
                  </div>

                  {/* Vendor Storefront Shortcut */}
                  <div className="pt-4 border-t border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider block">Vendor Navigation</span>
                    <button
                      onClick={() => handleTabChange('storefronts')}
                      className="w-full py-2 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Vendor Directory</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT MAIN CATALOG GRID (9 Cols) */}
              <div className="lg:col-span-9 space-y-6">
                {/* Control Bar & Results Count */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                  <div className="flex items-center space-x-2 text-xs text-slate-300">
                    <span className="font-bold text-white">{selectedCategory}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400 font-mono">{filteredProducts.length} Verified Deliverables</span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-400">
                    <span>Sort By:</span>
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value as any)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      <option value="featured">Featured First</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="downloads">Most Downloaded</option>
                    </select>
                  </div>
                </div>

                {/* Product Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((prod) => {
                    const isFav = favorites.includes(prod.id);
                    const isCompared = compareProducts.some(p => p.id === prod.id);

                    return (
                      <div
                        key={prod.id}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-xl hover:shadow-2xl hover:shadow-emerald-950/20 flex flex-col justify-between group relative overflow-hidden"
                      >
                        {prod.badgeTag && (
                          <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-slate-950 font-extrabold text-[10px] uppercase px-3 py-1 rounded-bl-xl shadow">
                            {prod.badgeTag}
                          </div>
                        )}

                        <div>
                          {/* Category & Favorite Controls */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {prod.category}
                            </span>

                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => toggleCompare(prod)}
                                title="Compare product"
                                className={`p-1.5 rounded-lg text-xs transition-colors ${
                                  isCompared ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500 hover:text-slate-300'
                                }`}
                              >
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => toggleFavoriteProduct(prod.id)}
                                title="Favorite product"
                                className={`p-1.5 rounded-lg transition-colors ${
                                  isFav ? 'text-rose-500 fill-rose-500' : 'text-slate-500 hover:text-slate-300'
                                }`}
                              >
                                <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                              </button>
                            </div>
                          </div>

                          {/* Product Title & Vendor Link */}
                          <h3 
                            onClick={() => navigateToProduct(prod)}
                            className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors mb-1 leading-snug cursor-pointer line-clamp-2"
                          >
                            {prod.title}
                          </h3>

                          <div className="flex items-center space-x-2 text-[11px] text-slate-400 mb-3">
                            <span>Vendor: </span>
                            <button
                              onClick={() => navigateToVendor(prod.firmName)}
                              className="text-slate-300 hover:text-amber-400 underline decoration-slate-700 font-semibold transition-colors truncate max-w-[120px]"
                            >
                              {prod.firmName}
                            </button>
                            <span>•</span>
                            <span className="text-amber-400 font-bold flex items-center shrink-0">
                              <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                              {prod.rating}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                            {prod.description}
                          </p>

                          {/* Included Features */}
                          <ul className="space-y-1 mb-5 text-[11px] text-slate-300">
                            {prod.features.slice(0, 2).map((feat, i) => (
                              <li key={i} className="flex items-center space-x-2">
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span className="truncate">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Bottom Row */}
                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-slate-500 font-mono">Format</p>
                            <p className="text-[11px] font-semibold text-slate-200 truncate max-w-[100px]">{prod.deliverableType}</p>
                          </div>

                          <div className="text-right">
                            <p className="text-base font-black text-amber-400">${prod.price}</p>
                            <button
                              onClick={() => navigateToProduct(prod)}
                              className="mt-1 px-3 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              <span>Inspect</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ROUTED VIEW 2: DEDICATED PRODUCT DETAILS PAGE ================= */}
      {subRoute.mode === 'product-detail' && activeProduct && (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          {/* Back Button */}
          <button
            onClick={() => setSubRoute({ mode: 'home' })}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Catalog Grid</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Product Spec & Description (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                {/* Header Tag Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                      {activeProduct.category}
                    </span>
                    {activeProduct.badgeTag && (
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold">
                        {activeProduct.badgeTag}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-slate-400">
                    <span className="flex items-center text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                      {activeProduct.rating} Rating
                    </span>
                    <span>•</span>
                    <span className="flex items-center text-slate-300">
                      <Download className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {activeProduct.downloads} Delivered
                    </span>
                  </div>
                </div>

                {/* Title & Vendor Byline */}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                    {activeProduct.title}
                  </h1>

                  <div className="mt-3 flex items-center space-x-2 text-xs text-slate-400">
                    <span>Published & Supported by:</span>
                    <button
                      onClick={() => navigateToVendor(activeProduct.firmName)}
                      className="font-bold text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{activeProduct.firmName}</span>
                    </button>
                  </div>
                </div>

                {/* Product Description */}
                <div className="bg-slate-950 border border-slate-800/80 p-5 rounded-2xl text-slate-300 text-xs leading-relaxed space-y-2">
                  <h3 className="font-bold text-white uppercase text-[11px] tracking-wider text-slate-400">Executive Summary & Deliverable Brief</h3>
                  <p>{activeProduct.description}</p>
                </div>

                {/* Technical Specifications Matrix */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Code className="w-4 h-4 text-emerald-400" />
                    <span>Included Technical Assets & Deliverable Specs</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeProduct.features.map((feat, idx) => (
                      <div 
                        key={idx}
                        className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-xs text-slate-200 flex items-start space-x-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security & License Audit */}
                <div className="bg-slate-950 border border-emerald-950 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Holas Shield Enterprise Security & Source Integrity Audit</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    This deliverable has undergone automated zero-trust security analysis. Source code and PDF artifacts are verified clean with no third-party telemetry, malicious scripts, or unlicensed code segments. Full commercial enterprise transfer rights included.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Commercial Buy Box & Vendor Card (4 cols) */}
            <div className="lg:col-span-4 space-y-6 sticky top-24">
              {/* Buy Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
                <div>
                  <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block mb-1">Commercial Price</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-amber-400">${activeProduct.price}</span>
                    <span className="text-xs text-slate-400">USD (One-time license)</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs border-t border-b border-slate-800 py-4">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Deliverable Format:</span>
                    <span className="font-bold text-white">{activeProduct.deliverableType}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Delivery Speed:</span>
                    <span className="font-bold text-emerald-400 flex items-center">
                      <Zap className="w-3 h-3 mr-1" /> Instant Download
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Commercial License:</span>
                    <span className="font-bold text-slate-200">Full Corporate Rights</span>
                  </div>
                </div>

                {/* Action CTAs */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleDownloadDeliverable(activeProduct)}
                    disabled={downloadingId === activeProduct.id}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl text-xs shadow-xl transition-all flex items-center justify-center space-x-2"
                  >
                    <Download className={`w-4 h-4 ${downloadingId === activeProduct.id ? 'animate-bounce' : ''}`} />
                    <span>
                      {downloadingId === activeProduct.id ? 'Generating Verified License...' : 'Buy & Download Deliverable'}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setQuoteProduct(activeProduct);
                      setIsQuoteModalOpen(true);
                    }}
                    className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>Request Custom Modifications</span>
                  </button>
                </div>

                {/* Vendor Summary Card */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <span className="text-[10px] uppercase font-mono text-slate-500 font-bold tracking-wider">Specialist Publisher</span>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{activeProduct.firmName}</h4>
                      <p className="text-[10px] text-emerald-400 font-mono">100% Guaranteed Delivery</p>
                    </div>

                    <button
                      onClick={() => navigateToVendor(activeProduct.firmName)}
                      className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-400 text-xs font-bold rounded-lg transition-colors"
                    >
                      View Storefront
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Related Products */}
          <div className="pt-8 border-t border-slate-800/80 space-y-4">
            <h3 className="text-base font-bold text-white">Related Deliverables in {activeProduct.category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products
                .filter(p => p.category === activeProduct.category && p.id !== activeProduct.id)
                .slice(0, 3)
                .map((rel) => (
                  <div 
                    key={rel.id} 
                    onClick={() => navigateToProduct(rel)}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl cursor-pointer transition-all space-y-3"
                  >
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
                      {rel.category}
                    </span>
                    <h4 className="font-bold text-white text-sm hover:text-emerald-400">{rel.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{rel.description}</p>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
                      <span className="font-bold text-slate-300">{rel.firmName}</span>
                      <span className="font-black text-amber-400">${rel.price}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= ROUTED VIEW 3: DEDICATED VENDOR STOREFRONT PAGE ================= */}
      {subRoute.mode === 'vendor-storefront' && (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          {/* Back Button */}
          <button
            onClick={() => {
              setSubRoute({ mode: 'home' });
              setActiveTab('catalog');
            }}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Marketplace Catalog</span>
          </button>

          {/* Directory mode vs Specific Vendor Storefront mode */}
          {subRoute.firmName === 'all' || !activeVendorNode ? (
            <div className="space-y-8">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center max-w-3xl mx-auto space-y-2 shadow-2xl">
                <Building2 className="w-8 h-8 text-amber-400 mx-auto" />
                <h2 className="text-xl font-bold text-white">Alexanda Martinz Inc. Specialist Vendor Directory</h2>
                <p className="text-xs text-slate-400">
                  Select an official specialist vendor storefront operating under corporate license and zero-trust security governance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {nodes.map((node) => {
                  const firmProducts = products.filter(p => p.firmName === node.name);

                  return (
                    <div
                      key={node.id}
                      className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between space-y-6"
                    >
                      <div>
                        {/* Storefront Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg font-black">
                              {node.firmCode}
                            </div>
                            <div>
                              <h3 
                                onClick={() => navigateToVendor(node.name)}
                                className="text-lg font-bold text-white hover:text-amber-400 cursor-pointer"
                              >
                                {node.name}
                              </h3>
                              <p className="text-xs text-emerald-400 font-mono font-semibold flex items-center">
                                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                                Verified Vendor • {node.status}
                              </p>
                            </div>
                          </div>

                          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-950 text-emerald-400 border border-slate-800">
                            99% Satisfaction
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 mb-4 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                          {node.description}
                        </p>

                        {/* Published Products Preview */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Verified Offerings ({firmProducts.length})
                          </h4>
                          {firmProducts.slice(0, 3).map(p => (
                            <div
                              key={p.id}
                              onClick={() => navigateToProduct(p)}
                              className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs hover:border-slate-700 transition-colors cursor-pointer"
                            >
                              <div>
                                <p className="font-bold text-white hover:text-emerald-400">{p.title}</p>
                                <p className="text-[10px] text-slate-400">{p.deliverableType}</p>
                              </div>
                              <span className="font-extrabold text-amber-400">${p.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Storefront Action Bar */}
                      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                        <div className="text-xs text-slate-400">
                          <span>Specialist Lead: <strong className="text-white">{node.ceoAgentName}</strong></span>
                        </div>

                        <button
                          onClick={() => navigateToVendor(node.name)}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center space-x-1.5"
                        >
                          <span>Open Full Storefront</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Dedicated Single Vendor Storefront Page */
            <div className="space-y-8">
              {/* Vendor Hero Banner */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl font-black shrink-0">
                      {activeVendorNode.firmCode}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold uppercase">
                          {activeVendorNode.status}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">Specialist Firm Node</span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{activeVendorNode.name}</h1>
                      <p className="text-xs text-slate-300">Lead Specialist Agent: <strong className="text-white">{activeVendorNode.ceoAgentName}</strong></p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <button
                      onClick={() => handleContactVendor(activeVendorNode.name)}
                      className="px-4 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5"
                    >
                      <MessageSquare className="w-4 h-4 text-amber-400" />
                      <span>Contact Lead</span>
                    </button>

                    <button
                      onClick={() => {
                        setQuoteProduct(null);
                        setIsQuoteModalOpen(true);
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg transition-all flex items-center space-x-1.5"
                    >
                      <Send className="w-4 h-4" />
                      <span>Commission Custom Work</span>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <p className="font-semibold text-slate-200 mb-1">Company Overview & Capability Brief:</p>
                  <p>{activeVendorNode.description}</p>
                </div>
              </div>

              {/* Products Published by this Vendor */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    <span>Official Deliverables Catalog ({products.filter(p => p.firmName === activeVendorNode.name).length})</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products
                    .filter(p => p.firmName === activeVendorNode.name)
                    .map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all shadow-xl flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                            {prod.category}
                          </span>

                          <h4 
                            onClick={() => navigateToProduct(prod)}
                            className="font-bold text-white text-base mt-2 mb-1 hover:text-emerald-400 cursor-pointer"
                          >
                            {prod.title}
                          </h4>

                          <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                            {prod.description}
                          </p>

                          <ul className="space-y-1 text-[11px] text-slate-300 mb-4">
                            {prod.features.slice(0, 3).map((f, i) => (
                              <li key={i} className="flex items-center space-x-2">
                                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span className="truncate">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-lg font-black text-amber-400">${prod.price}</span>
                          <button
                            onClick={() => navigateToProduct(prod)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors"
                          >
                            Inspect Specs
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= ROUTED VIEW 4: SIDE-BY-SIDE COMPARE ================= */}
      {subRoute.mode === 'compare' && (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Side-by-Side Product Comparison</h2>
            <button
              onClick={() => setCompareProducts([])}
              className="text-xs text-rose-400 hover:underline font-bold"
            >
              Clear Comparison List
            </button>
          </div>

          {compareProducts.length === 0 ? (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
              <SlidersHorizontal className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Products Selected for Comparison</h3>
              <p className="text-xs text-slate-400">Click the comparison icon on any product card in the catalog to add it here.</p>
              <button
                onClick={() => {
                  setSubRoute({ mode: 'home' });
                  setActiveTab('catalog');
                }}
                className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs shadow"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {compareProducts.map((p) => (
                <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono text-emerald-400 font-bold">{p.category}</span>
                    <button
                      onClick={() => toggleCompare(p)}
                      className="text-slate-500 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-bold text-white text-base">{p.title}</h3>
                  <p className="text-2xl font-black text-amber-400">${p.price}</p>

                  <div className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                    <p><strong>Vendor:</strong> {p.firmName}</p>
                    <p><strong>Format:</strong> {p.deliverableType}</p>
                    <p><strong>Security Audit:</strong> Certified Zero-Trust</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800">
                    <p className="text-xs font-bold text-slate-400 mb-2">Included Features:</p>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {p.features.map((f, i) => (
                        <li key={i} className="flex items-center space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => navigateToProduct(p)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all"
                  >
                    View Specs & Purchase
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= ROUTED VIEW 5: WISHLIST / SAVED ================= */}
      {subRoute.mode === 'saved' && (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Your Wishlist & Saved Deliverables</h2>
              <p className="text-xs text-slate-400">Products saved for quick access and enterprise purchasing</p>
            </div>

            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
              {savedProducts.length} Saved Items
            </span>
          </div>

          {savedProducts.length === 0 ? (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
              <Heart className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">Your Wishlist is Empty</h3>
              <p className="text-xs text-slate-400">Click the heart icon on any product card to save it here.</p>
              <button
                onClick={() => {
                  setSubRoute({ mode: 'home' });
                  setActiveTab('catalog');
                }}
                className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs shadow"
              >
                Explore Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProducts.map((p) => (
                <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-semibold">{p.category}</span>
                    <button
                      onClick={() => toggleFavoriteProduct(p.id)}
                      className="text-rose-500 hover:text-slate-400 font-bold"
                    >
                      Remove
                    </button>
                  </div>

                  <h3 className="font-bold text-white text-sm">{p.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-lg font-black text-amber-400">${p.price}</span>
                    <button
                      onClick={() => navigateToProduct(p)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs"
                    >
                      View & Purchase
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL 1: VENDOR INQUIRY ================= */}
      <VendorInquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        firmName={inquiryVendorFirm}
        productTitle={inquiryProductTitle}
        addAuditLog={addAuditLog}
      />

      {/* ================= MODAL 2: QUOTE REQUEST / CUSTOM WORK ================= */}
      <QuoteRequestModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        nodes={nodes}
        initialProduct={quoteProduct}
        submitOrderRequest={submitOrderRequest}
      />
    </div>
  );
};
