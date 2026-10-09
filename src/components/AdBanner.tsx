import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AdBannerProps {
  slot?: 'top' | 'player' | 'download';
}

export const AdBanner: React.FC<AdBannerProps> = ({ slot = 'top' }) => {
  const { adSettings } = useApp();

  if (!adSettings.topBannerEnabled && slot === 'top') return null;

  return (
    <div className="w-full max-w-5xl mx-auto my-3 px-2">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#171a26] via-[#1f2333] to-[#171a26] border border-slate-700/60 p-2 sm:p-3 shadow-md">
        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 px-1">
          <span className="flex items-center gap-1 font-semibold uppercase tracking-wider text-slate-400">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Sponsored Advertisement (728x90)
          </span>
          <span className="text-[9px] bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700/50">
            Adsterra High CPM
          </span>
        </div>

        {adSettings.topBannerHtml ? (
          <div
            className="w-full flex justify-center overflow-hidden"
            dangerouslySetInnerHTML={{ __html: adSettings.topBannerHtml }}
          />
        ) : adSettings.topBannerImage ? (
          <a
            href={adSettings.topBannerLink || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center"
          >
            <img
              src={adSettings.topBannerImage}
              alt="Ad Banner"
              className="max-h-24 sm:max-h-28 mx-auto rounded object-cover"
              referrerPolicy="no-referrer"
            />
          </a>
        ) : (
          <a
            href={adSettings.smartLink1 || 'https://adsterra.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg bg-[#0e1017]/80 hover:bg-[#141824] transition border border-dashed border-slate-700 hover:border-amber-500/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-sm shrink-0">
                18+
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-amber-400 transition flex items-center gap-1.5">
                  🔥 High Speed HD Streaming & Live Private Video Chat
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400" />
                </div>
                <div className="text-[11px] text-slate-400">
                  Click here to watch 4K uncensored full clips without buffering. Verified high CPM sponsor.
                </div>
              </div>
            </div>
            <div className="shrink-0 px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition shadow">
              WATCH NOW
            </div>
          </a>
        )}
      </div>
    </div>
  );
};
