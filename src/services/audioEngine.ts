// Web Audio API Synthesizer for UI sound effects and emergency siren

class AudioEngine {
  private ctx: AudioContext | null = null;
  private sirenOsc1: OscillatorNode | null = null;
  private sirenOsc2: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;
  private sirenInterval: any = null;
  public isSirenActive = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play subtle futuristic chime when gesture recognized
  playRecognitionTone(confidence = 0.9) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.12); // A5

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12 * Math.min(1, confidence), now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch {
      // Ignore audio failure
    }
  }

  // Play connection sound
  playConnectChirp() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(880, now + 0.16);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // ignore
    }
  }

  // Play button click tick
  playTick() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // ignore
    }
  }

  // Start continuous emergency siren
  startEmergencySiren() {
    try {
      if (this.isSirenActive) return;
      this.initCtx();
      if (!this.ctx) return;

      this.isSirenActive = true;
      const now = this.ctx.currentTime;

      this.sirenGain = this.ctx.createGain();
      this.sirenGain.gain.setValueAtTime(0.35, now);
      this.sirenGain.connect(this.ctx.destination);

      this.sirenOsc1 = this.ctx.createOscillator();
      this.sirenOsc1.type = 'sawtooth';
      this.sirenOsc1.frequency.setValueAtTime(700, now);
      this.sirenOsc1.connect(this.sirenGain);
      this.sirenOsc1.start();

      let toggle = false;
      this.sirenInterval = setInterval(() => {
        if (!this.ctx || !this.sirenOsc1) return;
        const curTime = this.ctx.currentTime;
        toggle = !toggle;
        const targetFreq = toggle ? 1050 : 650;
        this.sirenOsc1.frequency.linearRampToValueAtTime(targetFreq, curTime + 0.35);
      }, 400);
    } catch {
      // ignore
    }
  }

  // Stop emergency siren
  stopEmergencySiren() {
    try {
      this.isSirenActive = false;
      if (this.sirenInterval) {
        clearInterval(this.sirenInterval);
        this.sirenInterval = null;
      }
      if (this.sirenOsc1) {
        this.sirenOsc1.stop();
        this.sirenOsc1.disconnect();
        this.sirenOsc1 = null;
      }
      if (this.sirenGain) {
        this.sirenGain.disconnect();
        this.sirenGain = null;
      }
    } catch {
      // ignore
    }
  }
}

export const audioEngine = new AudioEngine();
