import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PlayerSetupProps {
  onStartGame: (players: string[]) => void;
}

export function PlayerSetup({ onStartGame }: PlayerSetupProps) {
  const [players, setPlayers] = useState<string[]>([]);
  const [newName, setNewName] = useState("");

  const addPlayer = () => {
    if (newName.trim()) {
      setPlayers([...players, newName.trim()]);
      setNewName("");
    }
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-md mx-auto p-6">
      <h1 className="text-4xl md:text-6xl text-primary font-bold mb-8 neon-text text-center font-display tracking-wider">
        Movie Charades
      </h1>
      
      <div className="w-full space-y-4 glass-panel p-6 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-4 font-display">Cast Members</h2>
        
        <div className="flex gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addPlayer()}
            placeholder="Enter player name..."
            className="bg-background/50 border-white/20 text-lg h-12"
          />
          <Button onClick={addPlayer} size="icon" className="h-12 w-12 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence>
            {players.map((player, index) => (
              <motion.div
                key={`${player}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <span className="font-medium text-lg truncate">{player}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removePlayer(index)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-transparent"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
          {players.length === 0 && (
            <div className="text-center text-muted-foreground py-8 italic">
              No players added yet. Add at least 2 players!
            </div>
          )}
        </div>

        <Button 
          onClick={() => onStartGame(players)} 
          disabled={players.length < 1}
          className="w-full h-14 text-xl font-bold mt-6 bg-gradient-to-r from-primary to-yellow-400 text-black hover:scale-105 transition-transform duration-200 shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
        >
          <Play className="mr-2 h-6 w-6" /> Start Show
        </Button>
      </div>
    </div>
  );
}
