export type GameMode = 'endless' | 'levels';
export type PortalAxis = 'horizontal' | 'vertical';

export interface PortalLane {
  axis: PortalAxis;
  lane: number;
  color: number;
}

export interface MapTheme {
  background: number;
  board: number;
  grid: number;
  rail: number;
  snake: number;
  head: number;
  obstacle: number;
}

export interface LevelDefinition {
  name: string;
  boardHalf: number;
  goal: number | null;
  startSpeed: number;
  speedFloor: number;
  portals: PortalLane[];
  obstacles: { x: number; z: number }[];
  theme: MapTheme;
}

const garden: MapTheme = {
  background: 0x101610, board: 0x314229, grid: 0x5e7650, rail: 0xc7d98a,
  snake: 0x79a83e, head: 0xb9dc5b, obstacle: 0x6c7950,
};

const canyon: MapTheme = {
  background: 0x1a120d, board: 0x60422e, grid: 0x8a6548, rail: 0xe0ae68,
  snake: 0xe0b94c, head: 0xffdf70, obstacle: 0x3c2a22,
};

const night: MapTheme = {
  background: 0x111016, board: 0x302b3b, grid: 0x645c77, rail: 0xa999c9,
  snake: 0x7fbd78, head: 0xb8e7a2, obstacle: 0x51475f,
};

const ice: MapTheme = {
  background: 0x101719, board: 0x294447, grid: 0x54777a, rail: 0xc8e3d7,
  snake: 0x84b65b, head: 0xc9df7a, obstacle: 0x436569,
};

const points = (...pairs: number[][]): { x: number; z: number }[] => pairs.map(([x, z]) => ({ x, z }));

export const ENDLESS_MAP: LevelDefinition = {
  name: 'ENDLESS', boardHalf: 9, goal: null, startSpeed: 0.17, speedFloor: 0.065,
  portals: [
    { axis: 'horizontal', lane: 0, color: 0xe96dff },
    { axis: 'vertical', lane: 0, color: 0x52e7ff },
  ],
  obstacles: [], theme: garden,
};

export const LEVELS: LevelDefinition[] = [
  {
    name: 'JARDIM', boardHalf: 7, goal: 5, startSpeed: 0.18, speedFloor: 0.11,
    portals: [{ axis: 'horizontal', lane: 0, color: 0xe96dff }],
    obstacles: [], theme: garden,
  },
  {
    name: 'CÂNION', boardHalf: 8, goal: 8, startSpeed: 0.165, speedFloor: 0.1,
    portals: [{ axis: 'vertical', lane: -2, color: 0x52e7ff }],
    obstacles: points([-4, -4], [-4, -3], [-4, 2], [-4, 3], [4, -3], [4, -2], [4, 3], [4, 4]),
    theme: canyon,
  },
  {
    name: 'NEXO', boardHalf: 9, goal: 11, startSpeed: 0.15, speedFloor: 0.09,
    portals: [
      { axis: 'horizontal', lane: 3, color: 0xe96dff },
      { axis: 'vertical', lane: -3, color: 0x52e7ff },
    ],
    obstacles: points([-5, -2], [-4, -2], [-3, -2], [3, 2], [4, 2], [5, 2], [-2, 5], [-2, 4], [2, -5], [2, -4]),
    theme: night,
  },
  {
    name: 'GELO', boardHalf: 10, goal: 15, startSpeed: 0.135, speedFloor: 0.082,
    portals: [
      { axis: 'horizontal', lane: -4, color: 0xe96dff },
      { axis: 'vertical', lane: 4, color: 0x52e7ff },
    ],
    obstacles: points([-6, -5], [-5, -5], [-4, -5], [-3, -5], [3, 5], [4, 5], [5, 5], [6, 5], [-6, 2], [-5, 2], [5, -2], [6, -2], [0, -3], [0, 3]),
    theme: ice,
  },
  {
    name: 'RUÍNAS', boardHalf: 10, goal: 17, startSpeed: 0.125, speedFloor: 0.075,
    portals: [
      { axis: 'horizontal', lane: 5, color: 0xe96dff },
      { axis: 'vertical', lane: -5, color: 0x52e7ff },
    ],
    obstacles: points([-7, -5], [-6, -5], [-5, -5], [-5, -4], [7, 5], [6, 5], [5, 5], [5, 4], [-3, 4], [-2, 4], [2, -4], [3, -4], [-7, 2], [7, -2]),
    theme: canyon,
  },
  {
    name: 'VULCÃO', boardHalf: 10, goal: 19, startSpeed: 0.115, speedFloor: 0.07,
    portals: [
      { axis: 'horizontal', lane: -6, color: 0xff6d8f },
      { axis: 'vertical', lane: 6, color: 0xffb052 },
    ],
    obstacles: points([-6, -6], [-5, -6], [-4, -6], [4, 6], [5, 6], [6, 6], [-7, 1], [-6, 1], [-5, 1], [5, -1], [6, -1], [7, -1], [-2, 5], [-2, 4], [2, -5], [2, -4]),
    theme: { ...canyon, background: 0x1b0d0a, board: 0x51251f, grid: 0x853f32, rail: 0xe0764f },
  },
  {
    name: 'QUÂNTICO', boardHalf: 11, goal: 21, startSpeed: 0.105, speedFloor: 0.064,
    portals: [
      { axis: 'horizontal', lane: 4, color: 0xe96dff },
      { axis: 'vertical', lane: -4, color: 0x52e7ff },
    ],
    obstacles: points([-8, -7], [-7, -7], [-6, -7], [6, 7], [7, 7], [8, 7], [-8, 4], [-7, 4], [-6, 4], [6, -4], [7, -4], [8, -4], [-3, -3], [-3, -2], [3, 3], [3, 2], [0, -7], [0, 7]),
    theme: night,
  },
  {
    name: 'LABIRINTO', boardHalf: 11, goal: 23, startSpeed: 0.098, speedFloor: 0.06,
    portals: [
      { axis: 'horizontal', lane: -7, color: 0xe96dff },
      { axis: 'vertical', lane: 7, color: 0x52e7ff },
    ],
    obstacles: points([-8, -6], [-7, -6], [-6, -6], [-5, -6], [-4, -6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6], [-8, 1], [-7, 1], [-6, 1], [-5, 1], [5, -1], [6, -1], [7, -1], [8, -1], [-2, 5], [-2, 4], [-2, 3], [2, -5], [2, -4], [2, -3]),
    theme: garden,
  },
  {
    name: 'VAZIO', boardHalf: 12, goal: 26, startSpeed: 0.09, speedFloor: 0.056,
    portals: [
      { axis: 'horizontal', lane: 8, color: 0xe96dff },
      { axis: 'vertical', lane: -8, color: 0x52e7ff },
    ],
    obstacles: points([-9, -8], [-8, -8], [-7, -8], [7, 8], [8, 8], [9, 8], [-9, 5], [-8, 5], [-7, 5], [7, -5], [8, -5], [9, -5], [-5, -2], [-4, -2], [-3, -2], [3, 2], [4, 2], [5, 2], [-1, 7], [-1, 6], [1, -7], [1, -6]),
    theme: { ...night, background: 0x09090c, board: 0x211e29, grid: 0x4d465c, rail: 0x8d7ba8 },
  },
  {
    name: 'COROA', boardHalf: 12, goal: 30, startSpeed: 0.082, speedFloor: 0.052,
    portals: [
      { axis: 'horizontal', lane: -9, color: 0xffd552 },
      { axis: 'vertical', lane: 9, color: 0xe96dff },
    ],
    obstacles: points([-9, -9], [-8, -9], [-7, -9], [7, 9], [8, 9], [9, 9], [-9, 3], [-8, 3], [-7, 3], [-6, 3], [6, -3], [7, -3], [8, -3], [9, -3], [-4, -6], [-3, -6], [-2, -6], [2, 6], [3, 6], [4, 6], [-5, 7], [-5, 6], [5, -7], [5, -6], [-1, -4], [1, 4]),
    theme: { ...ice, background: 0x15130b, board: 0x4a4325, grid: 0x7b7141, rail: 0xf0d56d },
  },
];

export function getMap(mode: GameMode, levelIndex: number): LevelDefinition {
  return mode === 'endless' ? ENDLESS_MAP : LEVELS[levelIndex] ?? LEVELS[0];
}
