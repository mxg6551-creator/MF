import React, { useState } from 'react';
import {
  X,
  LayoutDashboard,
  FileVideo,
  PlusCircle,
  FolderTree,
  MessageSquare,
  DollarSign,
  Megaphone,
  Settings,
  Users,
  ShieldCheck,
  UserPlus,
  Link as LinkIcon,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Upload,
  LogOut,
  TrendingUp,
  Search,
  Crown,
  ShieldAlert,
  Ban,
  CreditCard,
  Check,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Video, User } from '../../types';
import { extractThumbnailFromEmbed, compressImage } from '../../services/videoUtils';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    isAdminLoggedIn,
    loggedInAdminRole,
    loginAdmin,
    logoutAdmin,
    videos,
    addVideo,
    updateVideo,
    deleteVideo,
    categories,
    addCategory,
    deleteCategory,
    comments,
    deleteComment,
    vipOrders,
    approveVipOrder,
    rejectVipOrder,
    blockUserFromVip,
    unblockUserFromVip,
    vipPackages,
    updateVipPackagePrice,
    paymentMethods,
    updatePaymentMethod,
    subAdmins,
    addSubAdmin,
    removeSubAdmin,
    customSidebarLinks,
    addCustomSidebarLink,
    deleteCustomSidebarLink,
    users,
    updateUserByAdmin,
    deleteUserByAdmin,
    stats,
    adSettings,
    updateAdSettings,
    siteSettings,
    updateSiteSettings,
    showToast,
  } = useApp();

  // Admin login credentials input
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');

  // Active admin tab
  const [currentTab, setCurrentTab] = useState<
    'stats' | 'posts' | 'orders' | 'gateways' | 'users' | 'subadmins' | 'links' | 'categories' | 'comments' | 'ads' | 'settings'
  >('stats');

  // Video editor modal state (includes Views, Likes, Dislikes modifications!)
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoCategory, setVideoCategory] = useState('bangladeshi');
  const [videoTags, setVideoTags] = useState('');
  const [videoDuration, setVideoDuration] = useState('15:20');
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState('');
  const [videoEmbedCode, setVideoEmbedCode] = useState('');
  const [videoDownloadUrl, setVideoDownloadUrl] = useState('');
  const [videoIsVip, setVideoIsVip] = useState(false);
  const [videoDownloadEnabled, setVideoDownloadEnabled] = useState(true);
  const [videoQuality, setVideoQuality] = useState<'HD' | '4K' | 'SD'>('HD');
  const [videoViews, setVideoViews] = useState(1400);
  const [videoLikes, setVideoLikes] = useState(120);
  const [videoDislikes, setVideoDislikes] = useState(5);

  // User management & edit states
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserFullName, setEditUserFullName] = useState('');
  const [editUserPassword, setEditUserPassword] = useState('');
  const [editUserLikes, setEditUserLikes] = useState(0);
  const [editUserMinutes, setEditUserMinutes] = useState(0);
  const [editUserIsVip, setEditUserIsVip] = useState(false);
  const [editUserCountry, setEditUserCountry] = useState('BD');

  // Sub-admin form
  const [newSubName, setNewSubName] = useState('');
  const [newSubUsername, setNewSubUsername] = useState('');
  const [newSubEmail, setNewSubEmail] = useState('');
  const [newSubPassword, setNewSubPassword] = useState('');

  // Custom sidebar link form
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkBadge, setNewLinkBadge] = useState('HOT');

  // Category form
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');

  // Site settings form
  const [siteTitle, setSiteTitle] = useState(siteSettings.siteTitle);
  const [siteLogo, setSiteLogo] = useState(siteSettings.siteLogoText);
  const [adminUsernameInput, setAdminUsernameInput] = useState(siteSettings.adminUsername);
  const [adminPasswordInput, setAdminPasswordInput] = useState(siteSettings.adminPasswordHash);
  const [bkashNum, setBkashNum] = useState(siteSettings.bkashNumber);
  const [nagadNum, setNagadNum] = useState(siteSettings.nagadNumber);
  const [rocketNum, setRocketNum] = useState(siteSettings.rocketNumber);
  const [antiCopyToggle, setAntiCopyToggle] = useState(siteSettings.antiCopyEnabled);
  const [ageGateToggle, setAgeGateToggle] = useState(siteSettings.ageGateEnabled);

  // Ad settings
  const [topBannerHtml, setTopBannerHtml] = useState(adSettings.topBannerHtml);
  const [topBannerImg, setTopBannerImg] = useState(adSettings.topBannerImage);
  const [topBannerLink, setTopBannerLink] = useState(adSettings.topBannerLink);
  const [smartLink1, setSmartLink1] = useState(adSettings.smartLink1);
  const [smartLink2, setSmartLink2] = useState(adSettings.smartLink2);
  const [smartLink3, setSmartLink3] = useState(adSettings.smartLink3);
  const [directDownload, setDirectDownload] = useState(adSettings.directDownloadLink);
  const [popunderCode, setPopunderCode] = useState(adSettings.popunderCode || '');
  const [popunderEnabled, setPopunderEnabled] = useState(adSettings.popunderEnabled !== false);
  const [socialBarCode, setSocialBarCode] = useState(adSettings.socialBarCode || '');
  const [socialBarEnabled, setSocialBarEnabled] = useState(adSettings.socialBarEnabled !== false);

  if (!isAdminOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(adminUser, adminPass);
    if (success) {
      setAdminUser('');
      setAdminPass('');
    }
  };

  const handleCloseAdmin = () => {
    // Strict session security: Always logout admin when closing panel
    logoutAdmin();
    setIsAdminOpen(false);
  };

  const handleOpenNewPost = () => {
    setEditingVideoId(null);
    setVideoTitle('');
    setVideoDesc('');
    setVideoCategory(categories[1]?.slug || 'bangladeshi');
    setVideoTags('Viral, Desi, 1080p');
    setVideoDuration('14:30');
    setVideoThumbnailUrl(''); // Optional: empty by default so it auto-extracts native iframe cover!
    setVideoEmbedCode('');
    setVideoDownloadUrl('');
    setVideoIsVip(false);
    setVideoDownloadEnabled(true);
    setVideoQuality('HD');
    setVideoViews(1200);
    setVideoLikes(95);
    setVideoDislikes(3);
    setIsEditorOpen(true);
  };

  const handleOpenEditPost = (video: Video) => {
    setEditingVideoId(video.id);
    setVideoTitle(video.title);
    setVideoDesc(video.description);
    setVideoCategory(video.category);
    setVideoTags(video.tags.join(', '));
    setVideoDuration(video.duration);
    setVideoThumbnailUrl(video.thumbnailUrl || '');
    setVideoEmbedCode(video.embedCode);
    setVideoDownloadUrl(video.downloadUrl || '');
    setVideoIsVip(video.isVip);
    setVideoDownloadEnabled(video.downloadEnabled !== false);
    setVideoQuality(video.quality || 'HD');
    setVideoViews(video.views);
    setVideoLikes(video.likes);
    setVideoDislikes(video.dislikes);
    setIsEditorOpen(true);
  };

  // High-performance gallery image upload with automatic canvas compression
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file, 720, 405, 0.8);
        setVideoThumbnailUrl(compressedBase64);
        showToast('Gallery image loaded & optimized (~30KB)!');
      } catch (err) {
        // Fallback to direct read if canvas fails
        const reader = new FileReader();
        reader.onloadend = () => {
          setVideoThumbnailUrl(reader.result as string);
          showToast('Gallery image loaded!');
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim()) {
      showToast('Please enter video title');
      return;
    }
    if (!videoEmbedCode.trim()) {
      showToast('Please enter iframe embed code or stream URL');
      return;
    }
    const tagList = videoTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // If custom thumbnail is provided, use it. Otherwise, auto-extract from iframe!
    const autoThumb = extractThumbnailFromEmbed(videoEmbedCode.trim());
    const finalThumb = videoThumbnailUrl.trim() || autoThumb;

    if (editingVideoId) {
      updateVideo(editingVideoId, {
        title: videoTitle.trim(),
        description: videoDesc.trim(),
        category: videoCategory,
        tags: tagList,
        duration: videoDuration.trim() || '12:00',
        thumbnailUrl: finalThumb,
        embedCode: videoEmbedCode.trim(),
        downloadUrl: videoDownloadUrl.trim(),
        isVip: videoIsVip,
        downloadEnabled: videoDownloadEnabled,
        quality: videoQuality,
        views: Number(videoViews),
        likes: Number(videoLikes),
        dislikes: Number(videoDislikes),
      });
    } else {
      addVideo({
        title: videoTitle.trim(),
        description: videoDesc.trim(),
        category: videoCategory,
        tags: tagList,
        duration: videoDuration.trim() || '12:00',
        thumbnailUrl: finalThumb,
        embedCode: videoEmbedCode.trim(),
        downloadUrl: videoDownloadUrl.trim(),
        isVip: videoIsVip,
        downloadEnabled: videoDownloadEnabled,
        quality: videoQuality,
        author: 'Admin Moon',
      });
    }
    setIsEditorOpen(false);
  };

  // Open User Edit Modal
  const handleOpenEditUser = (u: User) => {
    setEditingUser(u);
    setEditUserName(u.username);
    setEditUserFullName(u.name || u.username);
    setEditUserPassword(u.password || '');
    setEditUserLikes(u.likesReceivedCount || 0);
    setEditUserMinutes(Math.floor((u.timeSpentSeconds || 0) / 60));
    setEditUserIsVip(u.isVip);
    setEditUserCountry(u.country || 'BD');
  };

  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUserByAdmin(editingUser.id, {
      username: editUserName.trim() || editingUser.username,
      name: editUserFullName.trim(),
      password: editUserPassword.trim(),
      likesReceivedCount: Number(editUserLikes),
      timeSpentSeconds: Number(editUserMinutes) * 60,
      isVip: editUserIsVip,
      country: editUserCountry,
    });
    setEditingUser(null);
  };

  // Sub-Admin Add
  const handleAddSubAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubUsername.trim() || !newSubPassword.trim()) {
      showToast('Username and password required');
      return;
    }
    const success = addSubAdmin({
      name: newSubName.trim() || newSubUsername.trim(),
      username: newSubUsername.trim(),
      email: newSubEmail.trim() || `${newSubUsername.trim()}@tube.xyz`,
      passwordHash: newSubPassword.trim(),
    });
    if (success) {
      setNewSubName('');
      setNewSubUsername('');
      setNewSubEmail('');
      setNewSubPassword('');
    }
  };

  // Custom Sidebar Link Add
  const handleAddCustomLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;
    addCustomSidebarLink({
      title: newLinkTitle.trim(),
      url: newLinkUrl.trim(),
      badge: newLinkBadge.trim() || undefined,
      openNewTab: true,
    });
    setNewLinkTitle('');
    setNewLinkUrl('');
    setNewLinkBadge('HOT');
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const q = userSearchQuery.toLowerCase();
    return (
      u.username.toLowerCase().includes(q) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-6xl h-full sm:h-[95vh] bg-[#0c0e15] sm:rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#131622] border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center text-black font-extrabold text-sm shadow">
              M
            </div>
            <div>
              <div className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <span>Tube Master Admin Panel</span>
                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded">
                  {loggedInAdminRole === 'superadmin' ? 'SUPER-ADMIN' : loggedInAdminRole === 'subadmin' ? 'SUB-ADMIN' : 'SECURE'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                admin.bdtopupshop.com / Blogger Hybrid Control System (Max 3 Admins)
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAdminLoggedIn && (
              <button
                onClick={logoutAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={handleCloseAdmin}
              aria-label="Close admin dashboard"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isAdminLoggedIn ? (
          /* Login Screen */
          <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
            <div className="w-full max-w-md bg-[#131622] p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-5">
              <div className="text-center space-y-1">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-extrabold text-white">Admin Authentication</h2>
                <p className="text-xs text-slate-400">
                  Password required on every session for strict security. Max 3 authorized administrators.
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Admin / Sub-Admin Username
                  </label>
                  <input
                    type="text"
                    required
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    placeholder="admin or sub-admin"
                    className="w-full bg-[#191c2b] text-slate-100 text-sm rounded-lg px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#191c2b] text-slate-100 text-sm rounded-lg px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm rounded-xl uppercase tracking-wider transition shadow-md cursor-pointer"
                >
                  Verify & Enter Admin
                </button>
              </form>

              <div className="pt-3 border-t border-slate-800 text-center">
                <button
                  type="button"
                  onClick={() => loginAdmin('immoon', '66449988.com777')}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold rounded-lg border border-slate-700 transition cursor-pointer"
                >
                  🔑 Master Login (Admin Moon)
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar */}
            <div className="w-full md:w-60 bg-[#10121c] border-r border-slate-800/80 p-3 flex md:flex-col justify-between shrink-0 overflow-x-auto md:overflow-y-auto">
              <div className="space-y-1 w-full flex md:flex-col gap-1 md:gap-0">
                <div className="pb-2 hidden md:block">
                  <button
                    onClick={handleOpenNewPost}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg uppercase tracking-wider transition transform hover:scale-[1.01] cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ NEW POST / VIDEO</span>
                  </button>
                </div>

                <button
                  onClick={() => setCurrentTab('stats')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    currentTab === 'stats'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Stats & Dashboard</span>
                </button>

                <button
                  onClick={() => setCurrentTab('posts')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    currentTab === 'posts'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <FileVideo className="w-4 h-4" />
                  <span>Videos ({videos.length})</span>
                </button>

                {/* Users Management */}
                <button
                  onClick={() => setCurrentTab('users')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    currentTab === 'users'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Users & Logins ({users.length})</span>
                </button>

                {/* Sub-Admins */}
                <button
                  onClick={() => setCurrentTab('subadmins')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    currentTab === 'subadmins'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sub-Admins ({1 + subAdmins.length}/3)</span>
                </button>

                <button
                  onClick={() => setCurrentTab('orders')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    currentTab === 'orders'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>VIP Orders ({vipOrders.filter((o) => o.status === 'pending').length})</span>
                </button>

                <button
                  onClick={() => setCurrentTab('gateways')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    currentTab === 'gateways'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Payment Gateways ({paymentMethods.length})</span>
                </button>

                <button
                  onClick={() => setCurrentTab('links')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    currentTab === 'links'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Sidebar Links ({customSidebarLinks.length})</span>
                </button>

                <button
                  onClick={() => setCurrentTab('categories')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    currentTab === 'categories'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <FolderTree className="w-4 h-4" />
                  <span>Categories ({categories.length})</span>
                </button>

                <button
                  onClick={() => setCurrentTab('comments')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    currentTab === 'comments'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Comments ({comments.length})</span>
                </button>

                <button
                  onClick={() => setCurrentTab('ads')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    currentTab === 'ads'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Ads & Smartlinks</span>
                </button>

                <button
                  onClick={() => setCurrentTab('settings')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    currentTab === 'settings'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Site & Security</span>
                </button>
              </div>
            </div>

            {/* Viewport */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
              {/* TAB 1: STATS */}
              {currentTab === 'stats' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-xl bg-[#141624] border border-slate-800">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Users Gained
                      </div>
                      <div className="text-2xl font-black text-white mt-1 tabular-nums">
                        {users.length}
                      </div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">Active Registered</div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#141624] border border-slate-800">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Users Today
                      </div>
                      <div className="text-2xl font-black text-white mt-1 tabular-nums">
                        {Math.floor(stats.todayViews / 3)}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Live Visitors</div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#141624] border border-slate-800">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Total Posts / Videos
                      </div>
                      <div className="text-2xl font-black text-white mt-1 tabular-nums">
                        {videos.length}
                      </div>
                      <div className="text-[10px] text-amber-400 mt-0.5">Published Tube Content</div>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-tr from-[#161a2b] to-[#1d2238] border border-amber-500/30">
                      <div className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
                        VIP Wallet / Revenue
                      </div>
                      <div className="text-2xl font-black text-amber-400 mt-1 tabular-nums">
                        ৳ {stats.totalEarningsBdt}.00
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">bKash/Nagad/Rocket Paid</div>
                    </div>
                  </div>

                  {/* Views Tracker */}
                  <div className="p-5 rounded-2xl bg-[#141624] border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        Blogger Views & Impression Tracker
                      </h3>
                      <span className="text-xs text-slate-400">Real-time counter</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                      <div className="p-3 rounded-xl bg-[#181b2a] border border-slate-800">
                        <div className="text-xs text-slate-400">All Time</div>
                        <div className="text-lg font-bold text-white mt-1 tabular-nums">
                          {stats.allTimeViews.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-[#181b2a] border border-slate-800">
                        <div className="text-xs text-slate-400">Today</div>
                        <div className="text-lg font-bold text-emerald-400 mt-1 tabular-nums">
                          {stats.todayViews.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-[#181b2a] border border-slate-800">
                        <div className="text-xs text-slate-400">Yesterday</div>
                        <div className="text-lg font-bold text-slate-300 mt-1 tabular-nums">
                          {stats.yesterdayViews.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-[#181b2a] border border-slate-800">
                        <div className="text-xs text-slate-400">This Month</div>
                        <div className="text-lg font-bold text-sky-400 mt-1 tabular-nums">
                          {stats.thisMonthViews.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-[#181b2a] border border-slate-800">
                        <div className="text-xs text-slate-400">Last Month</div>
                        <div className="text-lg font-bold text-slate-300 mt-1 tabular-nums">
                          {stats.lastMonthViews.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: POSTS & VIDEOS */}
              {currentTab === 'posts' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <FileVideo className="w-5 h-5 text-amber-400" />
                      Manage Videos & Embed Codes ({videos.length})
                    </h3>
                    <button
                      onClick={handleOpenNewPost}
                      className="px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Upload Video</span>
                    </button>
                  </div>

                  <div className="divide-y divide-slate-800 bg-[#131522] rounded-xl border border-slate-800 overflow-hidden">
                    {videos.map((vid) => (
                      <div
                        key={vid.id}
                        className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-[#181b2a] transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={vid.thumbnailUrl}
                            alt={vid.title}
                            className="w-20 h-14 object-cover rounded-lg shrink-0 border border-slate-800"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-bold text-slate-100 truncate">
                                {vid.title}
                              </span>
                              {vid.isVip && (
                                <span className="text-[10px] font-black text-amber-300 bg-amber-950 px-1.5 py-0.2 rounded border border-amber-600/40">
                                  VIP
                                </span>
                              )}
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                                  vid.downloadEnabled !== false
                                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60'
                                    : 'bg-red-950/80 text-red-400 border-red-700/60'
                                }`}
                              >
                                {vid.downloadEnabled !== false ? 'DL ON' : 'DL OFF'}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                              <span className="capitalize">{vid.category}</span>
                              <span>•</span>
                              <span>{vid.duration}</span>
                              <span>•</span>
                              <span>{vid.views} views</span>
                              <span>•</span>
                              <span>{vid.likes} likes</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => handleOpenEditPost(vid)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                            title="Edit Video, Views & Likes"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteVideo(vid.id)}
                            className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 border border-red-900/40 transition cursor-pointer"
                            title="Delete Video"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: USERS & LOGINS MANAGEMENT */}
              {currentTab === 'users' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-amber-400" />
                        Registered Users & Login Logs ({users.length})
                      </h3>
                      <p className="text-xs text-slate-400">
                        View user credentials, passwords, login timestamps, and edit or grant VIP status.
                      </p>
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        placeholder="Search by username or email..."
                        className="w-full bg-[#181a28] text-xs rounded-lg pl-9 pr-3 py-2 border border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="divide-y divide-slate-800 bg-[#131522] rounded-xl border border-slate-800 overflow-hidden">
                    {filteredUsers.map((u) => (
                      <div
                        key={u.id}
                        className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-[#181b2a] transition"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar}
                            alt={u.username}
                            className="w-12 h-12 rounded-full border border-amber-400 object-cover shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-white">{u.username}</span>
                              {u.isVip ? (
                                <span className="text-[10px] font-black bg-amber-950 text-amber-300 border border-amber-500/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Crown className="w-3 h-3 fill-amber-300" /> VIP MEMBER
                                </span>
                              ) : (
                                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                                  Free User
                                </span>
                              )}
                              {u.vipBlockedUntil && new Date(u.vipBlockedUntil).getTime() > Date.now() && (
                                <span className="text-[10px] font-bold bg-red-950 text-red-300 border border-red-700 px-1.5 py-0.5 rounded flex items-center gap-1">
                                  <Ban className="w-2.5 h-2.5" /> 7D Fake TrxID Blocked
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5 flex flex-wrap gap-2">
                              <span>Password: <strong className="font-mono text-amber-300">{u.password || 'N/A'}</strong></span>
                              <span>•</span>
                              <span>Email: {u.email}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Registered: {u.createdAt} • Last Login: <strong className="text-emerald-400">{u.lastLoginAt}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
                          <button
                            onClick={() => handleOpenEditUser(u)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition cursor-pointer"
                            title="Edit user username, name, password, likes & stats"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit User</span>
                          </button>

                          <button
                            onClick={() => {
                              updateUserByAdmin(u.id, { isVip: !u.isVip });
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                              u.isVip
                                ? 'bg-amber-950 text-amber-300 border border-amber-500/40 hover:bg-amber-900'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            }`}
                          >
                            {u.isVip ? 'Revoke VIP' : 'Grant VIP'}
                          </button>

                          {u.vipBlockedUntil && new Date(u.vipBlockedUntil).getTime() > Date.now() ? (
                            <button
                              onClick={() => unblockUserFromVip(u.id)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-emerald-900 transition cursor-pointer"
                            >
                              Unblock VIP
                            </button>
                          ) : (
                            <button
                              onClick={() => blockUserFromVip(u.id)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-950/70 text-rose-300 border border-rose-800 hover:bg-rose-900 transition cursor-pointer"
                              title="Block user for 7 days from VIP applications for fake TrxID"
                            >
                              Block 7D (Fake TrxID)
                            </button>
                          )}

                          <button
                            onClick={() => deleteUserByAdmin(u.id)}
                            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800 cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SUB-ADMINS (Max 3 admins total) */}
              {currentTab === 'subadmins' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-amber-400" />
                      Administrators & Sub-Admins Management
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Security policy: Maximum 3 total admins allowed (1 Super-Admin + up to 2 Sub-Admins).
                    </p>
                  </div>

                  {/* Super-Admin Card */}
                  <div className="p-4 rounded-xl bg-[#161a29] border border-amber-500/40 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-amber-300">
                          Master Super-Admin (You)
                        </span>
                        <span className="text-[10px] font-black bg-amber-500 text-black px-1.5 py-0.2 rounded">
                          OWNER
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1 font-mono">
                        Username: <strong className="text-white">{siteSettings.adminUsername}</strong> • Password: <strong className="text-amber-300">Protected</strong>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-400 font-bold">Primary Root</span>
                  </div>

                  {/* Sub-Admins List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Sub-Admins ({subAdmins.length}/2 Active)
                    </h4>
                    {subAdmins.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-4 rounded-xl bg-[#141624] border border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-bold text-white">{sub.name}</div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5">
                            Username: <strong className="text-amber-300">{sub.username}</strong> • Password: <strong className="text-amber-300">{sub.passwordHash}</strong>
                          </div>
                          <div className="text-[10px] text-slate-500">Created: {sub.createdAt}</div>
                        </div>
                        <button
                          onClick={() => removeSubAdmin(sub.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-semibold border border-red-800 transition cursor-pointer"
                        >
                          Remove Sub-Admin
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Sub-Admin Form if under limit */}
                  {subAdmins.length < 2 && (
                    <form
                      onSubmit={handleAddSubAdmin}
                      className="p-4 rounded-xl bg-[#141624] border border-slate-800 space-y-3 max-w-xl"
                    >
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <UserPlus className="w-4 h-4" /> Add New Sub-Admin
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          value={newSubName}
                          onChange={(e) => setNewSubName(e.target.value)}
                          placeholder="Full Name (e.g. Shakil Moderator)"
                          className="bg-[#1a1d2e] text-xs rounded-lg p-2 border border-slate-700"
                        />
                        <input
                          type="text"
                          required
                          value={newSubUsername}
                          onChange={(e) => setNewSubUsername(e.target.value)}
                          placeholder="Username"
                          className="bg-[#1a1d2e] text-xs rounded-lg p-2 border border-slate-700"
                        />
                        <input
                          type="email"
                          value={newSubEmail}
                          onChange={(e) => setNewSubEmail(e.target.value)}
                          placeholder="Email Address"
                          className="bg-[#1a1d2e] text-xs rounded-lg p-2 border border-slate-700"
                        />
                        <input
                          type="password"
                          required
                          value={newSubPassword}
                          onChange={(e) => setNewSubPassword(e.target.value)}
                          placeholder="Login Password"
                          className="bg-[#1a1d2e] text-xs rounded-lg p-2 border border-slate-700"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg uppercase tracking-wider transition cursor-pointer"
                      >
                        Create Sub-Admin Account
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 5: VIP ORDERS & PRICING ADJUSTMENT */}
              {currentTab === 'orders' && (
                <div className="space-y-6">
                  {/* Pricing adjustment controls */}
                  <div className="p-4 rounded-xl bg-[#141624] border border-amber-500/30 space-y-3">
                    <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Adjust VIP Subscription Prices (BDT)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Change the price of VIP packages anytime. Updates immediately on the user payment screen.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {vipPackages.map((pkg) => (
                        <div key={pkg.id} className="p-3 rounded-lg bg-[#191c2b] border border-slate-800 space-y-1">
                          <span className="text-xs font-bold text-slate-200">{pkg.title}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-400">৳</span>
                            <input
                              type="number"
                              defaultValue={pkg.priceBdt}
                              onBlur={(e) => {
                                const val = Number(e.target.value);
                                if (val > 0) updateVipPackagePrice(pkg.id, val);
                              }}
                              className="w-full bg-[#121420] text-xs font-bold text-amber-400 p-1.5 rounded border border-slate-700 tabular-nums"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Transactions table */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Pending & Past Transactions ({vipOrders.length})
                    </h4>
                    {vipOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-xl bg-[#141624] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{ord.userName}</span>
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                                ord.gateway === 'bkash'
                                  ? 'bg-[#e2136e] text-white'
                                  : ord.gateway === 'nagad'
                                  ? 'bg-[#f7941d] text-white'
                                  : 'bg-[#8c3494] text-white'
                              }`}
                            >
                              {ord.gateway}
                            </span>
                            <span className="text-xs font-black text-amber-400">
                              ৳ {ord.priceBdt} BDT ({ord.packageType})
                            </span>
                          </div>
                          <div className="text-xs text-slate-300">
                            Sender Phone: <span className="font-mono font-bold text-white">{ord.userPhone}</span> • TrxID:{' '}
                            <span className="font-mono font-extrabold text-amber-300 bg-black/40 px-1.5 py-0.5 rounded">
                              {ord.trxId}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500">Submitted: {ord.createdAt}</div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center flex-wrap">
                          {ord.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => approveVipOrder(ord.id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow transition cursor-pointer"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Accept & Grant VIP</span>
                              </button>
                              <button
                                onClick={() => rejectVipOrder(ord.id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-950 text-red-300 hover:bg-red-900 rounded-lg text-xs font-semibold border border-red-800 transition cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          ) : (
                            <span
                              className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                                ord.status === 'approved'
                                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-600/50'
                                  : 'bg-red-950/80 text-red-400 border border-red-600/50'
                              }`}
                            >
                              {ord.status}
                            </span>
                          )}

                          {/* Block user for 7 days if submitted fake TrxID */}
                          <button
                            onClick={() => blockUserFromVip(ord.userId)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-lg text-xs font-semibold border border-rose-800/80 transition cursor-pointer"
                            title="Block this user from applying for VIP for 7 days due to fake TrxID"
                          >
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                            <span>Block 7D (Fake TrxID)</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: PAYMENT GATEWAYS (bKash, Nagad, Rocket, Binance, WebMoney) */}
              {currentTab === 'gateways' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-amber-400" />
                        Payment Gateways Control (bKash, Nagad, Rocket, Binance, WebMoney)
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        টগল অন/অফ করুন এবং বিকাশ, নগদ, রকেট, বাইনান্স ও ওয়েবমানির নম্বর বা অ্যাড্রেস সেটআপ করুন। অফ থাকলে পেমেন্ট স্ক্রিনে দেখাবে না।
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {paymentMethods.map((pm) => {
                      return (
                        <div
                          key={pm.id}
                          className={`p-4 sm:p-5 rounded-2xl border transition ${
                            pm.enabled
                              ? 'bg-[#141624] border-slate-800'
                              : 'bg-[#11131c] border-slate-800/60 opacity-80'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-xs shadow-md shrink-0"
                                style={{ backgroundColor: pm.themeColor || '#e2136e' }}
                              >
                                {pm.id === 'bkash' ? 'bK' : pm.id === 'nagad' ? 'NG' : pm.id === 'rocket' ? 'RC' : pm.id === 'binance' ? 'BN' : 'WM'}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                  <span>{pm.name}</span>
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      pm.enabled
                                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/60'
                                        : 'bg-red-950 text-red-400 border border-red-700/60'
                                    }`}
                                  >
                                    {pm.enabled ? 'ACTIVE (ON)' : 'DISABLED (OFF)'}
                                  </span>
                                </h4>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  Gateway: {pm.id}
                                </span>
                              </div>
                            </div>

                            {/* ON / OFF Switch */}
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-400">Method Status:</span>
                              <button
                                type="button"
                                onClick={() => {
                                  updatePaymentMethod(pm.id, { enabled: !pm.enabled });
                                  showToast(`${pm.name} is now ${!pm.enabled ? 'ON (Active)' : 'OFF (Disabled)'}`);
                                }}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer ${
                                  pm.enabled ? 'bg-emerald-500' : 'bg-slate-700'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                    pm.enabled ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                              <span className={`text-xs font-bold ${pm.enabled ? 'text-emerald-400' : 'text-red-400'}`}>
                                {pm.enabled ? 'ON' : 'OFF'}
                              </span>
                            </div>
                          </div>

                          {/* Form fields */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            <div>
                              <label className="text-xs font-semibold text-slate-300 block mb-1">
                                Display Name
                              </label>
                              <input
                                type="text"
                                defaultValue={pm.name}
                                onBlur={(e) => {
                                  updatePaymentMethod(pm.id, { name: e.target.value });
                                  showToast('Gateway name updated');
                                }}
                                className="w-full bg-[#181a28] text-xs text-slate-100 rounded-lg p-2.5 border border-slate-700 focus:outline-none focus:border-amber-400"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-semibold text-slate-300 block mb-1">
                                Wallet Number / Pay ID / Address
                              </label>
                              <input
                                type="text"
                                defaultValue={pm.numberOrAddress}
                                onBlur={(e) => {
                                  updatePaymentMethod(pm.id, { numberOrAddress: e.target.value });
                                  showToast('Gateway number/address updated');
                                }}
                                className="w-full bg-[#181a28] text-xs font-mono text-amber-300 rounded-lg p-2.5 border border-slate-700 focus:outline-none focus:border-amber-400"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="text-xs font-semibold text-slate-300 block mb-1">
                                Payment Instructions (Shown to user in VIP Modal)
                              </label>
                              <input
                                type="text"
                                defaultValue={pm.instructions}
                                onBlur={(e) => {
                                  updatePaymentMethod(pm.id, { instructions: e.target.value });
                                  showToast('Instructions updated');
                                }}
                                className="w-full bg-[#181a28] text-xs text-slate-100 rounded-lg p-2.5 border border-slate-700 focus:outline-none focus:border-amber-400"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 6: CUSTOM SIDEBAR LINKS */}
              {currentTab === 'links' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <LinkIcon className="w-5 h-5 text-amber-400" />
                      Manage Sidebar Links & Telegram Channels
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Add custom promotional links, Telegram channels, or backup links to the left side menu.
                    </p>
                  </div>

                  <form
                    onSubmit={handleAddCustomLink}
                    className="p-4 rounded-xl bg-[#141624] border border-slate-800 space-y-3 max-w-xl"
                  >
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      + Add New Menu Link
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        required
                        value={newLinkTitle}
                        onChange={(e) => setNewLinkTitle(e.target.value)}
                        placeholder="Link Title (e.g. VIP Telegram)"
                        className="bg-[#1a1d2e] text-xs rounded-lg p-2 border border-slate-700"
                      />
                      <input
                        type="url"
                        required
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        placeholder="Target URL (https://...)"
                        className="bg-[#1a1d2e] text-xs rounded-lg p-2 border border-slate-700"
                      />
                      <input
                        type="text"
                        value={newLinkBadge}
                        onChange={(e) => setNewLinkBadge(e.target.value)}
                        placeholder="Badge (e.g. HOT)"
                        className="bg-[#1a1d2e] text-xs rounded-lg p-2 border border-slate-700"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg uppercase tracking-wider transition cursor-pointer"
                    >
                      Save Link to Sidebar
                    </button>
                  </form>

                  <div className="divide-y divide-slate-800 bg-[#131522] rounded-xl border border-slate-800">
                    {customSidebarLinks.map((l) => (
                      <div key={l.id} className="p-3.5 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{l.title}</span>
                            {l.badge && (
                              <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1 rounded">
                                {l.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">{l.url}</div>
                        </div>
                        <button
                          onClick={() => deleteCustomSidebarLink(l.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-900/40 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: CATEGORIES */}
              {currentTab === 'categories' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-[#141624] border border-slate-800">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Add New Category
                    </h4>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newCatName.trim()) return;
                        addCategory(newCatName.trim(), newCatSlug.trim() || newCatName.trim());
                        setNewCatName('');
                        setNewCatSlug('');
                      }}
                      className="flex flex-col sm:flex-row gap-2"
                    >
                      <input
                        type="text"
                        required
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="Category Name"
                        className="flex-1 bg-[#1a1d2d] text-slate-100 text-xs sm:text-sm rounded-lg px-3 py-2 border border-slate-700"
                      />
                      <input
                        type="text"
                        value={newCatSlug}
                        onChange={(e) => setNewCatSlug(e.target.value)}
                        placeholder="Slug (optional)"
                        className="flex-1 bg-[#1a1d2d] text-slate-100 text-xs sm:text-sm rounded-lg px-3 py-2 border border-slate-700"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-lg transition cursor-pointer"
                      >
                        Add Category
                      </button>
                    </form>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="p-3 rounded-xl bg-[#131522] border border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-bold text-slate-200">{cat.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            slug: {cat.slug} • Count: <strong className="text-emerald-400">{cat.count}</strong>
                          </div>
                        </div>
                        {cat.id !== 'all' && (
                          <button
                            onClick={() => deleteCategory(cat.id)}
                            className="p-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-900/50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: COMMENTS */}
              {currentTab === 'comments' && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-red-500" />
                    Moderate Video Comments ({comments.length})
                  </h3>
                  <div className="space-y-2">
                    {comments.map((cm) => (
                      <div
                        key={cm.id}
                        className="p-3 rounded-xl bg-[#131522] border border-slate-800 flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-red-400">{cm.userName}</span>
                            <span className="text-slate-500">{cm.createdAt}</span>
                          </div>
                          <p className="text-xs text-slate-200">{cm.text}</p>
                        </div>
                        <button
                          onClick={() => deleteComment(cm.id)}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-900/40 cursor-pointer"
                          title="Delete Comment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 9: ADS */}
              {currentTab === 'ads' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateAdSettings({
                      topBannerHtml,
                      topBannerImage: topBannerImg,
                      topBannerLink,
                      smartLink1,
                      smartLink2,
                      smartLink3,
                      directDownloadLink: directDownload,
                      popunderCode,
                      popunderEnabled,
                      socialBarCode,
                      socialBarEnabled,
                    });
                    showToast('Ad Settings Saved! Popunder & Social Bar connected above </body>');
                  }}
                  className="p-4 sm:p-5 rounded-xl bg-[#131522] border border-slate-800 space-y-5 max-w-3xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        Monetization & Ad Networks Script Integration
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Popunder এবং Social Bar অ্যাড কোড সরাসরি &lt;/body&gt; ট্যাগের উপরে যুক্ত হবে এবং লাইভ কাজ করবে।
                      </p>
                    </div>
                  </div>

                  {/* 1. POPUNDER ADS CODE (Injected directly above </body>) */}
                  <div className="p-4 rounded-xl bg-[#171926] border border-amber-500/40 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                          <label className="text-xs font-bold text-amber-300">
                            1. Popunder Ad Script Code (বডি &lt;/body&gt; ট্যাগের ঠিক উপরে বসবে)
                          </label>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          সাইটের যেকোনো জায়গায় ইউজার ক্লিক করলেই পপআন্ডার কার্যকর হবে। কোডটি &lt;/body&gt; ট্যাগের ঠিক উপরে বসানো হয়েছে।
                        </p>
                      </div>

                      {/* Popunder ON/OFF Toggle */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setPopunderEnabled(!popunderEnabled)}
                          className={`relative inline-flex h-5 w-10 items-center rounded-full transition cursor-pointer ${
                            popunderEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${
                              popunderEnabled ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <span className={`text-[11px] font-bold ${popunderEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {popunderEnabled ? 'ON' : 'OFF'}
                        </span>
                      </div>
                    </div>

                    <textarea
                      rows={3}
                      value={popunderCode}
                      onChange={(e) => setPopunderCode(e.target.value)}
                      placeholder="<!-- Paste your Popunder Ad Script here (e.g. Adsterra / Monetag / PropellerAds) -->&#10;<script type='text/javascript' src='//pl12345678.highcpmgate.com/ab/cd/ef/invoke.js'></script>"
                      className="w-full bg-[#10121d] text-amber-200 font-mono text-xs rounded-lg p-3 border border-slate-700/80 focus:outline-none focus:border-amber-400"
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Ad Placement: <strong className="text-slate-300 font-mono">Right above &lt;/body&gt;</strong></span>
                      <span className="text-amber-400/90 font-mono">{popunderCode.length > 0 ? `${popunderCode.length} chars configured` : 'Empty (Ready for script)'}</span>
                    </div>
                  </div>

                  {/* 2. SOCIAL BAR ADS CODE (Injected directly above </body>, below Popunder) */}
                  <div className="p-4 rounded-xl bg-[#171926] border border-blue-500/40 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                          <label className="text-xs font-bold text-blue-300">
                            2. Social Bar Ad Script Code (বডি &lt;/body&gt; ট্যাগের উপরে ও Popunder-এর নিচে বসবে)
                          </label>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          সোশ্যাল বার পুশ নোটিফিকেশন/বার অ্যাড কোড সরাসরি &lt;/body&gt; ট্যাগের উপরে এবং পপআন্ডার কোডের নিচে বসবে।
                        </p>
                      </div>

                      {/* Social Bar ON/OFF Toggle */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setSocialBarEnabled(!socialBarEnabled)}
                          className={`relative inline-flex h-5 w-10 items-center rounded-full transition cursor-pointer ${
                            socialBarEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${
                              socialBarEnabled ? 'translate-x-5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                        <span className={`text-[11px] font-bold ${socialBarEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {socialBarEnabled ? 'ON' : 'OFF'}
                        </span>
                      </div>
                    </div>

                    <textarea
                      rows={3}
                      value={socialBarCode}
                      onChange={(e) => setSocialBarCode(e.target.value)}
                      placeholder="<!-- Paste your Social Bar Script here -->&#10;<script type='text/javascript' src='//alwingulla.com/88/a2/3c/88a23c3b01938b.js'></script>"
                      className="w-full bg-[#10121d] text-blue-200 font-mono text-xs rounded-lg p-3 border border-slate-700/80 focus:outline-none focus:border-blue-400"
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Ad Placement: <strong className="text-slate-300 font-mono">Right below Popunder, above &lt;/body&gt;</strong></span>
                      <span className="text-blue-400/90 font-mono">{socialBarCode.length > 0 ? `${socialBarCode.length} chars configured` : 'Empty (Ready for script)'}</span>
                    </div>
                  </div>

                  {/* 3. Top Banner 728x90 */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      728x90 Header Ad Code (HTML/Script)
                    </label>
                    <textarea
                      rows={2}
                      value={topBannerHtml}
                      onChange={(e) => setTopBannerHtml(e.target.value)}
                      placeholder="Paste Adsterra banner script..."
                      className="w-full bg-[#181b2a] text-slate-100 font-mono text-xs rounded-lg p-2.5 border border-slate-700"
                    />
                  </div>

                  {/* 4. Download 3-Step Smart Links */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <label className="text-xs font-bold text-amber-300 block">
                      Download 3-Step Smart Links (ফ্রি ডাউনলোডের জন্য ৩টি স্মার্টলিংক)
                    </label>
                    <input
                      type="text"
                      value={smartLink1}
                      onChange={(e) => setSmartLink1(e.target.value)}
                      placeholder="Smartlink 1"
                      className="w-full bg-[#181b2a] text-slate-100 font-mono text-xs rounded-lg p-2 border border-slate-700"
                    />
                    <input
                      type="text"
                      value={smartLink2}
                      onChange={(e) => setSmartLink2(e.target.value)}
                      placeholder="Smartlink 2"
                      className="w-full bg-[#181b2a] text-slate-100 font-mono text-xs rounded-lg p-2 border border-slate-700"
                    />
                    <input
                      type="text"
                      value={smartLink3}
                      onChange={(e) => setSmartLink3(e.target.value)}
                      placeholder="Smartlink 3"
                      className="w-full bg-[#181b2a] text-slate-100 font-mono text-xs rounded-lg p-2 border border-slate-700"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-lg uppercase tracking-wider transition shadow-lg cursor-pointer"
                    >
                      Save Ad Settings & Connect Codes
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 10: SETTINGS */}
              {currentTab === 'settings' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateSiteSettings({
                      siteTitle,
                      siteLogoText: siteLogo,
                      adminUsername: adminUsernameInput,
                      adminPasswordHash: adminPasswordInput,
                      bkashNumber: bkashNum,
                      nagadNumber: nagadNum,
                      rocketNumber: rocketNum,
                      antiCopyEnabled: antiCopyToggle,
                      ageGateEnabled: ageGateToggle,
                    });
                  }}
                  className="p-4 sm:p-5 rounded-xl bg-[#131522] border border-slate-800 space-y-4 max-w-2xl"
                >
                  <h3 className="text-sm font-bold text-slate-200">
                    Site Branding, Mobile Banking Numbers & Security
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Site Name</label>
                      <input
                        type="text"
                        value={siteTitle}
                        onChange={(e) => setSiteTitle(e.target.value)}
                        className="w-full bg-[#181b2a] text-slate-100 text-xs rounded-lg p-2.5 border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Logo Text Badge</label>
                      <input
                        type="text"
                        value={siteLogo}
                        onChange={(e) => setSiteLogo(e.target.value)}
                        className="w-full bg-[#181b2a] text-slate-100 text-xs rounded-lg p-2.5 border border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <label className="text-xs font-bold text-amber-300 block">
                      Payment Phone Numbers (Personal Send Money)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={bkashNum}
                        onChange={(e) => setBkashNum(e.target.value)}
                        placeholder="bKash"
                        className="w-full bg-[#181b2a] text-slate-100 font-mono text-xs rounded-lg p-2 border border-slate-700"
                      />
                      <input
                        type="text"
                        value={nagadNum}
                        onChange={(e) => setNagadNum(e.target.value)}
                        placeholder="Nagad"
                        className="w-full bg-[#181b2a] text-slate-100 font-mono text-xs rounded-lg p-2 border border-slate-700"
                      />
                      <input
                        type="text"
                        value={rocketNum}
                        onChange={(e) => setRocketNum(e.target.value)}
                        placeholder="Rocket"
                        className="w-full bg-[#181b2a] text-slate-100 font-mono text-xs rounded-lg p-2 border border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <label className="text-xs font-bold text-amber-300 block">
                      Super-Admin Master Credentials
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={adminUsernameInput}
                        onChange={(e) => setAdminUsernameInput(e.target.value)}
                        className="w-full bg-[#181b2a] text-slate-100 text-xs rounded-lg p-2 border border-slate-700"
                      />
                      <input
                        type="text"
                        value={adminPasswordInput}
                        onChange={(e) => setAdminPasswordInput(e.target.value)}
                        className="w-full bg-[#181b2a] text-slate-100 font-mono text-xs rounded-lg p-2 border border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">Anti-Copy & Right Click Off</span>
                      <input
                        type="checkbox"
                        checked={antiCopyToggle}
                        onChange={(e) => setAntiCopyToggle(e.target.checked)}
                        className="w-4 h-4 accent-amber-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">18+ Age Verification Gate</span>
                      <input
                        type="checkbox"
                        checked={ageGateToggle}
                        onChange={(e) => setAgeGateToggle(e.target.checked)}
                        className="w-4 h-4 accent-amber-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg uppercase tracking-wider transition cursor-pointer"
                  >
                    Save All Site Settings
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Video Editor Modal (With Views & Likes & Embed controls) */}
        {isEditorOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-[#11131e] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
              <div className="flex items-center justify-between px-5 py-3.5 bg-[#161928] border-b border-slate-800 shrink-0">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <FileVideo className="w-4 h-4 text-amber-400" />
                  {editingVideoId ? 'Edit Video & Metrics' : 'Publish New Video (Embed Iframe)'}
                </h3>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveVideo} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Video Title</label>
                  <input
                    type="text"
                    required
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="e.g. 🔥 VXL-038"
                    className="w-full bg-[#181a28] text-slate-100 text-xs sm:text-sm rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
                    <select
                      value={videoCategory}
                      onChange={(e) => setVideoCategory(e.target.value)}
                      className="w-full bg-[#181a28] text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-700"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Duration</label>
                    <input
                      type="text"
                      value={videoDuration}
                      onChange={(e) => setVideoDuration(e.target.value)}
                      placeholder="18:42"
                      className="w-full bg-[#181a28] text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Quality</label>
                    <select
                      value={videoQuality}
                      onChange={(e) => setVideoQuality(e.target.value as any)}
                      className="w-full bg-[#181a28] text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-700"
                    >
                      <option value="HD">HD 1080p</option>
                      <option value="4K">4K Ultra HD</option>
                      <option value="SD">SD 720p</option>
                    </select>
                  </div>
                </div>

                {/* Direct Views, Likes & Dislikes Adjustment (As requested by user!) */}
                <div className="p-3 rounded-xl bg-[#171926] border border-amber-500/30 space-y-2">
                  <label className="text-xs font-bold text-amber-300 block">
                    Modify Video Live Metrics (Views & Likes)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-0.5">Total Views:</span>
                      <input
                        type="number"
                        value={videoViews}
                        onChange={(e) => setVideoViews(Number(e.target.value))}
                        className="w-full bg-[#121420] text-xs text-amber-400 font-bold p-2 rounded border border-slate-700"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-0.5">Total Likes:</span>
                      <input
                        type="number"
                        value={videoLikes}
                        onChange={(e) => setVideoLikes(Number(e.target.value))}
                        className="w-full bg-[#121420] text-xs text-rose-400 font-bold p-2 rounded border border-slate-700"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-0.5">Dislikes:</span>
                      <input
                        type="number"
                        value={videoDislikes}
                        onChange={(e) => setVideoDislikes(Number(e.target.value))}
                        className="w-full bg-[#121420] text-xs text-slate-300 font-bold p-2 rounded border border-slate-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Embed Iframe Code or Video URL */}
                <div className="p-3.5 rounded-xl bg-[#171926] border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-300 block">
                      Embed Iframe Code or Video URL <span className="text-red-400">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Streamtape / Dood / YouTube / Mega / mp4</span>
                  </div>
                  <textarea
                    rows={3}
                    required
                    value={videoEmbedCode}
                    onChange={(e) => setVideoEmbedCode(e.target.value)}
                    placeholder='<iframe src="https://streamtape.com/e/..." allowfullscreen></iframe> or https://...'
                    className="w-full bg-[#11131e] text-slate-100 font-mono text-xs rounded-lg p-2.5 border border-slate-700 focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[11px] text-slate-400">
                    যেকোনো সাইটের আইফ্রেম কোড বা ভিডিও লিঙ্ক সরাসরি পেস্ট করুন। কোড থেকে স্বয়ংক্রিয়ভাবে ভিডিও প্লে হবে।
                  </p>
                </div>

                {/* Thumbnail Cover Image (Optional) */}
                {(() => {
                  const autoDetectedThumb = extractThumbnailFromEmbed(videoEmbedCode);
                  const hasCustomCover = Boolean(videoThumbnailUrl && videoThumbnailUrl.trim().length > 0);
                  const previewSrc = hasCustomCover ? videoThumbnailUrl : autoDetectedThumb;

                  return (
                    <div className="p-3.5 rounded-xl bg-[#171926] border border-slate-800 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <label className="text-xs font-bold text-amber-300 block">
                            Cover Image (Optional / ঐচ্ছিক)
                          </label>
                          <span className="text-[11px] text-slate-400">
                            কাস্টম কভার না দিলে আইফ্রেমের ভিডিওর আসল কভার অটোমেটিক দেখাবে।
                          </span>
                        </div>
                        {hasCustomCover && (
                          <button
                            type="button"
                            onClick={() => {
                              setVideoThumbnailUrl('');
                              showToast('Custom cover removed. Using native iframe cover.');
                            }}
                            className="text-[11px] font-bold text-red-400 hover:text-red-300 underline cursor-pointer self-start sm:self-center"
                          >
                            Reset to Iframe Cover
                          </button>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 items-center">
                        <label className="flex-1 w-full cursor-pointer flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-200 border border-slate-700 transition">
                          <Upload className="w-4 h-4 text-amber-400" />
                          <span>Select from Phone Gallery</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleGalleryUpload}
                            className="hidden"
                          />
                        </label>
                        <span className="text-xs text-slate-500">OR</span>
                        <input
                          type="text"
                          value={videoThumbnailUrl}
                          onChange={(e) => setVideoThumbnailUrl(e.target.value)}
                          placeholder="Optional: Paste Custom Image URL"
                          className="flex-1 w-full bg-[#12141f] text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-700"
                        />
                      </div>

                      {/* Live Cover Preview */}
                      <div className="pt-1 flex items-center gap-3">
                        {previewSrc ? (
                          <div className="flex items-center gap-3 bg-[#11131e] p-2 rounded-lg border border-slate-800">
                            <img
                              src={previewSrc}
                              alt="Cover Preview"
                              className="w-24 h-14 object-cover rounded border border-slate-700 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider inline-block ${
                                  hasCustomCover
                                    ? 'bg-amber-950 text-amber-400 border border-amber-600/50'
                                    : 'bg-emerald-950 text-emerald-400 border border-emerald-600/50'
                                }`}
                              >
                                {hasCustomCover ? 'Custom Gallery Cover' : '✓ Auto-Detected from Iframe'}
                              </span>
                              <p className="text-[11px] text-slate-300 mt-0.5">
                                {hasCustomCover
                                  ? 'This custom cover will display on the video card.'
                                  : 'Iframe video native cover will display automatically.'}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic bg-[#11131e] p-2.5 rounded-lg border border-slate-800 w-full">
                            ℹ️ কাস্টম কভার সিলেক্ট করা হয়নি — আইফ্রেমের ভিডিওর আসল কভার অটোমেটিক ব্যবহার হবে।
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Mega Download Link */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Direct Mega.nz / Storage Download URL
                  </label>
                  <input
                    type="text"
                    value={videoDownloadUrl}
                    onChange={(e) => setVideoDownloadUrl(e.target.value)}
                    placeholder="https://mega.nz/file/..."
                    className="w-full bg-[#181a28] text-slate-100 font-mono text-xs rounded-lg px-3 py-2 border border-slate-700"
                  />
                </div>

                {/* Tags & VIP Toggle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={videoTags}
                      onChange={(e) => setVideoTags(e.target.value)}
                      placeholder="Public Bang, Desi, Leaks"
                      className="w-full bg-[#181a28] text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-700"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-4">
                    <input
                      type="checkbox"
                      id="isVipCheck"
                      checked={videoIsVip}
                      onChange={(e) => setVideoIsVip(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    <label htmlFor="isVipCheck" className="text-xs font-bold text-amber-300 cursor-pointer">
                      VIP Exclusive Video (Requires VIP Pass)
                    </label>
                  </div>
                </div>

                {/* Download Permission Toggle (Download ON / OFF) */}
                <div className="p-3.5 rounded-xl bg-[#171926] border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-amber-300 block">
                    Download Feature for Users (৩-স্টেপ বিজ্ঞাপন দেখে ফ্রি ডাউনলোড)
                  </label>
                  <div className="flex flex-wrap items-center gap-5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                      <input
                        type="radio"
                        name="videoDownloadToggle"
                        checked={videoDownloadEnabled === true}
                        onChange={() => setVideoDownloadEnabled(true)}
                        className="w-4 h-4 accent-emerald-500 cursor-pointer"
                      />
                      <span className="text-emerald-400">✅ Download ON (ডাউনলোড চালু - বিজ্ঞাপন দেখে ডাউনলোড করতে পারবে)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                      <input
                        type="radio"
                        name="videoDownloadToggle"
                        checked={videoDownloadEnabled === false}
                        onChange={() => setVideoDownloadEnabled(false)}
                        className="w-4 h-4 accent-red-500 cursor-pointer"
                      />
                      <span className="text-red-400">🚫 Download OFF (ডাউনলোড বন্ধ - স্ক্রিনে Download Off দেখাবে)</span>
                    </label>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-lg shadow uppercase tracking-wider cursor-pointer"
                  >
                    {editingVideoId ? 'Save Changes' : 'Publish Post'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* User Profile Edit Modal (Username, Name, Password, Likes, VIP) */}
        {editingUser && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-lg bg-[#11131e] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
              <div className="flex items-center justify-between px-5 py-3.5 bg-[#161928] border-b border-slate-800 shrink-0">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Edit className="w-4 h-4 text-amber-400" />
                  Edit User Profile & Credentials
                </h3>
                <button
                  onClick={() => setEditingUser(null)}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveUserEdit} className="p-5 overflow-y-auto space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={editUserName}
                    onChange={(e) => setEditUserName(e.target.value)}
                    className="w-full bg-[#181a28] text-slate-100 text-xs sm:text-sm rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editUserFullName}
                    onChange={(e) => setEditUserFullName(e.target.value)}
                    className="w-full bg-[#181a28] text-slate-100 text-xs sm:text-sm rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Password (Admin can change or reset)
                  </label>
                  <input
                    type="text"
                    required
                    value={editUserPassword}
                    onChange={(e) => setEditUserPassword(e.target.value)}
                    className="w-full bg-[#181a28] font-mono text-amber-300 text-xs sm:text-sm rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Profile Likes Count (Give Likes)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editUserLikes}
                      onChange={(e) => setEditUserLikes(Number(e.target.value))}
                      className="w-full bg-[#181a28] font-mono text-rose-400 text-xs sm:text-sm rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Active Time (Minutes)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editUserMinutes}
                      onChange={(e) => setEditUserMinutes(Number(e.target.value))}
                      className="w-full bg-[#181a28] font-mono text-emerald-400 text-xs sm:text-sm rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="editVipCheck"
                    checked={editUserIsVip}
                    onChange={(e) => setEditUserIsVip(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <label htmlFor="editVipCheck" className="text-xs font-bold text-amber-300 cursor-pointer">
                    Grant VIP Pass Status (VIP Member)
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-bold rounded-lg shadow uppercase tracking-wider cursor-pointer"
                  >
                    Save User Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
