import React from 'react';
import { useApp } from '../context/AppContext';

export const CategoryBar: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory, isNightMode } = useApp();

  return (
    <div
      className={`w-full py-2.5 px-3 sm:px-6 border-b transition-colors ${
        isNightMode ? 'bg-[#0b0c10] border-slate-800/60' : 'bg-slate-100 border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-1 text-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg whitespace-nowrap transition shrink-0 font-medium cursor-pointer ${
                  isSelected
                    ? 'bg-[#facc15] text-slate-950 font-bold shadow-md shadow-yellow-500/10'
                    : isNightMode
                    ? 'bg-[#151822] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                    : 'bg-white text-slate-700 hover:text-black hover:bg-slate-200 border border-slate-300 shadow-xs'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] tabular-nums font-semibold ${
                    isSelected
                      ? 'text-slate-900/80 font-bold'
                      : isNightMode
                      ? 'text-slate-400'
                      : 'text-slate-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
