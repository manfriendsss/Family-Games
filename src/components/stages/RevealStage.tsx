import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, ChevronRight } from 'lucide-react';
import { Player, GameMode } from '../../types';

interface RevealStageProps {
  gameMode: GameMode;
  activePlayerIndex: number;
  players: Player[];
  isPressing: boolean;
  currentCharadesWord: string;
  currentActor: Player | null;
  setIsPressing: (is: boolean) => void;
  onNext: () => void;
}

export const RevealStage: React.FC<RevealStageProps> = ({
  gameMode, activePlayerIndex, players, isPressing, currentCharadesWord, currentActor, setIsPressing, onNext
}) => {
  const isCharades = gameMode === 'CHARADES';
  const isLastRevealPlayer = activePlayerIndex >= players.length - 1;
  const handlePressStart = () => {
    setIsPressing(true);
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(12);
    }
  };

  return (
    <motion.div
      key={isCharades ? 'reveal-charades' : `reveal-${activePlayerIndex}`}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ type: 'spring', damping: 22, stiffness: 85 }}
      className="h-[100svh] flex flex-col justify-between gap-5 px-4 py-8 sm:py-10"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 break-words">
          {isCharades ? (currentActor ? `Người giữ máy: ${currentActor.name}` : 'Người giữ máy') : players[activePlayerIndex].name}
        </h2>
        <p className="text-sm font-bold text-[#65A30D] uppercase tracking-[0.2em] bg-lime-50 inline-block px-4 py-1 rounded-full">
          {isCharades ? 'ĐẶT ĐIỆN THOẠI LÊN TRÁN' : 'LƯỢT CỦA BẠN'}
        </p>
        {!isCharades && (
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
            {activePlayerIndex + 1}/{players.length} người đã xem
          </p>
        )}
      </div>

      <div className="relative w-full max-w-[min(70vw,280px)] sm:max-w-[300px] aspect-[3/4.2] mx-auto">
        <motion.div
          onPointerDown={handlePressStart}
          onPointerUp={() => setIsPressing(false)}
          onPointerLeave={() => setIsPressing(false)}
          className="w-full h-full relative cursor-none select-none touch-none"
        >
          <AnimatePresence mode="wait">
            {!isPressing ? (
              <motion.div
                key="cover"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0 }}
                className={`absolute inset-0 rounded-[36px] sm:rounded-[48px] shadow-2xl flex flex-col items-center justify-center p-6 sm:p-8 border-8 sm:border-[12px] border-white group ${isCharades ? 'bg-blue-600' : 'bg-[#65A30D]'}`}
              >
                <motion.div
                  animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="bg-white/20 p-8 rounded-full mb-8 backdrop-blur-sm border border-white/30"
                >
                  <Eye size={56} className="text-white" />
                </motion.div>
                <div className="space-y-3 text-center">
                  <p className="text-white font-black text-2xl leading-tight tracking-tight uppercase">
                    {isCharades ? 'THẺ TỪ KHÓA ĐANG ÚP' : 'ẤN GIỮ ĐỂ XEM'}
                  </p>
                  <p className="text-white/60 font-bold text-xs uppercase tracking-widest leading-none">
                    {isCharades ? 'ẤN GIỮ ĐỂ MỌI NGƯỜI XEM TỪ KHÓA' : 'TUYỆT ĐỐI BÍ MẬT'}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="word"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`absolute inset-0 bg-white rounded-[48px] shadow-inner flex flex-col items-center justify-center p-8 border-4 ring-8 ${isCharades ? 'border-blue-600 ring-blue-50' : 'border-[#65A30D] ring-lime-100'}`}
              >
                <div className={`font-black text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] mb-4 sm:mb-6 opacity-60 ${isCharades ? 'text-blue-600' : 'text-[#65A30D]'}`}>TỪ KHÓA BÍ MẬT</div>
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  className={`text-3xl sm:text-5xl font-black text-gray-900 border-b-8 pb-3 sm:pb-4 mb-5 sm:mb-8 text-center break-words ${isCharades ? 'border-blue-400' : 'border-lime-400'}`}
                >
                  {isCharades ? currentCharadesWord : players[activePlayerIndex].word}
                </motion.div>
                {isCharades && currentActor && (
                  <div className="text-center mb-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Người giữ máy</p>
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-black">{currentActor.name}</span>
                  </div>
                )}
                <div className="flex flex-col items-center gap-2 opacity-30">
                  <EyeOff size={32} className="text-gray-400" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ĐỪNG ĐỂ NGƯỜI KHÁC THẤY</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="pt-2 sm:pt-4 flex justify-center">
        <button
          onClick={onNext}
          className="w-full max-w-[300px] h-14 sm:h-16 bg-gray-900 text-white rounded-[20px] sm:rounded-[24px] font-black text-base sm:text-lg shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 border-4 border-white [touch-action:manipulation]"
        >
          {isCharades ? 'BẮT ĐẦU LƯỢT CHƠI' : (isLastRevealPlayer ? 'XONG, BẮT ĐẦU' : 'XONG, NGƯỜI TIẾP THEO')} <ChevronRight size={22} strokeWidth={3} />
        </button>
      </div>
    </motion.div>
  );
};
