import { useRef, useEffect } from 'react';
import { GameState, GAME_CONFIG } from '../types/game';

interface GameRendererProps {
  gameState: GameState;
}

export const GameRenderer = ({ gameState }: GameRendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);

    // Draw starry background
    drawBackground(ctx, gameState.camera);

    // Apply camera transform
    ctx.save();
    ctx.translate(-gameState.camera.x, -gameState.camera.y);

    // Draw platforms
    gameState.platforms.forEach(platform => {
      drawPlatform(ctx, platform);
    });

    // Draw walls
    gameState.walls.forEach(wall => {
      drawWall(ctx, wall);
    });

    // Draw ladders
    gameState.ladders.forEach(ladder => {
      drawLadder(ctx, ladder);
    });

    // Draw coins
    gameState.coins.forEach(coin => {
      if (coin.active) {
        drawCoin(ctx, coin);
      }
    });

    // Draw powerups
    gameState.powerups.forEach(powerup => {
      if (powerup.active) {
        drawPowerup(ctx, powerup);
      }
    });

    // Draw enemies
    gameState.enemies.forEach(enemy => {
      if (enemy.active) {
        drawEnemy(ctx, enemy);
      }
    });

    // Draw player
    drawPlayer(ctx, gameState.player);

    ctx.restore();
  }, [gameState]);

  const drawBackground = (ctx: CanvasRenderingContext2D, camera: any) => {
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.CANVAS_HEIGHT);
    gradient.addColorStop(0, '#0f0f23');
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);

    // Stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 100; i++) {
      const x = (i * 123 + camera.x * 0.1) % GAME_CONFIG.CANVAS_WIDTH;
      const y = (i * 456 + camera.y * 0.1) % GAME_CONFIG.CANVAS_HEIGHT;
      ctx.fillRect(x, y, 1, 1);
    }
  };

  const drawPlatform = (ctx: CanvasRenderingContext2D, platform: any) => {
    // Platform base
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    
    // Platform highlight
    ctx.fillStyle = '#86efac';
    ctx.fillRect(platform.x, platform.y, platform.width, 4);
    
    // Platform shadow
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(platform.x, platform.y + platform.height - 4, platform.width, 4);
  };

  const drawWall = (ctx: CanvasRenderingContext2D, wall: any) => {
    // Wall base
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    
    // Wall highlights
    ctx.fillStyle = '#9ca3af';
    ctx.fillRect(wall.x, wall.y, 4, wall.height);
    ctx.fillRect(wall.x, wall.y, wall.width, 4);
    
    // Wall shadows
    ctx.fillStyle = '#374151';
    ctx.fillRect(wall.x + wall.width - 4, wall.y, 4, wall.height);
    ctx.fillRect(wall.x, wall.y + wall.height - 4, wall.width, 4);
  };

  const drawLadder = (ctx: CanvasRenderingContext2D, ladder: any) => {
    ctx.fillStyle = '#d97706';
    
    // Ladder sides
    ctx.fillRect(ladder.x, ladder.y, 4, ladder.height);
    ctx.fillRect(ladder.x + ladder.width - 4, ladder.y, 4, ladder.height);
    
    // Ladder rungs
    for (let y = ladder.y; y < ladder.y + ladder.height; y += 8) {
      ctx.fillRect(ladder.x, y, ladder.width, 2);
    }
  };

  const drawCoin = (ctx: CanvasRenderingContext2D, coin: any) => {
    const centerX = coin.x + coin.width / 2;
    const centerY = coin.y + coin.height / 2;
    const radius = coin.width / 2 - 2;
    
    // Coin shadow
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.arc(centerX + 1, centerY + 1, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Coin body
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Coin highlight
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(centerX - 1, centerY - 1, radius * 0.6, 0, Math.PI * 2);
    ctx.fill();
    
    // Coin center
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.3, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawPowerup = (ctx: CanvasRenderingContext2D, powerup: any) => {
    const centerX = powerup.x + powerup.width / 2;
    const centerY = powerup.y + powerup.height / 2;
    const radius = powerup.width / 2 - 2;
    
    // Pulsing effect
    const pulseScale = 1 + Math.sin(Date.now() / 200) * 0.2;
    const size = radius * pulseScale;
    
    // Powerup glow
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(centerX, centerY, size + 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Powerup body
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Powerup highlight
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(centerX - 2, centerY - 2, size * 0.5, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawEnemy = (ctx: CanvasRenderingContext2D, enemy: any) => {
    const centerX = enemy.x + enemy.width / 2;
    const centerY = enemy.y + enemy.height / 2;
    
    // Enemy shadow
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(enemy.x + 2, enemy.y + 2, enemy.width, enemy.height);
    
    // Enemy body
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    
    // Enemy face
    ctx.fillStyle = '#ffffff';
    // Eyes
    ctx.fillRect(enemy.x + 6, enemy.y + 8, 4, 4);
    ctx.fillRect(enemy.x + 14, enemy.y + 8, 4, 4);
    
    // Eye pupils
    ctx.fillStyle = '#000000';
    ctx.fillRect(enemy.x + 8, enemy.y + 10, 2, 2);
    ctx.fillRect(enemy.x + 16, enemy.y + 10, 2, 2);
    
    // Mouth
    ctx.fillStyle = '#000000';
    ctx.fillRect(enemy.x + 10, enemy.y + 18, 6, 2);
    
    // Floating animation offset
    const floatOffset = Math.sin(Date.now() / 500 + enemy.x) * 2;
    ctx.translate(0, floatOffset);
    ctx.translate(0, -floatOffset);
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D, player: any) => {
    // Player shadow
    ctx.fillStyle = player.hasPowerup ? '#7c3aed' : '#1e40af';
    ctx.fillRect(player.x + 2, player.y + 2, player.width, player.height);
    
    // Player body
    ctx.fillStyle = player.hasPowerup ? '#8b5cf6' : '#3b82f6';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Player face
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(player.x + 4, player.y + 4, player.width - 8, player.height - 8);
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(player.x + 8, player.y + 8, 2, 2);
    ctx.fillRect(player.x + 14, player.y + 8, 2, 2);
    
    // Nose
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(player.x + 12, player.y + 12, 2, 2);
    
    // Mustache
    ctx.fillStyle = '#92400e';
    ctx.fillRect(player.x + 8, player.y + 14, 8, 2);
    
    // Cap
    ctx.fillStyle = player.hasPowerup ? '#dc2626' : '#dc2626';
    ctx.fillRect(player.x + 2, player.y, player.width - 4, 8);
    
    // Power-up glow effect
    if (player.hasPowerup) {
      ctx.fillStyle = 'rgba(139, 92, 246, 0.3)';
      ctx.fillRect(player.x - 4, player.y - 4, player.width + 8, player.height + 8);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONFIG.CANVAS_WIDTH}
      height={GAME_CONFIG.CANVAS_HEIGHT}
      className="border border-border rounded-lg pixel-perfect"
      style={{ 
        maxWidth: '100%', 
        height: 'auto',
        imageRendering: 'pixelated'
      }}
    />
  );
};