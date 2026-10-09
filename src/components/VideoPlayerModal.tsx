import React, { useState, useEffect } from 'react';
import {
  X,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Share2,
  Download,
  Eye,
  Calendar,
  User as UserIcon,
  Crown,
  Lock,
  Unlock,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  CornerDownRight,
  Trash2,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AdBanner } from './AdBanner';

export const VideoPlayerModal: React.FC = () => {
  const {
    activeVideo,
    setActiveVideo,
    currentUser,
    likeVideo,
    dislikeVideo,
    toggleSaveVideo,
    addComment,
    deleteComment,
    comments,
    adSettings,
    setIsVipModalOpen,
    recordVideoWatch,
    isAdminLoggedIn,
    isNightMode,
    t,
    showToast,
  } = useApp();

  const [commentInput, setCommentInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // 3-step Ad Verification State
  const [ad1Verified, setAd1Verified] = useState(false);
  const [ad2Verified, setAd2Verified] = useState(false);
  const [ad3Verified, setAd3Verified] = useState(false);
  const [verifyingStep, setVerifyingStep] = useState<number | null>(null);

  useEffect(() => {
    setAd1Verified(false);
    setAd2Verified(false);
    setAd3Verified(false);
    setVerifyingStep(null);
    if (activeVideo?.id) {
      recordVideoWatch(activeVideo.id);
    }
  }, [activeVideo?.id, recordVideoWatch]);

  if (!activeVideo) return null;

  const isUserVip = Boolean(currentUser?.isVip);
  const isVideoVip = Boolean(activeVideo.isVip);
  const isLockedForPlay = isVideoVip && !isUserVip;
  const isLiked = currentUser?.likedVideoIds.includes(activeVideo.id);
  const isSaved = currentUser?.savedVideoIds.includes(activeVideo.id);
  const videoComments = comments.filter((c) => c.videoId === activeVideo.id);

  const handleVerifyAd = (step: number, adUrl: string) => {
    setVerifyingStep(step);
    if (adUrl) {
      window.open(adUrl, '_blank', 'noopener,noreferrer');
    }
    setTimeout(() => {
      if (step === 1) setAd1Verified(true);
      if (step === 2) setAd2Verified(true);
      if (step === 3) setAd3Verified(true);
      setVerifyingStep(null);
      showToast(`Ad Step ${step} verified!`);
    }, 2000);
  };

  const allAdsVerified = ad1Verified && ad2Verified && ad3Verified;

  const handleDownload = () => {
    // If video is VIP and user is NOT VIP: Block download completely!
    if (isVideoVip && !isUserVip) {
      showToast(t('vipOnlyDownloadNotice'));
      setIsVipModalOpen(true);
      return;
    }

    // If video is Free and user is NOT VIP: Must verify all 3 ads!
    if (!isVideoVip && !isUserVip && !allAdsVerified) {
      showToast('Please complete all 3 ad verifications below to unlock download!');
      return;
    }

    const targetUrl = activeVideo.downloadUrl || adSettings.directDownloadLink || 'https://mega.nz';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    showToast('Opening Mega Cloud Download...');
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const success = addComment(activeVideo.id, commentInput);
    if (success) {
      setCommentInput('');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    showToast('Video URL copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const renderPlayer = () => {
    if (isLockedForPlay) {
      return (
        <div className="relative aspect-video w-full bg-[#0d0f17] flex flex-col items-center justify-center p-6 text-center vip-shimmer overflow-hidden">
          <div className="relative w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mb-3 shadow-2xl ring-8 ring-amber-500/10">
            <Lock className="w-8 h-8 text-amber-400" />
            <Crown className="w-5 h-5 text-yellow-300 absolute -top-1 -right-1 fill-yellow-300 animate-bounce" />
          </div>
          <h2 className="text-xl font-black text-amber-300 tracking-wide">
            🔒 {t('vipExclusive')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mt-2 leading-relaxed">
            {t('vipRequiredPlay')}
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5 justify-center">
            <button
              onClick={() => setIsVipModalOpen(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs sm:text-sm font-extrabold rounded-xl shadow-lg flex items-center gap-2 uppercase tracking-wider transition transform hover:scale-105 cursor-pointer"
            >
              <Crown className="w-4 h-4 fill-black" />
              {t('unlockVipNow')}
            </button>
          </div>
        </div>
      );
    }

    const embed = activeVideo.embedCode.trim();
    if (embed.startsWith('<iframe')) {
      return (
        <div
          className="relative aspect-video w-full bg-black overflow-hidden [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
          dangerouslySetInnerHTML={{ __html: embed }}
        />
      );
    } else if (embed.startsWith('http://') || embed.startsWith('https://')) {
      return (
        <div className="relative aspect-video w-full bg-black overflow-hidden">
          <iframe
            src={embed}
            title={activeVideo.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      );
    } else {
      return (
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          <video
            controls
            autoPlay={false}
            poster={activeVideo.thumbnailUrl}
            className="w-full h-full object-contain"
          >
            <source
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              type="video/mp4"
            />
            Your browser does not support HTML5 video.
          </video>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        className={`relative w-full max-w-4xl sm:rounded-2xl border shadow-2xl overflow-hidden my-auto max-h-[100vh] sm:max-h-[95vh] flex flex-col transition-colors ${
          isNightMode
            ? 'bg-[#0f1118] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Top Bar */}
        <div
          className={`flex items-center justify-between px-4 py-3 border-b shrink-0 ${
            isNightMode ? 'bg-[#131622] border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 truncate pr-2">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
              {activeVideo.category}
            </span>
            <span className="text-xs sm:text-sm font-semibold truncate">
              {activeVideo.title}
            </span>
          </div>
          <button
            onClick={() => setActiveVideo(null)}
            aria-label="Close Video Player"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-5 space-y-4">
          <h1 className="text-base sm:text-xl font-bold leading-snug">
            {activeVideo.title}
          </h1>

          {/* Video Player Display */}
          <div className="rounded-xl overflow-hidden border border-slate-800 shadow-xl bg-black">
            {renderPlayer()}
          </div>

          {/* Action Buttons Row */}
          <div
            className={`flex flex-wrap items-center justify-between gap-2 py-2 border-b ${
              isNightMode ? 'border-slate-800/80' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => likeVideo(activeVideo.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  isLiked
                    ? 'bg-rose-500/20 text-rose-500 border-rose-500/40'
                    : isNightMode
                    ? 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
                <span className="tabular-nums">{activeVideo.likes}</span>
              </button>

              <button
                onClick={() => dislikeVideo(activeVideo.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  isNightMode
                    ? 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span className="tabular-nums">{activeVideo.dislikes}</span>
              </button>

              <button
                onClick={() => toggleSaveVideo(activeVideo.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  isSaved
                    ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                    : isNightMode
                    ? 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-500' : ''}`} />
                <span>{t('save')}</span>
              </button>

              <button
                onClick={() => setShowShareModal(!showShareModal)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  isNightMode
                    ? 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('share')}</span>
              </button>
            </div>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('download')}</span>
            </button>
          </div>

          {/* Share Box */}
          {showShareModal && (
            <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-300 truncate">{window.location.href}</span>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#facc15] text-black font-bold shrink-0 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 py-1">
            <div className="flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5" />
              <span>{t('by')} {activeVideo.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{activeVideo.createdAt}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>{activeVideo.views} {t('views')}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {activeVideo.tags.map((tag, idx) => (
              <span
                key={idx}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                  isNightMode
                    ? 'bg-[#1a1d29] text-slate-300 border-slate-800'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          <AdBanner slot="player" />

          {/* DOWNLOAD SECTION: Strict VIP vs Free Logic */}
          <div
            className={`rounded-xl border p-4 space-y-3 ${
              isNightMode ? 'bg-[#141622] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            {isVideoVip && !isUserVip ? (
              /* Case 1: Video is VIP, user is Free -> BLOCKED completely! */
              <div className="text-center py-4 space-y-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                  🔒 VIP Only Download
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {t('vipOnlyDownloadNotice')}
                </p>
                <button
                  onClick={() => setIsVipModalOpen(true)}
                  className="mt-2 px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold text-xs rounded-xl uppercase tracking-wider shadow cursor-pointer"
                >
                  {t('unlockVipNow')}
                </button>
              </div>
            ) : isUserVip ? (
              /* Case 2: User is VIP -> ZERO ads, instant download! */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-emerald-400">
                        {t('vipNoAdsDownload')}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        VIP Pass Holder: Zero ads, unlimited high speed direct Mega download!
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/40">
                    👑 VIP PASS
                  </span>
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Unlock className="w-4 h-4 text-emerald-200" />
                  <span>{t('downloadMega')}</span>
                </button>
              </div>
            ) : (
              /* Case 3: Free video & Free user -> 3-step ads verification required */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                      <Download className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-amber-400">
                        {t('protectedDownload')} (3 Ads)
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Verify all 3 sponsor links below to unlock the official download link.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleVerifyAd(1, adSettings.smartLink1)}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                      ad1Verified
                        ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-600/50'
                        : 'bg-red-600 hover:bg-red-500 text-white shadow'
                    }`}
                  >
                    {ad1Verified ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>1. Verified</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{verifyingStep === 1 ? 'Checking...' : t('verifyAd1')}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleVerifyAd(2, adSettings.smartLink2)}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                      ad2Verified
                        ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-600/50'
                        : 'bg-red-600 hover:bg-red-500 text-white shadow'
                    }`}
                  >
                    {ad2Verified ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>2. Verified</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{verifyingStep === 2 ? 'Checking...' : t('verifyAd2')}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleVerifyAd(3, adSettings.smartLink3)}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                      ad3Verified
                        ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-600/50'
                        : 'bg-red-600 hover:bg-red-500 text-white shadow'
                    }`}
                  >
                    {ad3Verified ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>3. Verified</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{verifyingStep === 3 ? 'Checking...' : t('verifyAd3')}</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={handleDownload}
                  disabled={!allAdsVerified}
                  className={`w-full py-3 rounded-lg text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                    allAdsVerified
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg cursor-pointer'
                      : 'bg-slate-800/90 text-slate-500 border border-slate-700/60 cursor-not-allowed'
                  }`}
                >
                  {allAdsVerified ? (
                    <>
                      <Unlock className="w-4 h-4 text-emerald-200" />
                      <span>{t('downloadMega')}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-slate-500" />
                      <span>{t('downloadLocked')}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Community Discussion */}
          <div
            className={`rounded-xl border p-4 space-y-4 ${
              isNightMode ? 'bg-[#12141e] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs sm:text-sm font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-red-500" />
                {t('communityDiscussion')} ({videoComments.length})
              </h3>
              <span className="text-[11px] text-slate-400">
                {t('maxComments')}
              </span>
            </div>

            <form onSubmit={handlePostComment} className="flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder={t('writeComment')}
                className={`flex-1 text-xs sm:text-sm rounded-lg px-3 py-2 border focus:outline-none focus:border-red-500 ${
                  isNightMode
                    ? 'bg-[#181b28] text-slate-100 placeholder-slate-500 border-slate-700'
                    : 'bg-white text-slate-900 placeholder-slate-400 border-slate-300'
                }`}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold rounded-lg transition shrink-0 cursor-pointer"
              >
                {t('post')}
              </button>
            </form>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 text-[11px]">Quick insert:</span>
              {['🔥', '😍', '❤️', '👏', '🤤'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setCommentInput((prev) => prev + ' ' + emoji)}
                  className={`px-2 py-0.5 rounded text-xs cursor-pointer ${
                    isNightMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div className="space-y-3 pt-2">
              {videoComments.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  No comments yet. Be the first to start the discussion!
                </div>
              ) : (
                videoComments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-3 rounded-lg border space-y-1.5 ${
                      isNightMode
                        ? 'bg-[#181b27]/80 border-slate-800/80'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={comment.userAvatar}
                          alt={comment.userName}
                          className="w-5 h-5 rounded-full border border-slate-700 object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-xs font-bold text-red-500">
                          {comment.userName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {comment.createdAt}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCommentInput(`@${comment.userName} `)}
                          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          <CornerDownRight className="w-3 h-3" />
                          <span>{t('reply')}</span>
                        </button>
                        {isAdminLoggedIn && (
                          <button
                            onClick={() => deleteComment(comment.id)}
                            className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                            title="Admin: Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs pl-7">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
