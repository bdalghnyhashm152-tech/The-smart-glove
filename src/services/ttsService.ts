// Text-to-Speech (TTS) Service supporting Arabic (العربية) and English

export interface TTSOptions {
  lang?: 'ar' | 'en';
  rate?: number;   // 0.5 to 2
  pitch?: number;  // 0.5 to 2
  volume?: number; // 0 to 1
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

class TTSService {
  private synth: SpeechSynthesis | null = null;
  public isSpeaking = false;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public getAvailableVoices() {
    return this.voices;
  }

  public speak(text: string, options: TTSOptions = {}) {
    if (!this.synth || !text) return;

    // Cancel existing speech
    this.synth.cancel();

    const lang = options.lang || (this.isArabic(text) ? 'ar' : 'en');
    const utterance = new SpeechSynthesisUtterance(text);

    // Settings
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.0;
    utterance.volume = options.volume ?? 1.0;
    utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';

    // Pick best matching voice
    if (this.voices.length > 0) {
      const matchPrefix = lang === 'ar' ? 'ar' : 'en';
      const voice = this.voices.find(v => v.lang.toLowerCase().startsWith(matchPrefix));
      if (voice) {
        utterance.voice = voice;
      }
    }

    this.isSpeaking = true;
    if (options.onStart) options.onStart();

    utterance.onend = () => {
      this.isSpeaking = false;
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      if (options.onError) options.onError(e);
      if (options.onEnd) options.onEnd();
    };

    try {
      this.synth.speak(utterance);
    } catch {
      this.isSpeaking = false;
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  public isArabic(text: string): boolean {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return arabicRegex.test(text);
  }
}

export const ttsService = new TTSService();
