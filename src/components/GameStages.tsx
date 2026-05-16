import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, ChevronRight, User, Info, RotateCcw } from 'lucide-react';
import { Player, GameMode, WordPair, GameSettings, CharadesSettings } from '../types';

// REVEAL STAGE
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

  return (
    <motion.div
      key={isCharades ? 'reveal-charades' : `reveal-${activePlayerIndex}`}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
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
          onPointerDown={() => setIsPressing(true)}
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
          className="w-full max-w-[300px] h-14 sm:h-16 bg-gray-900 text-white rounded-[20px] sm:rounded-[24px] font-black text-base sm:text-lg shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 border-4 border-white"
        >
          {isCharades ? 'BẮT ĐẦU LƯỢT CHƠI' : (isLastRevealPlayer ? 'XONG, BẮT ĐẦU' : 'XONG, NGƯỜI TIẾP THEO')} <ChevronRight size={22} strokeWidth={3} />
        </button>
      </div>
    </motion.div>
  );
};

// DISCUSSION STAGE
interface DiscussionStageProps {
  gameMode: GameMode;
  currentCharadesWord: string;
  currentActor: Player | null;
  talkOrder: string[];
  players: Player[];
  charadesSettings: CharadesSettings;
  onNext: () => void;
}

export const DiscussionStage: React.FC<DiscussionStageProps> = ({
  gameMode, currentCharadesWord, currentActor, talkOrder, players, charadesSettings, onNext
}) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 text-center">
        <h2 className="text-2xl font-black mb-1 text-lime-600">{gameMode === 'CHARADES' ? 'Đang chơi Charades' : 'Thảo luận'}</h2>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{gameMode === 'CHARADES' ? 'Mọi người diễn tả cho người giữ máy đoán' : 'Điểm danh theo thứ tự'}</p>
      </div>

      {gameMode === 'CHARADES' && (
        <div className="bg-blue-600 rounded-[32px] p-8 text-white text-center shadow-2xl space-y-4">
          <div className="text-xs font-black uppercase tracking-widest opacity-70">Từ khóa đang úp</div>
          <div className="text-2xl font-black">MỌI NGƯỜI DIỄN TẢ ĐỂ {currentActor?.name?.toUpperCase() || 'NGƯỜI GIỮ MÁY'} ĐOÁN</div>
          <div className="pt-4 border-t border-white/20 flex items-center justify-center gap-3">
            <div className="text-left">
              <p className="text-[10px] font-black uppercase opacity-60">Người giữ máy</p>
              <p className="text-lg font-black">{currentActor?.name}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <User size={20} />
            </div>
          </div>
        </div>
      )}

      {gameMode === 'IMPOSTER' && (
        <div className="space-y-2">
          {talkOrder.map((pid, idx) => {
            const p = players.find(player => player.id === pid);
            const isFirst = idx === 0;
            return (
              <motion.div
                key={pid}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded-3xl border flex items-center justify-between transition-all ${
                  isFirst ? 'bg-[#B2FF3D] border-[#B2FF3D] shadow-lg shadow-lime-100' : 'bg-white border-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${isFirst ? 'bg-black text-white' : 'bg-[#F2F2F7] text-gray-400'}`}>
                    {idx + 1}
                  </div>
                  <span className={`text-lg font-black ${isFirst ? 'text-black' : ''}`}>{p?.name}</span>
                </div>
                {isFirst && <span className="text-[10px] font-black uppercase text-black bg-white/30 px-2 py-1 rounded-lg">Mở màn</span>}
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center gap-2 text-lime-600 font-black text-sm"><Info size={16} /> {gameMode === 'CHARADES' ? 'HƯỚNG DẪN' : 'QUY TẮC CHƠI'}</div>
        <ul className="space-y-3">
          {(gameMode === 'CHARADES'
            ? [
                `Người giữ máy (${currentActor?.name}) tuyệt đối không được nhìn màn hình.`,
                charadesSettings.mode === 'ACTIONS_ONLY' ? 'Chỉ được dùng hành động, không được nói.' : 'Có thể dùng hành động và lời nói gợi ý (không nói từ khóa).',
                'Bấm Kết thúc vòng chơi khi người giữ máy đã đoán xong hoặc hết thời gian.'
              ]
            : [
                'Mô tả từ khóa của mình nhưng đừng quá lộ liễu.',
                'Lắng nghe xem ai là người có từ khóa khác biệt.',
                'Kết thúc lượt nói, hãy vote cho người bạn nghi là Imposter.'
              ]
          ).map((rule, i) => (
            <li key={i} className="flex gap-3 text-xs leading-relaxed font-medium text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 mt-1.5 shrink-0" />
              {rule}
            </li>
          ))}
        </ul>
      </div>

    </motion.div>
  );
};

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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
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
        CHƠI VÒNG MỚI
      </button>
    </motion.div>
  );
};

// VOTING STAGE
interface VotingStageProps {
  players: Player[];
  votes: Record<string, number>;
  hasVoted: boolean;
  onVote: (id: string) => void;
  onLockVotes: () => void;
  onShowResult: () => void;
}

export const VotingStage: React.FC<VotingStageProps> = ({
  players, votes, hasVoted, onVote, onLockVotes, onShowResult
}) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 text-center">
        <h2 className="text-2xl font-black mb-1">⚖️ Bình chọn</h2>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest text-wrap">Ai là Imposter? Hãy chọn 1 người!</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {players.map((p) => {
          const voteCount = votes[p.id] || 0;
          return (
            <button
              key={p.id}
              onClick={() => onVote(p.id)}
              className={`p-4 rounded-3xl border-2 flex items-center justify-between transition-all ${hasVoted ? 'opacity-80 pointer-events-none' : 'active:bg-gray-50'} ${votes[p.id] ? 'border-orange-200 bg-orange-50/30' : 'border-gray-50 bg-white'}`}
            >
              <span className="text-lg font-black">{p.name}</span>
              <div className="flex gap-1">
                {Array.from({ length: voteCount }).map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
                {voteCount > 0 && <span className="text-xs font-black text-red-500 ml-1">{voteCount}</span>}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onLockVotes}
          disabled={hasVoted}
          className={`flex-1 h-14 rounded-2xl font-black text-sm transition-all ${hasVoted ? 'bg-gray-100 text-gray-400' : 'bg-black text-white active:scale-95'}`}
        >
          CHỐT PHIẾU
        </button>
        {hasVoted && (
          <button
            onClick={onShowResult}
            className="flex-[2] h-14 bg-red-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-red-200 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            LẬT MẶT IMPOSTER <ChevronRight size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// RESULT STAGE
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
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
