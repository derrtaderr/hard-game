export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export enum EnemyType {
  LINEAR_VERTICAL,
  LINEAR_HORIZONTAL,
  CIRCULAR
}

export interface EnemyConfig {
  type: EnemyType;
  x: number;
  y: number;
  speed: number;
  range?: number; // Distance they move from start
  direction?: 1 | -1; // Initial direction
}

export interface EnemyState extends EnemyConfig {
  currentX: number;
  currentY: number;
  dir: number; // 1 or -1
}

export interface LevelData {
  id: number;
  startZone: Rect;
  endZone: Rect;
  walls: Rect[]; // Areas the player CANNOT go.
  coins: Point[];
  enemies: EnemyConfig[];
  spawnPoint: Point;
  bounds: Rect; // The outer rim of the playable area (optional visualization)
}
