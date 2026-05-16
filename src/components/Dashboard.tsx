import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface DashboardProps {
  onGoToImposter: () => void;
  onGoToCharades: () => void;
  onGoToCaro: () => void;
  onGoToDoanTu: () => void;
}

const cardClass =
  'w-full h-full bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-gray-100 flex items-center gap-4 md:gap-6 text-left group';

export const Dashboard: React.FC<DashboardProps> = ({ onGoToImposter, onGoToCharades, onGoToCaro, onGoToDoanTu }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onGoToImposter} className={cardClass}>
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner group-hover:ring-4 ring-lime-100 transition-all">
          <img src="/ailanguoigiamao.webp" alt="Imposter" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-black text-gray-900 uppercase">Ai la nguoi gia mao?</h3>
          <p className="text-sm font-medium text-gray-400">Tim ke gia mao trong nhom!</p>
        </div>
        <ChevronRight className="text-gray-300 group-hover:text-[#65A30D] transition-colors" />
      </motion.button>

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onGoToCharades} className={cardClass}>
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner group-hover:ring-4 ring-blue-100 transition-all">
          <img src="/toilaai.webp" alt="Charades" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-black text-gray-900 uppercase">Toi la ai?</h3>
          <p className="text-sm font-medium text-gray-400">Dien ta de toi doan minh la ai!</p>
        </div>
        <ChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors" />
      </motion.button>

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onGoToCaro} className={cardClass}>
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner group-hover:ring-4 ring-amber-100 transition-all">
          <img src="/cocaro.webp" alt="Caro" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-black text-gray-900 uppercase">Co caro</h3>
          <p className="text-sm font-medium text-gray-400">Doi khang 2 nguoi: 3x3 hoac 15x15.</p>
        </div>
        <ChevronRight className="text-gray-300 group-hover:text-amber-500 transition-colors" />
      </motion.button>

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onGoToDoanTu} className={cardClass}>
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner group-hover:ring-4 ring-pink-100 transition-all">
          <img src="/doantu.webp" alt="DoanTu" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-black text-gray-900 uppercase">Doan tu</h3>
          <p className="text-sm font-medium text-gray-400">Taboo mini: mo ta va tranh tu cam.</p>
        </div>
        <ChevronRight className="text-gray-300 group-hover:text-pink-500 transition-colors" />
      </motion.button>
    </div>
  );
};
