import React, { useRef, useEffect, useCallback } from 'react';
import { 
  CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_SIZE, PLAYER_SPEED, 
  COLOR_BG_OUTER, COLOR_WALL, COLOR_START_ZONE, COLOR_END_ZONE,
  COLOR_CHECKER_1, COLOR_CHECKER_2, TILE_SIZE,
  COLOR_PLAYER, COLOR_PLAYER_BORDER,
  COLOR_ENEMY, COLOR_ENEMY_BORDER, ENEMY_RADIUS,
  COLOR_COIN, COLOR_COIN_BORDER, COIN_RADIUS
} from '../constants';
import { LEVELS } from '../data/levels';
import { Rect, Point, EnemyState } from '../types';
import { checkRectCollision, checkCircleRectCollision, updateEnemyPosition } from '../utils/physics';

interface GameCanvasProps {
  currentLevelIndex: number;
  deaths: number;
  onDeath: () => void;
  onLevelComplete: () => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ currentLevelIndex, deaths, onDeath, onLevelComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  
  // Game State Refs (mutable for loop performance)
  const playerPos = useRef<Point>({ x: 0, y: 0 });
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const enemiesRef = useRef<EnemyState[]>([]);
  const coinsRef = useRef<Point[]>([]);
  const levelRef = useRef(LEVELS[currentLevelIndex]);

  // Initialize Level State
  const resetLevel = useCallback(() => {
    const level = LEVELS[currentLevelIndex];
    levelRef.current = level;
    playerPos.current = { ...level.spawnPoint };
    
    // Deep copy enemies to reset their state
    enemiesRef.current = level.enemies.map(e => ({
      ...e,
      currentX: e.x,
      currentY: e.y, 
      dir: e.direction || 1
    }));
    coinsRef.current = [...level.coins];
    
    // Clear keys on reset to prevent stuck movement
    keysPressed.current = {};
  }, [currentLevelIndex]);

  // Initial Setup
  useEffect(() => {
    resetLevel();
  }, [resetLevel]);

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
      }
      keysPressed.current[e.key] = true;
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
      }
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // The Game Loop
  const update = useCallback(() => {
    const level = levelRef.current;
    
    // 1. Update Player Position based on Input
    let dx = 0;
    let dy = 0;
    
    if (keysPressed.current['ArrowUp'] || keysPressed.current['w']) dy -= PLAYER_SPEED;
    if (keysPressed.current['ArrowDown'] || keysPressed.current['s']) dy += PLAYER_SPEED;
    if (keysPressed.current['ArrowLeft'] || keysPressed.current['a']) dx -= PLAYER_SPEED;
    if (keysPressed.current['ArrowRight'] || keysPressed.current['d']) dx += PLAYER_SPEED;

    // Apply X movement and check collision
    if (dx !== 0) {
      playerPos.current.x += dx;
      const playerRectX: Rect = { x: playerPos.current.x, y: playerPos.current.y, w: PLAYER_SIZE, h: PLAYER_SIZE };
      let collidedX = false;
      
      // Wall Collision
      for (const wall of level.walls) {
        if (checkRectCollision(playerRectX, wall)) {
          collidedX = true;
          break;
        }
      }
      
      // Canvas Bounds Collision
      if (playerPos.current.x < 0 || playerPos.current.x + PLAYER_SIZE > CANVAS_WIDTH) collidedX = true;

      if (collidedX) {
        playerPos.current.x -= dx; // Revert
      }
    }

    // Apply Y movement and check collision
    if (dy !== 0) {
      playerPos.current.y += dy;
      const playerRectY: Rect = { x: playerPos.current.x, y: playerPos.current.y, w: PLAYER_SIZE, h: PLAYER_SIZE };
      let collidedY = false;
      
      for (const wall of level.walls) {
        if (checkRectCollision(playerRectY, wall)) {
          collidedY = true;
          break;
        }
      }
      
      if (playerPos.current.y < 0 || playerPos.current.y + PLAYER_SIZE > CANVAS_HEIGHT) collidedY = true;

      if (collidedY) {
        playerPos.current.y -= dy; // Revert
      }
    }

    // 2. Update Enemies
    enemiesRef.current.forEach(enemy => {
      updateEnemyPosition(enemy);
    });

    // 3. Check Deaths (Enemy Collision)
    const playerRect: Rect = { x: playerPos.current.x, y: playerPos.current.y, w: PLAYER_SIZE, h: PLAYER_SIZE };
    for (const enemy of enemiesRef.current) {
      const enemyCircle = { x: enemy.currentX, y: enemy.currentY, r: ENEMY_RADIUS };
      if (checkCircleRectCollision(enemyCircle, playerRect)) {
        onDeath();
        resetLevel();
        return; // Stop update for this frame
      }
    }

    // 4. Check Coins
    for (let i = coinsRef.current.length - 1; i >= 0; i--) {
      const coin = coinsRef.current[i];
      const coinCircle = { x: coin.x, y: coin.y, r: COIN_RADIUS };
      if (checkCircleRectCollision(coinCircle, playerRect)) {
        // Collect coin
        coinsRef.current.splice(i, 1);
      }
    }

    // 5. Check Win Condition
    if (coinsRef.current.length === 0) {
       // Check overlap with end zone
       if (checkRectCollision(playerRect, level.endZone)) {
         // Simple overlap check often sufficient, but let's ensure substantial overlap
         // by checking center point
         const px = playerPos.current.x + PLAYER_SIZE / 2;
         const py = playerPos.current.y + PLAYER_SIZE / 2;
         
         if (px > level.endZone.x && px < level.endZone.x + level.endZone.w &&
             py > level.endZone.y && py < level.endZone.y + level.endZone.h) {
            onLevelComplete();
            resetLevel(); 
            return;
         }
       }
    }

  }, [onDeath, onLevelComplete, resetLevel]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    const level = levelRef.current;

    // 1. Draw Checkerboard everywhere (the floor)
    // We draw this first, covering the whole screen.
    // The "Walls" will be drawn on top of this.
    for (let y = 0; y < CANVAS_HEIGHT; y += TILE_SIZE) {
      for (let x = 0; x < CANVAS_WIDTH; x += TILE_SIZE) {
        ctx.fillStyle = ((x / TILE_SIZE + y / TILE_SIZE) % 2 === 0) ? COLOR_CHECKER_1 : COLOR_CHECKER_2;
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      }
    }

    // 2. Draw Start and End Zones (On top of checkerboard)
    ctx.fillStyle = COLOR_START_ZONE;
    ctx.fillRect(level.startZone.x, level.startZone.y, level.startZone.w, level.startZone.h);
    
    ctx.fillStyle = COLOR_END_ZONE;
    ctx.fillRect(level.endZone.x, level.endZone.y, level.endZone.w, level.endZone.h);

    // 3. Draw Walls (The void)
    // The walls are the "background" color, effectively cutting out the play area.
    ctx.lineWidth = 4;
    ctx.strokeStyle = COLOR_WALL;

    level.walls.forEach(wall => {
      ctx.fillStyle = COLOR_BG_OUTER;
      ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
      ctx.strokeRect(wall.x, wall.y, wall.w, wall.h);
    });

    // 4. Draw Coins
    coinsRef.current.forEach(coin => {
      ctx.beginPath();
      ctx.arc(coin.x, coin.y, COIN_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = COLOR_COIN;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = COLOR_COIN_BORDER;
      ctx.stroke();
    });

    // 5. Draw Enemies
    enemiesRef.current.forEach(enemy => {
      ctx.beginPath();
      ctx.arc(enemy.currentX, enemy.currentY, ENEMY_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = COLOR_ENEMY;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = COLOR_ENEMY_BORDER;
      ctx.stroke();
    });

    // 6. Draw Player
    ctx.fillStyle = COLOR_PLAYER;
    ctx.fillRect(playerPos.current.x, playerPos.current.y, PLAYER_SIZE, PLAYER_SIZE);
    ctx.lineWidth = 2;
    ctx.strokeStyle = COLOR_PLAYER_BORDER;
    ctx.strokeRect(playerPos.current.x, playerPos.current.y, PLAYER_SIZE, PLAYER_SIZE);

  }, []);

  const tick = useCallback(() => {
    update();
    draw();
    requestRef.current = requestAnimationFrame(tick);
  }, [update, draw]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(tick);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [tick]);

  return (
    <canvas 
      ref={canvasRef} 
      width={CANVAS_WIDTH} 
      height={CANVAS_HEIGHT}
      className="bg-[#b5b5ff] border-4 border-black"
    />
  );
};

export default GameCanvas;