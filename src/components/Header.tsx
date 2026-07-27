import React, { useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './auth/AuthModal';
import { 
  Globe, 
  ShoppingBag, 
  LayoutDashboard, 
  ShieldCheck, 
  Power,
  Sparkles,
  User,
  CreditCard,
  LogOut,
  UserCheck,
  Receipt
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentSurface, 
    setCurrentSurface, 
    aiCeoAutoMode, 
    toggleAiCeoMode,
    isCeoThinking,
    isHolasAuditing
  } = usePlatform();

  const { currentUser, userProfile, invoices, signOut } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const pendingCount = invoices.filter(i => i.status === 'pending').length;

  return (
    <>
      <header className="h-16 bg-[#0F172A] text-white flex items-center justify-between px-4 sm:px-6 border-b border-slate-700 shrink-0 sticky top-0 z-50 shadow-md">
        {/* Brand Identity */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentSurface('portal')}>
          <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center font-bold text-lg italic text-white shadow-sm">
            A
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight uppercase text-white">Alexanda Martinz Inc.</h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.1em]">AI Production Network & Solutions Foundry</p>
          </div>
        </div>

        {/* Surface Navigation Pill Tabs */}
        <nav className="hidden md:flex gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700/60">
          <button
            onClick={() => setCurrentSurface('portal')}
            id="surface-portal-button"
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              currentSurface === 'portal'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Public Portal</span>
          </button>

          <button
            onClick={() => setCurrentSurface('marketplace')}
            id="surface-marketplace-button"
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              currentSurface === 'marketplace'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Marketplace</span>
          </button>

          <button
            onClick={() => setCurrentSurface('dashboard')}
            id="surface-dashboard-button"
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              currentSurface === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Management OS</span>
          </button>

          <button
            onClick={() => setCurrentSurface('account')}
            id="surface-account-button"
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 relative ${
              currentSurface === 'account'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Account & Billing</span>
            {pendingCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>
        </nav>

        {/* Right Controls & User Profile */}
        <div className="flex items-center gap-3">
          {/* AI CEO Auto Mode Toggle Button */}
          <button
            onClick={toggleAiCeoMode}
            id="ai-ceo-mode-toggle-button"
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold transition-all border ${
              aiCeoAutoMode
                ? 'bg-indigo-950 text-indigo-300 border-indigo-700 hover:bg-indigo-900'
                : 'bg-amber-950 text-amber-300 border-amber-700 hover:bg-amber-900'
            }`}
            title="Toggle AI CEO Auto Mode vs Manual Override"
          >
            <Power className="w-3 h-3" />
            <span>{aiCeoAutoMode ? 'AI AUTO: ON' : 'MANUAL'}</span>
            {isCeoThinking && <Sparkles className="w-3 h-3 text-indigo-400 animate-spin" />}
          </button>

          {/* User Account Button / Pill */}
          {currentUser ? (
            <button
              onClick={() => setCurrentSurface('account')}
              className="flex items-center gap-2.5 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 transition-all text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300 text-xs shrink-0">
                {userProfile?.displayName ? userProfile.displayName.slice(0, 2).toUpperCase() : 'AM'}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-bold text-white truncate max-w-[120px]">{userProfile?.displayName || 'Member'}</span>
                <span className="text-[10px] text-emerald-400 font-mono leading-none">
                  ${(userProfile?.accountBalance || 0).toLocaleString()} USD
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
};
