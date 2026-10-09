import React from 'react';
import { X, Star, Heart, Video as VideoIcon, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminProfileModal: React.FC = () => {
  const {
    isAdminMoonProfileOpen,
    setIsAdminMoonProfileOpen,
    adminMoonChannel,
    isSubscribedToAdminMoon,
    subscribeToAdminMoon,
    likeAdminMoonChannel,
    videos,
    setActiveVideo,
    isNightMode,
  } = useApp();

  if (!isAdminMoonProfileOpen) return null;

  const adminVideos = videos.filter((v) => v.author.toLowerCase().includes('admin'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        className={`relative w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col transition-colors ${
          isNightMode
            ? 'bg-[#11131e] border-amber-500/40 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Banner */}
        <div className="relative h-28 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 p-4 flex justify-end">
          <button
            onClick={() => setIsAdminMoonProfileOpen(false)}
            aria-label="Close admin profile"
            className="p-1 rounded-full bg-black/40 text-white hover:bg-black/70 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="p-4 sm:p-6 -mt-12 space-y-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-3 text-center sm:text-left">
            <div className="relative">
              {/* Star on avatar head */}
              <div className="w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center absolute -top-2 -right-1 shadow-md border-2 border-white ring-2 ring-amber-400/50">
                <Star className="w-3.5 h-3.5 fill-black stroke-black" />
              </div>
              <img
                src={adminMoonChannel.avatar}
                alt={adminMoonChannel.name}
                className="w-20 h-20 rounded-full border-4 border-[#11131e] object-cover shadow-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={subscribeToAdminMoon}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition shadow cursor-pointer ${
                  isSubscribedToAdminMoon
                    ? 'bg-slate-700 text-slate-200'
                    : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white'
                }`}
              >
                {isSubscribedToAdminMoon ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                  </>
                )}
              </button>
              <button
                onClick={likeAdminMoonChannel}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1 transition cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 fill-rose-400" />
                <span>{adminMoonChannel.likesCount}</span>
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-1.5">
              <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 animate-pulse font-sans">
                {adminMoonChannel.name}
              </h3>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{adminMoonChannel.bio}</p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-black/30 border border-slate-800 text-center text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Subscribers</span>
              <span className="font-extrabold text-white text-sm tabular-nums">
                {(adminMoonChannel.subscribersCount / 1000).toFixed(1)}K
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Channel Likes</span>
              <span className="font-extrabold text-rose-400 text-sm tabular-nums">
                {adminMoonChannel.likesCount}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Total Uploads</span>
              <span className="font-extrabold text-amber-400 text-sm tabular-nums">
                {adminMoonChannel.totalVideosCount} videos
              </span>
            </div>
          </div>

          {/* Uploaded Videos List */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <VideoIcon className="w-3.5 h-3.5 text-amber-400" />
              Latest Uploads by Admin Moon ({adminVideos.length})
            </h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {adminVideos.map((v) => (
                <div
                  key={v.id}
                  onClick={() => {
                    setActiveVideo(v);
                    setIsAdminMoonProfileOpen(false);
                  }}
                  className="cursor-pointer flex items-center gap-2.5 p-2 rounded-lg bg-[#181a28] hover:bg-slate-800 transition border border-slate-800"
                >
                  <img
                    src={v.thumbnailUrl}
                    alt={v.title}
                    className="w-16 h-10 object-cover rounded shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-slate-100 truncate">{v.title}</div>
                    <div className="text-[10px] text-slate-400">{v.duration} • {v.views} views</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
