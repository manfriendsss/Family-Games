import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { GameMode, GameStage } from '../types';

interface GameHeaderProps {
  stage: GameStage;
  gameMode: GameMode;
  onBack: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ stage, gameMode, onBack }) => {
  return (
    <header className="flex flex-col items-center mb-4 pt-4">
      <div className="w-full flex justify-between items-center mb-2 px-2">
        {stage !== 'DASHBOARD' ? (
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center text-gray-900 active:scale-95 transition-all"
          >
            <ArrowLeft size={28} />
          </button>
        ) : <div className="w-10" />}
        
        <div className="relative w-full max-w-[140px]">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex items-center justify-center"
          >
            <img 
              src={gameMode === 'CHARADES' ? '/toilaai.webp' : gameMode === 'IMPOSTER' ? '/ailanguoigiamao.webp' : gameMode === 'CARO' ? '/cocaro.webp' : gameMode === 'DOAN_TU' ? '/doantu.webp' : '/familygame.webp'} 
              alt="Logo" 
              className={`w-full h-auto ${gameMode === 'CHARADES' ? 'scale-150' : gameMode === 'CARO' ? 'scale-110' : gameMode === 'DOAN_TU' ? 'scale-110' : 'drop-shadow-xl'}`}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
        <div className="w-10" />
      </div>
      
    </header>
  );
};
