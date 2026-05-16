import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';

type Team = 'A' | 'B';

interface Card {
  keyword: string;
  taboo: string[];
}

const CARD_BANK: Card[] = [
  { keyword: 'Bóng đá', taboo: ['cầu thủ', 'sân', 'trái bóng', 'ghi bàn'] },
  { keyword: 'Máy bay', taboo: ['bay', 'phi công', 'hàng không', 'cất cánh'] },
  { keyword: 'Kem', taboo: ['lạnh', 'ăn', 'ốc quế', 'vani'] },
  { keyword: 'Điện thoại', taboo: ['gọi', 'smartphone', 'màn hình', 'app'] },
  { keyword: 'Mì tôm', taboo: ['gói', 'nước sôi', 'ăn liền', 'mì'] },
  { keyword: 'Bác sĩ', taboo: ['bệnh', 'khám', 'bệnh viện', 'áo trắng'] },
  { keyword: 'Con mèo', taboo: ['meo', 'thú cưng', 'chuột', 'lông'] },
  { keyword: 'Bánh sinh nhật', taboo: ['nến', 'thổi', 'tiệc', 'kem'] },
  { keyword: 'Xe đạp', taboo: ['đạp', '2 bánh', 'yên', 'pedal'] },
  { keyword: 'Trường học', taboo: ['học sinh', 'giáo viên', 'lớp', 'bảng'] },
];

const pickRandomCard = (exclude?: string): Card => {
  const pool = CARD_BANK.filter((c) => c.keyword !== exclude);
  return pool[Math.floor(Math.random() * pool.length)] || CARD_BANK[0];
};

interface DoanTuSetupProps {
  turnSeconds: number;
  rounds: number;
  onTurnSecondsChange: (n: number) => void;
  onRoundsChange: (n: number) => void;
  onStart: () => void;
}

export const DoanTuSetup: React.FC<DoanTuSetupProps> = ({
  turnSeconds,
  rounds,
  onTurnSecondsChange,
  onRoundsChange,
  onStart
}) => {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-black text-gray-900 mb-2">Luật chơi Đoán Từ</h2>
        <p className="text-sm font-bold text-gray-500">Mô tả từ khóa để đồng đội đoán, nhưng không được nói các từ cấm.</p>
      </section>

      <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Thời gian mỗi lượt</p>
        <div className="grid grid-cols-3 gap-2">
          {[30, 45, 60].map((s) => (
            <button
              key={s}
              onClick={() => onTurnSecondsChange(s)}
              className={`h-11 rounded-xl font-black text-sm border-2 ${turnSeconds === s ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-gray-100 text-gray-500'}`}
            >
              {s}s
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Số lượt mỗi đội</p>
        <div className="grid grid-cols-3 gap-2">
          {[3, 5, 7].map((r) => (
            <button
              key={r}
              onClick={() => onRoundsChange(r)}
              className={`h-11 rounded-xl font-black text-sm border-2 ${rounds === r ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-gray-100 text-gray-500'}`}
            >
              {r} lượt
            </button>
          ))}
        </div>
      </section>

      <button
        onClick={onStart}
        className="w-full h-16 rounded-[24px] bg-[#B2FF3D] text-gray-900 font-black text-lg border-4 border-white shadow-xl active:scale-95 transition-transform"
      >
        BẮT ĐẦU ĐOÁN TỪ
      </button>
    </motion.div>
  );
};

interface DoanTuPlayProps {
  turnSeconds: number;
  rounds: number;
  onBackToSetup: () => void;
}

export const DoanTuPlay: React.FC<DoanTuPlayProps> = ({ turnSeconds, rounds, onBackToSetup }) => {
  const [teamTurn, setTeamTurn] = useState<Team>('A');
  const [turnIndex, setTurnIndex] = useState(1);
  const [timeLeft, setTimeLeft] = useState(turnSeconds);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [currentCard, setCurrentCard] = useState<Card>(pickRandomCard());
  const [isEnded, setIsEnded] = useState(false);

  const totalTurns = rounds * 2;
  const flatTurnIndex = useMemo(() => (turnIndex - 1) * 2 + (teamTurn === 'A' ? 1 : 2), [turnIndex, teamTurn]);

  const nextCard = () => setCurrentCard((prev) => pickRandomCard(prev.keyword));

  const nextTurn = () => {
    const nextFlat = flatTurnIndex + 1;
    if (nextFlat > totalTurns) {
      setIsEnded(true);
      return;
    }
    if (teamTurn === 'A') setTeamTurn('B');
    else {
      setTeamTurn('A');
      setTurnIndex((v) => v + 1);
    }
    setTimeLeft(turnSeconds);
    nextCard();
  };

  useEffect(() => {
    if (isEnded) return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(id);
          nextTurn();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [teamTurn, turnIndex, isEnded, turnSeconds]);

  const applyResult = (type: 'CORRECT' | 'SKIP' | 'FOUL') => {
    if (isEnded) return;
    if (type === 'CORRECT') teamTurn === 'A' ? setScoreA((s) => s + 1) : setScoreB((s) => s + 1);
    if (type === 'FOUL') teamTurn === 'A' ? setScoreA((s) => s - 1) : setScoreB((s) => s - 1);
    nextCard();
  };

  const winner = scoreA === scoreB ? 'HÒA' : scoreA > scoreB ? 'Đội A' : 'Đội B';

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <section className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Lượt hiện tại</p>
            <p className="text-lg font-black text-gray-900">Đội {teamTurn} • {timeLeft}s</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Vòng</p>
            <p className="font-black text-gray-900">{Math.min(flatTurnIndex, totalTurns)}/{totalTurns}</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-blue-50 p-3 text-center">
            <p className="text-[10px] font-black uppercase text-blue-500">Đội A</p>
            <p className="text-xl font-black text-blue-600">{scoreA}</p>
          </div>
          <div className="rounded-xl bg-pink-50 p-3 text-center">
            <p className="text-[10px] font-black uppercase text-pink-500">Đội B</p>
            <p className="text-xl font-black text-pink-600">{scoreB}</p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">TỪ KHÓA</p>
        <h3 className="text-4xl font-black text-gray-900 mb-4">{currentCard.keyword}</h3>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">TỪ CẤM</p>
        <div className="grid grid-cols-2 gap-2">
          {currentCard.taboo.map((w) => (
            <div key={w} className="h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-xs font-black text-red-500">
              {w}
            </div>
          ))}
        </div>
      </section>

      {!isEnded ? (
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => applyResult('CORRECT')} className="h-12 rounded-xl bg-lime-500 text-white font-black active:scale-95 transition-transform">ĐÚNG</button>
          <button onClick={() => applyResult('SKIP')} className="h-12 rounded-xl bg-gray-700 text-white font-black active:scale-95 transition-transform">BỎ QUA</button>
          <button onClick={() => applyResult('FOUL')} className="h-12 rounded-xl bg-red-500 text-white font-black active:scale-95 transition-transform">PHẠM</button>
        </div>
      ) : (
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center space-y-3">
          <h3 className="text-2xl font-black text-gray-900">Kết thúc</h3>
          <p className="text-sm font-black text-gray-500">Đội thắng: <span className="text-pink-600">{winner}</span></p>
          <button
            onClick={onBackToSetup}
            className="w-full h-12 rounded-xl bg-[#B2FF3D] text-gray-900 font-black active:scale-95 transition-transform"
          >
            CHƠI VÁN MỚI
          </button>
        </section>
      )}
    </motion.div>
  );
};
