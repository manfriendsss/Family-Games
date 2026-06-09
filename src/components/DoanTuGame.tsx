import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Player } from '../types';
import { DOAN_TU_CARDS } from '../data/doanTuCards';

type TeamName = string;
type DifficultyMode = 'EASY' | 'HARD';

interface Card {
  keyword: string;
  taboo: string[];
}

const TEAM_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const TURN_SECONDS = 120;

const shuffle = <T,>(arr: T[]) => {
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
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

  return teams.map((t, idx) => ({ ...t, name: TEAM_LABELS[idx] || `D${idx + 1}` }));
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
      alert('Can so nguoi choi chan va du dieu kien chia doi (tre em ghep voi nguoi lon).');
      return;
    }
    onStart(teams);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="bg-[#1D1D1F] rounded-3xl p-6 shadow-xl text-white">
        <h2 className="text-sm font-black uppercase tracking-wider mb-2">Luat choi</h2>
        <ul className="space-y-2 text-xs font-bold text-gray-300 leading-relaxed">
          <li>- Chia ngau nhien 2 nguoi/doi (A, B, C...).</li>
          <li>- Neu co tre em: moi doi ghep 1 tre em + 1 nguoi lon.</li>
          <li>- Moi doi co 120 giay de doan cang nhieu tu cang tot.</li>
          <li>- Nguoi choi cua doi dang luot xem tu; doi khac cam may de cham diem.</li>
          <li>- Che do De: khong hien tu cam. Che do Kho: hien 3 tu cam.</li>
        </ul>
      </section>

      <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Che do choi</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onDifficultyChange('EASY')}
            className={`h-12 rounded-xl font-black border-2 ${difficulty === 'EASY' ? 'border-lime-500 bg-lime-50 text-lime-700' : 'border-gray-100 text-gray-500'}`}
          >
            De
          </button>
          <button
            onClick={() => onDifficultyChange('HARD')}
            className={`h-12 rounded-xl font-black border-2 ${difficulty === 'HARD' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-100 text-gray-500'}`}
          >
            Kho
          </button>
        </div>
      </section>

      <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nguoi choi hien tai</p>
        <p className="text-sm font-black text-gray-700">{players.length} nguoi</p>
        <p className="text-xs font-black text-pink-600 mt-1">Kho tu hien co: {DOAN_TU_CARDS.length} the</p>
        <p className="text-xs font-bold text-gray-500 mt-1">Muon bat dau can so nguoi choi chan.</p>
      </section>

      <button
        onClick={handleStart}
        className="w-full h-16 rounded-[24px] bg-[#B2FF3D] text-gray-900 font-black text-lg border-4 border-white shadow-xl active:scale-95 transition-transform"
      >
        BAT DAU DOAN TU
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
  const [startTeamIdx] = useState(() => Math.floor(Math.random() * teams.length));
  const playOrder = useMemo(() => teams.map((_, i) => teams[(startTeamIdx + i) % teams.length]), [teams, startTeamIdx]);
  const [orderPos, setOrderPos] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>(() => Object.fromEntries(teams.map((t) => [t.name, 0])));
  const [deck, setDeck] = useState<Card[]>(() => shuffle(DOAN_TU_CARDS));
  const [deckIndex, setDeckIndex] = useState(0);
  const [card, setCard] = useState<Card>(() => shuffle(DOAN_TU_CARDS)[0]);
  const [phase, setPhase] = useState<'OVERVIEW' | 'PLAY' | 'TEAM_END' | 'FINAL'>('OVERVIEW');
  const [timeLeft, setTimeLeft] = useState(TURN_SECONDS);

  const team = playOrder[orderPos];
  const mainPlayer = team.members[0];

  useEffect(() => {
    if (phase !== 'PLAY') return;
    if (timeLeft <= 0) return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, timeLeft]);

  useEffect(() => {
    if (phase === 'PLAY' && timeLeft <= 0) {
      notifyEndTurn();
      setPhase('TEAM_END');
    }
  }, [phase, timeLeft]);

  const goNextCard = () => {
    notifyKeywordChange();
    setDeckIndex((idx) => {
      const next = idx + 1;
      if (next >= deck.length) {
        const reshuffled = shuffle(DOAN_TU_CARDS);
        setDeck(reshuffled);
        setCard(reshuffled[0]);
        return 0;
      }
      setCard(deck[next]);
      return next;
    });
  };

  const apply = (kind: 'CORRECT' | 'SKIP' | 'FOUL') => {
    if (phase !== 'PLAY') return;
    if (kind === 'CORRECT') setScores((s) => ({ ...s, [team.name]: s[team.name] + 1 }));
    if (kind === 'FOUL') setScores((s) => ({ ...s, [team.name]: s[team.name] - 1 }));
    goNextCard();
  };

  const nextTeam = () => {
    if (orderPos >= playOrder.length - 1) {
      setPhase('FINAL');
      return;
    }
    setOrderPos((i) => i + 1);
    setTimeLeft(TURN_SECONDS);
    setPhase('OVERVIEW');
  };

  const sorted = useMemo(() => [...teams].sort((a, b) => scores[b.name] - scores[a.name]), [teams, scores]);

  if (phase === 'FINAL') {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-black text-gray-900 mb-3">Bang diem cuoi</h2>
          <div className="space-y-2">
            {sorted.map((t, idx) => (
              <div key={t.name} className="h-12 rounded-xl border border-gray-100 px-4 flex items-center justify-between">
                <span className="text-sm font-black text-gray-700">#{idx + 1} • Doi {t.name} ({t.members.map((m) => m.name).join(' & ')})</span>
                <span className="text-lg font-black text-pink-600">{scores[t.name]}</span>
              </div>
            ))}
          </div>
          <button onClick={onBackToSetup} className="w-full h-12 mt-4 rounded-xl bg-[#B2FF3D] text-gray-900 font-black active:scale-95 transition-transform">
            CHOI VAN MOI
          </button>
        </section>
      </motion.div>
    );
  }

  if (phase === 'TEAM_END') {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
          <h3 className="text-2xl font-black text-gray-900 mb-2">Doi {team.name} het thoi gian</h3>
          <p className="text-sm font-black text-gray-500">Diem hien tai: <span className="text-pink-600">{scores[team.name]}</span></p>
          <button onClick={nextTeam} className="w-full h-12 mt-4 rounded-xl bg-gray-900 text-white font-black active:scale-95 transition-transform">
            {orderPos >= playOrder.length - 1 ? 'XEM BANG DIEM CUOI' : `DEN DOI ${playOrder[orderPos + 1].name}`}
          </button>
        </section>
      </motion.div>
    );
  }

  if (phase === 'OVERVIEW') {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <section className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Phan doi</p>
          <div className="space-y-2">
            {teams.map((t) => (
              <div key={t.name} className="rounded-xl border border-gray-100 p-3">
                <p className="text-sm font-black text-gray-800">Doi {t.name}</p>
                <p className="text-xs font-bold text-gray-500">{t.members.map((m) => m.name).join(' & ')}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 text-center">
          <p className="text-sm font-black text-gray-600">Doi bat dau: <span className="text-blue-600">Doi {team.name}</span></p>
          <p className="text-xs font-bold text-gray-500 mt-1">Doi {team.name} bam san sang de bat dau luot.</p>
          <button
            onClick={() => {
              setTimeLeft(TURN_SECONDS);
              goNextCard();
              setPhase('PLAY');
            }}
            className="w-full h-12 mt-4 rounded-xl bg-[#B2FF3D] text-gray-900 font-black active:scale-95 transition-transform"
          >
            DOI {team.name} SAN SANG
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
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Doi dang choi</p>
            <p className="text-xl font-black text-gray-900">Doi {team.name}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Thoi gian</p>
            <p className={`text-lg font-black ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-900'}`}>{timeLeft}s</p>
          </div>
        </div>
        <p className="mt-2 text-sm font-black text-gray-600">Nguoi mo ta: <span className="text-blue-600">{mainPlayer.name}</span></p>
        <p className="text-xs font-bold text-gray-500">Doi khac cam may de cham va gio cho nguoi mo ta xem.</p>
      </section>

      <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">TU KHOA</p>
        <h3 className="text-4xl font-black text-gray-900 mb-4">{card.keyword}</h3>
        {difficulty === 'HARD' && (
          <>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">TU CAM</p>
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
        <button onClick={() => apply('CORRECT')} className="h-12 rounded-xl bg-lime-500 text-white font-black active:scale-95 transition-transform">DUNG</button>
        <button onClick={() => apply('SKIP')} className="h-12 rounded-xl bg-gray-700 text-white font-black active:scale-95 transition-transform">BO QUA</button>
        <button onClick={() => apply('FOUL')} className="h-12 rounded-xl bg-red-500 text-white font-black active:scale-95 transition-transform">PHAM QUY</button>
      </div>

      <section className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Diem tam thoi</p>
        <div className="grid grid-cols-2 gap-2">
          {teams.map((t) => (
            <div key={t.name} className="rounded-xl bg-gray-50 border border-gray-100 p-2 text-center">
              <p className="text-[10px] font-black text-gray-500 uppercase">Doi {t.name}</p>
              <p className="text-lg font-black text-pink-600">{scores[t.name]}</p>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};


