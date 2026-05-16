import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Plus, Trash2, User, Baby, ChevronDown } from 'lucide-react';
import { Player, Difficulty } from '../types';

interface PlayerManagerProps {
  players: Player[];
  newPlayerName: string;
  expandedPlayerId: string | null;
  onNewPlayerNameChange: (name: string) => void;
  onAddPlayer: () => void;
  onRemovePlayer: (id: string) => void;
  onUpdatePlayerName: (id: string, name: string) => void;
  onUpdatePlayerType: (id: string, isAdult: boolean) => void;
  onSetExpandedPlayerId: (id: string | null) => void;
  gameConditions: { difficulty: Difficulty; mode: string };
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const PlayerManager: React.FC<PlayerManagerProps> = ({
  players,
  newPlayerName,
  expandedPlayerId,
  onNewPlayerNameChange,
  onAddPlayer,
  onRemovePlayer,
  onUpdatePlayerName,
  onUpdatePlayerType,
  onSetExpandedPlayerId,
  gameConditions,
  isExpanded,
  onToggleExpand,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside to close individual cards
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onSetExpandedPlayerId(null);
      }
    };

    if (expandedPlayerId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expandedPlayerId, onSetExpandedPlayerId]);

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
    <section ref={containerRef} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transition-all overflow-hidden">
      <div 
        className="flex items-center justify-between cursor-pointer group" 
        onClick={onToggleExpand}
      >
        <div className="flex items-start gap-4">
          <div className="mt-1">
            <div className="w-10 h-10 bg-lime-100 rounded-2xl flex items-center justify-center">
              <Users size={20} className="text-[#65A30D]" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-gray-900 leading-none mb-1 uppercase tracking-tight">Người chơi</h2>
              <span className="bg-gray-100 px-2 py-0.5 rounded-full text-[10px] font-black text-gray-400">{players.length}</span>
            </div>
            <p className="text-[13px] text-gray-400 font-bold truncate max-w-[180px]">
              {isExpanded ? 'Thiết lập danh sách gia đình' : `${players.map(p => p.name).join(', ')}`}
            </p>
          </div>
        </div>
        <motion.div 
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-gray-100 transition-colors"
        >
          <ChevronDown size={20} />
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
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
                  const isExpandedPlayer = expandedPlayerId === player.id;
                  return (
                    <motion.div 
                      key={player.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`rounded-2xl border transition-all overflow-hidden ${
                        isExpandedPlayer ? 'border-lime-200 shadow-sm bg-lime-50/20' : 'border-gray-50 bg-white'
                      }`}
                    >
                      <div className="flex items-center p-3 gap-3 cursor-pointer" onClick={() => onSetExpandedPlayerId(isExpandedPlayer ? null : player.id)}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getPlayerIcon(idx)}`}>
                          {player.isAdult === false ? '👶' : '👤'}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-black text-gray-900">{player.name}</p>
                          <p className={`text-[10px] font-black uppercase ${player.isAdult === false ? 'text-blue-500' : 'text-orange-500'}`}>
                            {player.isAdult === false ? 'Trẻ em' : 'Người lớn'}
                          </p>
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onRemovePlayer(player.id); }}
                            className="p-2 text-gray-200 hover:text-red-500 transition-colors"
                         >
                            <Trash2 size={16} />
                         </button>
                      </div>

                      <AnimatePresence>
                        {isExpandedPlayer && (
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
                              <div className="space-y-2">
                                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Loại người chơi</span>
                                 <div className="grid grid-cols-2 gap-2">
                                    <button
                                      onClick={() => onUpdatePlayerType(player.id, false)}
                                      className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase transition-all border-2 ${
                                        player.isAdult === false 
                                          ? 'bg-blue-50 border-blue-500 text-blue-600' 
                                          : 'bg-white border-gray-50 text-gray-400'
                                      }`}
                                    >
                                      <Baby size={16} />
                                      Trẻ em
                                    </button>
                                    <button
                                      onClick={() => onUpdatePlayerType(player.id, true)}
                                      className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase transition-all border-2 ${
                                        player.isAdult !== false 
                                          ? 'bg-orange-50 border-orange-500 text-orange-600' 
                                          : 'bg-white border-gray-50 text-gray-400'
                                      }`}
                                    >
                                      <User size={16} />
                                      Người lớn
                                    </button>
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
               <div className="text-right">
                  <p className="text-xs font-black text-[#65A30D] uppercase leading-none mb-1">
                    {gameConditions.difficulty === 'VERY_EASY' ? 'Rất dễ' : 
                     gameConditions.difficulty === 'EASY' ? 'Bình thường' : 
                     'Thử thách'}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold leading-none">
                    {gameConditions.difficulty === 'VERY_EASY' ? '(Chỉ có trẻ em)' : 
                     gameConditions.difficulty === 'EASY' ? '(Cả nhà cùng chơi)' : 
                     '(Toàn người lớn)'}
                  </p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
