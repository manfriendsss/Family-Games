import React from 'react';
import { motion } from 'motion/react';
import { Info, Tag, Plus, Check, Settings, Clock, ChevronDown, Users, RotateCcw } from 'lucide-react';
import { GameSettings, Category, Difficulty } from '../types';
import { CATEGORIES } from '../constants';

interface ImposterSetupProps {
  settings: GameSettings;
  showAllCategories: boolean;
  onToggleCategory: (id: string) => void;
  onShowAllCategories: () => void;
  onStartQuickMode: () => void;
  onUpdateSettings: (settings: GameSettings) => void;
}

export const ImposterSetup: React.FC<ImposterSetupProps> = ({
  settings,
  showAllCategories,
  onToggleCategory,
  onShowAllCategories,
  onStartQuickMode,
  onUpdateSettings,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Info Card */}
      <section className="bg-[#1D1D1F] rounded-3xl p-6 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#65A30D] opacity-10 blur-3xl -mr-16 -mt-16 group-hover:opacity-20 transition-opacity" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 bg-[#65A30D]/20 rounded-lg flex items-center justify-center text-[#65A30D]">
                <Info size={16} />
             </div>
             <h2 className="text-white font-black text-sm uppercase tracking-wider">Luật chơi cơ bản</h2>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed font-bold">
            Tất cả mọi người sẽ nhận được một từ giống nhau, ngoại trừ <span className="text-red-400">Kẻ giả mạo</span>. 
            Kẻ giả mạo sẽ nhận được một từ gợi ý gần giống. Hãy diễn tả thật khéo léo để không bị lộ!
          </p>
        </div>
      </section>

      {/* Quick Game Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onStartQuickMode}
        className="w-full relative overflow-hidden bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex items-center justify-between group transition-all"
      >
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-lime-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-lime-100 text-[#65A30D]">
            ⚡
          </div>
          <div className="text-left">
            <h3 className="font-black text-gray-900 leading-tight text-lg">CHƠI NHANH</h3>
            <p className="text-[11px] text-[#65A30D] font-black uppercase tracking-wider">Tự động cấu hình • Vào game ngay</p>
          </div>
        </div>
        <div className="bg-[#65A30D] p-2 rounded-full text-white relative z-10 shadow-lg group-hover:translate-x-1 transition-transform">
          <Check size={20} strokeWidth={3} />
        </div>
      </motion.button>

      {/* Categories Card */}
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
          {(showAllCategories ? CATEGORIES : CATEGORIES.slice(0, 6)).map((cat) => {
            const isSelected = settings.selectedCategories.includes(cat.id);
            const nameParts = cat.name.split(' & ');
            return (
              <button
                key={cat.id}
                onClick={() => onToggleCategory(cat.id)}
                className={`flex items-center p-3 rounded-2xl border-2 transition-all active:scale-95 text-left ${
                  isSelected
                    ? 'bg-white border-lime-500 shadow-sm ring-1 ring-lime-100'
                    : 'bg-white border-gray-100 shadow-xs'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm mr-4 shrink-0 transition-colors ${
                   isSelected ? 'bg-lime-50' : 'bg-gray-50'
                }`}>
                  {cat.icon}
                </div>
                <div className="flex-1 overflow-hidden min-w-0">
                  <span className={`text-[14px] font-bold block leading-tight truncate ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                    {nameParts[0]}
                  </span>
                  <span className="text-[11px] text-gray-400 font-bold block truncate mt-0.5">
                     {nameParts.length > 1 ? nameParts[1] : (cat.id === 'nature' ? 'không biên giới' : 'thú vị')}
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
        </div>
        
        {!showAllCategories && CATEGORIES.length > 6 && (
          <button 
            onClick={onShowAllCategories}
            className="w-full mt-4 py-3 border-2 border-dashed border-gray-100 rounded-xl text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Plus size={14} /> Thêm danh mục khác
          </button>
        )}
      </section>

      {/* Game Settings Card */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-start gap-4 mb-2">
          <div className="mt-1">
            <Settings size={24} className="text-gray-700" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Cài đặt game</h2>
          </div>
        </div>

        {/* Time Limit */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <Clock size={20} className="text-gray-400" />
                <span className="text-sm font-bold text-gray-700">Giới hạn thời gian</span>
             </div>
              <button 
                onClick={() => onUpdateSettings({ ...settings, timeLimit: !settings.timeLimit })}
                className={`w-14 h-8 rounded-full p-1 transition-colors relative ${settings.timeLimit ? 'bg-lime-500' : 'bg-gray-200'}`}
              >
                <motion.div 
                  animate={{ x: settings.timeLimit ? 24 : 0 }}
                  className="w-6 h-6 bg-white rounded-full shadow-sm" 
                />
              </button>
          </div>
        </div>

        {/* Imposter Count */}
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <Users size={20} className="text-gray-400" />
              <span className="text-sm font-bold text-gray-700">Số lượng Imposter</span>
           </div>
           <div className="relative min-w-[120px]">
              <select 
                value={settings.imposterCount}
                onChange={(e) => onUpdateSettings({ ...settings, imposterCount: Number(e.target.value) })}
                className="w-full bg-[#F5F5F7] border-none rounded-xl p-3 pr-10 text-sm font-bold appearance-none outline-none focus:ring-2 ring-lime-200"
              >
                <option value={1}>1 Imposter</option>
                <option value={2}>2 Imposter</option>
                <option value={3}>3 Imposter</option>
              </select>
              <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
           </div>
        </div>

        {/* Difficulty */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-3 text-gray-400">
             <RotateCcw size={20} className="rotate-45" />
             <span className="text-sm font-bold text-gray-700">Độ khó</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {(['EASY', 'HARD'] as const).map((mode) => {
              const isSelected = settings.difficulty === mode;
              return (
                <button
                  key={mode}
                  onClick={() => onUpdateSettings({ ...settings, difficulty: mode })}
                  className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                    isSelected
                      ? 'bg-[#F2FBDF] border-lime-500'
                      : 'bg-white border-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                     <div>
                        <span className={`text-sm font-bold block ${isSelected ? 'text-lime-700' : 'text-gray-700'}`}>
                          {mode === 'EASY' ? 'Dễ (Imposter có gợi ý)' : 'Khó (Imposter không có gợi ý)'}
                        </span>
                        <span className={`text-[11px] font-medium block mt-1 ${isSelected ? 'text-lime-600' : 'text-gray-400'}`}>
                          {mode === 'EASY' 
                            ? 'Imposter sẽ nhận được gợi ý liên quan' 
                            : 'Imposter không nhận được bất kỳ gợi ý nào'}
                        </span>
                     </div>
                     <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-lime-500' : 'border-gray-200'
                     }`}>
                        {isSelected && <div className="w-3 h-3 bg-lime-500 rounded-full" />}
                     </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </motion.div>
  );
};
