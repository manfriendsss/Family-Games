import React from 'react';
import { motion } from 'motion/react';
import { GameMode } from '../../types';

export const ShuffleStage: React.FC<{ gameMode: GameMode }> = ({ gameMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="h-[100svh] flex items-center justify-center px-4"
    >
      <div className="relative w-56 h-80">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ rotate: i === 0 ? -6 : i === 1 ? 2 : 8, y: 0, x: 0, scale: 0.96 }}
            animate={{
              y: [-6, 6, -2, 0],
              x: [i * 2, i * -2, 0],
              rotate: [i === 0 ? -10 : i === 1 ? 3 : 10, i === 0 ? 6 : i === 1 ? -2 : -6, i === 0 ? -6 : i === 1 ? 2 : 8],
              scale: [0.95, 1, 0.98]
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`absolute inset-0 rounded-[36px] border-8 border-white shadow-2xl ${gameMode === 'CHARADES' ? 'bg-blue-600' : 'bg-[#65A30D]'}`}
            style={{ zIndex: 3 - i }}
          />
        ))}
      </div>
    </motion.div>
  );
};
