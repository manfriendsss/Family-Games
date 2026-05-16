import React from 'react';
import { motion } from 'motion/react';
import { Check, Plus, Clock, ChevronDown, User, LayoutGrid, Users, Info, Tag } from 'lucide-react';
import { CharadesSettings, Player } from '../types';
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
      <section className="bg-[#1D1D1F] rounded-3xl p-6 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-10 blur-3xl -mr-16 -mt-16 group-hover:opacity-20 transition-opacity" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
              <Info size={16} />
            </div>
            <h2 className="text-white font-black text-sm uppercase tracking-wider">Luật chơi cơ bản</h2>
          </div>
          <p className="text-gray-300 text-xs leading-relaxed font-bold">
            Ứng dụng sẽ chỉ định <span className="text-blue-300">người giữ điện thoại</span>. Người này đặt máy lên trán và không nhìn màn hình.
            Mọi người còn lại diễn tả để người giữ máy đoán từ khóa.
          </p>
        </div>
      </section>

      <section className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Users size={16} className="text-gray-400" />
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Người chơi tham gia</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {players.map(p => (
            <span key={p.id} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-[11px] font-bold text-gray-600">
              {p.isAdult === false ? '👶' : '👤'} {p.name}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start gap-4 mb-6">
          <div className="mt-1">
            <Tag size={24} className="text-gray-700" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-none mb-1">Lựa chọn danh mục</h2>
            <p className="text-[13px] text-gray-400 font-medium">Chọn 1 hoặc nhiều danh mục</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {CHARADES_CATEGORIES.map(cat => {
            const isSelected = settings.selectedCategories.includes(cat.id);
            const nameParts = cat.name.split(' ');
            return (
              <button
                key={cat.id}
                onClick={() => onToggleCategory(cat.id)}
                className={`flex items-center p-3 rounded-2xl border-2 transition-all active:scale-95 text-left ${
                  isSelected ? 'bg-white border-lime-500 shadow-sm ring-1 ring-lime-100' : 'bg-white border-gray-100 shadow-xs'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm mr-4 shrink-0 transition-colors ${
                  isSelected ? 'bg-lime-50' : 'bg-gray-50'
                }`}>
                  {cat.icon}
                </div>
                <div className="flex-1 overflow-hidden min-w-0">
                  <span title={cat.name} className={`text-[14px] font-bold block leading-tight truncate line-clamp-1 ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                    {nameParts[0]}
                  </span>
                  <span title={cat.name} className="text-[11px] text-gray-400 font-bold block truncate line-clamp-1 mt-0.5">
                    {nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'thú vị'}
                  </span>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0 ml-2 ${
                  isSelected ? 'bg-lime-500 text-white' : 'border-2 border-gray-200'
                }`}>
                  {isSelected && <Check size={14} strokeWidth={4} />}
                </div>
              </button>
            );
          })}

          <button
            onClick={onShowCategoryPopup}
            className="w-full py-3 border-2 border-dashed border-gray-100 rounded-xl text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Plus size={14} /> Thêm danh mục khác
          </button>
        </div>
      </section>

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
          <button
            onClick={() => onUpdateSettings({ ...settings, timeLimit: !settings.timeLimit })}
            className={`w-12 h-7 rounded-full p-1 transition-colors relative ${settings.timeLimit ? 'bg-blue-500' : 'bg-gray-200'}`}
          >
            <motion.div animate={{ x: settings.timeLimit ? 20 : 0 }} className="w-5 h-5 bg-white rounded-full shadow-sm" />
          </button>
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
              <h3 className="text-sm font-black text-gray-900 uppercase">Người giữ máy</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ai sẽ giữ điện thoại?</p>
            </div>
          </div>

          <div className="relative">
            <select
              value={settings.actorId}
              onChange={(e) => onUpdateSettings({ ...settings, actorId: e.target.value })}
              disabled={settings.autoRotateActor}
              className={`w-full border-none rounded-xl p-4 pr-10 text-sm font-bold appearance-none outline-none focus:ring-2 ring-purple-200 ${settings.autoRotateActor ? 'bg-gray-100 text-gray-400' : 'bg-gray-50'}`}
            >
              <option value="RANDOM">🎲 Ngẫu nhiên</option>
              {players.map(p => (
                <option key={p.id} value={p.id}>👤 {p.name}</option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] font-black text-gray-500 uppercase tracking-wider">Tự luân phiên người giữ máy</span>
            <button
              onClick={() => onUpdateSettings({ ...settings, autoRotateActor: !settings.autoRotateActor })}
              className={`w-12 h-7 rounded-full p-1 transition-colors relative ${settings.autoRotateActor ? 'bg-purple-500' : 'bg-gray-200'}`}
            >
              <motion.div animate={{ x: settings.autoRotateActor ? 20 : 0 }} className="w-5 h-5 bg-white rounded-full shadow-sm" />
            </button>
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
