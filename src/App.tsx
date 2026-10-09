import React, { useState, useMemo } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { MainSearchBar } from './components/MainSearchBar';
import { CategoryBar } from './components/CategoryBar';
import { AdBanner } from './components/AdBanner';
import { VideoCard } from './components/VideoCard';
import { SidebarDrawer } from './components/SidebarDrawer';
import { SettingsModal } from './components/SettingsModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { VipModal } from './components/VipModal';
import { AuthModal } from './components/AuthModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { AdminProfileModal } from './components/AdminProfileModal';
import { GuestLoginPromptModal } from './components/GuestLoginPromptModal';
import { UserGuideModal } from './components/UserGuideModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AgeGateModal } from './components/AgeGateModal';
import { BodyAdsInjector } from './components/BodyAdsInjector';
import { Flame, ArrowDown, Sparkles, AlertTriangle } from 'lucide-react';

export default function App() {
  const {
    videos,
    searchQuery,
    selectedCategory,
    pricingFilter,
    siteSettings,
    toastMessage,
    isNightMode,
    isFullDisplay,
    setIsVipModalOpen,
    t,
  } = useApp();

  const [visibleCount, setVisibleCount] = useState(30);

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      // Category filter
      if (selectedCategory !== 'all' && video.category !== selectedCategory) {
        return false;
      }
      // Pricing filter
      if (pricingFilter === 'free' && video.isVip) {
        return false;
      }
      if (pricingFilter === 'vip' && !video.isVip) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = video.title.toLowerCase().includes(query);
        const matchesCategory = video.category.toLowerCase().includes(query);
        const matchesTags = video.tags.some((t) => t.toLowerCase().includes(query));
        const matchesAuthor = video.author.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCategory && !matchesTags && !matchesAuthor) {
          return false;
        }
      }
      return true;
    });
  }, [videos, selectedCategory, pricingFilter, searchQuery]);

  const displayedVideos = filteredVideos.slice(0, visibleCount);
  const hasMore = visibleCount < filteredVideos.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 15);
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors selection:bg-[#ff2442] selection:text-white relative ${
        isNightMode ? 'bg-[#0b0c10] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      {/* 18+ Age Gate Modal */}
      <AgeGateModal />

      {/* Top Notice Bar */}
      {siteSettings.siteNotice && (
        <div className="bg-gradient-to-r from-red-950 via-amber-950/90 to-red-950 text-amber-200 text-xs py-1.5 px-4 text-center border-b border-red-900/40 font-medium flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{siteSettings.siteNotice}</span>
          <button
            onClick={() => setIsVipModalOpen(true)}
            className="underline font-bold text-white hover:text-amber-300 ml-1 cursor-pointer"
          >
            {t('vipPass')}
          </button>
        </div>
      )}

      {/* Header Bar */}
      <Header />

      {/* Main Search Bar (Placed directly above categories/tags, stretching left to right) */}
      <MainSearchBar />

      {/* Category Horizontal Filter Bar (Tags) */}
      <CategoryBar />

      {/* 728x90 Header Ad Banner */}
      <AdBanner slot="top" />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h2 className="text-base sm:text-lg font-extrabold capitalize">
              {searchQuery
                ? `${t('resultsFor')} "${searchQuery}"`
                : selectedCategory === 'all'
                ? t('mostPopularTube')
                : `${selectedCategory.replace('-', ' ')} Videos`}
            </h2>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              ({filteredVideos.length})
            </span>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-3">
            <span className="hidden sm:inline">Active Filter: {pricingFilter.toUpperCase()}</span>
          </div>
        </div>

        {/* Video Grid (Adapts to Full vs 2-Column mode) */}
        {filteredVideos.length === 0 ? (
          <div
            className={`p-12 text-center rounded-2xl border space-y-3 ${
              isNightMode ? 'bg-[#12141e] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-800/40 flex items-center justify-center text-slate-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold">{t('noVideosFound')}</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No videos matching your current filter criteria.
            </p>
          </div>
        ) : (
          <div
            className={`grid gap-2.5 sm:gap-4 ${
              isFullDisplay
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
            }`}
          >
            {displayedVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}

        {/* Show More Button (+15) */}
        {hasMore && (
          <div className="mt-8 mb-4 text-center">
            <button
              onClick={handleShowMore}
              className={`px-8 py-3 border rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition shadow-lg inline-flex items-center gap-2 cursor-pointer ${
                isNightMode
                  ? 'bg-[#181a28] hover:bg-slate-800 text-slate-200 hover:text-white border-slate-700/80 hover:border-amber-400/50'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-xs'
              }`}
            >
              <span>{t('showMore')}</span>
              <ArrowDown className="w-4 h-4 text-amber-500" />
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className={`mt-12 py-8 px-4 sm:px-6 text-xs border-t transition-colors ${
          isNightMode
            ? 'bg-[#08090d] border-slate-800/80 text-slate-400'
            : 'bg-slate-100 border-slate-200 text-slate-600'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-lg font-black text-[#facc15] font-sans">
                {siteSettings.siteLogoText || 'FUQ'}
              </span>
              <span className="text-[10px] text-red-500 font-bold bg-red-950/80 px-1 py-0.5 rounded">
                18+ ADULT TUBE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              All videos and embeds are hosted by third parties. We do not store any copyrighted media on our servers.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsVipModalOpen(true)}
              className="hover:text-amber-500 font-bold transition cursor-pointer"
            >
              VIP Membership
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-center mt-6 pt-4 border-t border-slate-800/40 text-[11px] text-slate-400">
          © 2026 {siteSettings.siteTitle || 'MMSHUB.XYZ'}. Powered by High-Performance Iframe Embed Engine.
        </div>
      </footer>

      {/* Slide Drawer Navigation */}
      <SidebarDrawer />

      {/* Settings Modal */}
      <SettingsModal />

      {/* Video Player Modal */}
      <VideoPlayerModal />

      {/* VIP Upgrade & Mobile Banking Payment Modal */}
      <VipModal />

      {/* User Login & Account Modal */}
      <AuthModal />

      {/* Live Member Leaderboard / Ranking Modal */}
      <LeaderboardModal />

      {/* Admin Moon Profile Modal */}
      <AdminProfileModal />

      {/* Guest Login Reminder Prompt */}
      <GuestLoginPromptModal />

      {/* User & Deployment Guide Modal */}
      <UserGuideModal />

      {/* Admin Dashboard */}
      <AdminDashboard />

      {/* Popunder & Social Bar Ads Injector (Injected above </body> tag) */}
      <BodyAdsInjector />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-70 bg-[#161928] border border-amber-500/40 text-slate-100 text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-200">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
