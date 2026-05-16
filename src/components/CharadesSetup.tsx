import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Check, Plus, Clock, ChevronDown, User, LayoutGrid, Users } from 'lucide-react';
import { CharadesSettings, Player, Category } from '../types';
import { CHARADES_CATEGORIES } from '../constants';

interface CharadesSetupProps {
  settings: CharadesSettings;
  players: Player[];
  onToggleCategory: (id: string) => void;
  onUpdateSettings: (settings: CharadesSettings) => void;
  onShowCategoryPopup: () => void;
}

export const CharadesSetup: React.FC<CharadesSetupProps> = ({
  settings,
  players,
  onToggleCategory,
  onUpdateSettings,
  onShowCategoryPopup,
}) => {
  return (
    <motion.div 
      key="charades-setup"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Category Card */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full border border-yellow-100 flex items-center justify-center text-2xl shadow-sm text-yellow-500">
              🎬
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 leading-none mb-1 uppercase tracking-tight">Danh mục trò chơi</h2>
              <p className="text-[13px] text-gray-400 font-bold">Chọn 1 hoặc nhiều chủ đề để chơi</p>
            </div>
          </div>
          <ChevronRight className="text-gray-300" size={20} />
        </div>

        {/* Players Summary in Charades */}
        <div className="px-1 mb-6">
           <div className="flex items-center gap-2 mb-3">
              <Users size={16} className="text-gray-400" />
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Đội hình chơi</h3>
           </div>
           <div className="flex flex-wrap gap-2">
              {players.map(p => (
                <span key={p.id} className="px-3 py-1 bg-gray-50 border border-gray-50 rounded-full text-[10px] font-bold text-gray-500">
                  {p.isAdult === false ? '👶' : '👤'} {p.name}
                </span>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-2">
          {CHARADES_CATEGORIES.map(cat => {
            const isSelected = settings.selectedCategories.includes(cat.id);
            const nameParts = cat.name.split(' ');
            return (
              <button
                key={cat.id}
                onClick={() => onToggleCategory(cat.id)}
                className={`flex items-center p-3 rounded-2xl border-2 transition-all group active:scale-95 text-left ${
                  isSelected ? 'border-[#65A30D] bg-lime-50/20' : 'border-gray-50 bg-white'
                }`}
              >
                <span className={`text-2xl mr-3 transition-transform group-hover:scale-110 ${isSelected ? 'grayscale-0' : 'grayscale opacity-50'}`}>
                  {cat.icon}
                </span>
                <div className="flex flex-col text-left flex-1 min-w-0">
                  <span className={`text-xs font-black truncate uppercase leading-none ${isSelected ? 'text-gray-900' : 'text-gray-400'}`}>
                    {nameParts[0]}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold block truncate mt-0.5">
                     {nameParts.length > 1 ? nameParts[1] : 'thú vị'}
                  </span>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all shrink-0 ml-2 ${
                  isSelected ? 'bg-[#65A30D] text-white' : 'border-2 border-gray-100'
                }`}>
                  {isSelected && <Check size={12} strokeWidth={4} />}
                </div>
              </button>
            );
          })}
          <button 
            onClick={onShowCategoryPopup}
            className="flex items-center p-3 rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/30 group hover:bg-gray-100/50 transition-all active:scale-95"
          >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm mr-3 group-hover:bg-[#65A30D] group-hover:text-white transition-all">
              <Plus size={16} />
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thêm</span>
          </button>
        </div>
      </section>

      {/* Time Limit Card */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 space-y-6">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900 uppercase">Thời gian diễn</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Mỗi lượt chơi</p>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <button 
                onClick={() => onUpdateSettings({ ...settings, timeLimit: !settings.timeLimit })}
                className={`w-12 h-7 rounded-full p-1 transition-colors relative ${settings.timeLimit ? 'bg-blue-500' : 'bg-gray-200'}`}
              >
                <motion.div 
                  animate={{ x: settings.timeLimit ? 20 : 0 }}
                  className="w-5 h-5 bg-white rounded-full shadow-sm" 
                />
              </button>
           </div>
        </div>
        
        {settings.timeLimit && (
          <div className="grid grid-cols-3 gap-2">
            {[30, 60, 90].map(s => (
              <button
                key={s}
                onClick={() => onUpdateSettings({ ...settings, timeSeconds: s })}
                className={`py-3 rounded-xl border-2 font-black text-xs transition-all ${
                  settings.timeSeconds === s ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-50 text-gray-400'
                }`}
              >
                {s} GIÂY
              </button>
            ))}
          </div>
        )}

        <div className="pt-2">
           <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
                <User size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900 uppercase">Người diễn</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ai sẽ là diễn viên?</p>
              </div>
           </div>
           
           <div className="relative">
              <select 
                value={settings.actorId}
                onChange={(e) => onUpdateSettings({ ...settings, actorId: e.target.value })}
                className="w-full bg-gray-50 border-none rounded-xl p-4 pr-10 text-sm font-bold appearance-none outline-none focus:ring-2 ring-purple-200"
              >
                <option value="RANDOM">🎲 Ngẫu nhiên</option>
                {players.map(p => (
                  <option key={p.id} value={p.id}>👤 {p.name}</option>
                ))}
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
           </div>
        </div>

        <div className="pt-2">
           <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                <LayoutGrid size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900 uppercase">Chế độ chơi</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Cách thức đoán</p>
              </div>
           </div>
           
           <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => onUpdateSettings({ ...settings, mode: 'ACTIONS_AND_HINTS' })}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  settings.mode === 'ACTIONS_AND_HINTS' ? 'border-orange-500 bg-orange-50/30' : 'border-gray-50 bg-white'
                }`}
              >
                <span className={`text-xs font-black block uppercase ${settings.mode === 'ACTIONS_AND_HINTS' ? 'text-orange-600' : 'text-gray-700'}`}>Hành động + Gợi ý</span>
                <span className="text-[10px] text-gray-400 font-bold block mt-1 uppercase">Diễn tả kèm gợi ý chữ cái</span>
              </button>
              <button
                onClick={() => onUpdateSettings({ ...settings, mode: 'ACTIONS_ONLY' })}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  settings.mode === 'ACTIONS_ONLY' ? 'border-orange-500 bg-orange-50/30' : 'border-gray-50 bg-white'
                }`}
              >
                <span className={`text-xs font-black block uppercase ${settings.mode === 'ACTIONS_ONLY' ? 'text-orange-600' : 'text-gray-700'}`}>Chỉ hành động</span>
                <span className="text-[10px] text-gray-400 font-bold block mt-1 uppercase">Im lặng và chỉ dùng cử chỉ</span>
              </button>
           </div>
        </div>
      </section>
    </motion.div>
  );
};
