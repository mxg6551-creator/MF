import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Video,
  Category,
  Comment,
  VipOrder,
  AdSettings,
  SiteSettings,
  SiteStats,
  User,
  SubAdmin,
  CustomSidebarLink,
  VipPackage,
  PaymentMethodConfig,
  PaymentGatewayType,
} from '../types';
import {
  INITIAL_VIDEOS,
  INITIAL_CATEGORIES,
  INITIAL_COMMENTS,
  INITIAL_STATS,
  INITIAL_AD_SETTINGS,
  INITIAL_SITE_SETTINGS,
  INITIAL_VIP_ORDERS,
  INITIAL_SUB_ADMINS,
  INITIAL_CUSTOM_SIDEBAR_LINKS,
  INITIAL_VIP_PACKAGES,
  INITIAL_USERS,
  INITIAL_PAYMENT_METHODS,
  ADULT_STAR_AVATARS,
} from '../services/initialData';
import { TRANSLATIONS, Language } from '../services/translations';

interface AppContextType {
  // Localization & Theme & Layout
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS.en) => string;
  isNightMode: boolean;
  setIsNightMode: (val: boolean) => void;
  isFullDisplay: boolean;
  setIsFullDisplay: (val: boolean) => void;
  isTwoColumnLayout: boolean;
  setIsTwoColumnLayout: (val: boolean) => void;

  // Data
  videos: Video[];
  categories: Category[];
  comments: Comment[];
  vipOrders: VipOrder[];
  adSettings: AdSettings;
  siteSettings: SiteSettings;
  stats: SiteStats;
  currentUser: User | null;
  activeVideo: Video | null;
  searchQuery: string;
  selectedCategory: string;
  pricingFilter: 'all' | 'free' | 'vip';
  isAgeGatePassed: boolean;

  // Modals & Navigation
  isSidebarOpen: boolean;
  isAdminOpen: boolean;
  isAdminLoggedIn: boolean;
  loggedInAdminRole: 'superadmin' | 'subadmin' | null;
  isAuthModalOpen: boolean;
  isVipModalOpen: boolean;
  isSettingsModalOpen: boolean;
  isLeaderboardOpen: boolean;
  isAdminMoonProfileOpen: boolean;
  isGuestLoginPromptOpen: boolean;
  isGuideModalOpen: boolean;
  toastMessage: string | null;

  // Sub-Admins, Links, Packages, Payments & Users
  subAdmins: SubAdmin[];
  customSidebarLinks: CustomSidebarLink[];
  vipPackages: VipPackage[];
  paymentMethods: PaymentMethodConfig[];
  users: User[];

  // Admin Moon Channel State
  adminMoonChannel: SiteSettings['adminMoonChannel'];
  isSubscribedToAdminMoon: boolean;
  subscribeToAdminMoon: () => void;
  likeAdminMoonChannel: () => void;

  // Setters
  setActiveVideo: (video: Video | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: string) => void;
  setPricingFilter: (filter: 'all' | 'free' | 'vip') => void;
  setIsAgeGatePassed: (val: boolean) => void;
  setIsSidebarOpen: (val: boolean) => void;
  setIsAdminOpen: (val: boolean) => void;
  setIsAuthModalOpen: (val: boolean) => void;
  setIsVipModalOpen: (val: boolean) => void;
  setIsSettingsModalOpen: (val: boolean) => void;
  setIsLeaderboardOpen: (val: boolean) => void;
  setIsAdminMoonProfileOpen: (val: boolean) => void;
  setIsGuestLoginPromptOpen: (val: boolean) => void;
  setIsGuideModalOpen: (val: boolean) => void;
  showToast: (msg: string) => void;

  // Video Management
  addVideo: (video: Omit<Video, 'id' | 'createdAt' | 'views' | 'likes' | 'dislikes'>) => void;
  updateVideo: (id: string, updated: Partial<Video>) => void;
  deleteVideo: (id: string) => void;
  incrementVideoView: (id: string) => void;
  likeVideo: (id: string) => void;
  dislikeVideo: (id: string) => void;
  toggleSaveVideo: (id: string) => void;
  recordVideoWatch: (videoId: string) => void;

  // Comments
  addComment: (videoId: string, text: string) => boolean;
  deleteComment: (commentId: string) => void;

  // VIP & Payments
  submitVipOrder: (order: {
    userPhone: string;
    packageType: '1 Month' | '3 Months' | '6 Months' | '1 Year';
    priceBdt: number;
    gateway: PaymentGatewayType;
    trxId: string;
  }) => { success: boolean; message: string };
  approveVipOrder: (orderId: string) => void;
  rejectVipOrder: (orderId: string) => void;
  blockUserFromVip: (userId: string) => void;
  unblockUserFromVip: (userId: string) => void;
  updateVipPackagePrice: (id: '1 Month' | '3 Months' | '6 Months' | '1 Year', newPrice: number) => void;
  updatePaymentMethod: (id: PaymentGatewayType, updated: Partial<PaymentMethodConfig>) => void;

  // Settings & Monetization
  updateAdSettings: (newAds: Partial<AdSettings>) => void;
  updateSiteSettings: (newSettings: Partial<SiteSettings>) => void;

  // Categories & Sub-Admins & Links
  addCategory: (name: string, slug: string) => void;
  deleteCategory: (id: string) => void;
  addSubAdmin: (admin: Omit<SubAdmin, 'id' | 'createdAt'>) => boolean;
  removeSubAdmin: (id: string) => void;
  addCustomSidebarLink: (link: Omit<CustomSidebarLink, 'id'>) => void;
  updateCustomSidebarLink: (id: string, updated: Partial<CustomSidebarLink>) => void;
  deleteCustomSidebarLink: (id: string) => void;

  // User Actions & Leaderboard
  registerOrLoginUser: (username: string, password?: string, country?: string) => { success: boolean; message: string };
  logoutUser: () => void;
  changeUsername: (newUsername: string) => { success: boolean; message: string };
  changePassword: (oldPass: string, newPass: string) => { success: boolean; message: string };
  changeAvatar: (newAvatarUrl: string) => { success: boolean; message: string };
  changeBio: (newBio: string) => { success: boolean; message: string };
  changeCountry: (newCountryCode: string) => void;
  likeUserProfile: (targetUserId: string) => { success: boolean; message: string };
  updateUserByAdmin: (userId: string, updated: Partial<User>) => void;
  deleteUserByAdmin: (userId: string) => void;

  // Admin Auth
  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdmin: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('mmshub_language') as Language) || 'en';
  });

  const [isNightMode, setIsNightMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('mmshub_night_mode');
    return saved !== null ? saved === 'true' : true;
  });

  const [isFullDisplay, setIsFullDisplayState] = useState<boolean>(() => {
    const saved = localStorage.getItem('mmshub_full_display');
    return saved !== null ? saved === 'true' : true;
  });

  const [isTwoColumnLayout, setIsTwoColumnLayout] = useState<boolean>(() => {
    const saved = localStorage.getItem('mmshub_full_display');
    if (saved !== null) return saved !== 'true';
    return localStorage.getItem('mmshub_2col_layout') === 'true';
  });

  const setIsFullDisplay = (val: boolean) => {
    setIsFullDisplayState(val);
    setIsTwoColumnLayout(!val);
    localStorage.setItem('mmshub_full_display', val ? 'true' : 'false');
    localStorage.setItem('mmshub_2col_layout', val ? 'false' : 'true');
  };

  const [videos, setVideos] = useState<Video[]>(() => {
    const saved = localStorage.getItem('mmshub_videos');
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });

  const [baseCategories, setBaseCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('mmshub_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const categories = React.useMemo(() => {
    return baseCategories.map((cat) => {
      if (cat.slug === 'all') {
        return { ...cat, count: videos.length };
      }
      const realCount = videos.filter((v) => v.category === cat.slug).length;
      return { ...cat, count: realCount };
    });
  }, [baseCategories, videos]);

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('mmshub_comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [vipOrders, setVipOrders] = useState<VipOrder[]>(() => {
    const saved = localStorage.getItem('mmshub_vip_orders');
    return saved ? JSON.parse(saved) : INITIAL_VIP_ORDERS;
  });

  const [vipPackages, setVipPackages] = useState<VipPackage[]>(() => {
    const saved = localStorage.getItem('mmshub_vip_packages');
    return saved ? JSON.parse(saved) : INITIAL_VIP_PACKAGES;
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>(() => {
    const saved = localStorage.getItem('mmshub_payment_methods');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENT_METHODS;
  });

  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>(() => {
    const saved = localStorage.getItem('mmshub_sub_admins');
    return saved ? JSON.parse(saved) : INITIAL_SUB_ADMINS;
  });

  const [customSidebarLinks, setCustomSidebarLinks] = useState<CustomSidebarLink[]>(() => {
    const saved = localStorage.getItem('mmshub_custom_links');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOM_SIDEBAR_LINKS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('mmshub_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [adSettings, setAdSettings] = useState<AdSettings>(() => {
    const saved = localStorage.getItem('mmshub_ads');
    return saved ? JSON.parse(saved) : INITIAL_AD_SETTINGS;
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('mmshub_site_settings');
    return saved ? JSON.parse(saved) : INITIAL_SITE_SETTINGS;
  });

  const [stats, setStats] = useState<SiteStats>(() => {
    const saved = localStorage.getItem('mmshub_stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  // Current logged in user: default is null (visitor has no account until logged in/registered)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mmshub_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [loggedInAdminRole, setLoggedInAdminRole] = useState<'superadmin' | 'subadmin' | null>(null);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [pricingFilter, setPricingFilter] = useState<'all' | 'free' | 'vip'>('all');
  const [isAgeGatePassed, setIsAgeGatePassed] = useState<boolean>(() => {
    return localStorage.getItem('mmshub_age_gate') === 'passed';
  });

  // Modals
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isAdminMoonProfileOpen, setIsAdminMoonProfileOpen] = useState(false);
  const [isGuestLoginPromptOpen, setIsGuestLoginPromptOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Admin Moon Channel state
  const [adminMoonChannel, setAdminMoonChannel] = useState(siteSettings.adminMoonChannel);
  const [isSubscribedToAdminMoon, setIsSubscribedToAdminMoon] = useState<boolean>(() => {
    return localStorage.getItem('mmshub_sub_moon') === 'true';
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('mmshub_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('mmshub_night_mode', isNightMode ? 'true' : 'false');
    if (isNightMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isNightMode]);

  useEffect(() => {
    localStorage.setItem('mmshub_2col_layout', isTwoColumnLayout ? 'true' : 'false');
  }, [isTwoColumnLayout]);

  useEffect(() => {
    localStorage.setItem('mmshub_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('mmshub_categories', JSON.stringify(baseCategories));
  }, [baseCategories]);

  useEffect(() => {
    localStorage.setItem('mmshub_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('mmshub_vip_orders', JSON.stringify(vipOrders));
  }, [vipOrders]);

  useEffect(() => {
    localStorage.setItem('mmshub_vip_packages', JSON.stringify(vipPackages));
  }, [vipPackages]);

  useEffect(() => {
    localStorage.setItem('mmshub_payment_methods', JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  useEffect(() => {
    localStorage.setItem('mmshub_sub_admins', JSON.stringify(subAdmins));
  }, [subAdmins]);

  useEffect(() => {
    localStorage.setItem('mmshub_custom_links', JSON.stringify(customSidebarLinks));
  }, [customSidebarLinks]);

  useEffect(() => {
    localStorage.setItem('mmshub_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('mmshub_ads', JSON.stringify(adSettings));
  }, [adSettings]);

  useEffect(() => {
    localStorage.setItem('mmshub_site_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('mmshub_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mmshub_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mmshub_current_user');
    }
  }, [currentUser]);

  // Live time-on-site tracker for logged-in user: only counts when tab is active/visible
  // Pauses automatically when tab is hidden or user leaves, resumes seamlessly on return
  useEffect(() => {
    if (!currentUser) return;

    let tickCount = 0;
    const timer = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        tickCount += 1;
        setCurrentUser((prev) => {
          if (!prev) return null;
          const updatedSeconds = (prev.timeSpentSeconds || 0) + 1;
          return {
            ...prev,
            timeSpentSeconds: updatedSeconds,
            isOnline: true,
            lastActiveAt: 'Just now',
          };
        });

        // Sync to users collection every 5 seconds for smooth performance
        if (tickCount % 5 === 0) {
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.id === currentUser.id
                ? {
                    ...u,
                    timeSpentSeconds: (u.timeSpentSeconds || 0) + 5,
                    isOnline: true,
                    lastActiveAt: 'Just now',
                  }
                : u
            )
          );
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentUser?.id]);

  // Periodic guest login prompt (5-7 minutes = 360 seconds)
  useEffect(() => {
    const promptInterval = setInterval(() => {
      if (!currentUser || currentUser.id === 'u-guest' || currentUser.username === 'Guest_Viewer') {
        setIsGuestLoginPromptOpen(true);
      }
    }, 360000);
    return () => clearInterval(promptInterval);
  }, [currentUser]);

  // Anti-Copy & Context Menu protection
  useEffect(() => {
    if (!siteSettings.antiCopyEnabled) return;
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isAdminLoggedIn || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === 'u' || e.key === 'U')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
        e.key === 'F12'
      ) {
        if (!isAdminLoggedIn) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [siteSettings.antiCopyEnabled, isAdminLoggedIn]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  const t = (key: keyof typeof TRANSLATIONS.en): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || '';
  };

  // Video Management
  const addVideo = (newVidData: Omit<Video, 'id' | 'createdAt' | 'views' | 'likes' | 'dislikes'>) => {
    const newVideo: Video = {
      ...newVidData,
      id: `v-${Date.now()}`,
      createdAt: 'Just now',
      views: 1,
      likes: 1,
      dislikes: 0,
      downloadEnabled: newVidData.downloadEnabled !== false,
    };
    setVideos((prev) => [newVideo, ...prev]);
    setStats((prev) => ({
      ...prev,
      totalPosts: prev.totalPosts + 1,
      todayViews: prev.todayViews + 1,
      allTimeViews: prev.allTimeViews + 1,
    }));
    showToast('Video published successfully!');
  };

  const updateVideo = (id: string, updated: Partial<Video>) => {
    setVideos((prev) =>
      prev.map((vid) => (vid.id === id ? { ...vid, ...updated } : vid))
    );
    if (activeVideo && activeVideo.id === id) {
      setActiveVideo((prev) => (prev ? { ...prev, ...updated } : null));
    }
    showToast('Video updated successfully.');
  };

  const deleteVideo = (id: string) => {
    setVideos((prev) => prev.filter((vid) => vid.id !== id));
    if (activeVideo && activeVideo.id === id) {
      setActiveVideo(null);
    }
    setStats((prev) => ({ ...prev, totalPosts: Math.max(0, prev.totalPosts - 1) }));
    showToast('Video deleted.');
  };

  const incrementVideoView = (id: string) => {
    setVideos((prev) =>
      prev.map((vid) => (vid.id === id ? { ...vid, views: vid.views + 1 } : vid))
    );
    setStats((prev) => ({
      ...prev,
      todayViews: prev.todayViews + 1,
      allTimeViews: prev.allTimeViews + 1,
      thisMonthViews: prev.thisMonthViews + 1,
    }));
  };

  const recordVideoWatch = (videoId: string) => {
    if (!currentUser) return;
    const now = 'Just now';
    const history = currentUser.watchHistory || [];
    const filteredHistory = history.filter((h) => h.videoId !== videoId);
    const updatedHistory = [{ videoId, watchedAt: now }, ...filteredHistory].slice(0, 10);
    const updatedUser: User = {
      ...currentUser,
      watchHistory: updatedHistory,
      videosWatchedCount: (currentUser.videosWatchedCount || 0) + 1,
    };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
  };

  const likeVideo = (id: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      showToast('Please login or register to like videos!');
      return;
    }
    const isLiked = currentUser.likedVideoIds.includes(id);
    let updatedLikes: string[];
    if (isLiked) {
      updatedLikes = currentUser.likedVideoIds.filter((vId) => vId !== id);
      setVideos((prev) =>
        prev.map((v) => (v.id === id ? { ...v, likes: Math.max(0, v.likes - 1) } : v))
      );
      showToast('Removed like');
    } else {
      updatedLikes = [...currentUser.likedVideoIds, id];
      setVideos((prev) =>
        prev.map((v) => (v.id === id ? { ...v, likes: v.likes + 1 } : v))
      );
      showToast('Liked video 👍');
    }
    const updatedUser = { ...currentUser, likedVideoIds: updatedLikes };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
  };

  const dislikeVideo = (id: string) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, dislikes: v.dislikes + 1 } : v))
    );
    showToast('Feedback submitted');
  };

  const toggleSaveVideo = (id: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      showToast('Please login or register to save to playlist!');
      return;
    }
    const isSaved = currentUser.savedVideoIds.includes(id);
    let newSaved: string[];
    if (isSaved) {
      newSaved = currentUser.savedVideoIds.filter((vId) => vId !== id);
      showToast('Removed from Saved Playlist');
    } else {
      newSaved = [...currentUser.savedVideoIds, id];
      showToast('Saved to Playlist 📁');
    }
    const updatedUser = { ...currentUser, savedVideoIds: newSaved };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
  };

  // Comments (Max 3 comments per user per video)
  const addComment = (videoId: string, text: string): boolean => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return false;
    }
    const userCommentsOnThisVid = comments.filter(
      (c) => c.videoId === videoId && c.userId === currentUser.id
    );
    if (userCommentsOnThisVid.length >= 3 && currentUser.role !== 'admin') {
      showToast('You can only post up to 3 comments on this video!');
      return false;
    }
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      videoId,
      userId: currentUser.id,
      userName: currentUser.username,
      userAvatar: currentUser.avatar,
      userCountry: currentUser.country,
      text: text.trim(),
      createdAt: 'Just now',
    };
    setComments((prev) => [newComment, ...prev]);
    setStats((prev) => ({ ...prev, totalComments: prev.totalComments + 1 }));
    showToast('Comment posted! 💬');
    return true;
  };

  const deleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    setStats((prev) => ({ ...prev, totalComments: Math.max(0, prev.totalComments - 1) }));
    showToast('Comment removed.');
  };

  // VIP & Payments (Enforces 2 attempts in 24h & 7-day penalty if blocked)
  const submitVipOrder = (orderData: {
    userPhone: string;
    packageType: '1 Month' | '3 Months' | '6 Months' | '1 Year';
    priceBdt: number;
    gateway: PaymentGatewayType;
    trxId: string;
  }): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: 'Login required' };

    // Check if blocked by admin for fake TrxID
    if (currentUser.vipBlockedUntil) {
      const blockedTime = new Date(currentUser.vipBlockedUntil).getTime();
      if (Date.now() < blockedTime) {
        const daysLeft = Math.ceil((blockedTime - Date.now()) / (1000 * 60 * 60 * 24));
        return {
          success: false,
          message: `Your account is restricted from VIP applications for fake TrxID. Wait ${daysLeft} more days.`,
        };
      }
    }

    // Check 2 applications per 24 hours
    const lastApply = currentUser.lastVipApplyAt ? new Date(currentUser.lastVipApplyAt).getTime() : 0;
    const now = Date.now();
    let currentAttempts = currentUser.vipApplyAttempts24h || 0;
    if (now - lastApply > 24 * 60 * 60 * 1000) {
      currentAttempts = 0; // Reset after 24h
    }
    if (currentAttempts >= 2) {
      return {
        success: false,
        message: 'You can apply for VIP a maximum of 2 times in 24 hours. Please wait!',
      };
    }

    const newOrder: VipOrder = {
      id: `ord-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.username,
      userPhone: orderData.userPhone,
      packageType: orderData.packageType,
      priceBdt: orderData.priceBdt,
      gateway: orderData.gateway,
      trxId: orderData.trxId.toUpperCase(),
      status: 'pending',
      createdAt: new Date().toLocaleString(),
    };
    setVipOrders((prev) => [newOrder, ...prev]);

    const updatedUser: User = {
      ...currentUser,
      vipApplyAttempts24h: currentAttempts + 1,
      lastVipApplyAt: new Date().toISOString(),
    };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));

    showToast('Payment submitted! Admin will verify and activate your VIP shortly.');
    return { success: true, message: 'VIP request submitted successfully' };
  };

  const approveVipOrder = (orderId: string) => {
    const order = vipOrders.find((o) => o.id === orderId);
    if (!order) return;
    setVipOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'approved' } : o))
    );
    setStats((prev) => ({
      ...prev,
      totalEarningsBdt: prev.totalEarningsBdt + order.priceBdt,
    }));
    // Grant VIP status with golden name and unlimited service
    setUsers((prev) =>
      prev.map((u) =>
        u.id === order.userId || u.username === order.userName
          ? { ...u, isVip: true, vipExpiresAt: '30 Days' }
          : u
      )
    );
    if (currentUser && (currentUser.id === order.userId || currentUser.username === order.userName)) {
      setCurrentUser({
        ...currentUser,
        isVip: true,
        vipExpiresAt: '30 Days',
      });
    }
    showToast(`Order approved! ৳${order.priceBdt} added to wallet.`);
  };

  const rejectVipOrder = (orderId: string) => {
    setVipOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'rejected' } : o))
    );
    showToast('Order marked as rejected.');
  };

  // Admin action: Block user for 7 days if fake TrxID was submitted
  const blockUserFromVip = (userId: string) => {
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, vipBlockedUntil: sevenDaysFromNow } : u))
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, vipBlockedUntil: sevenDaysFromNow } : null));
    }
    showToast('User blocked from VIP applications for 7 days for fake TrxID.');
  };

  const unblockUserFromVip = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, vipBlockedUntil: undefined } : u))
    );
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, vipBlockedUntil: undefined } : null));
    }
    showToast('User unblocked from VIP applications.');
  };

  const updateVipPackagePrice = (
    id: '1 Month' | '3 Months' | '6 Months' | '1 Year',
    newPrice: number
  ) => {
    setVipPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, priceBdt: newPrice } : p))
    );
    showToast(`Price for ${id} updated to ৳${newPrice}`);
  };

  const updatePaymentMethod = (id: PaymentGatewayType, updated: Partial<PaymentMethodConfig>) => {
    setPaymentMethods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updated } : m))
    );
    showToast(`Payment gateway ${id} updated.`);
  };

  // Sub-Admins Management
  const addSubAdmin = (newAdminData: Omit<SubAdmin, 'id' | 'createdAt'>): boolean => {
    if (subAdmins.length >= 2) {
      showToast('Maximum 3 admins reached (1 Superadmin + 2 Sub-admins)!');
      return false;
    }
    const newAdmin: SubAdmin = {
      ...newAdminData,
      id: `sub-${Date.now()}`,
      createdAt: new Date().toLocaleString(),
    };
    setSubAdmins((prev) => [...prev, newAdmin]);
    showToast(`Sub-admin ${newAdmin.username} added successfully!`);
    return true;
  };

  const removeSubAdmin = (id: string) => {
    setSubAdmins((prev) => prev.filter((a) => a.id !== id));
    showToast('Sub-admin removed.');
  };

  // Custom Sidebar Links
  const addCustomSidebarLink = (linkData: Omit<CustomSidebarLink, 'id'>) => {
    const newLink: CustomSidebarLink = {
      ...linkData,
      id: `link-${Date.now()}`,
    };
    setCustomSidebarLinks((prev) => [...prev, newLink]);
    showToast('Custom sidebar link added!');
  };

  const updateCustomSidebarLink = (id: string, updated: Partial<CustomSidebarLink>) => {
    setCustomSidebarLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updated } : l))
    );
    showToast('Sidebar link updated.');
  };

  const deleteCustomSidebarLink = (id: string) => {
    setCustomSidebarLinks((prev) => prev.filter((l) => l.id !== id));
    showToast('Sidebar link removed.');
  };

  // Admin Moon Channel Actions
  const subscribeToAdminMoon = () => {
    const nextState = !isSubscribedToAdminMoon;
    setIsSubscribedToAdminMoon(nextState);
    localStorage.setItem('mmshub_sub_moon', nextState ? 'true' : 'false');
    setAdminMoonChannel((prev) => ({
      ...prev,
      subscribersCount: prev.subscribersCount + (nextState ? 1 : -1),
    }));
    showToast(nextState ? 'Subscribed to Admin Moon channel! 🔔' : 'Unsubscribed.');
  };

  const likeAdminMoonChannel = () => {
    setAdminMoonChannel((prev) => ({
      ...prev,
      likesCount: prev.likesCount + 1,
    }));
    showToast('Liked Admin Moon channel ❤️');
  };

  // User Authentication & Management
  const registerOrLoginUser = (username: string, password?: string, country: string = 'BD'): { success: boolean; message: string } => {
    const trimmedUser = username.trim();
    if (trimmedUser.length < 3) {
      return { success: false, message: 'Username must be at least 3 characters' };
    }
    const existing = users.find(
      (u) => u.username.toLowerCase() === trimmedUser.toLowerCase()
    );
    const now = new Date().toLocaleString();
    if (existing) {
      // Check password if provided
      if (password && existing.password && existing.password !== password) {
        return { success: false, message: 'Incorrect password for this username!' };
      }
      const updatedUser: User = {
        ...existing,
        lastLoginAt: now,
        isOnline: true,
        lastActiveAt: 'Just now',
      };
      setUsers((prev) => prev.map((u) => (u.id === existing.id ? updatedUser : u)));
      setCurrentUser(updatedUser);
      setIsAuthModalOpen(false);
      showToast(`Welcome back, ${updatedUser.username}!`);
      return { success: true, message: 'Logged in successfully' };
    } else {
      // New user signup: assign random adult star avatar preset & isVip: false
      const randomAvatar =
        ADULT_STAR_AVATARS[Math.floor(Math.random() * ADULT_STAR_AVATARS.length)];
      const newUser: User = {
        id: `u-${Date.now()}`,
        username: trimmedUser,
        name: trimmedUser,
        password: password || '123456',
        email: `${trimmedUser.toLowerCase()}@user.tube`,
        avatar: randomAvatar,
        bio: 'MMSHUB community member',
        country,
        isVip: false, // Strict: NOT VIP by default!
        savedVideoIds: [],
        likedVideoIds: [],
        watchHistory: [],
        timeSpentSeconds: 0, // Starts strictly at 0!
        videosWatchedCount: 0,
        likesReceivedCount: 0, // Starts strictly at 0 likes!
        lastLikedByUsers: [],
        isOnline: true,
        lastActiveAt: 'Just now',
        role: 'user',
        createdAt: now,
        lastLoginAt: now,
      };
      setUsers((prev) => [newUser, ...prev]);
      setCurrentUser(newUser);
      setStats((prev) => ({ ...prev, totalFollowers: prev.totalFollowers + 1 }));
      setIsAuthModalOpen(false);
      showToast(`Account created for ${newUser.username}!`);
      return { success: true, message: 'Account registered' };
    }
  };

  const logoutUser = () => {
    if (currentUser) {
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? { ...u, isOnline: false } : u)));
    }
    setCurrentUser(null);
    localStorage.removeItem('mmshub_current_user');
    setIsAuthModalOpen(false);
    showToast('Signed out successfully.');
  };

  // Enforces unique username & 30-day constraint
  const changeUsername = (newUsername: string): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: 'Not logged in' };
    const trimmed = newUsername.trim();
    if (!trimmed || trimmed.length < 3) {
      return { success: false, message: 'Username must be at least 3 characters' };
    }
    // Check uniqueness
    const exists = users.some(
      (u) => u.id !== currentUser.id && u.username.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      return { success: false, message: 'This username is already taken! Choose a unique username.' };
    }
    if (currentUser.lastUsernameChangeAt) {
      const lastChange = new Date(currentUser.lastUsernameChangeAt).getTime();
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - lastChange < thirtyDaysMs) {
        const daysLeft = Math.ceil((thirtyDaysMs - (Date.now() - lastChange)) / (1000 * 60 * 60 * 24));
        return {
          success: false,
          message: `Username can be changed once every 30 days. Please wait ${daysLeft} more days.`,
        };
      }
    }
    const updated: User = {
      ...currentUser,
      username: trimmed,
      lastUsernameChangeAt: new Date().toISOString(),
    };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    return { success: true, message: 'Username updated successfully!' };
  };

  const changePassword = (oldPass: string, newPass: string): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: 'Not logged in' };
    if (currentUser.password && currentUser.password !== oldPass) {
      return { success: false, message: 'Previous password does not match!' };
    }
    if (newPass.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters' };
    }
    const updated: User = { ...currentUser, password: newPass };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    return { success: true, message: 'Password changed successfully!' };
  };

  // Enforces 7-day avatar change constraint & valid image
  const changeAvatar = (newAvatarUrl: string): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: 'Not logged in' };
    if (!newAvatarUrl || newAvatarUrl.length < 10) {
      return { success: false, message: 'Invalid profile image' };
    }
    if (currentUser.lastAvatarChangeAt) {
      const lastChange = new Date(currentUser.lastAvatarChangeAt).getTime();
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - lastChange < sevenDaysMs) {
        const daysLeft = Math.ceil((sevenDaysMs - (Date.now() - lastChange)) / (1000 * 60 * 60 * 24));
        return {
          success: false,
          message: `Profile photo can be changed once every 7 days. Please wait ${daysLeft} more days.`,
        };
      }
    }
    const updated: User = {
      ...currentUser,
      avatar: newAvatarUrl,
      lastAvatarChangeAt: new Date().toISOString(),
    };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    return { success: true, message: 'Profile photo updated!' };
  };

  // Enforces 7-day bio change constraint and profanity filter
  const changeBio = (newBio: string): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: 'Not logged in' };
    const trimmed = newBio.trim();
    // Profanity blacklist check
    const badWords = ['fuck', 'bitch', 'madarchod', 'chuda', 'khanki', 'gali', 'bc', 'mc', 'motherfucker', 'harami', 'kutta'];
    const hasBadWord = badWords.some((w) => trimmed.toLowerCase().includes(w));
    if (hasBadWord) {
      return {
        success: false,
        message: 'Bio contains prohibited abusive words! Please keep it clean.',
      };
    }
    if (currentUser.lastBioChangeAt) {
      const lastChange = new Date(currentUser.lastBioChangeAt).getTime();
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - lastChange < sevenDaysMs) {
        const daysLeft = Math.ceil((sevenDaysMs - (Date.now() - lastChange)) / (1000 * 60 * 60 * 24));
        return {
          success: false,
          message: `Bio can be changed once every 7 days. Please wait ${daysLeft} more days.`,
        };
      }
    }
    const updated: User = {
      ...currentUser,
      bio: trimmed,
      lastBioChangeAt: new Date().toISOString(),
    };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    return { success: true, message: 'Profile bio updated successfully!' };
  };

  const changeCountry = (newCountryCode: string) => {
    if (!currentUser) return;
    const updated: User = { ...currentUser, country: newCountryCode };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    showToast('Country updated!');
  };

  // Like other user profile on leaderboard (1 like per user per day)
  const likeUserProfile = (targetUserId: string): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: 'Login required to like profiles' };
    if (currentUser.id === targetUserId) {
      return { success: false, message: 'You cannot like your own profile!' };
    }
    const target = users.find((u) => u.id === targetUserId);
    if (!target) return { success: false, message: 'User not found' };
    const likedToday = target.lastLikedByUsers?.includes(currentUser.id);
    if (likedToday) {
      return { success: false, message: 'You have already liked this user today. Try again tomorrow!' };
    }
    const updatedTarget: User = {
      ...target,
      likesReceivedCount: (target.likesReceivedCount || 0) + 1,
      lastLikedByUsers: [...(target.lastLikedByUsers || []), currentUser.id],
    };
    setUsers((prev) => prev.map((u) => (u.id === targetUserId ? updatedTarget : u)));
    return { success: true, message: `Liked ${target.username}'s profile! ❤️` };
  };

  const updateUserByAdmin = (userId: string, updated: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...updated } : u)));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, ...updated } : null));
    }
    showToast('User profile updated by admin.');
  };

  const deleteUserByAdmin = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast('User account deleted.');
  };

  // Strict Admin Login
  const loginAdmin = (user: string, pass: string): boolean => {
    const trimmedUser = user.trim();
    const trimmedPass = pass.trim();
    if (
      trimmedUser === siteSettings.adminUsername &&
      trimmedPass === siteSettings.adminPasswordHash
    ) {
      setIsAdminLoggedIn(true);
      setLoggedInAdminRole('superadmin');
      showToast('Super-Admin authenticated! 🔓');
      return true;
    }
    const sub = subAdmins.find(
      (s) => s.username === trimmedUser && s.passwordHash === trimmedPass
    );
    if (sub) {
      setIsAdminLoggedIn(true);
      setLoggedInAdminRole('subadmin');
      showToast(`Sub-Admin authenticated (${sub.name})! 🔓`);
      return true;
    }
    showToast('Invalid admin username or password!');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setLoggedInAdminRole(null);
    showToast('Admin logged out.');
  };

  const updateAdSettings = (newAds: Partial<AdSettings>) => {
    setAdSettings((prev) => ({ ...prev, ...newAds }));
    showToast('Ad settings saved.');
  };

  const updateSiteSettings = (newSettings: Partial<SiteSettings>) => {
    setSiteSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Site settings updated.');
  };

  const addCategory = (name: string, slug: string) => {
    const newCat: Category = {
      id: slug.toLowerCase().replace(/\s+/g, '-'),
      name,
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      count: 0,
    };
    setBaseCategories((prev) => [...prev, newCat]);
    showToast('Category added!');
  };

  const deleteCategory = (id: string) => {
    setBaseCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category deleted.');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isNightMode,
        setIsNightMode,
        isFullDisplay,
        setIsFullDisplay,
        isTwoColumnLayout,
        setIsTwoColumnLayout,
        videos,
        categories,
        comments,
        vipOrders,
        adSettings,
        siteSettings,
        stats,
        currentUser,
        activeVideo,
        searchQuery,
        selectedCategory,
        pricingFilter,
        isAgeGatePassed,
        subAdmins,
        customSidebarLinks,
        vipPackages,
        paymentMethods,
        users,
        adminMoonChannel,
        isSubscribedToAdminMoon,
        subscribeToAdminMoon,
        likeAdminMoonChannel,
        isSidebarOpen,
        isAdminOpen,
        isAdminLoggedIn,
        loggedInAdminRole,
        isAuthModalOpen,
        isVipModalOpen,
        isSettingsModalOpen,
        isLeaderboardOpen,
        isAdminMoonProfileOpen,
        isGuestLoginPromptOpen,
        isGuideModalOpen,
        toastMessage,
        setActiveVideo,
        setSearchQuery,
        setSelectedCategory,
        setPricingFilter,
        setIsAgeGatePassed: (val) => {
          setIsAgeGatePassed(val);
          localStorage.setItem('mmshub_age_gate', val ? 'passed' : '');
        },
        setIsSidebarOpen,
        setIsAdminOpen,
        setIsAuthModalOpen,
        setIsVipModalOpen,
        setIsSettingsModalOpen,
        setIsLeaderboardOpen,
        setIsAdminMoonProfileOpen,
        setIsGuestLoginPromptOpen,
        setIsGuideModalOpen,
        showToast,
        addVideo,
        updateVideo,
        deleteVideo,
        incrementVideoView,
        likeVideo,
        dislikeVideo,
        toggleSaveVideo,
        recordVideoWatch,
        addComment,
        deleteComment,
        submitVipOrder,
        approveVipOrder,
        rejectVipOrder,
        blockUserFromVip,
        unblockUserFromVip,
        updateVipPackagePrice,
        updatePaymentMethod,
        updateAdSettings,
        updateSiteSettings,
        addCategory,
        deleteCategory,
        addSubAdmin,
        removeSubAdmin,
        addCustomSidebarLink,
        updateCustomSidebarLink,
        deleteCustomSidebarLink,
        registerOrLoginUser,
        logoutUser,
        changeUsername,
        changePassword,
        changeAvatar,
        changeBio,
        changeCountry,
        likeUserProfile,
        updateUserByAdmin,
        deleteUserByAdmin,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
