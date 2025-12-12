import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Clock } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface ActiveTurnProps {
  movie: string;
  difficulty: 'easy' | 'hard';
  onComplete: (success: boolean) => void;
}

export function ActiveTurn({ movie, difficulty, onComplete }: ActiveTurnProps) {
  // 4 mins = 240s, 8 mins = 480s
  const duration = difficulty === 'easy' ? 240 : 480; 
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    
    if (timeLeft <= 0) {
      onComplete(false); // Time's up
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isPaused, onComplete]);

  const handleSuccess = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: difficulty === 'easy' ? ['#06b6d4', '#ffffff'] : ['#f43f5e', '#ffffff']
    });
    onComplete(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const themeColor = difficulty === 'easy' ? 'text-accent' : 'text-secondary';
  const borderColor = difficulty === 'easy' ? 'border-accent' : 'border-secondary';
  const shadowColor = difficulty === 'easy' ? 'shadow-accent/20' : 'shadow-secondary/20';

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-6 min-h-[70vh]">
      
      {/* Timer */}
      <div className={`relative mb-12 flex items-center justify-center w-48 h-48 rounded-full border-8 ${borderColor} bg-background shadow-[0_0_50px_currentColor] ${themeColor} ${shadowColor}`}>
        <div className="text-5xl font-bold font-mono tracking-tighter tabular-nums">
          {formatTime(timeLeft)}
        </div>
        <Clock className="absolute top-4 h-6 w-6 opacity-50" />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center space-y-6 w-full max-w-2xl"
      >
        <h3 className="text-xl text-muted-foreground uppercase tracking-[0.2em]">Your Movie Is</h3>
        <div className={`p-8 rounded-xl border-2 border-dashed ${borderColor} bg-white/5 backdrop-blur-sm`}>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight font-display text-white">
            {movie}
          </h1>
        </div>
      </motion.div>

      <div className="mt-16 w-full max-w-md">
        <Button
          onClick={handleSuccess}
          className={`w-full h-20 text-3xl font-bold font-display uppercase tracking-widest hover:scale-105 transition-all duration-300 shadow-xl ${
            difficulty === 'easy' 
              ? 'bg-accent hover:bg-accent/90 text-white shadow-accent/40' 
              : 'bg-secondary hover:bg-secondary/90 text-white shadow-secondary/40'
          }`}
        >
          <Check className="mr-4 h-10 w-10 stroke-[3]" />
          Done!
        </Button>
      </div>
    </div>
  );
}
