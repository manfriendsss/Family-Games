import React from 'react';
import { motion } from 'motion/react';
import { Ghost, Theater, ChevronRight } from 'lucide-react';

interface DashboardProps {
  onGoToImposter: () => void;
  onGoToCharades: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onGoToImposter, onGoToCharades }) => {
  return (
    <div className="space-y-4">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onGoToImposter}
        className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-6 text-left group"
      >
        <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-[#65A30D] transition-colors">
          <Ghost size={32} className="text-white" />
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
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-blue-500 transition-colors">
          <Theater size={32} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-black text-gray-900 uppercase">Tôi là ai?</h3>
          <p className="text-sm font-medium text-gray-400">Diễn tả để tôi đoán mình là ai!</p>
        </div>
        <ChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors" />
      </motion.button>
    </div>
  );
};
