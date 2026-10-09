import React, { useState } from 'react';
import { X, Crown, Check, Copy, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

export const VipModal: React.FC = () => {
  const {
    isVipModalOpen,
    setIsVipModalOpen,
    siteSettings,
    submitVipOrder,
    currentUser,
    vipPackages,
    setIsAuthModalOpen,
    isNightMode,
    t,
    showToast,
  } = useApp();

  const [selectedPackage, setSelectedPackage] = useState<'1 Month' | '3 Months' | '6 Months' | '1 Year'>('3 Months');
  const [selectedGateway, setSelectedGateway] = useState<'bkash' | 'nagad' | 'rocket'>('bkash');
  const [senderPhone, setSenderPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isVipModalOpen) return null;

  const currentPkg = vipPackages.find((p) => p.id === selectedPackage) || vipPackages[1];
  const isVipBlocked = Boolean(
    currentUser?.vipBlockedUntil && new Date(currentUser.vipBlockedUntil).getTime() > Date.now()
  );
  const daysLeftBlocked = isVipBlocked && currentUser?.vipBlockedUntil
    ? Math.ceil((new Date(currentUser.vipBlockedUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  const getNumberForGateway = () => {
    if (selectedGateway === 'bkash') return siteSettings.bkashNumber || '0190942xxxx';
    if (selectedGateway === 'nagad') return siteSettings.nagadNumber || '0190942xxxx';
    return siteSettings.rocketNumber || '0190942xxxx';
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(getNumberForGateway());
    setCopiedNumber(true);
    showToast('Payment phone number copied to clipboard!');
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Please login first to link your VIP subscription!');
      setIsAuthModalOpen(true);
      return;
    }
    if (isVipBlocked) {
      showToast(`Account restricted from VIP for fake TrxID. Wait ${daysLeftBlocked} more days.`);
      return;
    }
    if (!senderPhone.trim()) {
      showToast('Please enter your sender mobile number!');
      return;
    }
    if (!trxId.trim() || trxId.length < 5) {
      showToast('Please enter a valid Transaction ID (TrxID)!');
      return;
    }
    const res = submitVipOrder({
      userPhone: senderPhone,
      packageType: currentPkg.id,
      priceBdt: currentPkg.priceBdt,
      gateway: selectedGateway,
      trxId: trxId.trim(),
    });
    if (!res.success) {
      showToast(res.message);
      return;
    }
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className={`relative w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden my-auto transition-colors ${
          isNightMode
            ? 'bg-[#11131d] border-amber-500/30 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`relative p-5 sm:p-6 border-b ${
            isNightMode
              ? 'bg-gradient-to-r from-amber-950/60 via-[#181b29] to-amber-950/40 border-slate-800'
              : 'bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-slate-200'
          }`}
        >
          <button
            onClick={() => {
              setIsVipModalOpen(false);
              setIsSubmitted(false);
            }}
            className={`absolute top-4 right-4 p-1.5 rounded-lg cursor-pointer ${
              isNightMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-500 shadow-md">
              <Crown className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-amber-500 flex items-center gap-2">
                VIP Premium Membership
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Instant access to 1080p full cuts, no advertisements & direct Mega files.
              </p>
            </div>
          </div>
        </div>

        {isSubmitted ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="text-lg font-bold">Payment Request Submitted!</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Your transaction ID <span className="font-mono font-bold text-amber-500">{trxId.toUpperCase()}</span> has been sent to the Admin Panel. The admin will verify and activate your VIP status within 5–15 minutes.
            </p>
            <button
              onClick={() => {
                setIsVipModalOpen(false);
                setIsSubmitted(false);
              }}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg uppercase tracking-wider transition cursor-pointer"
            >
              Done / Return to Tube
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
            {/* VIP Block Alert if admin penalized user for fake TrxID */}
            {isVipBlocked && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-red-300 block">
                    Account Blocked from VIP Applications
                  </span>
                  <p className="text-[11px] text-red-200/90 mt-0.5">
                    Your account has been temporarily restricted by the Admin for 7 days due to fake/invalid Transaction IDs. Remaining penalty: <strong>{daysLeftBlocked} day(s)</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Daily limit reminder */}
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Policy: Max 2 applications per 24 hours</span>
              <span className="font-mono text-amber-400 font-bold">
                {Math.max(0, 2 - (currentUser?.vipApplyAttempts24h || 0))}/2 remaining today
              </span>
            </div>

            {/* Dynamic Package Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider block mb-2 text-slate-400">
                {t('selectVipPackage')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {vipPackages.map((pkg) => {
                  const isSelected = selectedPackage === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`relative cursor-pointer p-3 rounded-xl border transition flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-400 shadow-md'
                          : isNightMode
                          ? 'bg-[#181b28] border-slate-800 text-slate-400 hover:border-slate-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {pkg.badge && (
                        <span className="absolute -top-2 left-2 text-[9px] font-black bg-gradient-to-r from-red-600 to-amber-600 text-white px-1.5 py-0.2 rounded-full">
                          {pkg.badge}
                        </span>
                      )}
                      <div>
                        <div className="text-xs font-bold">{pkg.title}</div>
                        <div className="text-base font-extrabold text-amber-500 mt-1">
                          ৳ {pkg.priceBdt} <span className="text-[10px] text-slate-400">BDT</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Gateway Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider block mb-2 text-slate-400">
                {t('selectBanking')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGateway('bkash')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                    selectedGateway === 'bkash'
                      ? 'bg-[#e2136e]/20 border-[#e2136e] shadow-md'
                      : isNightMode
                      ? 'bg-[#181b28] border-slate-800 text-slate-400'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#e2136e] flex items-center justify-center text-white font-black text-xs">
                    bK
                  </div>
                  <span className="text-xs font-bold">bKash</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGateway('nagad')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                    selectedGateway === 'nagad'
                      ? 'bg-[#f7941d]/20 border-[#f7941d] shadow-md'
                      : isNightMode
                      ? 'bg-[#181b28] border-slate-800 text-slate-400'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#f7941d] flex items-center justify-center text-white font-black text-xs">
                    NG
                  </div>
                  <span className="text-xs font-bold">Nagad</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGateway('rocket')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                    selectedGateway === 'rocket'
                      ? 'bg-[#8c3494]/20 border-[#8c3494] shadow-md'
                      : isNightMode
                      ? 'bg-[#181b28] border-slate-800 text-slate-400'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#8c3494] flex items-center justify-center text-white font-black text-xs">
                    RC
                  </div>
                  <span className="text-xs font-bold">Rocket</span>
                </button>
              </div>
            </div>

            {/* Instruction Box */}
            <div
              className={`p-3.5 rounded-xl border space-y-2 ${
                isNightMode ? 'bg-[#161926] border-slate-700/80' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Send Money to ({selectedGateway.toUpperCase()} Personal):
                </span>
                <span className="text-xs font-bold text-amber-500">
                  Total: ৳ {currentPkg.priceBdt} BDT
                </span>
              </div>
              <div
                className={`flex items-center justify-between gap-2 p-2 rounded-lg border ${
                  isNightMode ? 'bg-[#0e1017] border-slate-800' : 'bg-white border-slate-300'
                }`}
              >
                <span className="font-mono text-sm font-bold tracking-wider">
                  {getNumberForGateway()}
                </span>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className={`px-2.5 py-1 text-xs font-semibold rounded flex items-center gap-1 transition cursor-pointer ${
                    isNightMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedNumber ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="flex items-start gap-1.5 text-[11px] text-amber-500 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{t('sendMoneyNotice')}</span>
              </div>
            </div>

            {/* Inputs: Phone Number & TrxID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold block mb-1">
                  {t('senderNumber')}
                </label>
                <input
                  type="tel"
                  required
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder="e.g. 01712345678"
                  className={`w-full text-xs sm:text-sm rounded-lg px-3 py-2.5 border focus:outline-none focus:border-amber-400 ${
                    isNightMode
                      ? 'bg-[#181b28] text-slate-100 placeholder-slate-500 border-slate-700'
                      : 'bg-white text-slate-900 placeholder-slate-400 border-slate-300'
                  }`}
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">
                  {t('trxId')}
                </label>
                <input
                  type="text"
                  required
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  placeholder="e.g. BL84920X"
                  className={`w-full text-xs sm:text-sm font-mono rounded-lg px-3 py-2.5 border uppercase focus:outline-none focus:border-amber-400 ${
                    isNightMode
                      ? 'bg-[#181b28] text-slate-100 placeholder-slate-500 border-slate-700'
                      : 'bg-white text-slate-900 placeholder-slate-400 border-slate-300'
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isVipBlocked}
              className={`w-full py-3 font-extrabold text-sm rounded-xl uppercase tracking-wider shadow-lg transition transform ${
                isVipBlocked
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 hover:scale-[1.01] cursor-pointer'
              }`}
            >
              {isVipBlocked
                ? `Account Blocked (${daysLeftBlocked}d remaining)`
                : `${t('submitVipRequest')} (৳ ${currentPkg.priceBdt})`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
