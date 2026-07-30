import React, { useEffect, useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { useAuth } from '../context/AuthContext';
import { LogOut, Activity, ShieldCheck, Cpu, ChevronRight } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentSurface, setSurface } = usePlatform();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass-header py-3' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setSurface('portal')}>
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center group-hover:emerald-glow transition-all duration-500">
              <Activity className="text-emerald-400" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-[0.15em] text-white uppercase text-shadow-glow">
                ALEXANDA <span className="text-emerald-500">MARTINZ</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase">AI PRODUCTION NETWORK</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/5 p-1 rounded-2xl backdrop-blur-md">
            {[
              { id: 'portal', label: 'Public Portal' },
              { id: 'marketplace', label: 'Asset Exchange' },
              { id: 'dashboard', label: 'Network Ops' },
              { id: 'account', label: 'Corporate HQ' }
            ].map((surface) => (
              <button
                key={surface.id}
                onClick={() => setSurface(surface.id as any)}
                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  currentSurface === surface.id
                    ? 'bg-white/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {surface.label}
              </button>
            ))}
          </nav>
        </div>

        {/* System & User */}
        <div className="flex items-center gap-6">
          {/* Live System Stats (Visual only for now) */}
          <div className="hidden xl:flex items-center gap-4 border-r border-white/10 pr-6">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">System Health</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`w-1 h-3 rounded-full ${i < 5 ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                  ))}
                </div>
              </div>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Optimal</span>
            </div>
            <div className="w-px h-8 bg-white/5" />
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Security Node</span>
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Holas v4.2</span>
              </div>
              <ShieldCheck className="text-blue-500/50" size={18} />
            </div>
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 pl-2 py-1.5 pr-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group">
                <div className="relative">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`}
                    alt={user.name}
                    className="w-8 h-8 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-obsidian rounded-full" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-white tracking-wide">{user.name}</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Executive Director</span>
                </div>
                <ChevronRight size={14} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
              </div>
              
              <button
                onClick={logout}
                className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300"
                title="Logout System"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSurface('account')}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-emerald-900/20"
            >
              Access Network
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
