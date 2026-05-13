import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Plus, Smile, Trash2 } from 'lucide-react';
import { Player, Difficulty } from '../types';

interface PlayerManagerProps {
  players: Player[];
  newPlayerName: string;
  expandedPlayerId: string | null;
  onNewPlayerNameChange: (name: string) => void;
  onAddPlayer: () => void;
  onRemovePlayer: (id: string) => void;
  onUpdatePlayerName: (id: string, name: string) => void;
  onUpdatePlayerAge: (id: string, age: number) => void;
  onSetExpandedPlayerId: (id: string | null) => void;
  gameConditions: { difficulty: Difficulty; mode: string };
}

export const PlayerManager: React.FC<PlayerManagerProps> = ({
  players,
  newPlayerName,
  expandedPlayerId,
  onNewPlayerNameChange,
  onAddPlayer,
  onRemovePlayer,
  onUpdatePlayerName,
  onUpdatePlayerAge,
  onSetExpandedPlayerId,
  gameConditions,
}) => {
  const getPlayerIcon = (idx: number) => {
    const colors = [
      'bg-green-100 text-green-600',
      'bg-blue-100 text-blue-600',
      'bg-yellow-100 text-yellow-600',
      'bg-blue-200 text-blue-800',
      'bg-red-100 text-red-600',
      'bg-teal-100 text-teal-600',
    ];
    return colors[idx % colors.length];
  };

  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start gap-4 mb-4">
        <div className="mt-1">
          <div className="w-10 h-10 bg-lime-100 rounded-2xl flex items-center justify-center">
            <Users size={20} className="text-[#65A30D]" />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-black text-gray-900 leading-none mb-1 uppercase tracking-tight">Người chơi</h2>
          <p className="text-[13px] text-gray-400 font-bold">Nhấn vào tên để nhập tuổi (để tự điều chỉnh độ khó)</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          value={newPlayerName}
          onChange={(e) => onNewPlayerNameChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAddPlayer()}
          className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-lime-200 outline-none transition-all placeholder:text-gray-300"
          placeholder="Thêm người chơi mới..."
        />
        <button 
          onClick={onAddPlayer}
          className="w-12 h-12 bg-[#65A30D] text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-lime-600 active:scale-95 transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {players.map((player, idx) => {
            const isExpanded = expandedPlayerId === player.id;
            return (
              <motion.div 
                key={player.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -20 }}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isExpanded ? 'border-lime-200 shadow-sm bg-lime-50/20' : 'border-gray-50 bg-white'
                }`}
              >
                <div className="flex items-center p-3 gap-3 cursor-pointer" onClick={() => onSetExpandedPlayerId(isExpanded ? null : player.id)}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getPlayerIcon(idx)}`}>
                    <Smile size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-gray-900">{player.name}</p>
                    {player.age && (
                      <p className="text-[10px] text-[#65A30D] font-black uppercase">
                        {player.age} tuổi • {player.age >= 15 ? 'Người lớn' : 'Trẻ em'}
                      </p>
                    )}
                  </div>
                  <button 
                      onClick={(e) => { e.stopPropagation(); onRemovePlayer(player.id); }}
                      className="p-2 text-gray-200 hover:text-red-500 transition-colors"
                   >
                      <Trash2 size={16} />
                   </button>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-3 pb-3 border-t border-gray-50 pt-2"
                    >
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Đổi biệt danh</label>
                          <input
                            value={player.name}
                            onChange={(e) => onUpdatePlayerName(player.id, e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-lime-200"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Tuổi (Không bắt buộc)</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              placeholder="Vd: 25"
                              value={player.age || ''}
                              onChange={(e) => onUpdatePlayerAge(player.id, e.target.value ? Number(e.target.value) : 0)}
                              className="flex-1 bg-white border border-gray-100 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-lime-200"
                            />
                            <span className="text-[10px] font-black text-gray-400 uppercase">Tuổi</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Độ khó hiện tại:</p>
         <div className="px-3 py-1 bg-lime-100 rounded-full">
            <span className="text-[10px] font-black text-[#65A30D] uppercase">
              {gameConditions.difficulty === 'VERY_EASY' ? 'Dễ (Dành cho trẻ em)' : 
               gameConditions.difficulty === 'EASY' ? 'Trung bình (Cả nhà cùng chơi)' : 
               'Khó (Dành cho người lớn)'}
            </span>
         </div>
      </div>
    </section>
  );
};
