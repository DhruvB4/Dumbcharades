import { Button } from "@/components/ui/button";
import { Film, Skull } from "lucide-react";
import { motion } from "framer-motion";

interface TurnSelectorProps {
  currentPlayer: string;
  onSelectDifficulty: (difficulty: 'easy' | 'hard') => void;
}

export function TurnSelector({ currentPlayer, onSelectDifficulty }: TurnSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h3 className="text-xl text-muted-foreground uppercase tracking-widest mb-2 font-medium">Now Playing</h3>
        <h2 className="text-5xl md:text-7xl font-bold text-white neon-text font-display">{currentPlayer}</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectDifficulty('easy')}
          className="group relative flex flex-col items-center justify-center p-12 h-80 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/50 hover:border-accent shadow-[0_0_30px_hsl(var(--accent)/0.2)] hover:shadow-[0_0_50px_hsl(var(--accent)/0.4)] transition-all duration-300"
        >
          <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <Film className="h-24 w-24 text-accent mb-6 group-hover:rotate-12 transition-transform duration-300" />
          <h3 className="text-4xl font-bold text-accent font-display uppercase tracking-wider mb-2">Easy</h3>
          <p className="text-accent/80 text-xl font-medium">4 Minutes</p>
          <div className="mt-4 px-4 py-1 rounded-full bg-accent/20 text-accent font-bold border border-accent/30">
            +10 Points
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectDifficulty('hard')}
          className="group relative flex flex-col items-center justify-center p-12 h-80 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 border-2 border-secondary/50 hover:border-secondary shadow-[0_0_30px_hsl(var(--secondary)/0.2)] hover:shadow-[0_0_50px_hsl(var(--secondary)/0.4)] transition-all duration-300"
        >
          <div className="absolute inset-0 bg-secondary/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <Skull className="h-24 w-24 text-secondary mb-6 group-hover:animate-pulse transition-transform duration-300" />
          <h3 className="text-4xl font-bold text-secondary font-display uppercase tracking-wider mb-2">Hard</h3>
          <p className="text-secondary/80 text-xl font-medium">8 Minutes</p>
          <div className="mt-4 px-4 py-1 rounded-full bg-secondary/20 text-secondary font-bold border border-secondary/30">
            +20 Points
          </div>
        </motion.button>
      </div>
    </div>
  );
}
