import { useState } from "react";
import { PlayerSetup } from "@/components/game/PlayerSetup";
import { TurnSelector } from "@/components/game/TurnSelector";
import { ActiveTurn } from "@/components/game/ActiveTurn";
import { ScoreBoard } from "@/components/game/ScoreBoard";
import { EASY_MOVIES, HARD_MOVIES } from "@/lib/movies";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

type GameState = 'setup' | 'turn-select' | 'playing' | 'result';

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

  const resetGame = () => {
    if (confirm("Are you sure you want to end the game and start over?")) {
      setGameState('setup');
      setPlayers([]);
      setScores({});
      setCurrentPlayerIndex(0);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
      
      {gameState !== 'setup' && (
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

            <Button 
              onClick={nextTurn}
              size="lg"
              className="h-16 px-12 text-2xl font-bold bg-white text-black hover:bg-gray-200 rounded-full"
            >
              Next Actor
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
