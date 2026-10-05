import React, { useState } from 'react';
import { FlexSensors, IMUSensors, GestureDefinition, GestureCategory } from '../types/glove';
import { Sliders, Bluetooth, RefreshCw, Zap, Compass, Touchpad, Search, Layers } from 'lucide-react';
import { BUILTIN_GESTURES } from '../services/gestureEngine';

interface GloveTelemetryControlsProps {
  sensors: FlexSensors;
  imu: IMUSensors;
  touchContact: boolean;
  onUpdateSensor: (finger: keyof FlexSensors, val: number) => void;
  onUpdateIMU: (key: keyof IMUSensors, val: number) => void;
  onToggleContact: () => void;
  onResetSensors: () => void;
  onLoadPreset: (gesture: GestureDefinition) => void;
  onConnectBluetooth: () => void;
  onDisconnectBluetooth: () => void;
  isConnected: boolean;
  isConnecting: boolean;
}

export const GloveTelemetryControls: React.FC<GloveTelemetryControlsProps> = ({
  sensors,
  imu,
  touchContact,
  onUpdateSensor,
  onUpdateIMU,
  onToggleContact,
  onResetSensors,
  onLoadPreset,
  onConnectBluetooth,
  onDisconnectBluetooth,
  isConnected,
  isConnecting
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [presetSearch, setPresetSearch] = useState<string>('');

  const categoryTabs: { id: string; label: string }[] = [
    { id: 'all', label: '🌟 جميع الكلمات (' + BUILTIN_GESTURES.length + ')' },
    { id: 'greetings', label: '👋 التحيات' },
    { id: 'daily_needs', label: '💧 الحاجات اليومية' },
    { id: 'family', label: '👨‍👩‍👧‍👦 الأسرة والعائلة' },
    { id: 'questions', label: '❓ الأسئلة' },
    { id: 'places', label: '🏢 الأماكن والمرافق' },
    { id: 'actions', label: '⚡ الأفعال' },
    { id: 'emotions', label: '❤️ المشاعر' },
    { id: 'alphabet', label: '🔤 الحروف' },
    { id: 'numbers', label: '🔢 الأرقام' },
    { id: 'emergency', label: '🚨 الطوارئ' }
  ];

  const filteredPresets = BUILTIN_GESTURES.filter((g) => {
    const matchesCat = selectedCategory === 'all' || g.category === selectedCategory;
    const matchesSearch =
      presetSearch.trim() === '' ||
      g.arabic.toLowerCase().includes(presetSearch.toLowerCase()) ||
      g.english.toLowerCase().includes(presetSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-5">
      {/* Header & Bluetooth Connect */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-sm">
            لوحة تحكم مستشعرات القفاز والمحاكاة
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <button
              onClick={onDisconnectBluetooth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/60 transition"
            >
              <Bluetooth className="w-3.5 h-3.5 animate-pulse" />
              <span>فصل القفاز الفعلي</span>
            </button>
          ) : (
            <button
              onClick={onConnectBluetooth}
              disabled={isConnecting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/30 transition disabled:opacity-50"
            >
              <Bluetooth className={`w-3.5 h-3.5 ${isConnecting ? 'animate-spin' : ''}`} />
              <span>{isConnecting ? 'جاري الاقتران...' : 'ربط قفاز بلوتوث حقيقي (BLE)'}</span>
            </button>
          )}

          <button
            onClick={onResetSensors}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="إعادة ضبط المستشعرات إلى الوضع المنبسط"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5 Finger Flex Sensor Sliders */}
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-2">
          مستشعرات انثناء الأصابع (Flex Sensors - 0% مفرود إلى 100% مقبوض):
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            { label: 'الإبهام (Thumb)', key: 'thumb' as const },
            { label: 'السبابة (Index)', key: 'index' as const },
            { label: 'الوسطى (Middle)', key: 'middle' as const },
            { label: 'البنصر (Ring)', key: 'ring' as const },
            { label: 'الخنصر (Pinky)', key: 'pinky' as const },
          ].map(({ label, key }) => (
            <div key={key} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 flex flex-col">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-300 font-medium text-[11px]">{label}</span>
                <span className="font-mono text-cyan-400 font-bold">{Math.round(sensors[key])}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sensors[key]}
                onChange={(e) => onUpdateSensor(key, Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* IMU Orientation & Touch Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {/* Pitch slider */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-300 font-medium text-[11px] flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              الميل الرأسي (Pitch)
            </span>
            <span className="font-mono text-cyan-400 font-bold">{Math.round(imu.pitch)}°</span>
          </div>
          <input
            type="range"
            min="-90"
            max="90"
            value={imu.pitch}
            onChange={(e) => onUpdateIMU('pitch', Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
          />
        </div>

        {/* Roll slider */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-slate-300 font-medium text-[11px] flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              الميل الجانبي (Roll)
            </span>
            <span className="font-mono text-cyan-400 font-bold">{Math.round(imu.roll)}°</span>
          </div>
          <input
            type="range"
            min="-90"
            max="90"
            value={imu.roll}
            onChange={(e) => onUpdateIMU('roll', Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
          />
        </div>

        {/* Touch Contact Sensor Button */}
        <div className="flex items-center">
          <button
            onClick={onToggleContact}
            className={`w-full py-2.5 px-3 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
              touchContact
                ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Touchpad className="w-4 h-4" />
            <span>مستشعر التلامس: {touchContact ? 'مُلامس (مفعّل)' : 'غير ملامس'}</span>
          </button>
        </div>
      </div>

      {/* Comprehensive Words & Signs Library */}
      <div className="pt-2 border-t border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white">
              لوحة الكلمات والإشارات الشاملة (اضغط على أي كلمة لمحاكاتها وترجمتها فوراً):
            </h4>
          </div>

          {/* Search box for words */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
            <input
              type="text"
              value={presetSearch}
              onChange={(e) => setPresetSearch(e.target.value)}
              placeholder="ابحث عن أي كلمة..."
              className="w-full bg-slate-950 border border-slate-700/80 focus:border-cyan-400 rounded-lg py-1.5 pr-8 pl-3 text-xs text-slate-100 placeholder:text-slate-500 outline-none"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === tab.id
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Word Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
          {filteredPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onLoadPreset(preset)}
              className={`p-2 rounded-xl text-right border transition-all active:scale-95 flex flex-col justify-between group ${
                preset.isEmergency
                  ? 'bg-red-950/60 border-red-500/50 text-red-200 hover:bg-red-900/60'
                  : 'bg-slate-950/80 border-slate-800 hover:border-cyan-400 hover:bg-slate-800/80 text-slate-200'
              }`}
            >
              <div className="font-bold text-xs text-white group-hover:text-cyan-300 truncate w-full">
                {preset.arabic}
              </div>
              <div className="text-[10px] text-slate-400 truncate w-full mt-0.5" dir="ltr">
                {preset.english}
              </div>
            </button>
          ))}

          {filteredPresets.length === 0 && (
            <div className="col-span-full py-4 text-center text-xs text-slate-500">
              لا توجد كلمات مطابقة للبحث "{presetSearch}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

