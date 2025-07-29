import { GameState } from '../types/game';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface GameUIProps {
  gameState: GameState;
  onRestart: () => void;
  onStart: () => void;
}

export const GameUI = ({ gameState, onRestart, onStart }: GameUIProps) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderGameStats = () => (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
      {/* Left side stats */}
      <Card className="bg-card/90 backdrop-blur-sm border-border p-3">
        <div className="space-y-1 text-sm game-text">
          <div className="flex items-center gap-2">
            <span className="text-coin">💰</span>
            <span className="text-foreground">Score: {gameState.player.score}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-destructive">❤️</span>
            <span className="text-foreground">Lives: {gameState.player.lives}</span>
          </div>
          {gameState.player.hasPowerup && (
            <div className="flex items-center gap-2">
              <span className="text-powerup animate-power-pulse">⭐</span>
              <span className="text-powerup">Power: {Math.ceil(gameState.player.powerupTime / 1000)}s</span>
            </div>
          )}
        </div>
      </Card>

      {/* Right side stats */}
      <Card className="bg-card/90 backdrop-blur-sm border-border p-3">
        <div className="space-y-1 text-sm game-text">
          <div className="flex items-center gap-2">
            <span className="text-coin">🪙</span>
            <span className="text-foreground">
              Coins: {gameState.collectedCoins}/{gameState.totalCoins}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={gameState.timeLeft <= 10 ? "text-destructive" : "text-accent"}>⏰</span>
            <span className={`${gameState.timeLeft <= 10 ? "text-destructive" : "text-foreground"}`}>
              Time: {formatTime(gameState.timeLeft)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary">🏆</span>
            <span className="text-foreground">Level: {gameState.level}</span>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderMenuScreen = () => (
    <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-20">
      <Card className="bg-card border-border p-8 text-center max-w-md">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-primary game-text mb-2">
              🎮 SUPER MAZE QUEST
            </h1>
            <p className="text-muted-foreground">
              Collect all coins while avoiding the Goosts!
            </p>
          </div>
          
          <div className="text-left space-y-2 text-sm">
            <h3 className="text-lg font-semibold text-foreground">Objective:</h3>
            <p className="text-muted-foreground">
              Guide Marcoman through the maze, collect all 🪙 coins before time runs out!
            </p>
            
            <h3 className="text-lg font-semibold text-foreground mt-4">Power-ups:</h3>
            <div className="flex items-center gap-2">
              <span className="text-powerup">⭐</span>
              <span className="text-muted-foreground">Defeat enemies for 8 seconds</span>
            </div>
          </div>

          <Button 
            onClick={onStart}
            size="lg"
            className="w-full game-text text-lg"
          >
            🚀 START GAME
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderGameOverScreen = () => (
    <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-20">
      <Card className="bg-card border-border p-8 text-center max-w-md">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-destructive game-text mb-2">
              💀 GAME OVER
            </h2>
            <p className="text-muted-foreground">
              Marcoman has fallen to the Goosts!
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="text-2xl font-bold text-coin game-text">
              Final Score: {gameState.player.score}
            </div>
            <div className="text-muted-foreground">
              Coins Collected: {gameState.collectedCoins}/{gameState.totalCoins}
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={onRestart}
              size="lg"
              className="flex-1 game-text"
            >
              🔄 TRY AGAIN
            </Button>
            <Button 
              onClick={() => window.location.reload()}
              variant="secondary"
              size="lg"
              className="flex-1 game-text"
            >
              🏠 MENU
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderWinScreen = () => (
    <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-20">
      <Card className="bg-card border-border p-8 text-center max-w-md">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-coin game-text mb-2">
              🎉 LEVEL COMPLETE!
            </h2>
            <p className="text-muted-foreground">
              Marcoman collected all the coins!
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="text-2xl font-bold text-coin game-text">
              Score: {gameState.player.score}
            </div>
            <div className="text-muted-foreground">
              Time Bonus: +{Math.floor(gameState.timeLeft * 10)}
            </div>
            <div className="text-accent font-semibold">
              Level {gameState.level} Complete!
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={onRestart}
              size="lg"
              className="flex-1 game-text"
            >
              🎮 PLAY AGAIN
            </Button>
            <Button 
              onClick={() => window.location.reload()}
              variant="secondary"
              size="lg"
              className="flex-1 game-text"
            >
              🏠 MENU
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <>
      {gameState.gameStatus === 'playing' && renderGameStats()}
      {gameState.gameStatus === 'menu' && renderMenuScreen()}
      {gameState.gameStatus === 'gameOver' && renderGameOverScreen()}
      {gameState.gameStatus === 'won' && renderWinScreen()}
    </>
  );
};