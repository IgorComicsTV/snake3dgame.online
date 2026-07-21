import type { Direction } from './simulation';

const directions: Record<string, Direction> = {
  ArrowUp: { x: 0, z: -1 }, KeyW: { x: 0, z: -1 },
  ArrowDown: { x: 0, z: 1 }, KeyS: { x: 0, z: 1 },
  ArrowLeft: { x: -1, z: 0 }, KeyA: { x: -1, z: 0 },
  ArrowRight: { x: 1, z: 0 }, KeyD: { x: 1, z: 0 },
};

export function directionFromSwipe(deltaX: number, deltaY: number, threshold: number): Direction | undefined {
  if (Math.hypot(deltaX, deltaY) < threshold) return undefined;
  return Math.abs(deltaX) > Math.abs(deltaY)
    ? { x: Math.sign(deltaX), z: 0 }
    : { x: 0, z: Math.sign(deltaY) };
}

export class Input {
  private queue: Direction[] = [];
  private swipeStart?: { x: number; y: number; pointerId: number };

  constructor() {
    window.addEventListener('keydown', (event) => {
      const direction = directions[event.code];
      if (!direction) return;
      event.preventDefault();
      this.push(direction);
    });
    document.querySelectorAll<HTMLButtonElement>('[data-key]').forEach((button) => {
      const direction = directions[button.dataset.key ?? ''];
      button.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        if (direction) this.push(direction);
      });
    });
    const canvas = document.querySelector<HTMLCanvasElement>('#game-canvas');
    canvas?.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'touch') return;
      this.swipeStart = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
      canvas.setPointerCapture(event.pointerId);
    });
    canvas?.addEventListener('pointerup', (event) => {
      const start = this.swipeStart;
      if (!start || start.pointerId !== event.pointerId) return;
      this.swipeStart = undefined;
      const deltaX = event.clientX - start.x;
      const deltaY = event.clientY - start.y;
      const threshold = Math.max(24, Math.min(innerWidth, innerHeight) * 0.065);
      const direction = directionFromSwipe(deltaX, deltaY, threshold);
      if (!direction) return;
      this.push(direction);
      navigator.vibrate?.(10);
    });
    canvas?.addEventListener('pointercancel', () => { this.swipeStart = undefined; });
  }

  drain(): Direction[] {
    const directionsToApply = this.queue;
    this.queue = [];
    return directionsToApply;
  }

  clear(): void { this.queue = []; }

  private push(direction: Direction): void {
    const last = this.queue.at(-1);
    if (last?.x === direction.x && last.z === direction.z) return;
    if (this.queue.length < 3) this.queue.push(direction);
  }
}
