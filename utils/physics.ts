import { Rect, Point, EnemyState, EnemyType } from '../types';
import { PLAYER_SIZE, ENEMY_RADIUS, COIN_RADIUS } from '../constants';

// AABB Collision (Rectangle vs Rectangle)
export const checkRectCollision = (r1: Rect, r2: Rect): boolean => {
  return (
    r1.x < r2.x + r2.w &&
    r1.x + r1.w > r2.x &&
    r1.y < r2.y + r2.h &&
    r1.y + r1.h > r2.y
  );
};

// Circle vs Rectangle Collision (for Enemies vs Player)
// Player is Rect, Enemy is Circle
export const checkCircleRectCollision = (circle: { x: number; y: number; r: number }, rect: Rect): boolean => {
  // Find the closest point on the rectangle to the circle center
  const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.w));
  const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.h));

  // Calculate the distance between the closest point and the circle's center
  const distanceX = circle.x - closestX;
  const distanceY = circle.y - closestY;

  // If the distance is less than the circle's radius, an intersection occurs
  const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
  return distanceSquared < (circle.r * circle.r);
};

export const updateEnemyPosition = (enemy: EnemyState): void => {
  if (enemy.type === EnemyType.LINEAR_VERTICAL) {
    enemy.currentY += enemy.speed * enemy.dir;
    // Check bounds relative to start position and range
    // Assuming range implies "move range/2 up and range/2 down" or similar?
    // Let's implement simpler: move until 'range' pixels from start, then flip
    const dist = enemy.currentY - enemy.y;
    if (Math.abs(dist) >= (enemy.range || 100)) {
      enemy.dir *= -1;
    }
  } else if (enemy.type === EnemyType.LINEAR_HORIZONTAL) {
    enemy.currentX += enemy.speed * enemy.dir;
    const dist = enemy.currentX - enemy.x;
    if (Math.abs(dist) >= (enemy.range || 100)) {
      enemy.dir *= -1;
    }
  }
};
