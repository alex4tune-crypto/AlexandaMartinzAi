import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LoadingButton } from '../../components/LoadingSpinner';
import { User, Lock, LogOut, ShieldCheck, Mail, Building2, Zap, ArrowRight } from 'lucide-react';

export const CustomerAccountArea: React.FC = () => {
  const { user, logout, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-obsidian overflow-y-auto pt-24">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {user ? (
          <div className="space-y-12">
            <div className="flex items-center justify-between border-b border-white/5 pb-12">
              <div>
                <div className="flex items-center gap-3 text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">
                  <Zap size={14} className="fill-emerald-400" /> Corporate Headquarters
                </div>
                <h2 className="text-5xl font-black text-white tracking-tighter leading-tight">
                  Executive <span className="text-slate-500">Terminal</span>
                </h2>
              </div>
              <div className="flex gap-4">
                 <button onClick={logout} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-red-400 transition-all">
                    <LogOut size={20} />
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Identity Card */}
               <div className="lg:col-span-1">
                  <div className="glass-card rounded-[2.5rem] p-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500" />
                    <div className="relative mb-8 inline-block">
                      <img
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`}
                        alt={user.name}
                        className="w-32 h-32 rounded-3xl object-cover grayscale mx-auto border border-white/10 shadow-2xl"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-xl border-4 border-obsidian">
                         <ShieldCheck className="text-white" size={20} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{user.name}</h3>
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em] mb-8">{user.role}</p>
                    
                    <div className="space-y-4 pt-8 border-t border-white/5">
                       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-slate-500">Network ID</span>
                          <span className="text-white font-mono">{user.id.slice(0, 8)}...</span>
                       </div>
                       <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-slate-500">Security Clearance</span>
                          <span className="text-blue-400">Level 4</span>
                       </div>
                    </div>
                  </div>
               </div>

               {/* Detailed Information */}
               <div className="lg:col-span-2 space-y-8">
                  <div className="glass-card rounded-[2.5rem] p-10">
                    <h4 className="text-xl font-black text-white mb-10 flex items-center gap-4">
                       <Building2 className="text-slate-500" size={20} /> Corporate Dossier
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-6">
                          <div className="group">
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 block group-focus-within:text-emerald-400 transition-colors">Primary Email</label>
                             <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                                <Mail size={16} className="text-slate-600" />
                                <span className="text-sm font-bold text-white tracking-wide">{user.email}</span>
                             </div>
                          </div>
                          <div className="group">
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 block group-focus-within:text-emerald-400 transition-colors">Organization</label>
                             <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                                <Building2 size={16} className="text-slate-600" />
                                <span className="text-sm font-bold text-white tracking-wide">{user.companyName || "AM Global Network"}</span>
                             </div>
                          </div>
                       </div>
                       <div className="space-y-6">
                          <div className="group">
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 block group-focus-within:text-emerald-400 transition-colors">Network Plan</label>
                             <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-6 py-4">
                                <span className="text-sm font-black text-emerald-400 uppercase tracking-widest">{user.plan || "Enterprise Tier"}</span>
                                <ArrowRight size={14} className="text-emerald-500" />
                             </div>
                          </div>
                          <div className="group">
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 block group-focus-within:text-emerald-400 transition-colors">Allocated Capital</label>
                             <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                                <span className="text-2xl font-black text-white tracking-tighter">${user.accountBalance?.toLocaleString() || "50,000"}</span>
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">USD EQUIV</span>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="glass-card rounded-[2.5rem] p-10">
                    <h4 className="text-xl font-black text-white mb-10 flex items-center gap-4">
                       <Lock className="text-slate-500" size={20} /> System Security
                    </h4>
                    <div className="flex flex-wrap gap-4">
                       <button className="bg-white text-obsidian font-black px-8 py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">
                          Rotate Access Keys
                       </button>
                       <button className="bg-white/5 border border-white/10 text-white font-black px-8 py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                          Update Password
                       </button>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="min-h-[70vh] flex flex-col items-center justify-center relative overflow-hidden">
             {/* Background logic */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
             
             <div className="glass-card rounded-[3rem] p-16 w-full max-w-lg relative z-10 hover:border-emerald-500/30 transition-all duration-700">
               <div className="text-center mb-12">
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Activity className="text-emerald-400" size={32} />
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tight mb-3 uppercase tracking-[0.1em]">Network Access</h2>
                  <p className="text-slate-500 text-sm font-medium tracking-wide">Enter your credentials to connect to the AM AI production network.</p>
               </div>

               <form onSubmit={handleLogin} className="space-y-6">
                 <div className="group">
                   <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 group-focus-within:text-emerald-400 transition-colors">Identification</label>
                   <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="EXECUTIVE EMAIL"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-emerald-500/50 transition-all tracking-widest font-bold"
                        required
                      />
                   </div>
                 </div>

                 <div className="group">
                   <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 group-focus-within:text-emerald-400 transition-colors">Security Protocol</label>
                   <div className="relative">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="ACCESS CODE"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-emerald-500/50 transition-all tracking-widest font-bold"
                        required
                      />
                   </div>
                 </div>

                 <div className="pt-6">
                   <LoadingButton 
                     loading={loading}
                     className="w-full bg-white hover:bg-emerald-500 hover:text-white text-obsidian font-black py-6 rounded-[2rem] transition-all duration-300 text-xs uppercase tracking-[0.3em] shadow-2xl shadow-emerald-900/10 flex items-center justify-center gap-4"
                   >
                     Initialize Session <ArrowRight size={18} />
                   </LoadingButton>
                 </div>
               </form>
               
               <div className="mt-12 pt-8 border-t border-white/5 text-center">
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Authorized Personnel Only</p>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
