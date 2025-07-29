export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface GameObject extends Position, Size {
  id: string;
  type: 'player' | 'enemy' | 'coin' | 'powerup' | 'platform' | 'wall' | 'ladder';
  active: boolean;
}

export interface Player extends GameObject {
  type: 'player';
  velocityX: number;
  velocityY: number;
  isJumping: boolean;
  isOnGround: boolean;
  isOnLadder: boolean;
  hasPowerup: boolean;
  powerupTime: number;
  direction: 'left' | 'right';
  lives: number;
  score: number;
}

export interface Enemy extends GameObject {
  type: 'enemy';
  velocityX: number;
  velocityY: number;
  direction: 'left' | 'right';
  patrolStartX: number;
  patrolEndX: number;
  isDead: boolean;
  respawnTime: number;
  enemyType: 'goost';
}

export interface Coin extends GameObject {
  type: 'coin';
  collected: boolean;
  value: number;
}

export interface Powerup extends GameObject {
  type: 'powerup';
  collected: boolean;
  effect: 'invincible';
  duration: number;
}

export interface Platform extends GameObject {
  type: 'platform';
}

export interface Wall extends GameObject {
  type: 'wall';
}

export interface Ladder extends GameObject {
  type: 'ladder';
}

export interface GameState {
  player: Player;
  enemies: Enemy[];
  coins: Coin[];
  powerups: Powerup[];
  platforms: Platform[];
  walls: Wall[];
  ladders: Ladder[];
  gameStatus: 'playing' | 'paused' | 'won' | 'gameOver' | 'menu';
  level: number;
  timeLeft: number;
  totalCoins: number;
  collectedCoins: number;
  camera: Position;
}

export interface Controls {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jump: boolean;
  powerup: boolean;
}

export const GAME_CONFIG = {
  CANVAS_WIDTH: 1024,
  CANVAS_HEIGHT: 576,
  TILE_SIZE: 32,
  PLAYER_SPEED: 4,
  PLAYER_JUMP_POWER: 12,
  GRAVITY: 0.5,
  ENEMY_SPEED: 2,
  POWERUP_DURATION: 8000, // 8 seconds
  LEVEL_TIME: 60, // 60 seconds
  INITIAL_LIVES: 3,
  COIN_VALUE: 100,
} as const;