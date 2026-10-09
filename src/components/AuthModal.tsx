import React, { useState } from 'react';
import {
  X,
  User as UserIcon,
  Lock,
  Crown,
  Bookmark,
  Heart,
  LogOut,
  Upload,
  Calendar,
  Sparkles,
  History,
  Clock,
  Play,
  ThumbsUp,
  Eye,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ADULT_STAR_AVATARS } from '../services/initialData';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    registerOrLoginUser,
    logoutUser,
    changeUsername,
    changePassword,
    changeAvatar,
    videos,
    setActiveVideo,
    setIsVipModalOpen,
    isNightMode,
    showToast,
  } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Profile management edit states
  const [profileView, setProfileView] = useState<'info' | 'history' | 'saved' | 'liked' | 'edit'>('info');
  const [newUsername, setNewUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleManualAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      showToast('Please enter a username');
      return;
    }
    registerOrLoginUser(usernameInput.trim(), passwordInput.trim());
  };

  const handleGoogleLogin = () => {
    registerOrLoginUser('Md Jihad Hossain', 'google_auth_demo');
    showToast('Signed in with Google (mdjihadh334@gmail.com)');
  };

  // Gallery photo upload for profile avatar
  const handleGalleryAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = changeAvatar(reader.result as string);
        showToast(res.message);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPresetAvatar = (url: string) => {
    const res = changeAvatar(url);
    showToast(res.message);
  };

  const handleSaveUsername = (e: React.FormEvent) => {
    e.preventDefault();
    const res = changeUsername(newUsername);
    showToast(res.message);
    if (res.success) {
      setNewUsername('');
    }
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match!');
      return;
    }
    const res = changePassword(oldPassword, newPassword);
    showToast(res.message);
    if (res.success) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const savedVideos = videos.filter((v) => currentUser?.savedVideoIds.includes(v.id));
  const likedVideos = videos.filter((v) => currentUser?.likedVideoIds.includes(v.id));
  const historyVideos = (currentUser?.watchHistory || [])
    .map((h) => {
      const vid = videos.find((v) => v.id === h.videoId);
      return vid ? { ...vid, watchedAt: h.watchedAt } : null;
    })
    .filter(Boolean) as (typeof videos[0] & { watchedAt: string })[];

  const formatTimeSpent = (totalSeconds: number = 0) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className={`relative w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden my-auto transition-colors ${
          isNightMode
            ? 'bg-[#11131c] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 border-b ${
            isNightMode ? 'bg-[#161925] border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <h3 className="text-sm sm:text-base font-bold flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-[#facc15]" />
            {currentUser ? 'User Account & Profile' : authMode === 'login' ? 'Member Login' : 'Create New Account'}
          </h3>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            aria-label="Close authentication modal"
            className={`p-1 rounded-lg cursor-pointer ${
              isNightMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-200'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {currentUser ? (
          <div className="p-4 sm:p-5 space-y-4">
            {/* User Info Card */}
            <div
              className={`flex items-center gap-3.5 p-3 rounded-xl border ${
                isNightMode ? 'bg-[#171a27] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-14 h-14 rounded-full border-2 border-amber-400 object-cover shadow-sm"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm truncate ${
                      currentUser.isVip
                        ? 'font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-100 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] animate-pulse'
                        : 'font-bold'
                    }`}
                  >
                    {currentUser.username}
                  </span>
                  {currentUser.isVip ? (
                    <span className="text-[10px] font-black text-amber-300 bg-amber-950 border border-amber-500/50 px-1.5 py-0.2 rounded-full flex items-center gap-1 shadow-sm">
                      <Crown className="w-2.5 h-2.5 fill-amber-300 animate-bounce" /> VIP
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                      Free User
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 truncate">{currentUser.email}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Last active: {currentUser.lastLoginAt}
                </div>
              </div>
            </div>

            {/* Profile Tab Navigation (5 Tabs including Watch History) */}
            <div
              className={`grid grid-cols-5 gap-1 p-1 rounded-xl border text-xs ${
                isNightMode ? 'bg-[#171926] border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <button
                onClick={() => setProfileView('info')}
                className={`py-1.5 rounded-lg font-medium transition text-center cursor-pointer ${
                  profileView === 'info'
                    ? 'bg-amber-500 text-black font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setProfileView('history')}
                className={`py-1.5 rounded-lg font-medium transition flex items-center justify-center gap-1 cursor-pointer ${
                  profileView === 'history'
                    ? 'bg-amber-500 text-black font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <History className="w-3 h-3" />
                <span className="hidden sm:inline">History</span>
                <span className="text-[10px]">({historyVideos.length})</span>
              </button>
              <button
                onClick={() => setProfileView('saved')}
                className={`py-1.5 rounded-lg font-medium transition flex items-center justify-center gap-1 cursor-pointer ${
                  profileView === 'saved'
                    ? 'bg-amber-500 text-black font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bookmark className="w-3 h-3" />
                <span className="hidden sm:inline">Saved</span>
                <span className="text-[10px]">({savedVideos.length})</span>
              </button>
              <button
                onClick={() => setProfileView('liked')}
                className={`py-1.5 rounded-lg font-medium transition flex items-center justify-center gap-1 cursor-pointer ${
                  profileView === 'liked'
                    ? 'bg-amber-500 text-black font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Heart className="w-3 h-3" />
                <span className="hidden sm:inline">Liked</span>
                <span className="text-[10px]">({likedVideos.length})</span>
              </button>
              <button
                onClick={() => setProfileView('edit')}
                className={`py-1.5 rounded-lg font-medium transition text-center cursor-pointer ${
                  profileView === 'edit'
                    ? 'bg-amber-500 text-black font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Edit
              </button>
            </div>

            {/* TAB 1: OVERVIEW & REAL-TIME STATS */}
            {profileView === 'info' && (
              <div className="space-y-3">
                {/* 4 Stat Counters Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div
                    className={`p-2.5 rounded-xl border ${
                      isNightMode ? 'bg-[#151722] border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>Time on Site</span>
                    </div>
                    <div className="text-sm font-black text-amber-400 mt-1 tabular-nums">
                      {formatTimeSpent(currentUser.timeSpentSeconds)}
                    </div>
                  </div>

                  <div
                    className={`p-2.5 rounded-xl border ${
                      isNightMode ? 'bg-[#151722] border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Eye className="w-3 h-3 text-sky-400" />
                      <span>Videos Watched</span>
                    </div>
                    <div className="text-sm font-black text-sky-400 mt-1 tabular-nums">
                      {currentUser.videosWatchedCount || 0} videos
                    </div>
                  </div>

                  <div
                    className={`p-2.5 rounded-xl border ${
                      isNightMode ? 'bg-[#151722] border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="text-slate-400 text-[11px] flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3 text-rose-400" />
                      <span>Profile Likes</span>
                    </div>
                    <div className="text-sm font-black text-rose-400 mt-1 tabular-nums">
                      {currentUser.likesReceivedCount || 0} likes
                    </div>
                  </div>

                  <div
                    className={`p-2.5 rounded-xl border ${
                      isNightMode ? 'bg-[#151722] border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-emerald-400" />
                      <span>Member Since</span>
                    </div>
                    <div className="text-xs font-bold text-slate-200 mt-1 truncate">
                      {currentUser.createdAt?.split(',')[0] || '2026'}
                    </div>
                  </div>
                </div>

                {/* Membership & Saved Details */}
                <div
                  className={`p-3 rounded-xl border text-xs space-y-2 ${
                    isNightMode ? 'bg-[#151722] border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Membership Tier:</span>
                    <span
                      className={`font-black ${
                        currentUser.isVip
                          ? 'text-amber-400 flex items-center gap-1'
                          : 'text-slate-300'
                      }`}
                    >
                      {currentUser.isVip && <Crown className="w-3 h-3 fill-amber-400" />}
                      {currentUser.isVip ? 'VIP Premium Active (Uncapped)' : 'Standard Free'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Saved in Playlist:</span>
                    <span className="font-semibold">{savedVideos.length} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Liked Videos:</span>
                    <span className="font-semibold">{likedVideos.length} items</span>
                  </div>
                </div>

                {/* Last Watched Video Quick Resume Card (if any) */}
                {historyVideos.length > 0 && (
                  <div
                    onClick={() => {
                      setActiveVideo(historyVideos[0]);
                      setIsAuthModalOpen(false);
                    }}
                    className="cursor-pointer p-2.5 rounded-xl bg-gradient-to-r from-[#171a29] to-[#1e2238] border border-amber-500/30 hover:border-amber-400 transition flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={historyVideos[0].thumbnailUrl}
                        alt={historyVideos[0].title}
                        className="w-14 h-9 object-cover rounded-md border border-slate-700 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-amber-400 block uppercase">
                          Last Watched Video:
                        </span>
                        <h4 className="text-xs font-semibold text-slate-100 truncate">
                          {historyVideos[0].title}
                        </h4>
                      </div>
                    </div>
                    <button className="px-2.5 py-1 rounded-lg bg-amber-500 text-black font-extrabold text-[11px] shrink-0 flex items-center gap-1 cursor-pointer">
                      <Play className="w-3 h-3 fill-black" />
                      <span>Resume</span>
                    </button>
                  </div>
                )}

                {!currentUser.isVip && (
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(false);
                      setIsVipModalOpen(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow cursor-pointer"
                  >
                    <Crown className="w-4 h-4 fill-black" />
                    Upgrade to VIP Pass (৳ 199)
                  </button>
                )}

                <button
                  onClick={logoutUser}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}

            {/* TAB 2: WATCH HISTORY (Top 10 recently watched videos) */}
            {profileView === 'history' && (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                <div className="flex items-center justify-between text-xs px-1 text-slate-400">
                  <span className="font-bold flex items-center gap-1 text-amber-500">
                    <History className="w-3.5 h-3.5" />
                    Watch History (Top 10)
                  </span>
                  <span className="text-[11px] font-mono">{historyVideos.length}/10</span>
                </div>

                {historyVideos.length === 0 ? (
                  <div className="text-center py-10 space-y-2 text-slate-500">
                    <History className="w-8 h-8 mx-auto opacity-40 text-amber-400" />
                    <p className="text-xs font-semibold">No watched videos yet.</p>
                    <p className="text-[11px] text-slate-400">
                      Videos you watch will automatically be recorded here (up to 10 latest).
                    </p>
                  </div>
                ) : (
                  historyVideos.map((vid, idx) => (
                    <div
                      key={vid.id}
                      onClick={() => {
                        setActiveVideo(vid);
                        setIsAuthModalOpen(false);
                      }}
                      className="cursor-pointer flex items-center gap-3 p-2 rounded-xl bg-[#151724] hover:bg-slate-800 transition border border-slate-800 group"
                    >
                      <div className="relative w-20 h-13 rounded-lg overflow-hidden shrink-0 border border-slate-700/60">
                        <img
                          src={vid.thumbnailUrl}
                          alt={vid.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-1 right-1 bg-black/85 text-[10px] text-white px-1 rounded tabular-nums font-semibold">
                          {vid.duration}
                        </div>
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <Play className="w-4 h-4 text-[#facc15] fill-[#facc15]" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-amber-500">#{idx + 1}</span>
                          <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-amber-400 transition">
                            {vid.title}
                          </h4>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                          <span className="capitalize">{vid.category}</span>
                          <span>•</span>
                          <span className="text-slate-300 font-medium">{vid.watchedAt}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: EDIT PROFILE (Username 30-day constraint & Photo 7-day constraint) */}
            {profileView === 'edit' && (
              <div className="space-y-4 text-xs max-h-72 overflow-y-auto pr-1">
                {/* 1. Change Avatar Section */}
                <div
                  className={`p-3 rounded-xl border space-y-2.5 ${
                    isNightMode ? 'bg-[#151724] border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-500 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Profile Avatar (Model / Gallery)
                    </span>
                    <span className="text-[10px] text-slate-400">1x every 7 days</span>
                  </div>

                  {/* Gallery Upload Button */}
                  <label className="cursor-pointer w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center justify-center gap-2 font-bold transition">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload from Phone Gallery</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleGalleryAvatarUpload}
                      className="hidden"
                    />
                  </label>

                  {/* 15 Adult Star Preset Avatars Selector */}
                  <div className="pt-1">
                    <span className="text-[11px] text-slate-400 block mb-1">
                      Or pick from Top Stars Presets:
                    </span>
                    <div className="grid grid-cols-5 gap-1.5 max-h-24 overflow-y-auto p-1 bg-black/40 rounded-lg">
                      {ADULT_STAR_AVATARS.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt="Preset"
                          onClick={() => handleSelectPresetAvatar(url)}
                          className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-amber-400 transition"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Change Username Section (30 days constraint) */}
                <form
                  onSubmit={handleSaveUsername}
                  className={`p-3 rounded-xl border space-y-2 ${
                    isNightMode ? 'bg-[#151724] border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-500">Change Username</span>
                    <span className="text-[10px] text-slate-400">1x every 30 days</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter new username"
                    className={`w-full p-2 rounded-lg border text-xs focus:outline-none focus:border-amber-400 ${
                      isNightMode
                        ? 'bg-[#1a1d2d] text-white border-slate-700'
                        : 'bg-white text-slate-900 border-slate-300'
                    }`}
                  />
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg uppercase tracking-wider cursor-pointer"
                  >
                    Update Username
                  </button>
                </form>

                {/* 3. Change Password Section (requires old password) */}
                <form
                  onSubmit={handleSavePassword}
                  className={`p-3 rounded-xl border space-y-2 ${
                    isNightMode ? 'bg-[#151724] border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="font-bold text-amber-500 block">Change Password</span>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Current Password"
                    className={`w-full p-2 rounded-lg border text-xs focus:outline-none focus:border-amber-400 ${
                      isNightMode
                        ? 'bg-[#1a1d2d] text-white border-slate-700'
                        : 'bg-white text-slate-900 border-slate-300'
                    }`}
                  />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className={`w-full p-2 rounded-lg border text-xs focus:outline-none focus:border-amber-400 ${
                      isNightMode
                        ? 'bg-[#1a1d2d] text-white border-slate-700'
                        : 'bg-white text-slate-900 border-slate-300'
                    }`}
                  />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    className={`w-full p-2 rounded-lg border text-xs focus:outline-none focus:border-amber-400 ${
                      isNightMode
                        ? 'bg-[#1a1d2d] text-white border-slate-700'
                        : 'bg-white text-slate-900 border-slate-300'
                    }`}
                  />
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg uppercase tracking-wider cursor-pointer"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            )}

            {/* TAB: SAVED */}
            {profileView === 'saved' && (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {savedVideos.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-500">No saved videos in playlist.</p>
                ) : (
                  savedVideos.map((vid) => (
                    <div
                      key={vid.id}
                      onClick={() => {
                        setActiveVideo(vid);
                        setIsAuthModalOpen(false);
                      }}
                      className="cursor-pointer flex items-center gap-2.5 p-2 rounded-lg bg-[#161824] hover:bg-slate-800 transition border border-slate-800"
                    >
                      <img
                        src={vid.thumbnailUrl}
                        alt={vid.title}
                        className="w-16 h-10 object-cover rounded"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-200 truncate">{vid.title}</div>
                        <div className="text-[10px] text-slate-400">{vid.duration}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: LIKED */}
            {profileView === 'liked' && (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {likedVideos.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-500">No liked videos yet.</p>
                ) : (
                  likedVideos.map((vid) => (
                    <div
                      key={vid.id}
                      onClick={() => {
                        setActiveVideo(vid);
                        setIsAuthModalOpen(false);
                      }}
                      className="cursor-pointer flex items-center gap-2.5 p-2 rounded-lg bg-[#161824] hover:bg-slate-800 transition border border-slate-800"
                    >
                      <img
                        src={vid.thumbnailUrl}
                        alt={vid.title}
                        className="w-16 h-10 object-cover rounded"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-200 truncate">{vid.title}</div>
                        <div className="text-[10px] text-slate-400">{vid.duration}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          /* NOT LOGGED IN: Form */
          <div className="p-5 space-y-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm shadow transition cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-700 w-full" />
              <span className="px-3 text-[11px] text-slate-500 uppercase tracking-wider">
                Or with username
              </span>
            </div>

            <form onSubmit={handleManualAuth} className="space-y-3">
              <div>
                <label className="text-xs font-semibold block mb-1">Username</label>
                <div className="relative flex items-center">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Enter your username"
                    className={`w-full text-xs sm:text-sm rounded-lg pl-9 pr-3 py-2 border focus:outline-none focus:border-[#facc15] ${
                      isNightMode
                        ? 'bg-[#181a28] text-slate-100 border-slate-700'
                        : 'bg-slate-50 text-slate-900 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Password</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full text-xs sm:text-sm rounded-lg pl-9 pr-3 py-2 border focus:outline-none focus:border-[#facc15] ${
                      isNightMode
                        ? 'bg-[#181a28] text-slate-100 border-slate-700'
                        : 'bg-slate-50 text-slate-900 border-slate-300'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#facc15] hover:bg-[#eab308] text-black font-extrabold text-xs sm:text-sm rounded-lg uppercase tracking-wider transition shadow cursor-pointer"
              >
                {authMode === 'login' ? 'Sign In / Register' : 'Register Now'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
