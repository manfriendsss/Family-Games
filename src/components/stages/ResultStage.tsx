import React from 'react';
import { motion } from 'motion/react';
import { Player, WordPair, GameSettings } from '../../types';

interface ResultStageProps {
  currentWordPair: WordPair | null;
  players: Player[];
  settings: GameSettings;
  onNewGame: () => void;
}

export const ResultStage: React.FC<ResultStageProps> = ({
  currentWordPair, players, settings, onNewGame
}) => {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: 'easeOut' }} className="space-y-6">
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 text-center">
        <h2 className="text-2xl font-black mb-1">🎭 Kết quả</h2>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Kẻ giả mạo đã lộ diện</p>
      </div>

      <div className="bg-blue-600 rounded-[32px] p-8 text-white text-center shadow-2xl space-y-4">
        <div className="text-xs font-black uppercase tracking-widest opacity-70">Từ khóa của Citizen</div>
        <div className="text-4xl font-black">{currentWordPair?.citizen}</div>
        <hr className="border-white/20" />
        <div className="text-xs font-black uppercase tracking-widest opacity-70">Từ khóa của Imposter</div>
        <div className="text-4xl font-black">{settings.difficulty === 'EASY' ? currentWordPair?.imposter_hint : 'Không có gợi ý'}</div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest px-4">Danh sách Imposter</p>
        {players.filter(p => p.role === 'IMPOSTER').map(p => (
          <div key={p.id} className="bg-white border border-red-100 p-5 rounded-[24px] flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl">😈</div>
            <div>
              <div className="text-lg font-black">{p.name}</div>
              <div className="text-xs font-bold text-red-400 uppercase">Kẻ giả mạo</div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={onNewGame} className="w-full h-16 bg-black text-white rounded-[24px] font-black text-lg shadow-lg active:scale-95 transition-transform mt-8">
        CHƠI VÁN MỚI
      </button>
    </motion.div>
  );
};
