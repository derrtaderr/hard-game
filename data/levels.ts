
import { LevelData, EnemyType, EnemyConfig } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';

// Helper to generate a rotating cross of enemies
const createRotatingCross = (cx: number, cy: number, speed: number, radius: number, dotsPerArm: number): EnemyConfig[] => {
  const enemies: EnemyConfig[] = [];
  const spacing = radius / dotsPerArm;
  
  for (let arm = 0; arm < 4; arm++) {
    const baseAngle = (Math.PI / 2) * arm;
    for (let i = 1; i <= dotsPerArm; i++) {
       enemies.push({
         type: EnemyType.CIRCULAR,
         x: cx,
         y: cy,
         speed: speed,
         rotationRadius: i * spacing,
         initialAngle: baseAngle,
         direction: 1
       });
    }
  }
  return enemies;
};

// Helper for a single rotating line (propeller)
const createPropeller = (cx: number, cy: number, speed: number, length: number, dots: number, direction: 1 | -1 = 1): EnemyConfig[] => {
  const enemies: EnemyConfig[] = [];
  const spacing = length / dots;
  
  for (let i = 1; i <= dots; i++) {
    enemies.push({
      type: EnemyType.CIRCULAR,
      x: cx,
      y: cy,
      speed: speed,
      rotationRadius: i * spacing,
      initialAngle: 0,
      direction: direction
    });
    // Opposite side
    enemies.push({
      type: EnemyType.CIRCULAR,
      x: cx,
      y: cy,
      speed: speed,
      rotationRadius: i * spacing,
      initialAngle: Math.PI,
      direction: direction
    });
  }
  return enemies;
};

export const LEVELS: LevelData[] = [
  // LEVEL 1: The Basics
  {
    id: 1,
    startZone: { x: 100, y: 150, w: 100, h: 200 },
    endZone: { x: 600, y: 150, w: 100, h: 200 },
    spawnPoint: { x: 135, y: 235 },
    coins: [],
    enemies: [
      { type: EnemyType.LINEAR_VERTICAL, x: 280, y: 250, speed: 4, range: 60, direction: 1 },
      { type: EnemyType.LINEAR_VERTICAL, x: 360, y: 250, speed: 4, range: 60, direction: -1 },
      { type: EnemyType.LINEAR_VERTICAL, x: 440, y: 250, speed: 4, range: 60, direction: 1 },
      { type: EnemyType.LINEAR_VERTICAL, x: 520, y: 250, speed: 4, range: 60, direction: -1 }
    ],
    walls: [
      { x: 0, y: 0, w: CANVAS_WIDTH, h: 150 }, 
      { x: 0, y: 350, w: CANVAS_WIDTH, h: 100 },
      { x: 0, y: 0, w: 100, h: CANVAS_HEIGHT },
      { x: 700, y: 0, w: 100, h: CANVAS_HEIGHT },
      { x: 200, y: 150, w: 400, h: 70 }, 
      { x: 200, y: 280, w: 400, h: 70 },
    ],
    bounds: { x: 0, y: 0, w: CANVAS_WIDTH, h: CANVAS_HEIGHT }
  },

  // LEVEL 2: Coins & Tight Squeezes
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
       { type: EnemyType.LINEAR_HORIZONTAL, x: 250, y: 100, speed: 5, range: 120, direction: 1 },
       { type: EnemyType.LINEAR_HORIZONTAL, x: 450, y: 150, speed: 5, range: 120, direction: -1 },
       { type: EnemyType.LINEAR_HORIZONTAL, x: 250, y: 200, speed: 6, range: 120, direction: 1 },
       { type: EnemyType.LINEAR_HORIZONTAL, x: 450, y: 350, speed: 7, range: 120, direction: -1 },
       // Vertical guards
       { type: EnemyType.LINEAR_VERTICAL, x: 400, y: 225, speed: 3, range: 50, direction: 1 }
    ],
    walls: [
      { x: 0, y: 0, w: 50, h: CANVAS_HEIGHT },
      { x: 750, y: 0, w: 50, h: CANVAS_HEIGHT },
      { x: 0, y: 0, w: CANVAS_WIDTH, h: 50 },
      { x: 0, y: 400, w: CANVAS_WIDTH, h: 50 },
      { x: 200, y: 150, w: 50, h: 150 },
      { x: 550, y: 150, w: 50, h: 150 },
    ],
    bounds: { x: 0, y: 0, w: CANVAS_WIDTH, h: CANVAS_HEIGHT }
  },

  // LEVEL 3: Windmills (Rotating Introduction)
  {
    id: 3,
    startZone: { x: 50, y: 175, w: 100, h: 100 },
    endZone: { x: 650, y: 175, w: 100, h: 100 },
    spawnPoint: { x: 75, y: 225 },
    coins: [
      { x: 300, y: 150 },
      { x: 500, y: 300 }
    ],
    enemies: [
      // Windmill 1
      ...createPropeller(250, 225, 0.04, 110, 5, 1),
      // Windmill 2
      ...createPropeller(400, 225, 0.04, 110, 5, -1),
      // Windmill 3
      ...createPropeller(550, 225, 0.04, 110, 5, 1),
    ],
    walls: [
      { x: 0, y: 0, w: CANVAS_WIDTH, h: 100 },
      { x: 0, y: 350, w: CANVAS_WIDTH, h: 100 },
      { x: 0, y: 0, w: 50, h: CANVAS_HEIGHT },
      { x: 750, y: 0, w: 50, h: CANVAS_HEIGHT },
    ],
    bounds: { x: 0, y: 0, w: CANVAS_WIDTH, h: CANVAS_HEIGHT }
  },

  // LEVEL 4: The Processor (Big Rotating X)
  {
    id: 4,
    startZone: { x: 50, y: 50, w: 80, h: 80 },
    endZone: { x: 670, y: 320, w: 80, h: 80 },
    spawnPoint: { x: 90, y: 90 },
    coins: [
      { x: 650, y: 100 },
      { x: 150, y: 350 },
      { x: 400, y: 225 } // Middle suicide coin
    ],
    enemies: [
       // Giant center X
       ...createRotatingCross(400, 225, 0.02, 180, 7),
       // Fast linear guards at edges
       { type: EnemyType.LINEAR_VERTICAL, x: 200, y: 225, speed: 8, range: 150, direction: 1 },
       { type: EnemyType.LINEAR_VERTICAL, x: 600, y: 225, speed: 8, range: 150, direction: -1 }
    ],
    walls: [
      // Outer box
      { x: 0, y: 0, w: CANVAS_WIDTH, h: 50 },
      { x: 0, y: 400, w: CANVAS_WIDTH, h: 50 },
      { x: 0, y: 0, w: 50, h: CANVAS_HEIGHT },
      { x: 750, y: 0, w: 50, h: CANVAS_HEIGHT },
      // Safe corners cut off
      { x: 50, y: 350, w: 50, h: 50 }, // Bottom Left
      { x: 700, y: 50, w: 50, h: 50 }, // Top Right
    ],
    bounds: { x: 0, y: 0, w: CANVAS_WIDTH, h: CANVAS_HEIGHT }
  },

  // LEVEL 5: ALMOST IMPOSSIBLE
  {
    id: 5,
    startZone: { x: 350, y: 190, w: 100, h: 70 }, // Center start
    endZone: { x: 50, y: 190, w: 50, h: 70 }, // Left side exit
    spawnPoint: { x: 400, y: 225 },
    coins: [
       { x: 700, y: 100 },
       { x: 700, y: 350 },
       { x: 100, y: 100 },
       { x: 100, y: 350 }
    ],
    enemies: [
       // Inner ring of death around spawn
       ...createRotatingCross(400, 225, -0.05, 120, 5),
       
       // Vertical walls of doom on the right
       { type: EnemyType.LINEAR_VERTICAL, x: 550, y: 225, speed: 10, range: 170, direction: 1 },
       { type: EnemyType.LINEAR_VERTICAL, x: 600, y: 225, speed: 10, range: 170, direction: -1 },
       { type: EnemyType.LINEAR_VERTICAL, x: 650, y: 225, speed: 10, range: 170, direction: 1 },
       
       // Horizontal crushers on the left
       { type: EnemyType.LINEAR_HORIZONTAL, x: 200, y: 100, speed: 12, range: 100, direction: 1 },
       { type: EnemyType.LINEAR_HORIZONTAL, x: 200, y: 350, speed: 12, range: 100, direction: -1 },

       // Rotating sentries at coin locations
       ...createPropeller(700, 100, 0.08, 40, 2, 1),
       ...createPropeller(700, 350, 0.08, 40, 2, -1),
       ...createPropeller(100, 100, 0.08, 40, 2, 1),
       ...createPropeller(100, 350, 0.08, 40, 2, -1),
    ],
    walls: [
       // Top/Bottom
       { x: 0, y: 0, w: CANVAS_WIDTH, h: 50 },
       { x: 0, y: 400, w: CANVAS_WIDTH, h: 50 },
       // Sides
       { x: 0, y: 0, w: 50, h: CANVAS_HEIGHT },
       { x: 750, y: 0, w: 50, h: CANVAS_HEIGHT },
       // Dividers
       { x: 480, y: 50, w: 20, h: 120 },
       { x: 480, y: 280, w: 20, h: 120 },
       { x: 300, y: 50, w: 20, h: 120 },
       { x: 300, y: 280, w: 20, h: 120 },
    ],
    bounds: { x: 0, y: 0, w: CANVAS_WIDTH, h: CANVAS_HEIGHT }
  }
];
