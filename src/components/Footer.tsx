import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-700 text-slate-400 text-sm py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-slate-200 mb-3">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-slate-200">About</a></li>
              <li><a href="#" className="hover:text-slate-200">Blog</a></li>
              <li><a href="#" className="hover:text-slate-200">Careers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-200 mb-3">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-slate-200">Features</a></li>
              <li><a href="#" className="hover:text-slate-200">Pricing</a></li>
              <li><a href="#" className="hover:text-slate-200">Security</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-200 mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-slate-200">Privacy</a></li>
              <li><a href="#" className="hover:text-slate-200">Terms</a></li>
              <li><a href="#" className="hover:text-slate-200">Cookies</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-200 mb-3">Follow</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-slate-200">Twitter</a></li>
              <li><a href="#" className="hover:text-slate-200">LinkedIn</a></li>
              <li><a href="#" className="hover:text-slate-200">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-8 text-center">
          <p>&copy; 2026 Alexanda Martinz Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
