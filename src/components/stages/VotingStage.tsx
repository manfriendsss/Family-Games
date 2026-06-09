import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Player } from '../../types';

interface VotingStageProps {
  players: Player[];
  votes: Record<string, number>;
  hasVoted: boolean;
  onVote: (id: string) => void;
  onLockVotes: () => void;
  onShowResult: () => void;
}

export const VotingStage: React.FC<VotingStageProps> = ({
  players, votes, hasVoted, onVote, onLockVotes, onShowResult
}) => {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: 'easeOut' }} className="space-y-6">
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 text-center">
        <h2 className="text-2xl font-black mb-1">⚖️ Bình chọn</h2>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest text-wrap">Ai là Imposter? Hãy chọn 1 người!</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {players.map((p) => {
          const voteCount = votes[p.id] || 0;
          return (
            <button
              key={p.id}
              onClick={() => onVote(p.id)}
              className={`p-4 rounded-3xl border-2 flex items-center justify-between transition-all ${hasVoted ? 'opacity-80 pointer-events-none' : 'active:bg-gray-50'} ${votes[p.id] ? 'border-orange-200 bg-orange-50/30' : 'border-gray-50 bg-white'}`}
            >
              <span className="text-lg font-black">{p.name}</span>
              <div className="flex gap-1">
                {Array.from({ length: voteCount }).map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
                {voteCount > 0 && <span className="text-xs font-black text-red-500 ml-1">{voteCount}</span>}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onLockVotes}
          disabled={hasVoted}
          className={`flex-1 h-14 rounded-2xl font-black text-sm transition-all ${hasVoted ? 'bg-gray-100 text-gray-400' : 'bg-black text-white active:scale-95'}`}
        >
          CHỐT PHIẾU
        </button>
        {hasVoted && (
          <button
            onClick={onShowResult}
            className="flex-[2] h-14 bg-red-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-red-200 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            LẬT MẶT IMPOSTER <ChevronRight size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
};
