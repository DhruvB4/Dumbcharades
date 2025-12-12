import { Trophy } from "lucide-react";

interface ScoreBoardProps {
  scores: Record<string, number>;
  currentPlayerIndex: number;
  players: string[];
}

export function ScoreBoard({ scores, currentPlayerIndex, players }: ScoreBoardProps) {
  // Sort players by score for display order, but we also want to highlight current turn
  const sortedPlayers = [...players].sort((a, b) => (scores[b] || 0) - (scores[a] || 0));

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="glass-panel p-4 rounded-xl shadow-2xl min-w-[200px] border-white/10">
        <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h3 className="font-display font-bold text-lg text-primary tracking-wide">Leaderboard</h3>
        </div>
        
        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
          {sortedPlayers.map((player) => {
            const isCurrent = players[currentPlayerIndex] === player;
            return (
              <div 
                key={player}
                className={`flex justify-between items-center p-2 rounded ${
                  isCurrent ? 'bg-white/10 border border-white/20' : 'opacity-70'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isCurrent && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                  <span className={`font-medium ${isCurrent ? 'text-white' : 'text-muted-foreground'}`}>
                    {player}
                  </span>
                </div>
                <span className="font-bold font-mono text-primary">
                  {scores[player] || 0}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
