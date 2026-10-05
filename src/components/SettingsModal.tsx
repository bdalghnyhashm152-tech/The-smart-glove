import React from 'react';
import { Settings, Volume2, Sliders, X, RefreshCw } from 'lucide-react';

interface SettingsModalProps {
  ttsRate: number;
  setTtsRate: (val: number) => void;
  ttsPitch: number;
  setTtsPitch: (val: number) => void;
  confidenceThreshold: number;
  setConfidenceThreshold: (val: number) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  ttsRate,
  setTtsRate,
  ttsPitch,
  setTtsPitch,
  confidenceThreshold,
  setConfidenceThreshold,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-5">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">
              إعدادات القفاز الذكي والصوت
            </h3>
            <p className="text-xs text-slate-400">
              تخصيص سرعة النطق ودقة استشعار الحركات
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* TTS Rate */}
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                سرعة نطق الصوت (Speech Rate)
              </span>
              <span className="font-mono text-cyan-400 font-bold">{ttsRate}x</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.5"
              step="0.1"
              value={ttsRate}
              onChange={(e) => setTtsRate(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />
          </div>

          {/* TTS Pitch */}
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-300 font-medium">نبرة الصوت (Pitch)</span>
              <span className="font-mono text-cyan-400 font-bold">{ttsPitch}x</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.4"
              step="0.1"
              value={ttsPitch}
              onChange={(e) => setTtsPitch(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />
          </div>

          {/* Sensitivity threshold */}
          <div className="bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                عتبة دقة التعرف على الإشارة (Sensitivity Threshold)
              </span>
              <span className="font-mono text-cyan-400 font-bold">{confidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="90"
              step="2"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />
            <span className="text-[10px] text-slate-500 block mt-1">
              النسبة العالية تتطلب دقة أكبر في انثناء الأصابع لتفعيل الإشارة.
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-md transition"
        >
          حفظ وإغلاق
        </button>
      </div>
    </div>
  );
};
