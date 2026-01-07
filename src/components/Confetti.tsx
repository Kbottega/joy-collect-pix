import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  size: number;
}

const COLORS = [
  'hsl(8 76% 62%)',    // coral
  'hsl(38 70% 55%)',   // gold
  'hsl(340 80% 60%)',  // pink
  'hsl(160 50% 50%)',  // mint
  'hsl(270 40% 70%)',  // lavender
  'hsl(42 85% 55%)',   // yellow
];

const SHAPES = ['●', '■', '▲', '♦', '★', '♥'];

export const Confetti = ({ isActive = true }: { isActive?: boolean }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isActive) {
      const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 2,
        rotation: Math.random() * 360,
        size: Math.random() * 12 + 8,
      }));
      setPieces(newPieces);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      <AnimatePresence>
        {pieces.map((piece) => (
          <motion.div
            key={piece.id}
            initial={{ 
              y: -20, 
              x: `${piece.x}vw`,
              rotate: 0,
              opacity: 1 
            }}
            animate={{ 
              y: '110vh',
              rotate: piece.rotation + 720,
              opacity: 0
            }}
            transition={{ 
              duration: 4 + Math.random() * 2,
              delay: piece.delay,
              ease: 'linear'
            }}
            style={{
              position: 'absolute',
              color: piece.color,
              fontSize: piece.size,
            }}
          >
            {SHAPES[Math.floor(Math.random() * SHAPES.length)]}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
