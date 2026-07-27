import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

export const LoadingButton: React.FC<{ loading: boolean; children: React.ReactNode }> = ({
  loading,
  children,
}) => (
  <button
    disabled={loading}
    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
  >
    {loading && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
    {children}
  </button>
);
