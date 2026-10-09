export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  embedCode: string;
  category: string;
  tags: string[];
  duration: string;
  views: number;
  likes: number;
  dislikes: number;
  createdAt: string;
  author: string;
  isVip: boolean;
  downloadUrl?: string;
  quality?: 'HD' | '4K' | 'SD';
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userCountry?: string;
  text: string;
  createdAt: string;
  replyToId?: string;
  replies?: Comment[];
}

export interface User {
  id: string;
  username: string;
  password?: string;
  email?: string;
  avatar: string;
  bio?: string;
  country: string; // Flag code like 'BD', 'IN', 'PK', 'US', etc.
  isVip: boolean;
  vipExpiresAt?: string;
  savedVideoIds: string[];
  likedVideoIds: string[];
  watchHistory: { videoId: string; watchedAt: string }[];
  timeSpentSeconds: number;
  videosWatchedCount: number;
  likesReceivedCount: number;
  lastLikedByUsers?: string[]; // IDs of users who liked this user today
  isOnline: boolean;
  lastActiveAt: string;
  role: 'user' | 'admin' | 'subadmin';
  createdAt: string;
  lastLoginAt: string;
  lastUsernameChangeAt?: string; // 30 day limit
  lastAvatarChangeAt?: string;   // 7 day limit
  lastBioChangeAt?: string;      // 7 day limit
  vipApplyAttempts24h?: number;
  lastVipApplyAt?: string;
  vipBlockedUntil?: string;      // 7-day penalty if admin blocks for fake TrxID
}

export interface SubAdmin {
  id: string;
  username: string;
  passwordHash: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface CustomSidebarLink {
  id: string;
  title: string;
  url: string;
  badge?: string;
  openNewTab: boolean;
  isMainMenu?: boolean;
}

export interface VipPackage {
  id: '1 Month' | '3 Months' | '6 Months' | '1 Year';
  title: string;
  priceBdt: number;
  badge: string | null;
  desc: string;
}

export type PaymentGatewayType = 'bkash' | 'nagad' | 'rocket' | 'binance' | 'webmoney';

export interface PaymentMethodConfig {
  id: PaymentGatewayType;
  name: string;
  enabled: boolean;
  numberOrAddress: string;
  instructions: string;
  themeColor: string;
}

export interface VipOrder {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  packageType: '1 Month' | '3 Months' | '6 Months' | '1 Year';
  priceBdt: number;
  gateway: PaymentGatewayType;
  trxId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  icon?: string;
}

export interface AdSettings {
  topBannerEnabled: boolean;
  topBannerHtml: string;
  topBannerLink: string;
  topBannerImage: string;
  nativeBarEnabled: boolean;
  socialBarEnabled: boolean;
  smartLink1: string;
  smartLink2: string;
  smartLink3: string;
  directDownloadLink: string;
}

export interface SiteSettings {
  siteTitle: string;
  siteLogoText: string;
  siteNotice: string;
  bkashNumber?: string;
  nagadNumber?: string;
  rocketNumber?: string;
  antiCopyEnabled: boolean;
  ageGateEnabled: boolean;
  adminUsername: string;
  adminPasswordHash: string;
  secretAdminUrlCode: string; // e.g. '/lubnaseyes'
  searchPlaceholderCustom?: string;
  adminMoonChannel: {
    name: string;
    avatar: string;
    subscribersCount: number;
    likesCount: number;
    totalVideosCount: number;
    bio: string;
  };
}

export interface SiteStats {
  allTimeViews: number;
  todayViews: number;
  yesterdayViews: number;
  thisMonthViews: number;
  lastMonthViews: number;
  totalPosts: number;
  totalComments: number;
  totalFollowers: number;
  totalEarningsBdt: number;
  dailyViewsChart: { day: string; views: number }[];
}
