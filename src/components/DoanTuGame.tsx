import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Player } from '../types';

type TeamName = string;
type DifficultyMode = 'EASY' | 'HARD';

interface Card {
  keyword: string;
  taboo: string[];
}

const CARD_BANK: Card[] = [
  { keyword: 'Bóng đá', taboo: ['cầu thủ', 'sân cỏ', 'ghi bàn'] },
  { keyword: 'Máy bay', taboo: ['phi công', 'cất cánh', 'hàng không'] },
  { keyword: 'Kem', taboo: ['lạnh', 'ốc quế', 'vani'] },
  { keyword: 'Điện thoại', taboo: ['smartphone', 'màn hình', 'cuộc gọi'] },
  { keyword: 'Mì tôm', taboo: ['gói', 'nước sôi', 'ăn liền'] },
  { keyword: 'Bác sĩ', taboo: ['khám', 'bệnh viện', 'toa thuốc'] },
  { keyword: 'Con mèo', taboo: ['meo meo', 'thú cưng', 'chuột'] },
  { keyword: 'Bánh sinh nhật', taboo: ['nến', 'thổi', 'tiệc'] },
  { keyword: 'Xe đạp', taboo: ['2 bánh', 'đạp', 'yên xe'] },
  { keyword: 'Trường học', taboo: ['giáo viên', 'học sinh', 'lớp học'] },
  { keyword: 'Bắp rang', taboo: ['rạp phim', 'ngô', 'giòn'] },
  { keyword: 'Tủ lạnh', taboo: ['nhà bếp', 'đá', 'mát'] },
  { keyword: 'Cầu vồng', taboo: ['mưa', '7 màu', 'bầu trời'] },
  { keyword: 'Con voi', taboo: ['to lớn', 'vòi', 'châu phi'] },
  { keyword: 'Nón bảo hiểm', taboo: ['xe máy', 'an toàn', 'đội đầu'] },
];

const TEAM_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const TURNS_PER_TEAM = 10;

const shuffle = <T,>(arr: T[]) => {
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

const pickCard = (exclude?: string) => {
  const pool = CARD_BANK.filter((c) => c.keyword !== exclude);
  return pool[Math.floor(Math.random() * pool.length)] || CARD_BANK[0];
};

const playBeep = (freq: number, ms: number, delay = 0) => {
  const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  gain.gain.value = 0.05;
  osc.connect(gain);
  gain.connect(ctx.destination);
  const startAt = ctx.currentTime + delay;
  osc.start(startAt);
  osc.stop(startAt + ms / 1000);
};

const notifyKeywordChange = () => {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') navigator.vibrate(10);
  playBeep(880, 90);
};

const notifyEndTurn = () => {
  playBeep(820, 90, 0);
  playBeep(1000, 90, 0.16);
  playBeep(1180, 120, 0.32);
};

interface TeamInfo {
  name: TeamName;
  members: Player[];
}

const buildTeams = (players: Player[]): TeamInfo[] | null => {
  if (players.length < 2 || players.length % 2 !== 0) return null;

  const kids = shuffle(players.filter((p) => p.isAdult === false));
  const adults = shuffle(players.filter((p) => p.isAdult !== false));

  const teams: TeamInfo[] = [];

  if (kids.length > 0) {
    if (adults.length < kids.length) return null;

    for (let i = 0; i < kids.length; i++) {
      teams.push({ name: '', members: [kids[i], adults[i]] });
    }

    const remainingAdults = adults.slice(kids.length);
    if (remainingAdults.length % 2 !== 0) return null;
    for (let i = 0; i < remainingAdults.length; i += 2) {
      teams.push({ name: '', members: [remainingAdults[i], remainingAdults[i + 1]] });
    }
  } else {
    const all = shuffle(players);
    for (let i = 0; i < all.length; i += 2) {
      teams.push({ name: '', members: [all[i], all[i + 1]] });
    }
  }

  return teams.map((t, idx) => ({ ...t, name: TEAM_LABELS[idx] || `Đ${idx + 1}` }));
};

interface DoanTuSetupProps {
  players: Player[];
  difficulty: DifficultyMode;
  onDifficultyChange: (mode: DifficultyMode) => void;
  onStart: (teams: TeamInfo[]) => void;
}

export const DoanTuSetup: React.FC<DoanTuSetupProps> = ({ players, difficulty, onDifficultyChange, onStart }) => {
  const handleStart = () => {
    const teams = buildTeams(players);
    if (!teams) {
      alert('Cần số người chơi chẵn và đủ điều kiện chia đội (trẻ em ghép với người lớn).');
      return;
    }
    onStart(teams);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="bg-[#1D1D1F] rounded-3xl p-6 shadow-xl text-white">
        <h2 className="text-sm font-black uppercase tracking-wider mb-2">Luật chơi</h2>
        <ul className="space-y-2 text-xs font-bold text-gray-300 leading-relaxed">
          <li>- Chia ngẫu nhiên 2 người/đội (A, B, C...).</li>
          <li>- Nếu có trẻ em: mỗi đội ghép 1 trẻ em + 1 người lớn.</li>
          <li>- Mỗi đội chơi 10 lượt từ khóa rồi chuyển đội tiếp theo.</li>
          <li>- Người chơi của đội đang lượt xem từ; đội khác cầm máy để chấm điểm.</li>
          <li>- Chế độ Dễ: không hiện từ cấm. Chế độ Khó: hiện 3 từ cấm.</li>
        </ul>
      </section>

      <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Chế độ chơi</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onDifficultyChange('EASY')}
            className={`h-12 rounded-xl font-black border-2 ${difficulty === 'EASY' ? 'border-lime-500 bg-lime-50 text-lime-700' : 'border-gray-100 text-gray-500'}`}
          >
            Dễ
          </button>
          <button
            onClick={() => onDifficultyChange('HARD')}
            className={`h-12 rounded-xl font-black border-2 ${difficulty === 'HARD' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-100 text-gray-500'}`}
          >
            Khó
          </button>
        </div>
      </section>

      <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Người chơi hiện tại</p>
        <p className="text-sm font-black text-gray-700">{players.length} người</p>
        <p className="text-xs font-bold text-gray-500 mt-1">Muốn bắt đầu cần số người chơi chẵn.</p>
      </section>

      <button
        onClick={handleStart}
        className="w-full h-16 rounded-[24px] bg-[#B2FF3D] text-gray-900 font-black text-lg border-4 border-white shadow-xl active:scale-95 transition-transform"
      >
        BẮT ĐẦU ĐOÁN TỪ
      </button>
    </motion.div>
  );
};

interface DoanTuPlayProps {
  teams: TeamInfo[];
  difficulty: DifficultyMode;
  onBackToSetup: () => void;
}

export const DoanTuPlay: React.FC<DoanTuPlayProps> = ({ teams, difficulty, onBackToSetup }) => {
  const [teamIdx, setTeamIdx] = useState(0);
  const [turnInTeam, setTurnInTeam] = useState(1);
  const [scores, setScores] = useState<Record<string, number>>(() => Object.fromEntries(teams.map((t) => [t.name, 0])));
  const [card, setCard] = useState<Card>(pickCard());
  const [phase, setPhase] = useState<'PLAY' | 'TEAM_END' | 'FINAL'>('PLAY');

  const team = teams[teamIdx];
  const mainPlayer = team.members[0];

  const goNextCard = () => {
    notifyKeywordChange();
    setCard((prev) => pickCard(prev.keyword));
  };

  const apply = (kind: 'CORRECT' | 'SKIP' | 'FOUL') => {
    if (phase !== 'PLAY') return;
    if (kind === 'CORRECT') setScores((s) => ({ ...s, [team.name]: s[team.name] + 1 }));
    if (kind === 'FOUL') setScores((s) => ({ ...s, [team.name]: s[team.name] - 1 }));

    if (turnInTeam >= TURNS_PER_TEAM) {
      notifyEndTurn();
      setPhase('TEAM_END');
      return;
    }

    setTurnInTeam((v) => v + 1);
    goNextCard();
  };

  const nextTeam = () => {
    if (teamIdx >= teams.length - 1) {
      setPhase('FINAL');
      return;
    }
    setTeamIdx((i) => i + 1);
    setTurnInTeam(1);
    setCard(pickCard());
    setPhase('PLAY');
  };

  const sorted = useMemo(() => [...teams].sort((a, b) => scores[b.name] - scores[a.name]), [teams, scores]);

  if (phase === 'FINAL') {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-black text-gray-900 mb-3">Bảng điểm cuối</h2>
          <div className="space-y-2">
            {sorted.map((t, idx) => (
              <div key={t.name} className="h-12 rounded-xl border border-gray-100 px-4 flex items-center justify-between">
                <span className="text-sm font-black text-gray-700">#{idx + 1} • Đội {t.name} ({t.members.map((m) => m.name).join(' & ')})</span>
                <span className="text-lg font-black text-pink-600">{scores[t.name]}</span>
              </div>
            ))}
          </div>
          <button onClick={onBackToSetup} className="w-full h-12 mt-4 rounded-xl bg-[#B2FF3D] text-gray-900 font-black active:scale-95 transition-transform">
            CHƠI VÁN MỚI
          </button>
        </section>
      </motion.div>
    );
  }

  if (phase === 'TEAM_END') {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
          <h3 className="text-2xl font-black text-gray-900 mb-2">Đội {team.name} hoàn thành 10 lượt</h3>
          <p className="text-sm font-black text-gray-500">Điểm hiện tại: <span className="text-pink-600">{scores[team.name]}</span></p>
          <button onClick={nextTeam} className="w-full h-12 mt-4 rounded-xl bg-gray-900 text-white font-black active:scale-95 transition-transform">
            {teamIdx >= teams.length - 1 ? 'XEM BẢNG ĐIỂM CUỐI' : `ĐẾN ĐỘI ${teams[teamIdx + 1].name}`}
          </button>
        </section>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <section className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Đội đang chơi</p>
            <p className="text-xl font-black text-gray-900">Đội {team.name}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Lượt</p>
            <p className="text-lg font-black text-gray-900">{turnInTeam}/{TURNS_PER_TEAM}</p>
          </div>
        </div>
        <p className="mt-2 text-sm font-black text-gray-600">Người mô tả: <span className="text-blue-600">{mainPlayer.name}</span></p>
        <p className="text-xs font-bold text-gray-500">Đội khác cầm máy để chấm và giơ cho người mô tả xem.</p>
      </section>

      <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">TỪ KHÓA</p>
        <h3 className="text-4xl font-black text-gray-900 mb-4">{card.keyword}</h3>
        {difficulty === 'HARD' && (
          <>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">TỪ CẤM</p>
            <div className="grid grid-cols-1 gap-2">
              {card.taboo.map((w) => (
                <div key={w} className="h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-xs font-black text-red-500">
                  {w}
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <div className="grid grid-cols-3 gap-2">
        <button onClick={() => apply('CORRECT')} className="h-12 rounded-xl bg-lime-500 text-white font-black active:scale-95 transition-transform">ĐÚNG</button>
        <button onClick={() => apply('SKIP')} className="h-12 rounded-xl bg-gray-700 text-white font-black active:scale-95 transition-transform">BỎ QUA</button>
        <button onClick={() => apply('FOUL')} className="h-12 rounded-xl bg-red-500 text-white font-black active:scale-95 transition-transform">PHẠM QUY</button>
      </div>

      <section className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Điểm tạm thời</p>
        <div className="grid grid-cols-2 gap-2">
          {teams.map((t) => (
            <div key={t.name} className="rounded-xl bg-gray-50 border border-gray-100 p-2 text-center">
              <p className="text-[10px] font-black text-gray-500 uppercase">Đội {t.name}</p>
              <p className="text-lg font-black text-pink-600">{scores[t.name]}</p>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};
