import React from 'react';
import { motion } from 'motion/react';
import { User, Info } from 'lucide-react';
import { Player, GameMode, CharadesSettings } from '../../types';

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
  gameMode, currentActor, talkOrder, players, charadesSettings, onNext
}) => {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: 'easeOut' }} className="space-y-4">
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
