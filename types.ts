
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
  x: number; // Start Position (Linear) or Pivot Center (Circular)
  y: number;
  speed: number; // Pixels/frame (Linear) or Radians/frame (Circular)
  range?: number; // Linear range
  direction?: 1 | -1; // Direction multiplier
  // Circular specifics
  rotationRadius?: number;
  initialAngle?: number; // radians
}

export interface EnemyState extends EnemyConfig {
  currentX: number;
  currentY: number;
  dir: number; // 1 or -1
  currentAngle?: number; // For circular
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
