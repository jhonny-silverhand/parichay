/**
 * Archipelago Audio Engine
 * 
 * 100% offline, zero-network, synthetic sound design built with the Web Audio API.
 * Provides tactile mechanical clicks, resonant crystalline glass caustics chimes,
 * and sub-bass spatial sweeps for the avant-garde Archipelago Monolith.
 */

class ArchipelagoAudioEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('archipelago_audio_muted');
      this.muted = saved === 'true';
    }
  }

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('archipelago_audio_muted', String(this.muted));
    }
    if (!this.muted) {
      this.playClick();
    }
    return this.muted;
  }

  /**
   * Tactile Leica-style micro click
   */
  public playClick(): void {
    if (this.muted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Graceful fallback on strict audio policies
    }
  }

  /**
   * Crystalline quartz flip chime
   */
  public playFlip(): void {
    if (this.muted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const freqs = [880, 1320, 1760];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.025);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.18 + idx * 0.025);

        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28 + idx * 0.025);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.025);
        osc.stop(ctx.currentTime + 0.3 + idx * 0.025);
      });
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Photonic aperture laser sweep
   */
  public playScanSweep(): void {
    if (this.muted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1840, ctx.currentTime + 0.14);

      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Deep sub-bass resonance pulse for modal activation
   */
  public playResonance(): void {
    if (this.muted) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } catch {
      // Graceful fallback
    }
  }
}

export const archipelagoAudio = new ArchipelagoAudioEngine();
