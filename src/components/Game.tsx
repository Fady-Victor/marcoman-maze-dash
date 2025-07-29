import { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from '../utils/gameEngine';
import { GameState, Controls, GAME_CONFIG } from '../types/game';
import { GameRenderer } from './GameRenderer';
import { GameUI } from './GameUI';
import { createLevel1 } from '../data/levels';

export const Game = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [controls, setControls] = useState<Controls>({
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    powerup: false,
  });
  
  const gameEngine = useRef(GameEngine.getInstance());
  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const initializeGame = useCallback(() => {
    console.log('Initializing game...');
    try {
      const initialState = createLevel1();
      console.log('Initial state created:', initialState);
      gameEngine.current.setGameState(initialState);
      setGameState(initialState);
      console.log('Game state set successfully');
    } catch (error) {
      console.error('Error initializing game:', error);
    }
  }, []);

  const gameLoop = useCallback((currentTime: number) => {
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    gameEngine.current.updateControls(controls);
    const updatedState = gameEngine.current.update(deltaTime);
    
    if (updatedState) {
      setGameState({ ...updatedState });
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [controls]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    
    setControls(prev => {
      const newControls = { ...prev };
      
      switch (event.code) {
        case 'ArrowLeft':
          newControls.left = true;
          break;
        case 'ArrowRight':
          newControls.right = true;
          break;
        case 'ArrowUp':
          newControls.up = true;
          break;
        case 'ArrowDown':
          newControls.down = true;
          break;
        case 'Space':
          newControls.jump = true;
          break;
        case 'KeyZ':
          newControls.powerup = true;
          break;
      }
      
      return newControls;
    });
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    
    setControls(prev => {
      const newControls = { ...prev };
      
      switch (event.code) {
        case 'ArrowLeft':
          newControls.left = false;
          break;
        case 'ArrowRight':
          newControls.right = false;
          break;
        case 'ArrowUp':
          newControls.up = false;
          break;
        case 'ArrowDown':
          newControls.down = false;
          break;
        case 'Space':
          newControls.jump = false;
          break;
        case 'KeyZ':
          newControls.powerup = false;
          break;
      }
      
      return newControls;
    });
  }, []);

  const handleRestart = useCallback(() => {
    gameEngine.current.resetGame();
    const resetState = gameEngine.current.getGameState();
    if (resetState) {
      setGameState({ ...resetState });
    }
  }, []);

  const handleStartGame = useCallback(() => {
    if (gameState) {
      setGameState(prev => prev ? { ...prev, gameStatus: 'playing' } : null);
    }
  }, [gameState]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (gameState?.gameStatus === 'playing') {
      lastTimeRef.current = performance.now();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState?.gameStatus, gameLoop]);

  console.log('Game render - gameState:', gameState);
  
  if (!gameState) {
    console.log('Game state is null, showing loading screen');
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-foreground text-xl game-text">Loading Super Maze Quest...</div>
      </div>
    );
  }

  console.log('Rendering game with state:', gameState.gameStatus);
  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-4">
      <div className="relative">
        <GameRenderer gameState={gameState} />
        <GameUI 
          gameState={gameState} 
          onRestart={handleRestart}
          onStart={handleStartGame}
        />
      </div>
      
      {/* Controls Instructions */}
      <div className="mt-4 text-center text-sm text-muted-foreground game-text max-w-2xl">
        <div className="mb-2 text-lg text-foreground">🎮 CONTROLS</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>← → Arrow Keys: Move</div>
          <div>↑ Arrow / Space: Jump</div>
          <div>↓ Arrow: Climb Down</div>
          <div>Z: Use Power-up</div>
        </div>
      </div>
    </div>
  );
};