import React from 'react';
import { motion } from 'motion/react';
import { Player } from '../../types';

interface CharadesResultStageProps {
  currentCharadesWord: string;
  currentActor: Player | null;
  onNewRound: () => void;
}

export const CharadesResultStage: React.FC<CharadesResultStageProps> = ({
  currentCharadesWord,
  currentActor,
  onNewRound
}) => {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: 'easeOut' }} className="space-y-6">
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 text-center">
        <h2 className="text-2xl font-black mb-1">Kết thúc vòng chơi</h2>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Lật từ khóa để kiểm tra</p>
      </div>

      <div className="bg-blue-600 rounded-[32px] p-8 text-white text-center shadow-2xl space-y-4">
        <div className="text-xs font-black uppercase tracking-widest opacity-70">TỪ KHÓA CẦN ĐOÁN</div>
        <div className="text-3xl sm:text-4xl font-black break-words">{currentCharadesWord}</div>
        <div className="pt-4 border-t border-white/20 text-sm font-bold opacity-80">
          Người giữ máy: {currentActor?.name || '---'}
        </div>
      </div>

      <button onClick={onNewRound} className="w-full h-16 bg-black text-white rounded-[24px] font-black text-lg shadow-lg active:scale-95 transition-transform">
        CHƠI VÁN MỚI
      </button>
    </motion.div>
  );
};
