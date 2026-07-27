import React from 'react';
import { 
  Code, 
  Globe, 
  Cpu, 
  Tag, 
  Shirt, 
  FileText, 
  TrendingUp, 
  HeartPulse, 
  Megaphone, 
  Briefcase, 
  FileCheck, 
  Sparkles,
  Layers
} from 'lucide-react';

interface CategoryGridProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts
}) => {
  const categoryItems = [
    { name: 'All', icon: Layers, color: 'from-slate-700 to-slate-800' },
    { name: 'Web Applications', icon: Code, color: 'from-emerald-600 to-teal-700' },
    { name: 'Websites', icon: Globe, color: 'from-blue-600 to-indigo-700' },
    { name: 'AI Models & APIs', icon: Cpu, color: 'from-purple-600 to-indigo-700' },
    { name: 'Branding & Logos', icon: Tag, color: 'from-pink-600 to-rose-700' },
    { name: 'Fashion Specs', icon: Shirt, color: 'from-amber-600 to-orange-700' },
    { name: 'Research Reports', icon: FileText, color: 'from-cyan-600 to-blue-700' },
    { name: 'Economics Reports', icon: TrendingUp, color: 'from-green-600 to-emerald-700' },
    { name: 'Health Solutions', icon: HeartPulse, color: 'from-rose-600 to-red-700' },
    { name: 'Marketing Assets', icon: Megaphone, color: 'from-yellow-600 to-amber-700' },
    { name: 'Consulting Outputs', icon: Briefcase, color: 'from-violet-600 to-purple-700' },
    { name: 'Documents', icon: FileCheck, color: 'from-slate-600 to-slate-700' },
    { name: 'Custom AI Services', icon: Sparkles, color: 'from-amber-500 to-emerald-600' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
          <span>Browse Marketplace Categories</span>
        </h3>
        <span className="text-[11px] text-slate-500">12 Specialized Digital Offerings</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {categoryItems.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedCategory === item.name;
          const count = categoryCounts[item.name] || 0;

          return (
            <button
              key={item.name}
              onClick={() => onSelectCategory(item.name)}
              className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-2 group relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow`}>
                  <Icon className="w-4 h-4" />
                </div>

                {item.name !== 'All' && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {count}
                  </span>
                )}
              </div>

              <div>
                <p className={`text-xs font-bold truncate ${isSelected ? 'text-emerald-400' : 'text-slate-200 group-hover:text-white'}`}>
                  {item.name}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
