import React from 'react';
import { Lock, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const GuestLoginPromptModal: React.FC = () => {
  const {
    isGuestLoginPromptOpen,
    setIsGuestLoginPromptOpen,
    setIsAuthModalOpen,
    isNightMode,
  } = useApp();

  if (!isGuestLoginPromptOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div
        className={`relative w-full max-w-md rounded-2xl border p-6 text-center shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 ${
          isNightMode
            ? 'bg-[#12141f] border-amber-500/40 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-500 shadow-xl ring-4 ring-amber-500/10">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
            Member Authentication
          </span>
          <h3 className="text-xl font-black mt-2">
            Please Sign In to Continue
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            You have been browsing as a guest. Create a free account or login with Google to keep watching, save playlists, and unlock full HD streaming!
          </p>
        </div>
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => {
              setIsGuestLoginPromptOpen(false);
              setIsAuthModalOpen(true);
            }}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Sign In or Register Now</span>
          </button>
          <button
            onClick={() => setIsGuestLoginPromptOpen(false)}
            className="text-xs text-slate-400 hover:text-slate-200 py-1 transition cursor-pointer"
          >
            Remind me in 5 minutes
          </button>
        </div>
      </div>
    </div>
  );
};
