import React, { useState } from 'react';
import { Eye, ThumbsUp, Crown, Play, Lock, Film } from 'lucide-react';
import { Video } from '../types';
import { useApp } from '../context/AppContext';
import { getEffectiveThumbnail } from '../services/videoUtils';

interface VideoCardProps {
  video: Video;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const {
    setActiveVideo,
    incrementVideoView,
    recordVideoWatch,
    currentUser,
    setIsVipModalOpen,
    isNightMode,
    t,
  } = useApp();

  const [imageError, setImageError] = useState(false);
  const isLockedForUser = video.isVip && !currentUser?.isVip;
  const effectiveThumbnail = getEffectiveThumbnail(video);

  const handleCardClick = () => {
    incrementVideoView(video.id);
    recordVideoWatch(video.id);
    setActiveVideo(video);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group cursor-pointer flex flex-col rounded-xl overflow-hidden border transition duration-200 hover:shadow-xl hover:-translate-y-0.5 ${
        isNightMode
          ? 'bg-[#12141d] border-slate-800/80 hover:border-slate-700'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
      }`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full bg-[#151722] overflow-hidden">
        {effectiveThumbnail && !imageError ? (
          <img
            src={effectiveThumbnail}
            alt={video.title}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              isLockedForUser ? 'filter blur-[12px] brightness-75 scale-110' : ''
            }`}
            onError={() => setImageError(true)}
          />
        ) : (
          /* High-Quality Native Iframe Fallback Cover */
          <div className="absolute inset-0 bg-gradient-to-tr from-[#10121a] via-[#1a1d2e] to-[#251f33] flex flex-col items-center justify-center p-3 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-1 text-amber-400 group-hover:scale-110 transition shadow-lg">
              <Play className="w-6 h-6 fill-amber-400 ml-0.5" />
            </div>
            <span className="text-[10px] font-bold text-slate-300 line-clamp-1 max-w-[80%] uppercase tracking-wider">
              {video.title}
            </span>
            <span className="text-[9px] text-amber-400/90 font-mono mt-0.5">
              STREAM READY • {video.quality || 'HD'}
            </span>
          </div>
        )}

        {/* Enhanced Heavy Frosted Glass Blur Overlay for VIP Videos */}
        {isLockedForUser && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl vip-shimmer flex flex-col items-center justify-center p-3 text-center z-10">
            <div className="relative w-11 h-11 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mb-1.5 shadow-xl ring-4 ring-amber-500/20">
              <Lock className="w-5 h-5 text-amber-400" />
              <Crown className="w-3.5 h-3.5 text-yellow-300 absolute -top-1 -right-1 fill-yellow-300" />
            </div>
            <span className="text-xs font-black text-amber-300 tracking-wider drop-shadow-md uppercase">
              {t('vipExclusive')}
            </span>
            <span className="text-[10px] text-amber-200/80 mt-0.5 max-w-[160px] line-clamp-1">
              1080p Uncensored
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsVipModalOpen(true);
              }}
              className="mt-2 px-3.5 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-[10px] font-black rounded-full uppercase tracking-wider transition shadow-md cursor-pointer"
            >
              Unlock Now
            </button>
          </div>
        )}

        {/* Badges on Top */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 z-20">
          {video.quality && (
            <span className="bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/10 uppercase">
              {video.quality}
            </span>
          )}
          {video.isVip && (
            <span className="bg-gradient-to-r from-amber-600 to-yellow-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded shadow flex items-center gap-1">
              <Crown className="w-2.5 h-2.5 fill-black" />
              VIP
            </span>
          )}
        </div>

        <div className="absolute top-2 right-2 z-20">
          <span className="bg-red-600/95 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow">
            18+
          </span>
        </div>

        {/* Duration bottom-right badge */}
        <div className="absolute bottom-2 right-2 z-20">
          <span className="bg-black/80 backdrop-blur-xs text-slate-100 text-[11px] font-semibold px-1.5 py-0.5 rounded tabular-nums border border-white/10">
            {video.duration || '12:30'}
          </span>
        </div>

        {/* Play Icon Hover Overlay */}
        {!isLockedForUser && (
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
            <div className="w-12 h-12 rounded-full bg-[#facc15]/90 flex items-center justify-center text-black shadow-lg transform group-hover:scale-110 transition">
              <Play className="w-6 h-6 fill-black ml-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* Info Container */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3
            className={`text-xs sm:text-sm font-semibold line-clamp-2 leading-snug group-hover:text-[#facc15] transition ${
              isNightMode ? 'text-slate-100' : 'text-slate-900'
            }`}
          >
            {video.title}
          </h3>
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-400">
            <span className="font-medium truncate max-w-[120px]">{video.author}</span>
            <span aria-hidden="true">•</span>
            <span>{video.createdAt}</span>
          </div>
        </div>

        {/* Metrics Bar */}
        <div
          className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[11px] tabular-nums ${
            isNightMode ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'
          }`}
        >
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {video.views >= 1000000
                ? `${(video.views / 1000000).toFixed(1)}M`
                : video.views >= 1000
                ? `${(video.views / 1000).toFixed(0)}K`
                : video.views}{' '}
              {t('views')}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{video.likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
