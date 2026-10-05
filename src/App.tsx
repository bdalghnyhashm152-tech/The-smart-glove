import React, { useState, useEffect, useRef } from 'react';
import {
  Hand,
  Volume2,
  VolumeX,
  Sparkles,
  Bluetooth,
  Camera,
  MessageSquare,
  BookOpen,
  PlusCircle,
  AlertTriangle,
  Settings,
  History,
  Trash2,
  ShieldCheck,
  CheckCircle,
  Wifi
} from 'lucide-react';

import { FlexSensors, IMUSensors, RecognizedGesture, TranslationHistoryItem, ConversationMessage, GestureDefinition } from './types/glove';
import { BUILTIN_GESTURES, gestureEngine } from './services/gestureEngine';
import { ttsService } from './services/ttsService';
import { audioEngine } from './services/audioEngine';
import { bluetoothService } from './services/bluetoothService';

import { GloveVisualizer } from './components/GloveVisualizer';
import { GloveTelemetryControls } from './components/GloveTelemetryControls';
import { LiveTranslationBanner } from './components/LiveTranslationBanner';
import { TwoWayChatMode } from './components/TwoWayChatMode';
import { CameraVisionMode } from './components/CameraVisionMode';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { SignDictionaryModal } from './components/SignDictionaryModal';
import { CustomGestureModal } from './components/CustomGestureModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  // 1. Glove Sensors State
  const [sensors, setSensors] = useState<FlexSensors>({
    thumb: 0,
    index: 0,
    middle: 0,
    ring: 0,
    pinky: 0
  });

  const [imu, setIMU] = useState<IMUSensors>({
    pitch: 10,
    roll: 0,
    yaw: 0
  });

  const [touchContact, setTouchContact] = useState<boolean>(false);
  const [batteryLevel, setBatteryLevel] = useState<number>(94);
  const [isBluetoothConnected, setIsBluetoothConnected] = useState<boolean>(false);
  const [isConnectingBLE, setIsConnectingBLE] = useState<boolean>(false);
  const [deviceName, setDeviceName] = useState<string>('قفاز إشارة ذكي V2 (محاكي)');

  // 2. Gesture Recognition State
  const [currentRecognition, setCurrentRecognition] = useState<RecognizedGesture | null>(null);
  const [signBuffer, setSignBuffer] = useState<string[]>([]);
  const [composedResult, setComposedResult] = useState<{ arabic: string; english: string } | null>(null);
  const [isAiComposing, setIsAiComposing] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(70);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);

  // 3. Audio & Voice Settings
  const [ttsRate, setTtsRate] = useState<number>(1.0);
  const [ttsPitch, setTtsPitch] = useState<number>(1.0);

  // 4. History & Conversations
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);

  // 5. Modals State
  const [showTwoWayChat, setShowTwoWayChat] = useState<boolean>(false);
  const [showCameraVision, setShowCameraVision] = useState<boolean>(false);
  const [showEmergencySOS, setShowEmergencySOS] = useState<boolean>(false);
  const [showDictionary, setShowDictionary] = useState<boolean>(false);
  const [showCustomTrainer, setShowCustomTrainer] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Tracking last spoke to avoid spamming the exact same audio every millisecond
  const lastSpokenGestureIdRef = useRef<string | null>(null);
  const lastSpokeTimeRef = useRef<number>(0);

  // Real-time evaluation of glove sensors on every state update
  useEffect(() => {
    const match = gestureEngine.recognize(sensors, imu, touchContact, confidenceThreshold);

    if (match) {
      setCurrentRecognition(match);

      // Check if we should trigger audio / buffer
      const now = Date.now();
      const isNewGesture = lastSpokenGestureIdRef.current !== match.gesture.id;
      const cooldownPassed = now - lastSpokeTimeRef.current > 1800;

      if (isNewGesture || cooldownPassed) {
        lastSpokenGestureIdRef.current = match.gesture.id;
        lastSpokeTimeRef.current = now;

        // Sound effect
        audioEngine.playRecognitionTone(match.confidence / 100);

        // Haptic feedback if supported
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(match.gesture.isEmergency ? [100, 50, 100] : 40);
        }

        // Add to history
        setHistory((prev) => [
          {
            id: Date.now().toString(),
            arabic: match.gesture.arabic,
            english: match.gesture.english,
            timestamp: Date.now(),
            source: 'glove',
            category: match.gesture.category,
            isEmergency: match.gesture.isEmergency
          },
          ...prev.slice(0, 24)
        ]);

        // Add to sign buffer if not already the last item
        setSignBuffer((prev) => {
          if (prev[prev.length - 1] !== match.gesture.arabic) {
            return [...prev, match.gesture.arabic];
          }
          return prev;
        });

        // Auto speak if enabled
        if (autoSpeak) {
          ttsService.speak(match.gesture.arabic, {
            lang: 'ar',
            rate: ttsRate,
            pitch: ttsPitch
          });
        }

        // If emergency gesture triggered directly from glove, open SOS modal
        if (match.gesture.isEmergency) {
          setShowEmergencySOS(true);
        }
      }
    } else {
      // Dwell period before clearing current visual match
      const timer = setTimeout(() => {
        setCurrentRecognition(null);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [sensors, imu, touchContact, confidenceThreshold, autoSpeak, ttsRate, ttsPitch]);

  // Telemetry handlers
  const handleUpdateSensor = (finger: keyof FlexSensors, val: number) => {
    setSensors((prev) => ({ ...prev, [finger]: val }));
    setComposedResult(null); // Reset composed sentence when fresh signing starts
  };

  const handleUpdateIMU = (key: keyof IMUSensors, val: number) => {
    setIMU((prev) => ({ ...prev, [key]: val }));
  };

  const handleToggleContact = () => {
    setTouchContact((prev) => !prev);
    audioEngine.playTick();
  };

  const handleResetSensors = () => {
    setSensors({ thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0 });
    setIMU({ pitch: 0, roll: 0, yaw: 0 });
    setTouchContact(false);
    setComposedResult(null);
    audioEngine.playTick();
  };

  // Load a gesture preset into glove sensors
  const handleLoadPreset = (gesture: GestureDefinition) => {
    setSensors({ ...gesture.targetSensors });
    if (gesture.targetIMU) {
      setIMU((prev) => ({
        ...prev,
        pitch: gesture.targetIMU?.pitch ?? prev.pitch,
        roll: gesture.targetIMU?.roll ?? prev.roll
      }));
    }
    if (gesture.targetContact !== undefined) {
      setTouchContact(gesture.targetContact);
    }
    setComposedResult(null);
    audioEngine.playTick();
  };

  // Bluetooth connect
  const handleConnectBluetooth = async () => {
    setIsConnectingBLE(true);
    const res = await bluetoothService.connectRealGlove(
      (incoming) => {
        setSensors({
          thumb: incoming.thumb,
          index: incoming.index,
          middle: incoming.middle,
          ring: incoming.ring,
          pinky: incoming.pinky
        });
        setIMU((prev) => ({
          ...prev,
          pitch: incoming.pitch,
          roll: incoming.roll
        }));
        setTouchContact(incoming.touch);
      },
      () => {
        setIsBluetoothConnected(false);
        setDeviceName('قفاز إشارة ذكي V2 (محاكي)');
      }
    );

    setIsConnectingBLE(false);
    if (res.success) {
      setIsBluetoothConnected(true);
      setDeviceName(res.deviceName || 'Smart Glove BLE');
      audioEngine.playConnectChirp();
    } else {
      alert(res.error || 'فشل الاتصال بالبلوتوث');
    }
  };

  const handleDisconnectBluetooth = () => {
    bluetoothService.disconnect();
    setIsBluetoothConnected(false);
    setDeviceName('قفاز إشارة ذكي V2 (محاكي)');
    audioEngine.playTick();
  };

  // Audio Speech Handler
  const handleSpeakPhrase = (text: string, lang: 'ar' | 'en' = 'ar') => {
    ttsService.speak(text, {
      lang,
      rate: ttsRate,
      pitch: ttsPitch
    });
  };

  // AI Sentence Composer: converts list of signs to fluent speech
  const handleAiCompose = async () => {
    if (signBuffer.length === 0) return;
    setIsAiComposing(true);

    try {
      const res = await fetch('/api/ai/compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signs: signBuffer,
          context: 'محادثة يومية لمستخدم القفاز الذكي الأصم'
        })
      });

      if (res.ok) {
        const data = await res.json();
        const ar = data.composedArabic || signBuffer.join(' ');
        const en = data.composedEnglish || '';
        setComposedResult({ arabic: ar, english: en });

        // Add to history
        setHistory((prev) => [
          {
            id: Date.now().toString(),
            arabic: ar,
            english: en,
            timestamp: Date.now(),
            source: 'ai_composer'
          },
          ...prev
        ]);

        // Speak aloud
        ttsService.speak(ar, { lang: 'ar', rate: ttsRate, pitch: ttsPitch });
      }
    } catch {
      // Direct concatenation fallback
      const ar = signBuffer.join(' ');
      setComposedResult({ arabic: ar, english: 'Gesture sequence translated' });
      ttsService.speak(ar, { lang: 'ar' });
    } finally {
      setIsAiComposing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white pb-12">
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/20 px-4 sm:px-8 py-3.5 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Hand className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white tracking-tight">
                  القفاز الذكي
                </h1>
                <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/40">
                  Smart Glove V2
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                مترجم لغة الإشارة إلى صوت وكلام بالعربية والإنجليزية
              </p>
            </div>
          </div>

          {/* Quick Action Navigation Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Two-Way Chat Modal Button */}
            <button
              onClick={() => setShowTwoWayChat(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-cyan-500 text-xs font-semibold text-slate-200 hover:text-white transition shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>حوار ثنائي (أصم ↔ سامع)</span>
            </button>

            {/* Camera Vision Mode */}
            <button
              onClick={() => setShowCameraVision(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-cyan-500 text-xs font-semibold text-slate-200 hover:text-white transition shadow-sm"
            >
              <Camera className="w-4 h-4 text-blue-400" />
              <span>كاميرا الذكاء الاصطناعي</span>
            </button>

            {/* Sign Dictionary */}
            <button
              onClick={() => setShowDictionary(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-cyan-500 text-xs font-semibold text-slate-200 hover:text-white transition shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>قاموس الإشارات</span>
            </button>

            {/* Record Custom Sign */}
            <button
              onClick={() => setShowCustomTrainer(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-cyan-500 text-xs font-semibold text-slate-200 hover:text-white transition shadow-sm"
              title="تسجيل إشارة مخصصة"
            >
              <PlusCircle className="w-4 h-4 text-purple-400" />
              <span>تدريب إشارة</span>
            </button>

            {/* Emergency SOS Button (Bright Red) */}
            <button
              onClick={() => setShowEmergencySOS(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold shadow-lg shadow-red-600/40 active:scale-95 transition"
            >
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span>طوارئ SOS</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-cyan-500 text-slate-300 hover:text-white transition"
              title="الإعدادات ومستوى الصوت"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 pt-6 space-y-6 flex-1">
        {/* Banner: Live Gesture Recognition & Translation with Audio and AI Sentence Composer */}
        <LiveTranslationBanner
          currentRecognition={currentRecognition}
          signBuffer={signBuffer}
          onClearBuffer={() => setSignBuffer([])}
          onRemoveBufferItem={(idx) => setSignBuffer((prev) => prev.filter((_, i) => i !== idx))}
          onSpeakPhrase={handleSpeakPhrase}
          autoSpeak={autoSpeak}
          onToggleAutoSpeak={() => setAutoSpeak(!autoSpeak)}
          onAiCompose={handleAiCompose}
          isAiComposing={isAiComposing}
          composedResult={composedResult}
        />

        {/* 3. GLOVE HARDWARE & TELEMETRY SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left/Center: Visualizer (High-tech 3D/SVG Hand Skeleton) */}
          <div className="lg:col-span-5 w-full">
            <GloveVisualizer
              sensors={sensors}
              imu={imu}
              touchContact={touchContact}
              isConnected={isBluetoothConnected}
              deviceName={deviceName}
              batteryLevel={batteryLevel}
              activeGestureName={currentRecognition?.gesture.arabic}
            />
          </div>

          {/* Right: Glove Telemetry Controls & Presets */}
          <div className="lg:col-span-7 w-full space-y-6">
            <GloveTelemetryControls
              sensors={sensors}
              imu={imu}
              touchContact={touchContact}
              onUpdateSensor={handleUpdateSensor}
              onUpdateIMU={handleUpdateIMU}
              onToggleContact={handleToggleContact}
              onResetSensors={handleResetSensors}
              onLoadPreset={handleLoadPreset}
              onConnectBluetooth={handleConnectBluetooth}
              onDisconnectBluetooth={handleDisconnectBluetooth}
              isConnected={isBluetoothConnected}
              isConnecting={isConnectingBLE}
            />

            {/* Translation Log / History */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-bold text-slate-100">
                    سجل الإشارات والترجمات الأخيرة ({history.length})
                  </h4>
                </div>
                {history.length > 0 && (
                  <button
                    onClick={() => setHistory([])}
                    className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>مسح السجل</span>
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">
                  لا توجد حركات مسجلة بعد. حرّك القفاز أو اضغط على إحدى الوضعيات لبدء الترجمة.
                </p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {history.slice(0, 10).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/40 transition group"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-100">
                          {item.arabic}
                        </p>
                        <p className="text-xs text-slate-400 font-medium" dir="ltr">
                          {item.english}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(item.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                        <button
                          onClick={() => handleSpeakPhrase(item.arabic, 'ar')}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-cyan-400 transition"
                          title="استمع مرة أخرى"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 4. MODALS */}
      {/* Two-Way Deaf ↔ Hearing Conversation Modal */}
      {showTwoWayChat && (
        <TwoWayChatMode
          messages={conversationMessages}
          onAddMessage={(msg) => setConversationMessages((prev) => [...prev, msg])}
          onSendGloveSign={(ar, en) => {
            setConversationMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                sender: 'deaf_user',
                arabicText: ar,
                englishText: en,
                timestamp: Date.now()
              }
            ]);
            handleSpeakPhrase(ar, 'ar');
          }}
          onClose={() => setShowTwoWayChat(false)}
        />
      )}

      {/* Camera Gesture Recognition Mode */}
      {showCameraVision && (
        <CameraVisionMode
          onGestureDetected={(gesture, conf) => {
            handleLoadPreset(gesture);
            audioEngine.playRecognitionTone(conf / 100);
          }}
          onClose={() => setShowCameraVision(false)}
        />
      )}

      {/* Emergency SOS Modal */}
      {showEmergencySOS && (
        <EmergencySOSModal onClose={() => setShowEmergencySOS(false)} />
      )}

      {/* Sign Language Dictionary Modal */}
      {showDictionary && (
        <SignDictionaryModal
          onLoadGestureToGlove={handleLoadPreset}
          onClose={() => setShowDictionary(false)}
        />
      )}

      {/* Custom Gesture Trainer Modal */}
      {showCustomTrainer && (
        <CustomGestureModal
          currentSensors={sensors}
          currentIMU={imu}
          currentContact={touchContact}
          onRefreshGestures={() => {
            gestureEngine.loadCustomGestures();
          }}
          onClose={() => setShowCustomTrainer(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          ttsRate={ttsRate}
          setTtsRate={setTtsRate}
          ttsPitch={ttsPitch}
          setTtsPitch={setTtsPitch}
          confidenceThreshold={confidenceThreshold}
          setConfidenceThreshold={setConfidenceThreshold}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
