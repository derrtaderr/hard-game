import { LevelData, EnemyType } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';

// Helper to create walls effectively
// The strategy: Define the playable area, then everything else is a wall?
// No, the classic engine defines walls as colliders.
// Level 1: Two large rooms connected by a horizontal corridor.
// Layout approximation:
// Room 1 (Start): x: 100, y: 150, w: 150, h: 200
// Room 2 (End): x: 550, y: 150, w: 150, h: 200
// Corridor: x: 250, y: 200, w: 300, h: 100

// Walls would be the inverse of this.
// Top area: y < 150 (for rooms) or y < 200 (for corridor)
// Bottom area: y > 350 (for rooms) or y > 300 (for corridor)

export const LEVELS: LevelData[] = [
  {
    id: 1,
    startZone: { x: 100, y: 150, w: 120, h: 200 },
    endZone: { x: 580, y: 150, w: 120, h: 200 },
    spawnPoint: { x: 140, y: 235 }, // Center of start zone roughly
    coins: [], // No coins in level 1 typically, or maybe 1 for testing? Original level 1 has 0 coins.
    enemies: [
      {
        type: EnemyType.LINEAR_VERTICAL,
        x: 280, y: 250, speed: 4, range: 60, direction: 1
      },
      {
        type: EnemyType.LINEAR_VERTICAL,
        x: 360, y: 250, speed: 4, range: 60, direction: -1
      },
      {
        type: EnemyType.LINEAR_VERTICAL,
        x: 440, y: 250, speed: 4, range: 60, direction: 1
      },
      {
        type: EnemyType.LINEAR_VERTICAL,
        x: 520, y: 250, speed: 4, range: 60, direction: -1
      }
    ],
    // We construct walls to carve out the shape from the canvas
    walls: [
      // Top Block (filling everything above y=150, except we only need to block near playable area)
      { x: 0, y: 0, w: CANVAS_WIDTH, h: 150 }, 
      // Bottom Block
      { x: 0, y: 350, w: CANVAS_WIDTH, h: 100 },
      // Left Block
      { x: 0, y: 0, w: 100, h: CANVAS_HEIGHT },
      // Right Block
      { x: 700, y: 0, w: 100, h: CANVAS_HEIGHT },
      // Inner Top (Above corridor)
      { x: 220, y: 150, w: 360, h: 70 }, 
      // Inner Bottom (Below corridor)
      { x: 220, y: 280, w: 360, h: 70 },
    ],
    bounds: { x: 0, y: 0, w: CANVAS_WIDTH, h: CANVAS_HEIGHT } // Not really used for collision, just metadata
  },
  {
    id: 2,
    startZone: { x: 50, y: 50, w: 100, h: 100 },
    endZone: { x: 650, y: 300, w: 100, h: 100 },
    spawnPoint: { x: 80, y: 80 },
    coins: [
      { x: 400, y: 225 },
      { x: 200, y: 350 },
    ],
    enemies: [
       // Horizontal moving walls of dots
       { type: EnemyType.LINEAR_HORIZONTAL, x: 250, y: 100, speed: 6, range: 150, direction: 1 },
       { type: EnemyType.LINEAR_HORIZONTAL, x: 450, y: 150, speed: 6, range: 150, direction: -1 },
       { type: EnemyType.LINEAR_HORIZONTAL, x: 250, y: 200, speed: 6, range: 150, direction: 1 },
       { type: EnemyType.LINEAR_HORIZONTAL, x: 450, y: 350, speed: 7, range: 150, direction: -1 },
    ],
    walls: [
      { x: 0, y: 0, w: 50, h: CANVAS_HEIGHT }, // Left
      { x: 750, y: 0, w: 50, h: CANVAS_HEIGHT }, // Right
      { x: 0, y: 0, w: CANVAS_WIDTH, h: 50 }, // Top
      { x: 0, y: 400, w: CANVAS_WIDTH, h: 50 }, // Bottom
      // Central obstacles
      { x: 200, y: 150, w: 50, h: 150 },
      { x: 550, y: 150, w: 50, h: 150 },
    ],
    bounds: { x: 0, y: 0, w: CANVAS_WIDTH, h: CANVAS_HEIGHT }
  }
];