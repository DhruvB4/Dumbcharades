import { useState } from "react";
import { PlayerSetup } from "@/components/game/PlayerSetup";
import { TurnSelector } from "@/components/game/TurnSelector";
import { ActiveTurn } from "@/components/game/ActiveTurn";
import { ScoreBoard } from "@/components/game/ScoreBoard";
import { EASY_MOVIES, HARD_MOVIES } from "@/lib/movies";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trophy, LogOut } from "lucide-react";
import confetti from "canvas-confetti";

type GameState = 'setup' | 'turn-select' | 'playing' | 'result' | 'game-over';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [players, setPlayers] = useState<string[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  
  const [currentMovie, setCurrentMovie] = useState("");
  const [currentDifficulty, setCurrentDifficulty] = useState<'easy' | 'hard'>('easy');
  const [turnResult, setTurnResult] = useState<{ success: boolean; points: number } | null>(null);

  const startGame = (playerNames: string[]) => {
    setPlayers(playerNames);
    const initialScores: Record<string, number> = {};
    playerNames.forEach(p => initialScores[p] = 0);
    setScores(initialScores);
    setGameState('turn-select');
  };

  const startTurn = (difficulty: 'easy' | 'hard') => {
    const list = difficulty === 'easy' ? EASY_MOVIES : HARD_MOVIES;
    const randomMovie = list[Math.floor(Math.random() * list.length)];
    
    setCurrentMovie(randomMovie);
    setCurrentDifficulty(difficulty);
    setGameState('playing');
  };

  const completeTurn = (success: boolean) => {
    const points = success ? (currentDifficulty === 'easy' ? 10 : 20) : 0;
    
    if (success) {
      const currentPlayer = players[currentPlayerIndex];
      setScores(prev => ({
        ...prev,
        [currentPlayer]: (prev[currentPlayer] || 0) + points
      }));
    }

    setTurnResult({ success, points });
    setGameState('result');
  };

  const nextTurn = () => {
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    setGameState('turn-select');
    setTurnResult(null);
  };

  const endGame = () => {
    // Fire celebration confetti
    const fireConfetti = typeof confetti === 'function' ? confetti : (confetti as any)?.default;
    if (fireConfetti) {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        fireConfetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        fireConfetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
    setGameState('game-over');
  };

  const resetGame = () => {
    if (gameState === 'game-over' || confirm("Are you sure you want to end the game and start over?")) {
      setGameState('setup');
      setPlayers([]);
      setScores({});
      setCurrentPlayerIndex(0);
      setTurnResult(null);
    }
  };

  const getWinner = () => {
    const sortedPlayers = [...players].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));
    const winner = sortedPlayers[0];
    const winningScore = scores[winner] || 0;
    return { winner, winningScore };
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
      
      {gameState !== 'setup' && gameState !== 'game-over' && (
        <>
          <ScoreBoard 
            scores={scores} 
            currentPlayerIndex={currentPlayerIndex} 
            players={players} 
          />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={resetGame}
            className="fixed top-4 left-4 z-50 text-muted-foreground hover:text-white"
          >
            <RotateCcw className="h-6 w-6" />
          </Button>
        </>
      )}

      <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen">
        {gameState === 'setup' && (
          <PlayerSetup onStartGame={startGame} />
        )}

        {gameState === 'turn-select' && (
          <div className="flex-1 flex items-center">
            <TurnSelector 
              currentPlayer={players[currentPlayerIndex]} 
              onSelectDifficulty={startTurn} 
            />
          </div>
        )}

        {gameState === 'playing' && (
          <div className="flex-1 flex items-center">
            <ActiveTurn 
              movie={currentMovie} 
              difficulty={currentDifficulty} 
              onComplete={completeTurn} 
            />
          </div>
        )}

        {gameState === 'result' && turnResult && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
            <h1 className="text-6xl md:text-8xl font-display font-bold mb-8 neon-text text-center">
              {turnResult.success ? "SCENE!" : "CUT!"}
            </h1>
            
            <div className="text-center mb-12">
              <p className="text-2xl text-muted-foreground mb-4">
                {turnResult.success ? "Great performance!" : "Better luck next take."}
              </p>
              {turnResult.success && (
                <div className="text-5xl font-bold text-primary">
                  +{turnResult.points} Points
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 w-full max-w-md">
              <Button 
                onClick={nextTurn}
                size="lg"
                className="h-16 text-2xl font-bold bg-white text-black hover:bg-gray-200 rounded-full w-full"
              >
                Next Actor
              </Button>
              
              <Button 
                onClick={endGame}
                variant="outline"
                size="lg"
                className="h-12 text-lg font-bold border-destructive text-destructive hover:bg-destructive hover:text-white rounded-full w-full"
              >
                <LogOut className="mr-2 h-5 w-5" />
                End Game
              </Button>
            </div>
          </div>
        )}

        {gameState === 'game-over' && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
             <Trophy className="h-24 w-24 text-primary mb-6 animate-bounce" />
             <h1 className="text-5xl md:text-7xl font-display font-bold mb-2 neon-text text-center text-primary">
               AND THE WINNER IS...
             </h1>
             
             <div className="p-8 my-8 rounded-xl bg-white/5 border border-primary/30 backdrop-blur-sm text-center shadow-[0_0_50px_hsl(var(--primary)/0.2)]">
               <h2 className="text-6xl font-bold text-white mb-2 font-display tracking-wide">
                 {getWinner().winner}
               </h2>
               <p className="text-3xl text-primary font-mono">
                 {getWinner().winningScore} Points
               </p>
             </div>

             <div className="w-full max-w-md space-y-4">
               <div className="bg-black/30 rounded-lg p-4 border border-white/10 max-h-60 overflow-y-auto custom-scrollbar">
                 <h3 className="text-center font-bold text-muted-foreground mb-4 uppercase tracking-widest text-sm">Final Standings</h3>
                 {players.sort((a, b) => (scores[b] || 0) - (scores[a] || 0)).map((player, index) => (
                   <div key={player} className="flex justify-between items-center py-2 px-4 border-b border-white/5 last:border-0">
                     <span className="text-white/80 font-medium">
                       <span className="text-muted-foreground mr-4 text-sm">#{index + 1}</span>
                       {player}
                     </span>
                     <span className="font-mono text-primary/80">{scores[player] || 0}</span>
                   </div>
                 ))}
               </div>

               <Button 
                 onClick={resetGame}
                 size="lg"
                 className="h-16 w-full text-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 mt-8"
               >
                 Start New Show
               </Button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
