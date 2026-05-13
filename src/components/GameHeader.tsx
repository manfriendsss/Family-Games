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
              src={gameMode === 'CHARADES' ? '/input_file_2.png' : '/input_file_1.png'} 
              alt="Logo" 
              className={`w-full h-auto ${gameMode === 'CHARADES' ? 'scale-150' : 'drop-shadow-xl'}`}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
        <div className="w-10" />
      </div>
      
      {stage === 'DASHBOARD' ? (
        <h1 className="text-3xl font-black tracking-tight text-center leading-tight text-gray-900 -mt-6">
          <span className="text-[#65A30D]">Game</span> Hub
        </h1>
      ) : gameMode === 'CHARADES' ? (
        <div className="text-center mt-2">
          <h1 className="text-3xl font-black tracking-tight uppercase leading-none">
            CHARADES <span className="text-[#65A30D]">SETUP</span>
          </h1>
          <p className="text-gray-500 font-bold mt-1">Cài đặt ván Charades</p>
        </div>
      ) : (
        <h1 className="text-3xl font-black tracking-tight text-center leading-tight text-gray-900 -mt-6">
          Ai là người <span className="text-[#65A30D]">giả mạo?</span>
        </h1>
      )}
    </header>
  );
};
