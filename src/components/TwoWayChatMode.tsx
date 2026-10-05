import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Volume2, User, Sparkles, MessageSquare, CheckCircle, Hand } from 'lucide-react';
import { ConversationMessage } from '../types/glove';
import { ttsService } from '../services/ttsService';

interface TwoWayChatModeProps {
  onSendGloveSign: (textAr: string, textEn: string) => void;
  messages: ConversationMessage[];
  onAddMessage: (msg: ConversationMessage) => void;
  onClose: () => void;
}

export const TwoWayChatMode: React.FC<TwoWayChatModeProps> = ({
  onSendGloveSign,
  messages,
  onAddMessage,
  onClose
}) => {
  const [isListening, setIsListening] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [speechLanguage, setSpeechLanguage] = useState<'ar-SA' | 'en-US'>('ar-SA');
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Quick responses for the deaf user
  const quickDeafReplies = [
    { ar: 'نعم، فهمت عليك تماماً', en: 'Yes, I fully understand' },
    { ar: 'لا، لم أفهم. كرر من فضلك', en: 'No, please repeat' },
    { ar: 'شكراً جزيلاً لمساعدتك', en: 'Thank you very much for your help' },
    { ar: 'أنا بحاجة إلى وقت للكتابة', en: 'I need a moment to write/sign' },
    { ar: 'أين هو المكان المحدد؟', en: 'Where is the exact location?' },
    { ar: 'أنا بخير، لا تقلق', en: 'I am fine, do not worry' }
  ];

  // Start speech recognition for the hearing person
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('التعرف على الصوت غير مدعوم في متصفحك. يرجى تجربة Google Chrome.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = speechLanguage;
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setSpokenTranscript(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = async () => {
        setIsListening(false);
        if (spokenTranscript.trim()) {
          await handleHearingSpeechSubmit(spokenTranscript.trim());
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleHearingSpeechSubmit = async (text: string) => {
    if (!text) return;
    setIsProcessingAi(true);

    let simplifiedAr = text;
    let simplifiedEn = text;
    let keywords: string[] = [];

    try {
      const res = await fetch('/api/ai/speech-to-sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spokenText: text })
      });
      if (res.ok) {
        const data = await res.json();
        simplifiedAr = data.simplifiedArabic || text;
        simplifiedEn = data.english || text;
        keywords = data.keywords || [];
      }
    } catch {
      // fallback
    } finally {
      setIsProcessingAi(false);
      onAddMessage({
        id: Date.now().toString(),
        sender: 'hearing_user',
        arabicText: simplifiedAr,
        englishText: simplifiedEn,
        timestamp: Date.now(),
        matchedSigns: keywords
      });
      setSpokenTranscript('');
    }
  };

  const handleSendDeafReply = (ar: string, en: string) => {
    onAddMessage({
      id: Date.now().toString(),
      sender: 'deaf_user',
      arabicText: ar,
      englishText: en,
      timestamp: Date.now(),
      audioSpoken: true
    });
    ttsService.speak(ar, { lang: 'ar' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-cyan-500/30 w-full max-w-4xl h-[90vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                وضع الحوار المتبادل (أصم ↔ متحدث)
              </h2>
              <p className="text-xs text-slate-400">
                المتحدث يتكلم بالصوت ويتحول إلى نص وإشارة، والأصم يجيب بالقفاز أو الأزرار
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
          >
            إغلاق
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
              <div className="p-4 rounded-full bg-slate-800/80 border border-slate-700">
                <Hand className="w-10 h-10 text-cyan-400 animate-pulse" />
              </div>
              <h4 className="text-base font-bold text-slate-200">
                ابدأ المحادثة الآن
              </h4>
              <p className="text-xs max-w-md">
                اضغط على الميكروفون ليتحدث الشخص السامع، أو اختر من الردود السريعة أدناه ليرد الشخص الأصم بصوت مسموع!
              </p>
            </div>
          )}

          {messages.map((msg) => {
            const isDeaf = msg.sender === 'deaf_user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isDeaf ? 'mr-auto flex-row' : 'ml-auto flex-row-reverse'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isDeaf ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300' : 'bg-emerald-500/20 border border-emerald-400 text-emerald-300'
                }`}>
                  {isDeaf ? <Hand className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className={`rounded-2xl p-4 shadow-lg ${
                  isDeaf
                    ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-50'
                    : 'bg-slate-800/90 border border-slate-700 text-slate-100'
                }`}>
                  <div className="flex items-center justify-between gap-3 mb-1 text-[11px] text-slate-400">
                    <span className="font-semibold">
                      {isDeaf ? 'المستخدم الأصم (عبر القفاز الذكي)' : 'الشخص المتحدث (صوتياً)'}
                    </span>
                    <button
                      onClick={() => ttsService.speak(msg.arabicText, { lang: 'ar' })}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                      title="استماع"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-base sm:text-lg font-bold leading-relaxed mb-1">
                    {msg.arabicText}
                  </p>
                  <p className="text-xs text-slate-400" dir="ltr">
                    {msg.englishText}
                  </p>

                  {/* Keywords if provided */}
                  {msg.matchedSigns && msg.matchedSigns.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-400">مفاهيم الإشارة:</span>
                      {msg.matchedSigns.map((k, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-600/40">
                          {k}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Deaf User Quick Replies */}
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <div className="text-[11px] text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
            <Hand className="w-3.5 h-3.5 text-cyan-400" />
            ردود سريعة ومباشرة للشخص الأصم (تنطق صوتياً للسامع):
          </div>
          <div className="flex flex-wrap gap-2">
            {quickDeafReplies.map((r, i) => (
              <button
                key={i}
                onClick={() => handleSendDeafReply(r.ar, r.en)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 text-xs text-slate-300 hover:text-white transition active:scale-95 flex items-center gap-1.5"
              >
                <span>{r.ar}</span>
                <Volume2 className="w-3 h-3 text-cyan-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Hearing Person Voice Input Bar */}
        <div className="p-4 sm:p-5 bg-slate-950/90 border-t border-slate-800 flex items-center gap-3">
          <button
            onClick={toggleListening}
            className={`p-4 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95 ${
              isListening
                ? 'bg-red-600 text-white animate-pulse shadow-red-600/40'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
            }`}
            title="تحدث الآن (للشخص السامع)"
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={spokenTranscript}
              onChange={(e) => setSpokenTranscript(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleHearingSpeechSubmit(spokenTranscript.trim());
              }}
              placeholder={isListening ? 'جاري الاستماع... تحدث بوضوح' : 'تحدث عبر المايك أو اكتب هنا للطرف الآخر...'}
              className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-2xl py-3 px-4 text-sm text-slate-100 placeholder:text-slate-500 outline-none"
            />
          </div>

          <button
            onClick={() => handleHearingSpeechSubmit(spokenTranscript.trim())}
            disabled={!spokenTranscript.trim() || isProcessingAi}
            className="p-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white transition disabled:opacity-40 shadow-lg shadow-cyan-600/30"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
