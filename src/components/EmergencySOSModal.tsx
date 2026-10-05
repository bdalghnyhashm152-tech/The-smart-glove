import React, { useEffect } from 'react';
import { AlertTriangle, PhoneCall, Volume2, ShieldAlert, X, HeartPulse, MapPin } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';
import { ttsService } from '../services/ttsService';

interface EmergencySOSModalProps {
  onClose: () => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({ onClose }) => {
  const emergencyAr = '🚨 نداء طوارئ عاجل! أنا شخص أصم، أحتاج إلى إسعاف ومساعدة طبية فورية!';
  const emergencyEn = 'EMERGENCY! I am deaf and mute, I need urgent medical assistance immediately!';

  useEffect(() => {
    // Start siren sound and speak alert
    audioEngine.startEmergencySiren();
    ttsService.speak(emergencyAr, { lang: 'ar', rate: 1.1, volume: 1.0 });

    return () => {
      audioEngine.stopEmergencySiren();
    };
  }, []);

  const handleSpeakAgain = () => {
    ttsService.speak(emergencyAr, { lang: 'ar', rate: 1.1, volume: 1.0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-red-950/90 backdrop-blur-xl animate-pulse">
      <div className="bg-slate-900 border-2 border-red-500 w-full max-w-xl rounded-3xl p-6 shadow-[0_0_50px_rgba(239,68,68,0.6)] text-white relative">
        {/* Close Button */}
        <button
          onClick={() => {
            audioEngine.stopEmergencySiren();
            onClose();
          }}
          className="absolute top-4 left-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SOS Header */}
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <div className="p-4 rounded-full bg-red-600/30 border-2 border-red-500 text-red-400 animate-bounce">
            <ShieldAlert className="w-12 h-12" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-red-400">
            تنبيه استغاثة وطوارئ!
          </h2>
          <span className="text-xs font-mono uppercase bg-red-600/40 text-red-200 px-3 py-1 rounded-full border border-red-500/50">
            EMERGENCY SOS BROADCAST
          </span>
        </div>

        {/* Main Urgent Messages */}
        <div className="bg-slate-950/90 border border-red-500/40 rounded-2xl p-5 mb-5 space-y-3 text-center">
          <p className="text-xl sm:text-2xl font-black text-white leading-relaxed">
            {emergencyAr}
          </p>
          <p className="text-sm sm:text-base text-red-300 font-medium" dir="ltr">
            {emergencyEn}
          </p>
        </div>

        {/* Medical ID Card Info */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 mb-5 space-y-2 text-xs">
          <h4 className="font-bold text-slate-300 flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <HeartPulse className="w-4 h-4 text-red-400" />
            بطاقة الهوية الطبية لمستخدم القفاز:
          </h4>
          <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1">
            <div><span className="text-slate-500">الحالة:</span> أصم وأبكم (Deaf/Mute)</div>
            <div><span className="text-slate-500">فصيلة الدم:</span> O+ إيجابي</div>
            <div><span className="text-slate-500">رقم الإسعاف:</span> 997 / 911</div>
            <div><span className="text-slate-500">رقم الطوارئ للعائلة:</span> 0500000000</div>
          </div>
        </div>

        {/* Control Actions */}
        <div className="flex flex-wrap items-center gap-3 justify-center">
          <button
            onClick={handleSpeakAgain}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-500 font-bold text-sm shadow-lg shadow-red-600/40 active:scale-95 transition"
          >
            <Volume2 className="w-5 h-5" />
            <span>نطق نداء الطوارئ بصوت عالي</span>
          </button>

          <button
            onClick={() => {
              audioEngine.stopEmergencySiren();
              onClose();
            }}
            className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition"
          >
            إلغاء التنبيه وإيقاف الصفارة
          </button>
        </div>
      </div>
    </div>
  );
};
