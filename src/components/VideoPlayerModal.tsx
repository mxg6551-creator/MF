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
  Clock,
  Ban,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AdBanner } from './AdBanner';
import { extractIframeSrc, getEffectiveThumbnail } from '../services/videoUtils';

export const VideoPlayerModal: React.FC = () => {
  const {
    activeVideo,
    setActiveVideo,
    videos,
    currentUser,
    likeVideo,
    dislikeVideo,
    toggleSaveVideo,
    addComment,
    deleteComment,
    comments,
    adSettings,
    setIsVipModalOpen,
    setIsAuthModalOpen,
    recordVideoWatch,
    isAdminLoggedIn,
    isNightMode,
    t,
    showToast,
  } = useApp();

  const [commentInput, setCommentInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // 3-step Ad Verification State with 5-second countdown
  const [ad1Verified, setAd1Verified] = useState(false);
  const [ad2Verified, setAd2Verified] = useState(false);
  const [ad3Verified, setAd3Verified] = useState(false);
  const [ad1Countdown, setAd1Countdown] = useState<number>(0);
  const [ad2Countdown, setAd2Countdown] = useState<number>(0);
  const [ad3Countdown, setAd3Countdown] = useState<number>(0);

  useEffect(() => {
    setAd1Verified(false);
    setAd2Verified(false);
    setAd3Verified(false);
    setAd1Countdown(0);
    setAd2Countdown(0);
    setAd3Countdown(0);
    if (activeVideo?.id) {
      recordVideoWatch(activeVideo.id);
    }
  }, [activeVideo?.id, recordVideoWatch]);

  if (!activeVideo) return null;

  const currentVideo = videos.find((v) => v.id === activeVideo.id) || activeVideo;
  const isUserVip = Boolean(currentUser?.isVip);
  const isVideoVip = Boolean(currentVideo.isVip);
  const isLockedForPlay = isVideoVip && !isUserVip;
  const isLiked = Boolean(currentUser?.likedVideoIds.includes(currentVideo.id));
  const isSaved = Boolean(currentUser?.savedVideoIds.includes(currentVideo.id));
  const videoComments = comments.filter((c) => c.videoId === currentVideo.id);
  const isDownloadAllowed = currentVideo.downloadEnabled !== false;

  const handleVerifyAd = (step: number, adUrl: string) => {
    // Require authentication/registration for download verification
    if (!currentUser) {
      showToast('ভিডিও ডাউনলোড করতে দয়া করে লগইন বা রেজিস্টার করুন (Please login or register to download)');
      setIsAuthModalOpen(true);
      return;
    }

    if (step === 1) {
      if (ad1Verified || ad1Countdown > 0) return;
    } else if (step === 2) {
      if (!ad1Verified) {
        showToast('Please verify Step 1 first!');
        return;
      }
      if (ad2Verified || ad2Countdown > 0) return;
    } else if (step === 3) {
      if (!ad2Verified) {
        showToast('Please verify Step 2 first!');
        return;
      }
      if (ad3Verified || ad3Countdown > 0) return;
    }

    if (adUrl) {
      window.open(adUrl, '_blank', 'noopener,noreferrer');
    }

    if (step === 1) {
      setAd1Countdown(5);
      const interval = setInterval(() => {
        setAd1Countdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setAd1Verified(true);
            showToast('✓ Step 1 Verified (Green)! Now verify Step 2.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (step === 2) {
      setAd2Countdown(5);
      const interval = setInterval(() => {
        setAd2Countdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setAd2Verified(true);
            showToast('✓ Step 2 Verified (Green)! Now verify Step 3.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (step === 3) {
      setAd3Countdown(5);
      const interval = setInterval(() => {
        setAd3Countdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setAd3Verified(true);
            showToast('✓ Step 3 Verified (Green)! Download unlocked 🎉');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const allAdsVerified = ad1Verified && ad2Verified && ad3Verified;

  const handleDownload = () => {
    // If not logged in, prompt authentication/registration!
    if (!currentUser) {
      showToast('Please login or register to download videos!');
      setIsAuthModalOpen(true);
      return;
    }

    // Check if download is disabled by admin for this video
    if (!isDownloadAllowed) {
      showToast('Download is disabled for this video by admin.');
      return;
    }

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

    const embed = (currentVideo.embedCode || '').trim();
    const iframeSrc = extractIframeSrc(embed);

    if (iframeSrc) {
      return (
        <div className="relative aspect-video w-full bg-black overflow-hidden">
          <iframe
            key={currentVideo.id}
            src={iframeSrc}
            title={currentVideo.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
          />
        </div>
      );
    } else if (embed.includes('<iframe')) {
      return (
        <div
          className="relative aspect-video w-full bg-black overflow-hidden [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
          dangerouslySetInnerHTML={{ __html: embed }}
        />
      );
    } else if (embed.endsWith('.mp4') || embed.endsWith('.webm') || embed.endsWith('.m3u8')) {
      return (
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          <video
            controls
            autoPlay={false}
            poster={getEffectiveThumbnail(currentVideo)}
            className="w-full h-full object-contain"
          >
            <source src={embed} type="video/mp4" />
            Your browser does not support HTML5 video.
          </video>
        </div>
      );
    } else {
      return (
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          <video
            controls
            autoPlay={false}
            poster={getEffectiveThumbnail(currentVideo)}
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
                onClick={() => likeVideo(currentVideo.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  isLiked
                    ? 'bg-rose-500/20 text-rose-500 border-rose-500/40'
                    : isNightMode
                    ? 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
                <span className="tabular-nums">{currentVideo.likes}</span>
              </button>

              <button
                onClick={() => dislikeVideo(currentVideo.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  isNightMode
                    ? 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span className="tabular-nums">{currentVideo.dislikes}</span>
              </button>

              <button
                onClick={() => toggleSaveVideo(currentVideo.id)}
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
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-md ${
                !isDownloadAllowed
                  ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white cursor-pointer'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{!isDownloadAllowed ? 'Download Off' : t('download')}</span>
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

          {/* DOWNLOAD SECTION: Strict VIP vs Free Logic + Download Enabled Check */}
          <div
            className={`rounded-xl border p-4 space-y-3 ${
              isNightMode ? 'bg-[#141622] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            {!isDownloadAllowed ? (
              /* Case 0: Download is turned OFF by admin */
              <div className="text-center py-4 space-y-2">
                <div className="w-11 h-11 mx-auto rounded-full bg-red-500/15 border border-red-500/40 flex items-center justify-center text-red-400">
                  <Ban className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">
                  ডাউনলোড বন্ধ (Download Off)
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  এই ভিডিওটির জন্য ডাউনলোড সুবিধা বর্তমানে অ্যাডমিন কর্তৃক বন্ধ রাখা হয়েছে।
                </p>
              </div>
            ) : isVideoVip && !isUserVip ? (
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
              /* Case 3: Free video & Free user -> 3-step ads verification required with 5-second timer */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                      <Download className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-amber-400">
                        {t('protectedDownload')} (3 Ads Verification)
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        বিজ্ঞাপন ওপেন করুন এবং ৫ সেকেন্ড অপেক্ষা করুন। ৩টি ভেরিফাই হলেই ফাইল ডাউনলোড আনলক হবে।
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Step 1 Button */}
                  <button
                    onClick={() => handleVerifyAd(1, adSettings.smartLink1)}
                    disabled={ad1Verified || ad1Countdown > 0}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                      ad1Verified
                        ? 'bg-emerald-600 text-white border border-emerald-400 shadow-md ring-1 ring-emerald-400 cursor-default'
                        : ad1Countdown > 0
                        ? 'bg-amber-600 text-white animate-pulse shadow cursor-wait'
                        : 'bg-red-600 hover:bg-red-500 text-white shadow cursor-pointer'
                    }`}
                  >
                    {ad1Verified ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        <span>1. Verified ✓ (Green)</span>
                      </>
                    ) : ad1Countdown > 0 ? (
                      <>
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying... ({ad1Countdown}s)</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{t('verifyAd1')}</span>
                      </>
                    )}
                  </button>

                  {/* Step 2 Button (Locked until Step 1 is verified) */}
                  <button
                    onClick={() => handleVerifyAd(2, adSettings.smartLink2)}
                    disabled={!ad1Verified || ad2Verified || ad2Countdown > 0}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                      ad2Verified
                        ? 'bg-emerald-600 text-white border border-emerald-400 shadow-md ring-1 ring-emerald-400 cursor-default'
                        : ad2Countdown > 0
                        ? 'bg-amber-600 text-white animate-pulse shadow cursor-wait'
                        : !ad1Verified
                        ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-75'
                        : 'bg-red-600 hover:bg-red-500 text-white shadow cursor-pointer'
                    }`}
                  >
                    {ad2Verified ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        <span>2. Verified ✓ (Green)</span>
                      </>
                    ) : ad2Countdown > 0 ? (
                      <>
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying... ({ad2Countdown}s)</span>
                      </>
                    ) : !ad1Verified ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>2. Complete Step 1 First</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{t('verifyAd2')}</span>
                      </>
                    )}
                  </button>

                  {/* Step 3 Button (Locked until Step 2 is verified) */}
                  <button
                    onClick={() => handleVerifyAd(3, adSettings.smartLink3)}
                    disabled={!ad2Verified || ad3Verified || ad3Countdown > 0}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                      ad3Verified
                        ? 'bg-emerald-600 text-white border border-emerald-400 shadow-md ring-1 ring-emerald-400 cursor-default'
                        : ad3Countdown > 0
                        ? 'bg-amber-600 text-white animate-pulse shadow cursor-wait'
                        : !ad2Verified
                        ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-75'
                        : 'bg-red-600 hover:bg-red-500 text-white shadow cursor-pointer'
                    }`}
                  >
                    {ad3Verified ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        <span>3. Verified ✓ (Green)</span>
                      </>
                    ) : ad3Countdown > 0 ? (
                      <>
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying... ({ad3Countdown}s)</span>
                      </>
                    ) : !ad2Verified ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>3. Complete Step 2 First</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{t('verifyAd3')}</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={handleDownload}
                  disabled={!allAdsVerified}
                  className={`w-full py-3.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                    allAdsVerified
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl ring-2 ring-emerald-400/50 cursor-pointer animate-pulse'
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
