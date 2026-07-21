export class Sound {
  private context?: AudioContext;
  private enabled = true;

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (enabled) this.unlock();
  }

  unlock(): void {
    if (!this.enabled) return;
    this.context ??= new AudioContext();
    void this.context.resume();
  }

  tone(frequency: number, duration = 0.12, type: OscillatorType = 'sine', volume = 0.06): void {
    if (!this.context || !this.enabled) return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
    gain.gain.setValueAtTime(volume, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
    oscillator.connect(gain).connect(this.context.destination);
    oscillator.start();
    oscillator.stop(this.context.currentTime + duration);
  }

  eat(): void { this.tone(520, 0.1, 'square', 0.045); setTimeout(() => this.tone(720, 0.12, 'square', 0.04), 45); }
  crash(): void { this.tone(90, 0.32, 'sawtooth', 0.075); }
  portal(): void { this.tone(240, 0.16, 'sine', 0.05); setTimeout(() => this.tone(460, 0.18, 'sine', 0.04), 45); }
  level(): void { [440, 554, 659, 880].forEach((note, i) => setTimeout(() => this.tone(note, 0.3, 'triangle'), i * 90)); }
  win(): void { [523, 659, 784].forEach((note, i) => setTimeout(() => this.tone(note, 0.35, 'triangle'), i * 130)); }
}
