import { getMap, type GameMode, type LevelDefinition } from './levels';

export type Phase = 'menu' | 'playing' | 'paused' | 'lost' | 'won';
export type Direction = { x: number; z: number };
export type GridPoint = { x: number; z: number };

export interface SnakeState {
  phase: Phase;
  mode: GameMode;
  levelIndex: number;
  map: LevelDefinition;
  snake: GridPoint[];
  food: GridPoint;
  direction: Direction;
  queuedDirection: Direction;
  score: number;
  best: number;
  eaten: number;
  multiplier: number;
  stepTime: number;
  elapsed: number;
}

export interface StepResult {
  ate: boolean;
  crashed: boolean;
  teleported: boolean;
  previousHead: GridPoint;
}

export function createState(mode: GameMode = 'endless', levelIndex = 0, best = 0): SnakeState {
  const map = getMap(mode, levelIndex);
  const snake = [{ x: 1, z: 0 }, { x: 0, z: 0 }, { x: -1, z: 0 }];
  return {
    phase: 'menu', mode, levelIndex, map, snake,
    food: findFreeCell(snake, map),
    direction: { x: 1, z: 0 }, queuedDirection: { x: 1, z: 0 },
    score: 0, best, eaten: 0, multiplier: 1,
    stepTime: map.startSpeed, elapsed: 0,
  };
}

export function isReverse(a: Direction, b: Direction): boolean {
  return a.x === -b.x && a.z === -b.z;
}

export function advanceSnake(state: SnakeState, random = Math.random): StepResult {
  const previousHead = { ...state.snake[0] };
  if (state.phase !== 'playing') return { ate: false, crashed: false, teleported: false, previousHead };
  state.direction = state.queuedDirection;
  let next = { x: previousHead.x + state.direction.x, z: previousHead.z + state.direction.z };
  const portalExit = resolvePortal(next, previousHead, state.map);
  const teleported = portalExit !== null;
  if (portalExit) next = portalExit;

  const outside = Math.abs(next.x) > state.map.boardHalf || Math.abs(next.z) > state.map.boardHalf;
  const ate = next.x === state.food.x && next.z === state.food.z;
  const bodyToCheck = ate ? state.snake : state.snake.slice(0, -1);
  const hitBody = bodyToCheck.some((part) => sameCell(part, next));
  const hitObstacle = state.map.obstacles.some((part) => sameCell(part, next));
  if (outside || hitBody || hitObstacle) {
    state.phase = 'lost';
    return { ate: false, crashed: true, teleported: false, previousHead };
  }

  state.snake.unshift(next);
  if (ate) {
    state.eaten += 1;
    state.multiplier = Math.min(5, 1 + Math.floor(state.eaten / 3));
    state.score += 100 * state.multiplier;
    state.best = Math.max(state.best, state.score);
    state.stepTime = Math.max(state.map.speedFloor, state.map.startSpeed - state.eaten * 0.0045);
    if (state.map.goal !== null && state.eaten >= state.map.goal) state.phase = 'won';
    else state.food = findFreeCell(state.snake, state.map, random);
  } else {
    state.snake.pop();
  }
  return { ate, crashed: false, teleported, previousHead };
}

function resolvePortal(next: GridPoint, previous: GridPoint, map: LevelDefinition): GridPoint | null {
  const half = map.boardHalf;
  for (const portal of map.portals) {
    if (portal.axis === 'horizontal' && previous.z === portal.lane) {
      if (next.x > half) return { x: -half, z: portal.lane };
      if (next.x < -half) return { x: half, z: portal.lane };
    }
    if (portal.axis === 'vertical' && previous.x === portal.lane) {
      if (next.z > half) return { x: portal.lane, z: -half };
      if (next.z < -half) return { x: portal.lane, z: half };
    }
  }
  return null;
}

export function findFreeCell(snake: GridPoint[], map: LevelDefinition, random = Math.random): GridPoint {
  const free: GridPoint[] = [];
  for (let z = -map.boardHalf; z <= map.boardHalf; z += 1) {
    for (let x = -map.boardHalf; x <= map.boardHalf; x += 1) {
      const point = { x, z };
      if (!snake.some((part) => sameCell(part, point)) && !map.obstacles.some((part) => sameCell(part, point))) free.push(point);
    }
  }
  return free[Math.floor(random() * free.length)] ?? { x: 0, z: 0 };
}

const sameCell = (a: GridPoint, b: GridPoint): boolean => a.x === b.x && a.z === b.z;
