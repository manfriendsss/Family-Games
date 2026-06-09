import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Check } from 'lucide-react';
import { Category } from '../types';
import { CHARADES_CATEGORIES, CATEGORIES } from '../constants';

interface CharadesCategoryPopupProps {
  isOpen: boolean;
  selectedCategories: string[];
  onToggleCategory: (id: string) => void;
  onClose: () => void;
}

export const CharadesCategoryPopup: React.FC<CharadesCategoryPopupProps> = ({
  isOpen,
  selectedCategories,
  onToggleCategory,
  onClose,
}) => {
  const allAvailableCategories = [
    ...CHARADES_CATEGORIES,
    ...CATEGORIES.filter(cat => !CHARADES_CATEGORIES.some(cc => cc.id === cat.id))
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative z-10"
          >
             <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h2 className="text-xl font-black text-gray-900 uppercase">Chọn chủ đề trò chơi</h2>
                <button onClick={onClose} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                   <Plus size={20} className="rotate-45" />
                </button>
             </div>
             <div className="p-4 max-h-[60vh] overflow-y-auto grid grid-cols-1 gap-2">
                {allAvailableCategories.map(cat => {
                  const isSelected = selectedCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => onToggleCategory(cat.id)}
                      className={`flex items-center p-4 rounded-2xl border-2 transition-all ${isSelected ? 'border-lime-500 bg-lime-50' : 'border-gray-50 bg-white'}`}
                    >
                      <span className="text-3xl mr-4">{cat.icon}</span>
                      <span className="flex-1 text-left font-bold text-gray-900">{cat.name}</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-lime-500 text-white' : 'border-2 border-gray-100'}`}>
                        {isSelected && <Check size={14} strokeWidth={4} />}
                      </div>
                    </button>
                  );
                })}
             </div>
             <div className="p-6 pt-0">
                <button onClick={onClose} className="w-full h-14 bg-black text-white rounded-2xl font-black shadow-lg">XÁC NHẬN</button>
              </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
