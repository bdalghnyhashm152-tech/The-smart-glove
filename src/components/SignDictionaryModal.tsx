import React, { useState } from 'react';
import { BookOpen, Search, Volume2, Play, Sparkles, X, Filter } from 'lucide-react';
import { GestureDefinition, GestureCategory } from '../types/glove';
import { BUILTIN_GESTURES } from '../services/gestureEngine';
import { ttsService } from '../services/ttsService';

interface SignDictionaryModalProps {
  onLoadGestureToGlove: (gesture: GestureDefinition) => void;
  onClose: () => void;
}

export const SignDictionaryModal: React.FC<SignDictionaryModalProps> = ({
  onLoadGestureToGlove,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'الكل (' + BUILTIN_GESTURES.length + ')' },
    { id: 'greetings', label: 'التحيات والترحيب' },
    { id: 'daily_needs', label: 'الحاجات اليومية' },
    { id: 'family', label: 'الأسرة والعائلة' },
    { id: 'questions', label: 'الأسئلة والاستفسار' },
    { id: 'places', label: 'الأماكن والمرافق' },
    { id: 'actions', label: 'الأفعال والحاجات' },
    { id: 'emotions', label: 'المشاعر والاجتماعيات' },
    { id: 'alphabet', label: 'الحروف الهجائية' },
    { id: 'numbers', label: 'الأرقام والوقت' },
    { id: 'emergency', label: 'الطوارئ والصحة' }
  ];

  const filteredGestures = BUILTIN_GESTURES.filter((g) => {
    const matchesCat = selectedCategory === 'all' || g.category === selectedCategory;
    const matchesSearch =
      g.arabic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.descriptionAr.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-cyan-500/30 w-full max-w-4xl h-[90vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                قاموس لغة الإشارة للقفاز الذكي
              </h2>
              <p className="text-xs text-slate-400">
                مكتبة الإشارات المبرمجة باللغتين العربية والإنجليزية
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

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن إشارة أو كلمة بالعربية أو الإنجليزية..."
              className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl py-2.5 pr-10 pl-4 text-sm text-slate-100 placeholder:text-slate-500 outline-none"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gestures Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGestures.map((gesture) => (
            <div
              key={gesture.id}
              className="bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="text-base font-bold text-white">
                    {gesture.arabic}
                  </h4>
                  <button
                    onClick={() => ttsService.speak(gesture.arabic, { lang: 'ar' })}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-cyan-500/20 text-cyan-400 transition"
                    title="استمع للنطق"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-cyan-300/80 font-medium mb-2" dir="ltr">
                  {gesture.english}
                </p>

                <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                  {gesture.descriptionAr}
                </p>
              </div>

              {/* Finger Sensor Values Blueprint Mini */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                  <span>إ:{gesture.targetSensors.thumb}</span>
                  <span>س:{gesture.targetSensors.index}</span>
                  <span>و:{gesture.targetSensors.middle}</span>
                  <span>ب:{gesture.targetSensors.ring}</span>
                  <span>خ:{gesture.targetSensors.pinky}</span>
                </div>

                <button
                  onClick={() => {
                    onLoadGestureToGlove(gesture);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-semibold transition active:scale-95"
                >
                  <Play className="w-3 h-3" />
                  <span>محاكاة بالقفاز</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
