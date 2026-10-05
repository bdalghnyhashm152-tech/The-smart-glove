import React, { useState } from 'react';
import { FlexSensors, IMUSensors, GestureDefinition } from '../types/glove';
import { PlusCircle, Sparkles, X, Check, Trash2 } from 'lucide-react';
import { gestureEngine } from '../services/gestureEngine';

interface CustomGestureModalProps {
  currentSensors: FlexSensors;
  currentIMU: IMUSensors;
  currentContact: boolean;
  onClose: () => void;
  onRefreshGestures: () => void;
}

export const CustomGestureModal: React.FC<CustomGestureModalProps> = ({
  currentSensors,
  currentIMU,
  currentContact,
  onClose,
  onRefreshGestures
}) => {
  const [arabicText, setArabicText] = useState('');
  const [englishText, setEnglishText] = useState('');
  const [description, setDescription] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    if (!arabicText.trim()) return;

    const newGesture: GestureDefinition = {
      id: `custom_${Date.now()}`,
      arabic: arabicText.trim(),
      english: englishText.trim() || arabicText.trim(),
      category: 'custom',
      descriptionAr: description.trim() || 'إشارة مخصصة تم تسجيلها بواسطة المستخدم',
      descriptionEn: 'Custom user recorded gesture',
      targetSensors: { ...currentSensors },
      targetIMU: {
        pitch: Math.round(currentIMU.pitch),
        roll: Math.round(currentIMU.roll)
      },
      targetContact: currentContact,
      tolerance: 28,
      isCustom: true
    };

    gestureEngine.saveCustomGesture(newGesture);
    onRefreshGestures();
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-cyan-500/40 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">
              تسجيل وتدريب إشارة جديدة
            </h3>
            <p className="text-xs text-slate-400">
              احفظ وضعية أصابع يدك الحالية لترجمتها تلقائياً لاحقاً
            </p>
          </div>
        </div>

        {/* Current Sensor Snapshot preview */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 mb-4">
          <span className="text-[11px] font-semibold text-slate-400 block mb-2">
            لقطة المستشعرات الحالية التي سيتم حفظها:
          </span>
          <div className="grid grid-cols-5 gap-1.5 text-center font-mono text-xs">
            <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[10px] block">إبهام</span>
              <span className="text-cyan-400 font-bold">{Math.round(currentSensors.thumb)}%</span>
            </div>
            <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[10px] block">سبابة</span>
              <span className="text-cyan-400 font-bold">{Math.round(currentSensors.index)}%</span>
            </div>
            <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[10px] block">وسطى</span>
              <span className="text-cyan-400 font-bold">{Math.round(currentSensors.middle)}%</span>
            </div>
            <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[10px] block">بنصر</span>
              <span className="text-cyan-400 font-bold">{Math.round(currentSensors.ring)}%</span>
            </div>
            <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[10px] block">خنصر</span>
              <span className="text-cyan-400 font-bold">{Math.round(currentSensors.pinky)}%</span>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-3 mb-5">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              العبارة المنطوقة بالعربية:
            </label>
            <input
              type="text"
              value={arabicText}
              onChange={(e) => setArabicText(e.target.value)}
              placeholder="مثال: اسمي محمد، أو أحتاج دواء الحساسية..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl py-2 px-3 text-sm text-white placeholder:text-slate-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              الترجمة باللغة الإنجليزية:
            </label>
            <input
              type="text"
              value={englishText}
              onChange={(e) => setEnglishText(e.target.value)}
              placeholder="Example: My name is Mohammed..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl py-2 px-3 text-sm text-white placeholder:text-slate-500 outline-none"
              dir="ltr"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              وصف الحركة (اختياري):
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثال: وضعية الإبهام لأعلى مع ميلان اليد..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl py-2 px-3 text-sm text-white placeholder:text-slate-500 outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!arabicText.trim() || savedSuccess}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 active:scale-95 transition disabled:opacity-50"
        >
          {savedSuccess ? (
            <>
              <Check className="w-5 h-5 text-emerald-400" />
              <span>تم تدريب وحفظ الإشارة بنجاح!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>حفظ وتدريب الإشارة الآن</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
