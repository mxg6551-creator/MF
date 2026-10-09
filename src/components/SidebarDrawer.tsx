import React, { useState } from 'react';
import {
  X,
  Video as VideoIcon,
  Flame,
  Clock,
  Star,
  Layers,
  ChevronDown,
  ChevronUp,
  Crown,
  Heart,
  Bookmark,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SidebarDrawer: React.FC = () => {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    categories,
    selectedCategory,
    setSelectedCategory,
    setIsVipModalOpen,
    setIsAuthModalOpen,
    siteSettings,
    customSidebarLinks,
    isNightMode,
    t,
  } = useApp();

  const [isVideosOpen, setIsVideosOpen] = useState(true);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);

  if (!isSidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`relative w-72 max-w-[85vw] flex flex-col h-full shadow-2xl z-10 overflow-y-auto border-r ${
          isNightMode
            ? 'bg-[#0d0f15] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Drawer Header */}
        <div
          className={`flex items-center justify-between p-4 border-b ${
            isNightMode ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-[#facc15] font-sans">
              {siteSettings.siteLogoText || 'FUQ'}
            </span>
            <span className="text-[10px] font-bold text-red-500 bg-red-950/80 px-1 py-0.5 rounded">
              18+ TUBE
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close Navigation"
            className={`p-1 rounded-lg cursor-pointer ${
              isNightMode
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-500 hover:text-black hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-3 space-y-4 flex-1">
          {/* VIP Upgrade Banner */}
          <div
            onClick={() => {
              setIsSidebarOpen(false);
              setIsVipModalOpen(true);
            }}
            className="cursor-pointer p-3 rounded-xl bg-gradient-to-r from-amber-950/40 via-yellow-950/30 to-amber-900/20 border border-amber-500/40 hover:border-amber-400 transition"
          >
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-xs font-bold text-amber-300">{t('unlockVipClub')}</div>
            </div>
            <p className="text-[11px] text-amber-200/80 mt-1 leading-relaxed">
              {t('vipClubDesc')}
            </p>
          </div>

          {/* Videos Group */}
          <div>
            <button
              onClick={() => setIsVideosOpen(!isVideosOpen)}
              className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <VideoIcon className="w-4 h-4 text-[#facc15]" />
                {t('allVideos')}
              </span>
              {isVideosOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {isVideosOpen && (
              <div
                className={`mt-1 space-y-0.5 pl-3 border-l ml-3 ${
                  isNightMode ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : isNightMode
                      ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  {t('popularVideos')}
                </button>

                <button
                  onClick={() => {
                    setSelectedCategory('viral-mms');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                    selectedCategory === 'viral-mms'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : isNightMode
                      ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-sky-500" />
                  {t('newViralVideos')}
                </button>

                <button
                  onClick={() => {
                    setSelectedCategory('hd');
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                    selectedCategory === 'hd'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : isNightMode
                      ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  {t('topRatedVideos')}
                </button>
              </div>
            )}
          </div>

          {/* Categories Accordion */}
          <div>
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-red-500" />
                Categories
              </span>
              {isCategoriesOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {isCategoriesOpen && (
              <div
                className={`mt-1 space-y-0.5 max-h-60 overflow-y-auto pl-3 border-l ml-3 pr-1 ${
                  isNightMode ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      selectedCategory === cat.slug
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : isNightMode
                        ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[10px] text-slate-400 tabular-nums">
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Playlist & Saved Links */}
          <div
            className={`pt-2 border-t space-y-1 ${
              isNightMode ? 'border-slate-800' : 'border-slate-200'
            }`}
          >
            <button
              onClick={() => {
                setIsSidebarOpen(false);
                setIsAuthModalOpen(true);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                isNightMode
                  ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-4 h-4 text-emerald-500" />
              {t('savedPlaylists')}
            </button>
            <button
              onClick={() => {
                setIsSidebarOpen(false);
                setIsAuthModalOpen(true);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                isNightMode
                  ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-500" />
              {t('likedVideos')}
            </button>
          </div>

          {/* Custom Channels / Links (Configured by Admin) */}
          {customSidebarLinks.length > 0 && (
            <div
              className={`pt-2 border-t space-y-1.5 ${
                isNightMode ? 'border-slate-800' : 'border-slate-200'
              }`}
            >
              <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {t('customLinks')}
              </div>
              {customSidebarLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target={link.openNewTab ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    isNightMode
                      ? 'text-slate-300 hover:bg-slate-800/60 hover:text-amber-400'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-amber-600'
                  }`}
                >
                  <span className="truncate">{link.title}</span>
                  <div className="flex items-center gap-1">
                    {link.badge && (
                      <span className="text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1 rounded">
                        {link.badge}
                      </span>
                    )}
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
