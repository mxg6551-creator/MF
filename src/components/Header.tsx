import React, { useEffect } from 'react';
import { Menu, Settings, Crown, Trophy, User as UserIcon, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    siteSettings,
    setIsSidebarOpen,
    setIsSettingsModalOpen,
    setIsVipModalOpen,
    setIsAuthModalOpen,
    setIsLeaderboardOpen,
    setIsAdminOpen,
    currentUser,
    isAdminLoggedIn,
    isNightMode,
    t,
  } = useApp();

  // Secret admin shortcut: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsAdminOpen]);

  return (
    <header
      className={`sticky top-0 z-40 px-3 sm:px-6 py-2.5 border-b transition-colors ${
        isNightMode
          ? 'bg-[#0e1017]/95 backdrop-blur-md border-slate-800/80 text-white'
          : 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Hamburger & Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open Navigation Menu"
            className={`p-1.5 rounded-lg transition ${
              isNightMode
                ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                : 'text-slate-600 hover:text-black hover:bg-slate-100'
            }`}
          >
            <Menu className="w-6 h-6" />
          </button>

          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 select-none"
          >
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-[#facc15] font-sans drop-shadow-sm">
              {siteSettings.siteLogoText || 'FUQ'}
            </span>
            <span className="text-xs font-bold text-red-500 uppercase tracking-wider bg-red-950/60 border border-red-800/50 px-1 py-0.5 rounded">
              18+
            </span>
          </a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Live Leaderboard Button */}
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition shadow-xs cursor-pointer"
            title="Live Member Leaderboard"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{t('leaderboard')}</span>
            <span className="sm:hidden">Rank</span>
          </button>

          {/* VIP Upgrade Button */}
          <button
            onClick={() => setIsVipModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold text-amber-300 bg-gradient-to-r from-amber-600/30 to-yellow-500/20 border border-amber-500/40 hover:border-amber-400 hover:from-amber-600/40 transition shadow-sm cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('vipPass')}</span>
          </button>

          {/* Settings icon */}
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            aria-label="Display Settings"
            className={`p-2 rounded-lg transition cursor-pointer ${
              isNightMode
                ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                : 'text-slate-600 hover:text-black hover:bg-slate-100'
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Secret/Hidden Admin Indicator - ONLY visible if admin is logged in */}
          {isAdminLoggedIn && (
            <button
              onClick={() => setIsAdminOpen(true)}
              title="Admin Control Panel"
              className="p-2 rounded-lg text-amber-400 bg-amber-950/40 border border-amber-500/50 hover:bg-amber-900/40 transition cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5" />
            </button>
          )}

          {/* User Profile / Login */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className={`flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl transition cursor-pointer ${
              currentUser?.isVip
                ? 'bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-400/50 shadow-sm'
                : isNightMode
                ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                : 'text-slate-700 hover:text-black hover:bg-slate-100'
            }`}
          >
            <div className="relative shrink-0">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className={`w-7 h-7 rounded-full object-cover ${
                    currentUser.isVip ? 'border-2 border-amber-400 ring-2 ring-yellow-400/30' : 'border border-slate-700'
                  }`}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <UserIcon className="w-5 h-5" />
              )}
              {currentUser?.isVip && (
                <Crown className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 absolute -top-2 -right-1 drop-shadow animate-bounce" />
              )}
            </div>

            <div className="hidden lg:flex items-center gap-1 max-w-[110px] truncate">
              {currentUser?.isVip && (
                <Crown className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
              )}
              <span
                className={`text-xs truncate ${
                  currentUser?.isVip
                    ? 'font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-100 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] animate-pulse'
                    : 'font-medium'
                }`}
              >
                {currentUser ? currentUser.username : t('signIn')}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
