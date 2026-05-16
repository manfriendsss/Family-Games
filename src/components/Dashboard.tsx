import React from 'react';
import { motion } from 'motion/react';
import { Ghost, Theater, ChevronRight } from 'lucide-react';

interface DashboardProps {
  onGoToImposter: () => void;
  onGoToCharades: () => void;
  onGoToCaro: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onGoToImposter, onGoToCharades, onGoToCaro }) => {
  return (
    <div className="space-y-4">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onGoToImposter}
        className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-6 text-left group"
      >
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner group-hover:ring-4 ring-lime-100 transition-all">
          <img src="/ailanguoigiamao.webp" alt="Imposter" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-black text-gray-900 uppercase">Ai là người giả mạo?</h3>
          <p className="text-sm font-medium text-gray-400">Tìm kẻ giả mạo trong nhóm!</p>
        </div>
        <ChevronRight className="text-gray-300 group-hover:text-[#65A30D] transition-colors" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onGoToCharades}
        className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-6 text-left group"
      >
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner group-hover:ring-4 ring-blue-100 transition-all">
          <img src="/toilaai.webp" alt="Charades" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-black text-gray-900 uppercase">Tôi là ai?</h3>
          <p className="text-sm font-medium text-gray-400">Diễn tả để tôi đoán mình là ai!</p>
        </div>
        <ChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onGoToCaro}
        className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-6 text-left group"
      >
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner group-hover:ring-4 ring-amber-100 transition-all">
          <img src="/cocaro.webp" alt="Caro" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-black text-gray-900 uppercase">Cờ Caro</h3>
          <p className="text-sm font-medium text-gray-400">Đối kháng 2 người: 3x3 hoặc 15x15.</p>
        </div>
        <ChevronRight className="text-gray-300 group-hover:text-amber-500 transition-colors" />
      </motion.button>
    </div>
  );
};
