import { GameState, Player, Enemy, Controls, GAME_CONFIG, Position } from '../types/game';

export class GameEngine {
  private static instance: GameEngine;
  private gameState: GameState | null = null;
  private controls: Controls = {
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    powerup: false,
  };

  static getInstance(): GameEngine {
    if (!GameEngine.instance) {
      GameEngine.instance = new GameEngine();
    }
    return GameEngine.instance;
  }

  setGameState(state: GameState) {
    this.gameState = state;
  }

  getGameState(): GameState | null {
    return this.gameState;
  }

  updateControls(controls: Controls) {
    this.controls = { ...controls };
  }

  update(deltaTime: number): GameState | null {
    if (!this.gameState || this.gameState.gameStatus !== 'playing') {
      return this.gameState;
    }

    // Update timer
    this.gameState.timeLeft -= deltaTime / 1000;
    if (this.gameState.timeLeft <= 0) {
      this.gameState.gameStatus = 'gameOver';
      return this.gameState;
    }

    // Update player
    this.updatePlayer(deltaTime);

    // Update enemies
    this.gameState.enemies.forEach(enemy => this.updateEnemy(enemy, deltaTime));

    // Check collisions
    this.checkCollisions();

    // Check win condition
    if (this.gameState.collectedCoins >= this.gameState.totalCoins) {
      this.gameState.gameStatus = 'won';
    }

    // Update camera to follow player
    this.updateCamera();

    return this.gameState;
  }

  private updatePlayer(deltaTime: number) {
    if (!this.gameState) return;

    const player = this.gameState.player;

    // Handle powerup timer
    if (player.hasPowerup) {
      player.powerupTime -= deltaTime;
      if (player.powerupTime <= 0) {
        player.hasPowerup = false;
        player.powerupTime = 0;
      }
    }

    // Handle horizontal movement
    if (this.controls.left) {
      player.velocityX = -GAME_CONFIG.PLAYER_SPEED;
      player.direction = 'left';
    } else if (this.controls.right) {
      player.velocityX = GAME_CONFIG.PLAYER_SPEED;
      player.direction = 'right';
    } else {
      player.velocityX = 0;
    }

    // Handle jumping
    if (this.controls.jump && player.isOnGround && !player.isJumping) {
      player.velocityY = -GAME_CONFIG.PLAYER_JUMP_POWER;
      player.isJumping = true;
      player.isOnGround = false;
    }

    // Handle ladder climbing
    if (player.isOnLadder) {
      if (this.controls.up) {
        player.velocityY = -GAME_CONFIG.PLAYER_SPEED;
      } else if (this.controls.down) {
        player.velocityY = GAME_CONFIG.PLAYER_SPEED;
      } else {
        player.velocityY = 0;
      }
    } else {
      // Apply gravity
      player.velocityY += GAME_CONFIG.GRAVITY;
    }

    // Update position
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Check for ground collision and boundaries
    this.handlePlayerCollisions();
  }

  private updateEnemy(enemy: Enemy, deltaTime: number) {
    if (!this.gameState) return;

    if (enemy.isDead) {
      enemy.respawnTime -= deltaTime;
      if (enemy.respawnTime <= 0) {
        enemy.isDead = false;
        enemy.active = true;
      }
      return;
    }

    // Simple AI: patrol between two points
    if (enemy.direction === 'right') {
      enemy.x += GAME_CONFIG.ENEMY_SPEED;
      if (enemy.x >= enemy.patrolEndX) {
        enemy.direction = 'left';
      }
    } else {
      enemy.x -= GAME_CONFIG.ENEMY_SPEED;
      if (enemy.x <= enemy.patrolStartX) {
        enemy.direction = 'right';
      }
    }

    // Simple gravity for enemies
    enemy.velocityY += GAME_CONFIG.GRAVITY;
    enemy.y += enemy.velocityY;

    this.handleEnemyCollisions(enemy);
  }

  private handlePlayerCollisions() {
    if (!this.gameState) return;

    const player = this.gameState.player;
    let onGround = false;
    let onLadder = false;

    // Check platform collisions
    this.gameState.platforms.forEach(platform => {
      if (this.checkCollision(player, platform)) {
        // Landing on top of platform
        if (player.velocityY > 0 && player.y < platform.y) {
          player.y = platform.y - player.height;
          player.velocityY = 0;
          player.isJumping = false;
          onGround = true;
        }
      }
    });

    // Check wall collisions
    this.gameState.walls.forEach(wall => {
      if (this.checkCollision(player, wall)) {
        // Horizontal collision
        if (player.velocityX > 0) {
          player.x = wall.x - player.width;
        } else if (player.velocityX < 0) {
          player.x = wall.x + wall.width;
        }
        player.velocityX = 0;
      }
    });

    // Check ladder collisions
    this.gameState.ladders.forEach(ladder => {
      if (this.checkCollision(player, ladder)) {
        onLadder = true;
      }
    });

    player.isOnGround = onGround;
    player.isOnLadder = onLadder;

    // Boundary checks
    if (player.x < 0) player.x = 0;
    if (player.y > GAME_CONFIG.CANVAS_HEIGHT) {
      // Player fell off the map
      this.handlePlayerDeath();
    }
  }

  private handleEnemyCollisions(enemy: Enemy) {
    if (!this.gameState) return;

    let onGround = false;

    // Check platform collisions
    this.gameState.platforms.forEach(platform => {
      if (this.checkCollision(enemy, platform)) {
        if (enemy.velocityY > 0 && enemy.y < platform.y) {
          enemy.y = platform.y - enemy.height;
          enemy.velocityY = 0;
          onGround = true;
        }
      }
    });

    if (!onGround && enemy.y > GAME_CONFIG.CANVAS_HEIGHT) {
      // Enemy fell off, respawn it
      enemy.y = 0;
      enemy.x = enemy.patrolStartX;
    }
  }

  private checkCollisions() {
    if (!this.gameState) return;

    const player = this.gameState.player;

    // Check coin collisions
    this.gameState.coins.forEach(coin => {
      if (!coin.collected && this.checkCollision(player, coin)) {
        coin.collected = true;
        coin.active = false;
        player.score += coin.value;
        this.gameState!.collectedCoins++;
      }
    });

    // Check powerup collisions
    this.gameState.powerups.forEach(powerup => {
      if (!powerup.collected && this.checkCollision(player, powerup)) {
        powerup.collected = true;
        powerup.active = false;
        player.hasPowerup = true;
        player.powerupTime = powerup.duration;
      }
    });

    // Check enemy collisions
    this.gameState.enemies.forEach(enemy => {
      if (!enemy.isDead && this.checkCollision(player, enemy)) {
        if (player.hasPowerup) {
          // Player can defeat enemy
          enemy.isDead = true;
          enemy.active = false;
          enemy.respawnTime = 5000; // 5 seconds
          player.score += 200;
        } else {
          // Player loses a life
          this.handlePlayerDeath();
        }
      }
    });
  }

  private checkCollision(obj1: any, obj2: any): boolean {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    );
  }

  private handlePlayerDeath() {
    if (!this.gameState) return;

    this.gameState.player.lives--;
    if (this.gameState.player.lives <= 0) {
      this.gameState.gameStatus = 'gameOver';
    } else {
      // Respawn player at starting position
      this.gameState.player.x = 64;
      this.gameState.player.y = 400;
      this.gameState.player.velocityX = 0;
      this.gameState.player.velocityY = 0;
      this.gameState.player.hasPowerup = false;
      this.gameState.player.powerupTime = 0;
    }
  }

  private updateCamera() {
    if (!this.gameState) return;

    const player = this.gameState.player;
    const camera = this.gameState.camera;

    // Center camera on player with some offset
    camera.x = player.x - GAME_CONFIG.CANVAS_WIDTH / 2;
    camera.y = player.y - GAME_CONFIG.CANVAS_HEIGHT / 2;

    // Clamp camera to level bounds
    camera.x = Math.max(0, Math.min(camera.x, 2000 - GAME_CONFIG.CANVAS_WIDTH));
    camera.y = Math.max(0, Math.min(camera.y, 1000 - GAME_CONFIG.CANVAS_HEIGHT));
  }

  resetGame() {
    if (!this.gameState) return;

    this.gameState.gameStatus = 'playing';
    this.gameState.timeLeft = GAME_CONFIG.LEVEL_TIME;
    this.gameState.collectedCoins = 0;
    this.gameState.player.lives = GAME_CONFIG.INITIAL_LIVES;
    this.gameState.player.score = 0;
    this.gameState.player.x = 64;
    this.gameState.player.y = 400;
    this.gameState.player.velocityX = 0;
    this.gameState.player.velocityY = 0;
    this.gameState.player.hasPowerup = false;
    this.gameState.player.powerupTime = 0;

    // Reset coins
    this.gameState.coins.forEach(coin => {
      coin.collected = false;
      coin.active = true;
    });

    // Reset powerups
    this.gameState.powerups.forEach(powerup => {
      powerup.collected = false;
      powerup.active = true;
    });

    // Reset enemies
    this.gameState.enemies.forEach(enemy => {
      enemy.isDead = false;
      enemy.active = true;
      enemy.x = enemy.patrolStartX;
    });
  }
}