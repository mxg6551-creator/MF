import React, { useState } from 'react';
import {
  X,
  Trophy,
  Crown,
  Clock,
  Eye,
  ThumbsUp,
  Search,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COUNTRIES } from '../services/initialData';

export const LeaderboardModal: React.FC = () => {
  const {
    isLeaderboardOpen,
    setIsLeaderboardOpen,
    users,
    likeUserProfile,
    isNightMode,
    t,
    showToast,
  } = useApp();

  const [searchMember, setSearchMember] = useState('');
  const [selectedUserForCard, setSelectedUserForCard] = useState<any>(null);

  if (!isLeaderboardOpen) return null;

  // Calculate live composite score for each user: (timeSpentMinutes * 2) + (videosWatched * 5) + (likesReceived * 10)
  const rankedUsers = [...users]
    .map((u) => {
      const minutes = Math.floor((u.timeSpentSeconds || 0) / 60);
      const score = minutes * 2 + (u.videosWatchedCount || 0) * 5 + (u.likesReceivedCount || 0) * 10;
      return { ...u, minutes, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);

  const getCountryFlag = (code: string) => {
    const c = COUNTRIES.find((item) => item.code === code);
    return c ? c.flag : '🌐';
  };

  const filteredMembers = rankedUsers.filter((u) =>
    u.username.toLowerCase().includes(searchMember.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        className={`relative w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col transition-colors ${
          isNightMode
            ? 'bg-[#10131d] border-amber-500/30 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 sm:p-5 border-b ${
            isNightMode
              ? 'bg-gradient-to-r from-amber-950/50 via-[#161a29] to-amber-950/40 border-slate-800'
              : 'bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-500 shadow-md">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-amber-500 flex items-center gap-2">
                {t('leaderboard')}
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Top 50 Members ranked by activity, watch time & likes.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLeaderboardOpen(false)}
            aria-label="Close leaderboard"
            className={`p-1.5 rounded-lg cursor-pointer ${
              isNightMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar inside leaderboard */}
        <div
          className={`p-3 border-b flex items-center gap-2 ${
            isNightMode ? 'bg-[#141724] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchMember}
              onChange={(e) => setSearchMember(e.target.value)}
              placeholder="Search member in leaderboard..."
              className={`w-full text-xs rounded-lg pl-9 pr-3 py-2 border focus:outline-none focus:border-amber-400 ${
                isNightMode
                  ? 'bg-[#1a1d2e] text-slate-100 placeholder-slate-500 border-slate-700'
                  : 'bg-white text-slate-900 placeholder-slate-400 border-slate-300'
              }`}
            />
          </div>
          <span className="text-[11px] text-slate-400 font-mono shrink-0">
            {filteredMembers.length} active
          </span>
        </div>

        {/* Ranking List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
          {filteredMembers.map((member, index) => {
            const isRank1 = index === 0;
            const isRank2 = index === 1;
            const isRank3 = index === 2;

            return (
              <div
                key={member.id}
                onClick={() => setSelectedUserForCard(member)}
                className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between gap-3 transition transform hover:scale-[1.01] ${
                  isRank1
                    ? 'bg-gradient-to-r from-amber-950/40 via-yellow-950/20 to-amber-950/40 border-amber-400/80 shadow-lg ring-1 ring-amber-400/40'
                    : isRank2
                    ? 'bg-slate-800/40 border-slate-400/60 shadow-md'
                    : isRank3
                    ? 'bg-amber-900/20 border-amber-700/50'
                    : isNightMode
                    ? 'bg-[#141624] border-slate-800/80 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Left: Rank & Avatar */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 text-center font-black text-sm tabular-nums shrink-0">
                    {isRank1 ? (
                      <span className="text-amber-400 text-base">🥇</span>
                    ) : isRank2 ? (
                      <span className="text-slate-300 text-base">🥈</span>
                    ) : isRank3 ? (
                      <span className="text-amber-600 text-base">🥉</span>
                    ) : (
                      <span className="text-slate-400">#{index + 1}</span>
                    )}
                  </div>

                  {/* Avatar with Crown on Rank 1 */}
                  <div className="relative shrink-0">
                    {isRank1 && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
                        <Crown className="w-5 h-5 text-amber-300 fill-amber-300 drop-shadow-[0_0_12px_rgba(250,204,21,1)] animate-bounce" />
                        <Sparkles className="w-2.5 h-2.5 text-yellow-200 absolute -top-1 -right-2 animate-ping" />
                      </div>
                    )}
                    <img
                      src={member.avatar}
                      alt={member.username}
                      className={`w-11 h-11 rounded-full object-cover border-2 transition-all ${
                        isRank1
                          ? 'border-amber-400 ring-4 ring-yellow-400/40 shadow-[0_0_15px_rgba(250,204,21,0.5)]'
                          : isRank2
                          ? 'border-slate-200 ring-2 ring-slate-300/40 shadow-sm'
                          : isRank3
                          ? 'border-amber-600 ring-2 ring-amber-600/40 shadow-sm'
                          : 'border-slate-700'
                      }`}
                      referrerPolicy="no-referrer"
                    />
                    {/* Live Online Dot */}
                    {member.isOnline && (
                      <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-black absolute bottom-0 right-0 animate-pulse" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-sm truncate ${
                          isRank1
                            ? 'font-black text-amber-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]'
                            : member.isVip
                            ? 'font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-100 drop-shadow animate-pulse'
                            : 'font-bold'
                        }`}
                      >
                        {member.username}
                      </span>
                      <span className="text-xs" title={member.country}>
                        {getCountryFlag(member.country)}
                      </span>
                      {member.isVip && (
                        <span className="text-[9px] font-black bg-amber-950 text-amber-300 border border-amber-500/40 px-1 py-0.2 rounded-full flex items-center gap-0.5 shadow-sm">
                          <Crown className="w-2.5 h-2.5 fill-amber-300 animate-bounce" /> VIP
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {Math.floor(member.minutes / 60)}h {member.minutes % 60}m
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-slate-400" />
                        {member.videosWatchedCount || 0} watched
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Likes & Like Button */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-black text-rose-400 flex items-center gap-1 justify-end">
                      <ThumbsUp className="w-3 h-3 fill-rose-400" />
                      <span>{member.likesReceivedCount || 0}</span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-bold block">
                      {member.score} pts
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const res = likeUserProfile(member.id);
                      showToast(res.message);
                    }}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition cursor-pointer"
                    title="Like member profile"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* User Profile Card Modal if clicked */}
        {selectedUserForCard && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-20">
            <div
              className={`w-full max-w-sm rounded-2xl border p-5 space-y-4 shadow-2xl relative ${
                isNightMode ? 'bg-[#151825] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <button
                onClick={() => setSelectedUserForCard(null)}
                aria-label="Close user profile"
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <img
                  src={selectedUserForCard.avatar}
                  alt={selectedUserForCard.username}
                  className="w-14 h-14 rounded-full border-2 border-amber-400 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-base">{selectedUserForCard.username}</h4>
                    <span>{getCountryFlag(selectedUserForCard.country)}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Member since: {selectedUserForCard.createdAt?.split(' ')[0] || '2026'}
                  </div>
                  {selectedUserForCard.isVip && (
                    <span className="text-[10px] font-black text-amber-300 bg-amber-950 border border-amber-500/50 px-1.5 py-0.2 rounded-full inline-block mt-1">
                      👑 VIP PASS HOLDER
                    </span>
                  )}
                </div>
              </div>
              {selectedUserForCard.bio && (
                <div
                  className={`p-3 rounded-xl text-xs italic ${
                    isNightMode ? 'bg-[#1a1e30] text-slate-300' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  &quot;{selectedUserForCard.bio}&quot;
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-black/30">
                  <span className="text-slate-400 block text-[10px]">Watch Time</span>
                  <span className="font-bold text-amber-400">
                    {Math.floor((selectedUserForCard.timeSpentSeconds || 0) / 3600)}h
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-black/30">
                  <span className="text-slate-400 block text-[10px]">Watched</span>
                  <span className="font-bold text-sky-400">
                    {selectedUserForCard.videosWatchedCount || 0}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-black/30">
                  <span className="text-slate-400 block text-[10px]">Likes</span>
                  <span className="font-bold text-rose-400">
                    {selectedUserForCard.likesReceivedCount || 0}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  const res = likeUserProfile(selectedUserForCard.id);
                  showToast(res.message);
                }}
                className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow cursor-pointer"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Like Profile (+1)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
