import { GameState, GAME_CONFIG } from '../types/game';

export const createLevel1 = (): GameState => {
  return {
    player: {
      id: 'player',
      type: 'player',
      x: 64,
      y: 400,
      width: 24,
      height: 24,
      active: true,
      velocityX: 0,
      velocityY: 0,
      isJumping: false,
      isOnGround: false,
      isOnLadder: false,
      hasPowerup: false,
      powerupTime: 0,
      direction: 'right',
      lives: GAME_CONFIG.INITIAL_LIVES,
      score: 0,
    },
    enemies: [
      {
        id: 'enemy-1',
        type: 'enemy',
        x: 200,
        y: 360,
        width: 24,
        height: 24,
        active: true,
        velocityX: 0,
        velocityY: 0,
        direction: 'right',
        patrolStartX: 200,
        patrolEndX: 400,
        isDead: false,
        respawnTime: 0,
        enemyType: 'goost',
      },
      {
        id: 'enemy-2',
        type: 'enemy',
        x: 600,
        y: 200,
        width: 24,
        height: 24,
        active: true,
        velocityX: 0,
        velocityY: 0,
        direction: 'left',
        patrolStartX: 500,
        patrolEndX: 700,
        isDead: false,
        respawnTime: 0,
        enemyType: 'goost',
      },
      {
        id: 'enemy-3',
        type: 'enemy',
        x: 800,
        y: 360,
        width: 24,
        height: 24,
        active: true,
        velocityX: 0,
        velocityY: 0,
        direction: 'right',
        patrolStartX: 750,
        patrolEndX: 950,
        isDead: false,
        respawnTime: 0,
        enemyType: 'goost',
      },
    ],
    coins: [
      // Bottom level coins
      { id: 'coin-1', type: 'coin', x: 150, y: 370, width: 16, height: 16, active: true, collected: false, value: GAME_CONFIG.COIN_VALUE },
      { id: 'coin-2', type: 'coin', x: 300, y: 370, width: 16, height: 16, active: true, collected: false, value: GAME_CONFIG.COIN_VALUE },
      { id: 'coin-3', type: 'coin', x: 450, y: 370, width: 16, height: 16, active: true, collected: false, value: GAME_CONFIG.COIN_VALUE },
      
      // Middle level coins
      { id: 'coin-4', type: 'coin', x: 250, y: 250, width: 16, height: 16, active: true, collected: false, value: GAME_CONFIG.COIN_VALUE },
      { id: 'coin-5', type: 'coin', x: 400, y: 250, width: 16, height: 16, active: true, collected: false, value: GAME_CONFIG.COIN_VALUE },
      { id: 'coin-6', type: 'coin', x: 650, y: 210, width: 16, height: 16, active: true, collected: false, value: GAME_CONFIG.COIN_VALUE },
      
      // Top level coins
      { id: 'coin-7', type: 'coin', x: 150, y: 130, width: 16, height: 16, active: true, collected: false, value: GAME_CONFIG.COIN_VALUE },
      { id: 'coin-8', type: 'coin', x: 350, y: 130, width: 16, height: 16, active: true, collected: false, value: GAME_CONFIG.COIN_VALUE },
      { id: 'coin-9', type: 'coin', x: 550, y: 90, width: 16, height: 16, active: true, collected: false, value: GAME_CONFIG.COIN_VALUE },
      { id: 'coin-10', type: 'coin', x: 850, y: 130, width: 16, height: 16, active: true, collected: false, value: GAME_CONFIG.COIN_VALUE },
      
      // Hidden/secret coins
      { id: 'coin-11', type: 'coin', x: 100, y: 50, width: 16, height: 16, active: true, collected: false, value: GAME_CONFIG.COIN_VALUE },
      { id: 'coin-12', type: 'coin', x: 750, y: 50, width: 16, height: 16, active: true, collected: false, value: GAME_CONFIG.COIN_VALUE },
    ],
    powerups: [
      { id: 'powerup-1', type: 'powerup', x: 500, y: 240, width: 20, height: 20, active: true, collected: false, effect: 'invincible', duration: GAME_CONFIG.POWERUP_DURATION },
      { id: 'powerup-2', type: 'powerup', x: 200, y: 120, width: 20, height: 20, active: true, collected: false, effect: 'invincible', duration: GAME_CONFIG.POWERUP_DURATION },
    ],
    platforms: [
      // Ground level
      { id: 'platform-1', type: 'platform', x: 0, y: 400, width: 1000, height: 20, active: true },
      
      // Middle level platforms
      { id: 'platform-2', type: 'platform', x: 200, y: 270, width: 150, height: 20, active: true },
      { id: 'platform-3', type: 'platform', x: 400, y: 270, width: 150, height: 20, active: true },
      { id: 'platform-4', type: 'platform', x: 600, y: 230, width: 150, height: 20, active: true },
      
      // Upper level platforms
      { id: 'platform-5', type: 'platform', x: 100, y: 150, width: 120, height: 20, active: true },
      { id: 'platform-6', type: 'platform', x: 300, y: 150, width: 120, height: 20, active: true },
      { id: 'platform-7', type: 'platform', x: 500, y: 110, width: 120, height: 20, active: true },
      { id: 'platform-8', type: 'platform', x: 800, y: 150, width: 120, height: 20, active: true },
      
      // Top secret platforms
      { id: 'platform-9', type: 'platform', x: 50, y: 70, width: 100, height: 20, active: true },
      { id: 'platform-10', type: 'platform', x: 700, y: 70, width: 100, height: 20, active: true },
    ],
    walls: [
      // Side boundaries
      { id: 'wall-1', type: 'wall', x: -20, y: 0, width: 20, height: 600, active: true },
      { id: 'wall-2', type: 'wall', x: 1000, y: 0, width: 20, height: 600, active: true },
      
      // Maze walls
      { id: 'wall-3', type: 'wall', x: 160, y: 320, width: 20, height: 80, active: true },
      { id: 'wall-4', type: 'wall', x: 360, y: 320, width: 20, height: 80, active: true },
      { id: 'wall-5', type: 'wall', x: 560, y: 280, width: 20, height: 120, active: true },
      { id: 'wall-6', type: 'wall', x: 260, y: 200, width: 20, height: 70, active: true },
      { id: 'wall-7', type: 'wall', x: 460, y: 200, width: 20, height: 70, active: true },
    ],
    ladders: [
      { id: 'ladder-1', type: 'ladder', x: 130, y: 170, width: 16, height: 100, active: true },
      { id: 'ladder-2', type: 'ladder', x: 330, y: 170, width: 16, height: 100, active: true },
      { id: 'ladder-3', type: 'ladder', x: 530, y: 130, width: 16, height: 100, active: true },
      { id: 'ladder-4', type: 'ladder', x: 180, y: 290, width: 16, height: 80, active: true },
      { id: 'ladder-5', type: 'ladder', x: 380, y: 290, width: 16, height: 80, active: true },
      { id: 'ladder-6', type: 'ladder', x: 580, y: 250, width: 16, height: 80, active: true },
    ],
    gameStatus: 'menu',
    level: 1,
    timeLeft: GAME_CONFIG.LEVEL_TIME,
    totalCoins: 12,
    collectedCoins: 0,
    camera: { x: 0, y: 0 },
  };
};