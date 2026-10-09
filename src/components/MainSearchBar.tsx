import React from 'react';
import { Search, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MainSearchBar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    videos,
    siteSettings,
    setIsAdminOpen,
    isNightMode,
    t,
  } = useApp();

  const handleSearchChange = (val: string) => {
    // Secret access code: /lubnaseyes opens admin panel!
    const secretCode = siteSettings.secretAdminUrlCode || '/lubnaseyes';
    if (val.trim().toLowerCase() === secretCode.toLowerCase()) {
      setSearchQuery('');
      setIsAdminOpen(true);
      return;
    }
    setSearchQuery(val);
  };

  const placeholderText =
    siteSettings.searchPlaceholderCustom ||
    (t('searchPlaceholder').includes('ভিডিও')
      ? `${videos.length}টি ভিডিও সার্চ করুন...`
      : `Search ${videos.length} videos in database...`);

  return (
    <div
      className={`w-full pt-3 pb-2 px-3 sm:px-6 transition-colors border-b ${
        isNightMode ? 'bg-[#0b0c10] border-slate-800/40' : 'bg-[#f8fafc] border-slate-200/60'
      }`}
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="relative flex items-center w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={placeholderText}
            className={`w-full text-xs sm:text-sm rounded-xl pl-10 pr-10 py-2.5 sm:py-3 border shadow-xs transition focus:outline-none focus:ring-2 focus:ring-[#facc15] ${
              isNightMode
                ? 'bg-[#141724] text-slate-100 placeholder-slate-400 border-slate-700/80 focus:border-[#facc15]'
                : 'bg-white text-slate-900 placeholder-slate-500 border-slate-300 focus:border-amber-500 shadow-sm'
            }`}
          />
          <Search className="w-5 h-5 text-amber-500 absolute left-3.5 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-3.5 p-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
