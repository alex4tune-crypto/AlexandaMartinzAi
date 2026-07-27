import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LoadingButton } from '../../components/LoadingSpinner';
import { User, Lock, LogOut } from 'lucide-react';

export const CustomerAccountArea: React.FC = () => {
  const { user, logout, login } = useAuth();
  const [showLoginForm, setShowLoginForm] = useState(!user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      setShowLoginForm(false);
      setEmail('');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {user ? (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Account Settings</h2>
            
            <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 mb-8">
              <div className="flex items-center gap-4 mb-8">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-full border-2 border-blue-400"
                />
                <div>
                  <h3 className="text-2xl font-bold text-white">{user.name}</h3>
                  <p className="text-slate-400">{user.email}</p>
                  <p className="text-slate-500 text-sm mt-1">Role: {user.role}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-t border-slate-700 pt-4 mt-4">
                  <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                    <User size={20} /> Profile Information
                  </h4>
                  <div className="space-y-3 text-slate-300">
                    <div>
                      <label className="text-slate-400 text-sm">Email Address</label>
                      <p className="font-mono text-white">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm">Full Name</label>
                      <p className="text-white">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm">Account Role</label>
                      <p className="text-white">{user.role}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4 mt-4">
                  <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Lock size={20} /> Security
                  </h4>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Change Password
                  </button>
                </div>

                <div className="border-t border-slate-700 pt-4 mt-4">
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto pt-12">
            <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6">Sign In to Your Account</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <LoadingButton loading={loading}>Sign In</LoadingButton>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
