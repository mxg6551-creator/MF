import React from 'react';
import { X, Globe, DollarSign, Moon, Sun, LayoutGrid } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    isNightMode,
    setIsNightMode,
    isFullDisplay,
    setIsFullDisplay,
    pricingFilter,
    setPricingFilter,
    language,
    setLanguage,
    t,
    showToast,
  } = useApp();

  if (!isSettingsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16 sm:p-6 sm:pt-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSettingsModalOpen(false)}
      />

      {/* Settings Card */}
      <div
        className={`relative w-full max-w-xs rounded-2xl border shadow-2xl p-4 z-10 animate-in fade-in zoom-in-95 duration-150 ${
          isNightMode
            ? 'bg-[#131620] border-slate-700/80 text-slate-200'
            : 'bg-white border-slate-200 text-slate-800 shadow-xl'
        }`}
      >
        <div
          className={`flex items-center justify-between pb-3 border-b ${
            isNightMode ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <h3
            className={`text-sm font-bold flex items-center gap-2 ${
              isNightMode ? 'text-slate-100' : 'text-slate-900'
            }`}
          >
            {t('preferences')}
          </h3>
          <button
            onClick={() => setIsSettingsModalOpen(false)}
            aria-label="Close preferences"
            className={`p-1 rounded-lg cursor-pointer ${
              isNightMode
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div
          className={`py-2 space-y-3 divide-y ${
            isNightMode ? 'divide-slate-800/60' : 'divide-slate-200'
          }`}
        >
          {/* Language selector */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-amber-500" />
              <div>
                <div className="text-xs font-semibold">{t('language')}</div>
                <div className="text-[11px] text-slate-400">
                  {language === 'bn' ? 'বাংলা' : 'English'}
                </div>
              </div>
            </div>
            <select
              aria-label="Select Interface Language"
              value={language}
              onChange={(e) => {
                const newLang = e.target.value as 'en' | 'bn';
                setLanguage(newLang);
                showToast(newLang === 'bn' ? 'বাংলা ভাষা সেট করা হয়েছে' : 'Language set to English');
              }}
              className={`text-xs rounded-lg px-2.5 py-1.5 font-bold border focus:outline-none cursor-pointer ${
                isNightMode
                  ? 'bg-slate-800 text-slate-100 border-slate-700'
                  : 'bg-slate-100 text-slate-900 border-slate-300'
              }`}
            >
              <option value="en">English (US)</option>
              <option value="bn">বাংলা (Bengali)</option>
            </select>
          </div>

          {/* Pricing Mode filter */}
          <div className="pt-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <div>
                <div className="text-xs font-semibold">{t('pricingMode')}</div>
                <div className="text-[11px] text-slate-400 capitalize">
                  {pricingFilter === 'all'
                    ? t('all')
                    : pricingFilter === 'free'
                    ? t('free')
                    : t('vip')}
                </div>
              </div>
            </div>
            <div
              className={`flex items-center rounded-lg p-0.5 border ${
                isNightMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'
              }`}
            >
              <button
                onClick={() => setPricingFilter('all')}
                className={`px-2 py-1 text-[11px] rounded transition cursor-pointer ${
                  pricingFilter === 'all'
                    ? 'bg-[#facc15] text-black font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t('all')}
              </button>
              <button
                onClick={() => setPricingFilter('free')}
                className={`px-2 py-1 text-[11px] rounded transition cursor-pointer ${
                  pricingFilter === 'free'
                    ? 'bg-[#facc15] text-black font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t('free')}
              </button>
              <button
                onClick={() => setPricingFilter('vip')}
                className={`px-2 py-1 text-[11px] rounded transition cursor-pointer ${
                  pricingFilter === 'vip'
                    ? 'bg-[#facc15] text-black font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t('vip')}
              </button>
            </div>
          </div>

          {/* Night mode toggle */}
          <div className="pt-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {isNightMode ? (
                <Moon className="w-4 h-4 text-yellow-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
              <div>
                <div className="text-xs font-semibold">
                  {isNightMode ? t('nightMode') : t('lightMode')}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isNightMode ? 'Dark Theme' : 'Light Theme'}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                const nextMode = !isNightMode;
                setIsNightMode(nextMode);
                showToast(nextMode ? 'Night Mode Activated 🌙' : 'Light Mode Activated ☀️');
              }}
              aria-label="Toggle theme mode"
              className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-200 ease-in-out cursor-pointer ${
                isNightMode ? 'bg-[#facc15]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full shadow-md transform transition duration-200 ease-in-out ${
                  isNightMode ? 'bg-slate-900 translate-x-6' : 'bg-white translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Full Display Layout Toggle (On = Full serial 1 per row | Off = 2-Column grid: 2 per row) */}
          <div className="pt-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <LayoutGrid className="w-4 h-4 text-sky-500" />
              <div>
                <div className="text-xs font-semibold">{t('fullDisplayMode')}</div>
                <div className="text-[11px] text-slate-400">
                  {isFullDisplay ? 'Full (1 per row) — ON' : '2-Column (2 per row) — OFF'}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                const next = !isFullDisplay;
                setIsFullDisplay(next);
                showToast(next ? 'Full View Active (1 per row serial)' : '2-Column Grid Active (2 per row)');
              }}
              aria-label="Toggle layout mode"
              className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-200 ease-in-out cursor-pointer ${
                isFullDisplay ? 'bg-sky-500' : 'bg-slate-400'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full shadow-md transform transition duration-200 ease-in-out ${
                  isFullDisplay ? 'bg-white translate-x-6' : 'bg-white translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
