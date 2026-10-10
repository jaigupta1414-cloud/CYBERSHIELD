/**
 * Audio Synthesizer using Web Audio API
 * Provides tactical SOS siren and system notification beeps without external audio files
 */

class SoundService {
  private ctx: AudioContext | null = null;
  private sirenInterval: any = null;
  private isSirenActive = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playBeep(freq = 880, duration = 0.08, type: OscillatorType = 'sine') {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio playback failed silently
    }
  }

  playSuccess() {
    this.playBeep(523.25, 0.06, 'sine');
    setTimeout(() => this.playBeep(659.25, 0.08, 'sine'), 60);
  }

  playWarning() {
    this.playBeep(440, 0.12, 'square');
    setTimeout(() => this.playBeep(330, 0.15, 'square'), 120);
  }

  startEmergencySiren() {
    if (this.isSirenActive) return;
    this.initCtx();
    if (!this.ctx) return;
    this.isSirenActive = true;

    let highPitch = true;
    const pulse = () => {
      if (!this.isSirenActive || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      const targetFreq = highPitch ? 960 : 640;
      highPitch = !highPitch;
      
      osc.frequency.setValueAtTime(targetFreq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    };

    pulse();
    this.sirenInterval = setInterval(pulse, 400);
  }

  stopEmergencySiren() {
    this.isSirenActive = false;
    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
  }

  isSirenRunning() {
    return this.isSirenActive;
  }
}

export const sound = new SoundService();
