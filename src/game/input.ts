import type { Direction } from './simulation';

const directions: Record<string, Direction> = {
  ArrowUp: { x: 0, z: -1 }, KeyW: { x: 0, z: -1 },
  ArrowDown: { x: 0, z: 1 }, KeyS: { x: 0, z: 1 },
  ArrowLeft: { x: -1, z: 0 }, KeyA: { x: -1, z: 0 },
  ArrowRight: { x: 1, z: 0 }, KeyD: { x: 1, z: 0 },
};

export class Input {
  private queue: Direction[] = [];

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
