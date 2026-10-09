import React from 'react';
import { ShieldAlert, Flame, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AgeGateModal: React.FC = () => {
  const { isAgeGatePassed, setIsAgeGatePassed, siteSettings, t } = useApp();

  if (isAgeGatePassed || !siteSettings.ageGateEnabled) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
      <div className="relative w-full max-w-lg rounded-3xl border-2 border-red-500/40 bg-gradient-to-b from-[#16141c] via-[#0f0e15] to-[#0a0910] p-6 sm:p-8 text-center shadow-2xl space-y-6 ring-4 ring-red-500/10 animate-in fade-in zoom-in-95 duration-300">
        {/* Glow Orb Effect */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-20 bg-red-600/30 rounded-full blur-2xl pointer-events-none" />

        {/* Shield Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-red-600/30 to-amber-500/20 border-2 border-red-500/60 flex items-center justify-center text-red-500 shadow-2xl shadow-red-950/80">
          <ShieldAlert className="w-10 h-10 drop-shadow" />
          <Flame className="w-4 h-4 text-amber-400 absolute -top-1.5 -right-1.5 fill-amber-400 animate-pulse" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/60 text-red-400 text-xs font-black tracking-widest uppercase shadow">
            <span>🔞</span>
            <span>RESTRICTED ACCESS — 18+</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-3.5 tracking-tight font-sans">
            {t('ageWarning')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-md mx-auto">
            {t('ageDescription')}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#13111b]/80 border border-slate-800 text-[11px] text-slate-400 text-left space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <Lock className="w-3.5 h-3.5 text-red-400" />
            <span>Parental Advisory & Legal Compliance</span>
          </div>
          <p className="leading-relaxed">
            By proceeding, you confirm that you are at least 18 years old or the legal age of majority in your region, and agree to our Terms of Service.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            onClick={() => setIsAgeGatePassed(true)}
            className="flex-1 py-3.5 px-5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm rounded-xl uppercase tracking-wider shadow-xl shadow-red-950/50 transition transform hover:scale-[1.02] cursor-pointer"
          >
            {t('enter18')}
          </button>
          <button
            onClick={() => {
              window.location.href = 'https://www.google.com';
            }}
            className="py-3.5 px-5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition cursor-pointer"
          >
            {t('exit')}
          </button>
        </div>
      </div>
    </div>
  );
};
