import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Cloud,
  Globe,
  Database,
  DollarSign,
  Layers,
  Copy,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const UserGuideModal: React.FC = () => {
  const { isGuideModalOpen, setIsGuideModalOpen, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'cloudflare' | 'domain' | 'firebase' | 'embeds' | 'adsterra'>('cloudflare');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isGuideModalOpen) return null;

  const copySnippet = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    showToast('Code copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#10121c] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-[#151825] border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Master Setup Guide & Architecture (Cloudflare, Firebase, Ads)
              </h2>
              <p className="text-xs text-slate-400">
                Complete deployment manual for low-cost, zero-buffer video portal
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsGuideModalOpen(false)}
            aria-label="Close user guide"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-2 bg-[#121420] border-b border-slate-800 overflow-x-auto text-xs shrink-0">
          <button
            onClick={() => setActiveTab('cloudflare')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
              activeTab === 'cloudflare'
                ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cloud className="w-4 h-4 text-orange-400" />
            <span>1. Cloudflare Free Hosting</span>
          </button>
          <button
            onClick={() => setActiveTab('domain')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
              activeTab === 'domain'
                ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>2. Domain & Sub-domain (admin.)</span>
          </button>
          <button
            onClick={() => setActiveTab('embeds')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
              activeTab === 'embeds'
                ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>3. Iframe Embed Hosting (Cheap)</span>
          </button>
          <button
            onClick={() => setActiveTab('firebase')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
              activeTab === 'firebase'
                ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4 text-amber-400" />
            <span>4. Firebase Config</span>
          </button>
          <button
            onClick={() => setActiveTab('adsterra')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
              activeTab === 'adsterra'
                ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>5. Adsterra & Monetization</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {activeTab === 'cloudflare' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cloud className="w-5 h-5 text-orange-400" />
                Cloudflare Pages বিনামূল্যে হোস্টিং
              </h3>
              <div className="p-3.5 rounded-xl bg-[#171927] border border-slate-800 space-y-2">
                <p className="text-slate-200 leading-relaxed">
                  Cloudflare Pages ব্যবহার করে সম্পূর্ণ বিনামূল্যে সীমাহীন ব্যান্ডউইথ এবং ফাস্ট গ্লোবাল CDN পাওয়া যায়।
                </p>
                <div className="space-y-1 text-slate-300 pl-4 border-l-2 border-emerald-500">
                  <div>১. GitHub এ কোড পুশ করুন</div>
                  <div>২. Cloudflare ড্যাশবোর্ডে গিয়ে Pages সিলেক্ট করুন</div>
                  <div>৩. ফ্রেমওয়ার্ক হিসেবে Vite নির্বাচন করুন</div>
                  <div>৪. Build command: <code className="text-amber-300">npm run build</code> এবং Output: <code className="text-amber-300">dist</code></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'domain' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                কাস্টম ডোমেইন ও সাবডোমেইন সেটআপ
              </h3>
              <div className="p-3.5 rounded-xl bg-[#171927] border border-slate-800 space-y-2.5">
                <p className="text-slate-200 leading-relaxed">
                  আপনার ডোমেইনের DNS সেকশনে গিয়ে CNAME রেকর্ড যোগ করুন।
                </p>
                <div className="p-3 rounded-lg bg-black/60 font-mono text-xs text-emerald-400 border border-slate-800">
                  Type: CNAME | Name: admin | Target: your-site.pages.dev | Proxy: Proxied
                </div>
              </div>
            </div>
          )}

          {activeTab === 'embeds' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                ভিডিও হোস্টিং ও আইফ্রেম এমবেড
              </h3>
              <div className="p-3.5 rounded-xl bg-[#171927] border border-slate-800 space-y-2">
                <p className="text-slate-200 leading-relaxed">
                  ভিডিও ফাইল সরাসরি সার্ভারে না রেখে Streamtape, Doodstream অথবা Mega তে আপলোড করে এমবেড কোড ব্যবহার করুন।
                </p>
                <div className="p-2.5 rounded-lg bg-black/50 font-mono text-[11px] text-slate-300 border border-slate-800">
                  <div className="text-amber-400 mt-1">
                    &lt;iframe src=&quot;https://streamtape.com/e/...&quot; frameborder=&quot;0&quot; allowfullscreen&gt;&lt;/iframe&gt;
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'firebase' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                Firebase ডাটাবেস কনফিগারেশন
              </h3>
              <div className="p-3.5 rounded-xl bg-[#171927] border border-slate-800 space-y-2">
                <div className="relative p-3 rounded-lg bg-black/60 font-mono text-[11px] text-amber-300 border border-slate-800">
                  <button
                    onClick={() =>
                      copySnippet(
                        `projectId: "mmshub-79800",\nstorageBucket: "mmshub-79800.firebasestorage.app"`,
                        'fb'
                      )
                    }
                    className="absolute top-2 right-2 p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                  >
                    {copiedCode === 'fb' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <div>projectId: &quot;mmshub-79800&quot;</div>
                  <div>authDomain: &quot;mmshub-79800.firebaseapp.com&quot;</div>
                  <div>storageBucket: &quot;mmshub-79800.firebasestorage.app&quot;</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'adsterra' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                Adsterra ও মনিটাইজেশন আর্নিং
              </h3>
              <div className="p-3.5 rounded-xl bg-[#171927] border border-slate-800 space-y-2">
                <p className="text-slate-200 leading-relaxed">
                  Adsterra এর 728x90 ব্যানার এবং 3-Step Smartlink এর মাধ্যমে সর্বোচ্চ CPM আয় নিশ্চিত করুন।
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
