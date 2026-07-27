import React from 'react';
import { usePlatform } from '../context/PlatformContext';
import { useAuth } from '../context/AuthContext';
import { Menu, LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentSurface, setSurface } = usePlatform();
  const { user, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Alexanda Martinz AI
          </h1>
          <nav className="flex gap-4">
            {['portal', 'marketplace', 'dashboard', 'account'].map((surface) => (
              <button
                key={surface}
                onClick={() => setSurface(surface as any)}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  currentSurface === surface
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {surface.charAt(0).toUpperCase() + surface.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-slate-500"
                />
                <span className="text-slate-300 text-sm">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <div className="text-slate-300 text-sm">Not logged in</div>
          )}
        </div>
      </div>
    </header>
  );
};
