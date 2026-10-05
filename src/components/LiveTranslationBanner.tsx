import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Copy, Check, RefreshCw, Send, AlertTriangle } from 'lucide-react';
import { RecognizedGesture } from '../types/glove';
import { ttsService } from '../services/ttsService';

interface LiveTranslationBannerProps {
  currentRecognition: RecognizedGesture | null;
  signBuffer: string[];
  onClearBuffer: () => void;
  onRemoveBufferItem: (index: number) => void;
  onSpeakPhrase: (text: string, lang?: 'ar' | 'en') => void;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
  onAiCompose: () => void;
  isAiComposing: boolean;
  composedResult: { arabic: string; english: string } | null;
}

export const LiveTranslationBanner: React.FC<LiveTranslationBannerProps> = ({
  currentRecognition,
  signBuffer,
  onClearBuffer,
  onRemoveBufferItem,
  onSpeakPhrase,
  autoSpeak,
  onToggleAutoSpeak,
  onAiCompose,
  isAiComposing,
  composedResult
}) => {
  const [copied, setCopied] = useState(false);

  // Active translation details
  const displayArabic = composedResult
    ? composedResult.arabic
    : currentRecognition?.gesture.arabic || 'حرّك القفاز أو اختر حركة لبدء الترجمة...';

  const displayEnglish = composedResult
    ? composedResult.english
    : currentRecognition?.gesture.english || 'Move smart glove or select a gesture to translate...';

  const confidence = currentRecognition?.confidence || 0;
  const isEmergency = currentRecognition?.gesture.isEmergency;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${displayArabic} | ${displayEnglish}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative rounded-3xl p-6 transition-all duration-300 shadow-2xl border backdrop-blur-xl ${
      isEmergency
        ? 'bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/80 border-red-500/50 shadow-red-950/50 animate-pulse'
        : 'bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-cyan-950/40 border-cyan-500/30'
    }`}>
      {/* Header with Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 ${
            currentRecognition
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}>
            <span className={`w-2 h-2 rounded-full ${currentRecognition ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            {currentRecognition ? 'تم التعرف الفوري' : 'في انتظار إشارة اليد'}
          </span>

          {currentRecognition && (
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300">
              دقة المطابقة: {confidence}%
            </span>
          )}

          {isEmergency && (
            <span className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-red-600/30 border border-red-500 text-red-200">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-bounce" />
              حالة طوارئ
            </span>
          )}
        </div>

        {/* Controls: Auto-speak, Copy */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleAutoSpeak}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              autoSpeak
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-slate-800/80 text-slate-400 border border-slate-700 hover:text-slate-200'
            }`}
            title="نطق الترجمة صوتياً بمجرد استشعار الإشارة"
          >
            {autoSpeak ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>النطق التلقائي: {autoSpeak ? 'مفعّل' : 'معطّل'}</span>
          </button>

          <button
            onClick={handleCopy}
            disabled={!currentRecognition && !composedResult}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition disabled:opacity-40"
            title="نسخ النص"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Display: Arabic & English */}
      <div className="space-y-3 my-2">
        {/* Arabic Text (Primary Large) */}
        <div className="relative">
          <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-relaxed select-text font-sans">
            {displayArabic}
          </p>
        </div>

        {/* English Translation */}
        <div className="flex items-center gap-2 pt-1" dir="ltr">
          <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
            EN
          </span>
          <p className="text-lg sm:text-xl font-medium text-slate-300 tracking-wide select-text">
            {displayEnglish}
          </p>
        </div>
      </div>

      {/* Action Buttons: Speak Audio & AI Sentence Composer */}
      <div className="flex flex-wrap items-center gap-3 pt-5 mt-4 border-t border-slate-800/80">
        {/* Speak Arabic button */}
        <button
          onClick={() => onSpeakPhrase(displayArabic, 'ar')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 active:scale-95 transition-all"
        >
          <Volume2 className="w-4 h-4" />
          <span>نطق بالعربية</span>
        </button>

        {/* Speak English button */}
        <button
          onClick={() => onSpeakPhrase(displayEnglish, 'en')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-semibold text-sm transition-all active:scale-95"
          dir="ltr"
        >
          <Volume2 className="w-4 h-4 text-cyan-400" />
          <span>Speak English</span>
        </button>

        {/* AI Composer button if multiple signs were made */}
        {signBuffer.length > 0 && (
          <button
            onClick={onAiCompose}
            disabled={isAiComposing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all active:scale-95 disabled:opacity-50 mr-auto"
          >
            <Sparkles className={`w-4 h-4 ${isAiComposing ? 'animate-spin' : ''}`} />
            <span>{isAiComposing ? 'جاري صياغة الجملة...' : 'صياغة ذكية بالذكاء الاصطناعي'}</span>
          </button>
        )}
      </div>

      {/* Signed Gesture Stream Buffer */}
      {signBuffer.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-800/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">
              تسلسل الإشارات المتتالية ({signBuffer.length}):
            </span>
            <button
              onClick={onClearBuffer}
              className="text-xs text-slate-400 hover:text-red-400 transition"
            >
              مسح التسلسل
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {signBuffer.map((sign, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-cyan-300"
              >
                <span>{sign}</span>
                <button
                  onClick={() => onRemoveBufferItem(idx)}
                  className="text-slate-400 hover:text-red-400 ml-1 text-sm font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
