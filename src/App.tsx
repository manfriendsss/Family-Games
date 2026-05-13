/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Settings, 
  Play, 
  Trash2, 
  Plus, 
  Check, 
  ChevronRight, 
  Info, 
  RotateCcw,
  Eye,
  EyeOff,
  Pencil,
  Tag,
  Clock,
  ChevronDown,
  Circle,
  Smile,
  Search,
  Ghost,
  Theater,
  Hand,
  User,
  LayoutGrid,
  ArrowLeft
} from 'lucide-react';
import { Player, GameSettings, GameStage, Role, WordPair, Category, GameMode, CharadesSettings, Difficulty } from './types';
import { CATEGORIES, CHARADES_CATEGORIES } from './constants';

export default function App() {
  // Game State
  const [gameMode, setGameMode] = useState<GameMode>('DASHBOARD');
  const [stage, setStage] = useState<GameStage>('DASHBOARD');
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Người chơi 1', isRevealed: false },
    { id: '2', name: 'Người chơi 2', isRevealed: false },
    { id: '3', name: 'Người chơi 3', isRevealed: false },
    { id: '4', name: 'Người chơi 4', isRevealed: false },
  ]);
  const [settings, setSettings] = useState<GameSettings>({
    timeLimit: false,
    imposterCount: 1,
    difficulty: 'EASY',
    selectedCategories: ['objects'],
  });
  const [charadesSettings, setCharadesSettings] = useState<CharadesSettings>({
    selectedCategories: ['actions'],
    timeLimit: true,
    timeSeconds: 60,
    actorId: 'RANDOM',
    mode: 'ACTIONS_AND_HINTS',
  });
  const [currentWordPair, setCurrentWordPair] = useState<WordPair | null>(null);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [talkOrder, setTalkOrder] = useState<string[]>([]);
  const [isPressing, setIsPressing] = useState(false);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [hasVoted, setHasVoted] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showCharadesCategoryPopup, setShowCharadesCategoryPopup] = useState(false);
  const [currentCharadesWord, setCurrentCharadesWord] = useState<string>('');
  const [currentActor, setCurrentActor] = useState<Player | null>(null);

  // Difficulty Logic based on age
  const getGameConditions = () => {
    const total = players.length;
    const adults = players.filter(p => (p.age || 0) >= 15).length;
    const children = players.filter(p => p.age && p.age < 15).length;
    
    // Default if no ages are set
    if (players.every(p => !p.age)) return { difficulty: 'EASY' as Difficulty, mode: 'NORMAL' };
    
    if (children === total) return { difficulty: 'VERY_EASY' as Difficulty, mode: 'KIDS_ONLY' };
    if (adults === total) return { difficulty: 'HARD' as Difficulty, mode: 'ADULTS_ONLY' };
    if (children > 0 && adults > 0) return { difficulty: 'EASY' as Difficulty, mode: 'MIXED' };
    
    return { difficulty: 'EASY' as Difficulty, mode: 'NORMAL' };
  };

  // Helpers
  const addPlayer = () => {
    if (!newPlayerName.trim()) return;
    const newId = String(Date.now());
    setPlayers([...players, { id: newId, name: newPlayerName.trim(), isRevealed: false }]);
    setNewPlayerName('');
  };

  const removePlayer = (id: string) => {
    if (players.length <= 3) return;
    setPlayers(players.filter(p => p.id !== id));
  };

  const updatePlayerName = (id: string, name: string) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name } : p));
  };

  const updatePlayerAge = (id: string, age: number) => {
    setPlayers(players.map(p => p.id === id ? { ...p, age } : p));
  };

  const toggleCategory = (id: string) => {
    setSettings(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(id)
        ? prev.selectedCategories.filter(c => c !== id)
        : [...prev.selectedCategories, id]
    }));
  };

  const toggleCharadesCategory = (id: string) => {
    setCharadesSettings(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(id)
        ? prev.selectedCategories.filter(c => c !== id)
        : [...prev.selectedCategories, id]
    }));
  };

  const initiateGame = (overrideSettings?: GameSettings) => {
    const currentSettings = overrideSettings || settings;
    if (currentSettings.selectedCategories.length === 0) return;

    const { difficulty: autoDifficulty, mode } = getGameConditions();
    const effectiveDifficulty = overrideSettings ? currentSettings.difficulty : autoDifficulty;

    // 1. Pick a random category and word pair
    const targetCats = currentSettings.selectedCategories;
    const randomCatId = targetCats[Math.floor(Math.random() * targetCats.length)];
    const category = CATEGORIES.find(c => c.id === randomCatId);
    if (!category) return;

    // Filter pairs by difficulty
    let availablePairs = category.pairs.filter(p => p.difficulty === effectiveDifficulty);
    if (availablePairs.length === 0) availablePairs = category.pairs;
    
    const wordPair = availablePairs[Math.floor(Math.random() * availablePairs.length)];
    setCurrentWordPair(wordPair);

    // 2. Assign Roles
    let newPlayers = [...players].map(p => ({ ...p, isRevealed: false, role: 'CITIZEN' as Role }));
    
    // If MIXED mode, reduce imposter chance for children
    let imposterCandidates = [...newPlayers];
    if (mode === 'MIXED') {
        const adults = newPlayers.filter(p => (p.age || 0) >= 15);
        const kids = newPlayers.filter(p => p.age && p.age < 15);
        // Reduce weight for kids (e.g., adult is 3x more likely to be imposter)
        const weightedPool: Player[] = [];
        adults.forEach(p => { for(let i=0; i<3; i++) weightedPool.push(p); });
        kids.forEach(p => weightedPool.push(p));
        
        const count = Math.min(currentSettings.imposterCount, newPlayers.length - 1);
        for (let i = 0; i < count; i++) {
            if (weightedPool.length === 0) break;
            const chosen = weightedPool[Math.floor(Math.random() * weightedPool.length)];
            const pIdx = newPlayers.findIndex(p => p.id === chosen.id);
            if (pIdx !== -1 && newPlayers[pIdx].role !== 'IMPOSTER') {
                newPlayers[pIdx].role = 'IMPOSTER';
                // Remove all instances of this player from pool
                for(let j=weightedPool.length-1; j>=0; j--) {
                    if (weightedPool[j].id === chosen.id) weightedPool.splice(j, 1);
                }
            } else {
                i--; // try again
            }
        }
    } else {
        const shuffledIdx = Array.from({ length: newPlayers.length }, (_, i) => i).sort(() => Math.random() - 0.5);
        for (let i = 0; i < Math.min(currentSettings.imposterCount, newPlayers.length - 1); i++) {
            newPlayers[shuffledIdx[i]].role = 'IMPOSTER';
        }
    }

    // 3. Assign Words
    newPlayers = newPlayers.map(p => ({
      ...p,
      word: p.role === 'CITIZEN' 
        ? wordPair.citizen 
        : (effectiveDifficulty === 'HARD' ? 'Bạn không có gợi ý' : wordPair.imposter_hint)
    }));

    setPlayers(newPlayers);

    // 4. Calculate Talk Order (Imposter NEVER speaks first, Kids NEVER speak first in Mixed mode)
    let order = [...newPlayers].sort(() => Math.random() - 0.5);
    
    const isInvalidFirstSpeaker = (p: typeof newPlayers[0]) => {
        if (p.role === 'IMPOSTER') return true;
        if (mode === 'MIXED' && p.age && p.age < 15) return true;
        return false;
    };

    if (isInvalidFirstSpeaker(order[0])) {
      const validFirstIdx = order.findIndex(p => !isInvalidFirstSpeaker(p));
      if (validFirstIdx !== -1) {
        [order[0], order[validFirstIdx]] = [order[validFirstIdx], order[0]];
      }
    }
    setTalkOrder(order.map(p => p.id));

    setStage('REVEAL');
    setActivePlayerIndex(0);
    setIsPressing(false);
  };

  const startGameLogic = () => initiateGame();

  const startQuickMode = () => {
    const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)].id;
    const quickSettings: GameSettings = {
      timeLimit: true,
      imposterCount: 1,
      difficulty: 'EASY',
      selectedCategories: [randomCategory],
    };
    setSettings(quickSettings);
    initiateGame(quickSettings);
  };

  const resetGame = () => {
    if (gameMode === 'IMPOSTER') {
      setStage('SETUP');
    } else if (gameMode === 'CHARADES') {
      setStage('CHARADES_SETUP');
    } else {
      setStage('DASHBOARD');
    }
    setPlayers(players.map(p => ({ ...p, isRevealed: false, role: undefined, word: undefined })));
    setVotes({});
    setHasVoted(false);
  };

  const backToDashboard = () => {
    setGameMode('DASHBOARD');
    setStage('DASHBOARD');
  };

  const goToImposterSetup = () => {
    setGameMode('IMPOSTER');
    setStage('SETUP');
  };

  const goToCharadesSetup = () => {
    setGameMode('CHARADES');
    setStage('CHARADES_SETUP');
  };

  const initiateCharades = () => {
    if (charadesSettings.selectedCategories.length === 0) return;

    const { difficulty: effectiveDifficulty } = getGameConditions();

    // 1. Pick a random word
    const randomCatId = charadesSettings.selectedCategories[Math.floor(Math.random() * charadesSettings.selectedCategories.length)];
    const category = CHARADES_CATEGORIES.find(c => c.id === randomCatId) || CATEGORIES.find(c => c.id === randomCatId);
    if (!category) return;
    
    // Filter pairs by difficulty
    let availablePairs = category.pairs.filter(p => p.difficulty === effectiveDifficulty);
    if (availablePairs.length === 0) availablePairs = category.pairs;
    
    const pair = availablePairs[Math.floor(Math.random() * availablePairs.length)];
    // In Charades, we just use the 'citizen' word as the target
    setCurrentCharadesWord(pair.citizen);

    // 2. Pick Actor
    if (charadesSettings.actorId === 'RANDOM') {
      const randomActor = players[Math.floor(Math.random() * players.length)];
      setCurrentActor(randomActor);
    } else {
      const selectedActor = players.find(p => p.id === charadesSettings.actorId);
      setCurrentActor(selectedActor || players[0]);
    }

    setStage('REVEAL');
    setActivePlayerIndex(0);
  };

  const nextReveal = () => {
    if (activePlayerIndex < players.length - 1) {
      setActivePlayerIndex(activePlayerIndex + 1);
      setIsPressing(false);
    } else {
      setStage('DISCUSSION');
    }
  };

  const getPlayerIcon = (idx: number) => {
    const colors = [
      'bg-green-100 text-green-600',
      'bg-blue-100 text-blue-600',
      'bg-yellow-100 text-yellow-600',
      'bg-blue-200 text-blue-800',
      'bg-red-100 text-red-600',
      'bg-teal-100 text-teal-600',
    ];
    return colors[idx % colors.length];
  };

  return (
    <div className="min-h-screen bg-[#F5F7F9] text-[#1D1D1F] font-sans p-4 md:p-8 flex justify-center pb-24">
      <div className="w-full max-w-lg flex flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col items-center mb-4 pt-4">
          <div className="w-full flex justify-between items-center mb-2 px-2">
             {stage !== 'DASHBOARD' ? (
                <button 
                  onClick={backToDashboard}
                  className="w-10 h-10 flex items-center justify-center text-gray-900 active:scale-95 transition-all"
                >
                  <ArrowLeft size={28} />
                </button>
             ) : <div className="w-10" />}
             
             <div className="relative w-full max-w-[140px]">
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full flex items-center justify-center"
                >
                    <img 
                      src={gameMode === 'CHARADES' ? '/input_file_2.png' : '/input_file_1.png'} 
                      alt="Logo" 
                      className={`w-full h-auto ${gameMode === 'CHARADES' ? 'scale-150' : 'drop-shadow-xl'}`}
                      referrerPolicy="no-referrer"
                    />
                </motion.div>
             </div>
             <div className="w-10" />
          </div>
          
          {stage === 'DASHBOARD' ? (
            <h1 className="text-3xl font-black tracking-tight text-center leading-tight text-gray-900 -mt-6">
              <span className="text-[#65A30D]">Game</span> Hub
            </h1>
          ) : gameMode === 'CHARADES' ? (
            <div className="text-center mt-2">
              <h1 className="text-3xl font-black tracking-tight uppercase leading-none">
                CHARADES <span className="text-[#65A30D]">SETUP</span>
              </h1>
              <p className="text-gray-500 font-bold mt-1">Cài đặt ván Charades</p>
            </div>
          ) : (
            <h1 className="text-3xl font-black tracking-tight text-center leading-tight text-gray-900 -mt-6">
              Ai là người <span className="text-[#65A30D]">giả mạo?</span>
            </h1>
          )}
        </header>

        <main className="space-y-6 pb-32">
          <AnimatePresence mode="wait">
            {stage === 'DASHBOARD' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                {/* Players Card in Dashboard */}
                <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="mt-1">
                      <div className="w-10 h-10 bg-lime-100 rounded-2xl flex items-center justify-center">
                        <Users size={20} className="text-[#65A30D]" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-black text-gray-900 leading-none mb-1 uppercase tracking-tight">Người chơi</h2>
                      <p className="text-[13px] text-gray-400 font-bold">Nhấn vào tên để nhập tuổi (để tự điều chỉnh độ khó)</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-6">
                    <input
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                      className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-lime-200 outline-none transition-all placeholder:text-gray-300"
                      placeholder="Thêm người chơi mới..."
                    />
                    <button 
                      onClick={addPlayer}
                      className="w-12 h-12 bg-[#65A30D] text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-lime-600 active:scale-95 transition-all"
                    >
                      <Plus size={24} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <AnimatePresence initial={false}>
                      {players.map((player, idx) => {
                        const isExpanded = expandedPlayerId === player.id;
                        return (
                          <motion.div 
                            key={player.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={`rounded-2xl border transition-all overflow-hidden ${
                              isExpanded ? 'border-lime-200 shadow-sm bg-lime-50/20' : 'border-gray-50 bg-white'
                            }`}
                          >
                            <div className="flex items-center p-3 gap-3 cursor-pointer" onClick={() => setExpandedPlayerId(isExpanded ? null : player.id)}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getPlayerIcon(idx)}`}>
                                <Smile size={16} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-black text-gray-900">{player.name}</p>
                                {player.age && (
                                  <p className="text-[10px] text-[#65A30D] font-black uppercase">
                                    {player.age} tuổi • {player.age >= 15 ? 'Người lớn' : 'Trẻ em'}
                                  </p>
                                )}
                              </div>
                              <button 
                                  onClick={(e) => { e.stopPropagation(); removePlayer(player.id); }}
                                  className="p-2 text-gray-200 hover:text-red-500 transition-colors"
                               >
                                  <Trash2 size={16} />
                               </button>
                            </div>

                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="px-3 pb-3 border-t border-gray-50 pt-2"
                                >
                                  <div className="space-y-3">
                                    <div>
                                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Đổi biệt danh</label>
                                      <input
                                        value={player.name}
                                        onChange={(e) => updatePlayerName(player.id, e.target.value)}
                                        className="w-full bg-white border border-gray-100 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-lime-200"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Tuổi (Không bắt buộc)</label>
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="number"
                                          placeholder="Vd: 25"
                                          value={player.age || ''}
                                          onChange={(e) => updatePlayerAge(player.id, e.target.value ? Number(e.target.value) : 0)}
                                          className="flex-1 bg-white border border-gray-100 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-lime-200"
                                        />
                                        <span className="text-[10px] font-black text-gray-400 uppercase">Tuổi</span>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Độ khó hiện tại:</p>
                     <div className="px-3 py-1 bg-lime-100 rounded-full">
                        <span className="text-[10px] font-black text-[#65A30D] uppercase">
                          {getGameConditions().difficulty === 'VERY_EASY' ? 'Dễ (Dành cho trẻ em)' : 
                           getGameConditions().difficulty === 'EASY' ? 'Trung bình (Cả nhà cùng chơi)' : 
                           'Khó (Dành cho người lớn)'}
                        </span>
                     </div>
                  </div>
                </section>

                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={goToImposterSetup}
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
                    onClick={goToCharadesSetup}
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
              </motion.div>
            )}

            {stage === 'SETUP' && (
              <motion.div 
                key="setup"
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
                  onClick={startQuickMode}
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
                    <ChevronRight size={20} strokeWidth={3} />
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
                          onClick={() => toggleCategory(cat.id)}
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
                      onClick={() => setShowAllCategories(true)}
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
                          onClick={() => setSettings({ ...settings, timeLimit: !settings.timeLimit })}
                          className={`w-14 h-8 rounded-full p-1 transition-colors relative ${settings.timeLimit ? 'bg-lime-500' : 'bg-gray-200'}`}
                        >
                          <motion.div 
                            animate={{ x: settings.timeLimit ? 24 : 0 }}
                            className="w-6 h-6 bg-white rounded-full shadow-sm" 
                          />
                        </button>
                    </div>
                    {settings.timeLimit && (
                      <div className="relative">
                        <select className="w-full bg-[#F5F5F7] border-none rounded-xl p-4 pr-10 text-sm font-bold appearance-none outline-none focus:ring-2 ring-lime-200">
                          <option>5 phút</option>
                          <option>3 phút</option>
                          <option>1 phút</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    )}
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
                          onChange={(e) => setSettings({ ...settings, imposterCount: Number(e.target.value) })}
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
                            onClick={() => setSettings({ ...settings, difficulty: mode })}
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
            )}

            {stage === 'CHARADES_SETUP' && (
              <motion.div 
                key="charades-setup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Category Card */}
                <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
                  <div className="flex items-center justify-between mb-6 px-1">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-full border border-yellow-100 flex items-center justify-center text-2xl shadow-sm text-yellow-500">
                        🎬
                      </div>
                      <div>
                        <h2 className="text-lg font-black text-gray-900 leading-none mb-1 uppercase tracking-tight">Danh mục Charades</h2>
                        <p className="text-[13px] text-gray-400 font-bold">Chọn 1 hoặc nhiều chủ đề để chơi</p>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-300" size={20} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-2">
                    {CHARADES_CATEGORIES.map(cat => {
                      const isSelected = charadesSettings.selectedCategories.includes(cat.id);
                      const nameParts = cat.name.split(' ');
                      return (
                        <button
                          key={cat.id}
                          onClick={() => toggleCharadesCategory(cat.id)}
                          className={`flex items-center p-3 rounded-2xl border-2 transition-all group active:scale-95 text-left ${
                            isSelected ? 'border-[#65A30D] bg-lime-50/20' : 'border-gray-50 bg-white'
                          }`}
                        >
                          <span className={`text-2xl mr-3 transition-transform group-hover:scale-110 ${isSelected ? 'grayscale-0' : 'grayscale opacity-50'}`}>
                            {cat.icon}
                          </span>
                          <div className="flex flex-col text-left flex-1 min-w-0">
                            <span className={`text-xs font-black truncate uppercase leading-none ${isSelected ? 'text-gray-900' : 'text-gray-400'}`}>
                              {nameParts[0]}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold block truncate mt-0.5">
                               {nameParts.length > 1 ? nameParts[1] : 'thú vị'}
                            </span>
                          </div>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all shrink-0 ml-2 ${
                            isSelected ? 'bg-[#65A30D] text-white' : 'border-2 border-gray-100'
                          }`}>
                            {isSelected && <Check size={12} strokeWidth={4} />}
                          </div>
                        </button>
                      );
                    })}
                    <button 
                      onClick={() => setShowCharadesCategoryPopup(true)}
                      className="flex items-center p-3 rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/30 group hover:bg-gray-100/50 transition-all active:scale-95"
                    >
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm mr-3 group-hover:bg-[#65A30D] group-hover:text-white transition-all">
                        <Plus size={16} />
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thêm</span>
                    </button>
                  </div>
                </section>

                {/* Time Limit Card */}
                <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full border border-yellow-100 flex items-center justify-center text-2xl shadow-sm">
                          <Clock className="text-yellow-500" size={24} />
                        </div>
                        <div>
                          <h2 className="text-lg font-black text-gray-900 leading-none uppercase">Giới hạn thời gian</h2>
                          <p className="text-[13px] text-gray-400 font-bold">Bật để giới hạn thời gian diễn tả</p>
                        </div>
                     </div>
                      <button 
                        onClick={() => setCharadesSettings({ ...charadesSettings, timeLimit: !charadesSettings.timeLimit })}
                        className={`w-12 h-7 rounded-full p-1 transition-colors relative ${charadesSettings.timeLimit ? 'bg-[#65A30D]' : 'bg-gray-200'}`}
                      >
                        <motion.div 
                          animate={{ x: charadesSettings.timeLimit ? 20 : 0 }}
                          className="w-5 h-5 bg-white rounded-full shadow-sm" 
                        />
                      </button>
                  </div>

                  {charadesSettings.timeLimit && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center px-1">
                        <h3 className="text-sm font-black text-gray-900">Thời gian mỗi lượt</h3>
                        <div className="relative">
                          <select 
                            value={charadesSettings.timeSeconds}
                            onChange={(e) => setCharadesSettings({ ...charadesSettings, timeSeconds: Number(e.target.value) })}
                            className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 pr-10 text-sm font-black appearance-none outline-none"
                          >
                            <option value={30}>30 giây</option>
                            <option value={60}>60 giây</option>
                            <option value={90}>90 giây</option>
                            <option value={120}>120 giây</option>
                          </select>
                          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      
                      <div className="relative pt-2 px-1">
                        <input 
                          type="range"
                          min="15"
                          max="120"
                          step="5"
                          value={charadesSettings.timeSeconds}
                          onChange={(e) => setCharadesSettings({ ...charadesSettings, timeSeconds: Number(e.target.value) })}
                          className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#65A30D]"
                        />
                        <div className="flex justify-between mt-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">15 giây</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">120 giây</span>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* Actor Selection Card */}
                <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full border border-blue-100 flex items-center justify-center text-xl shadow-sm">
                      <User className="text-blue-500" size={24} />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-gray-900 leading-none uppercase">Người diễn (Actor)</h2>
                      <p className="text-[13px] text-gray-400 font-bold">Chọn người sẽ diễn tả trong lượt này</p>
                    </div>
                  </div>

                  <div className="relative min-w-[140px]">
                    <select 
                      value={charadesSettings.actorId}
                      onChange={(e) => setCharadesSettings({ ...charadesSettings, actorId: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 pr-10 text-sm font-black appearance-none outline-none"
                    >
                      <option value="RANDOM">Ngẫu nhiên</option>
                      {players.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </section>

                {/* Mode Selection Card */}
                <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full border border-orange-100 flex items-center justify-center text-xl shadow-sm">
                      <Hand className="text-orange-500" size={24} />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-gray-900 leading-none uppercase">Chế độ diễn tả</h2>
                      <p className="text-[13px] text-gray-400 font-bold">Chọn cách diễn tả cho người diễn</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-1">
                    {[
                      { id: 'ACTIONS_AND_HINTS', name: 'Hành động & Gợi ý', desc: '(Hành động có thể dùng lời nói gợi ý nhẹ)' },
                      { id: 'ACTIONS_ONLY', name: 'Chỉ Hành động', desc: '(Im lặng)' }
                    ].map(mode => (
                      <button
                        key={mode.id}
                        onClick={() => setCharadesSettings({ ...charadesSettings, mode: mode.id as any })}
                        className="w-full flex items-start gap-4 text-left group"
                      >
                         <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          charadesSettings.mode === mode.id ? 'border-[#65A30D] bg-white' : 'border-gray-200'
                        }`}>
                           {charadesSettings.mode === mode.id && <div className="w-3 h-3 bg-[#65A30D] rounded-full" />}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900">{mode.name}</p>
                          <p className="text-[12px] text-gray-400 font-bold">{mode.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Popup for categories */}
                <AnimatePresence>
                  {showCharadesCategoryPopup && (
                    <motion.div 
                      key="charades-popup"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
                    >
                      <div 
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm" 
                        onClick={() => setShowCharadesCategoryPopup(false)}
                      />
                      <motion.div 
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative z-10"
                      >
                         <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <h2 className="text-xl font-black text-gray-900 uppercase">Chọn chủ đề Charades</h2>
                            <button 
                              onClick={() => setShowCharadesCategoryPopup(false)}
                              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
                            >
                              <Plus size={20} className="rotate-45" />
                            </button>
                         </div>
                         <div className="p-4 max-h-[60vh] overflow-y-auto grid grid-cols-1 gap-2">
                            {CHARADES_CATEGORIES.map(cat => {
                              const isSelected = charadesSettings.selectedCategories.includes(cat.id);
                              return (
                                <button
                                  key={cat.id}
                                  onClick={() => toggleCharadesCategory(cat.id)}
                                  className={`flex items-center p-4 rounded-2xl border-2 transition-all ${
                                    isSelected ? 'border-lime-500 bg-lime-50' : 'border-gray-50 bg-white'
                                  }`}
                                >
                                  <span className="text-3xl mr-4">{cat.icon}</span>
                                  <span className="flex-1 text-left font-bold text-gray-900">{cat.name}</span>
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                    isSelected ? 'bg-lime-500 text-white' : 'border-2 border-gray-100'
                                  }`}>
                                    {isSelected && <Check size={14} strokeWidth={4} />}
                                  </div>
                                </button>
                              );
                            })}
                         </div>
                         <div className="p-6 pt-0">
                            <button 
                              onClick={() => setShowCharadesCategoryPopup(false)}
                              className="w-full h-14 bg-black text-white rounded-2xl font-black shadow-lg"
                            >
                              XÁC NHẬN
                            </button>
                          </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {stage === 'REVEAL' && (
              <motion.div 
                key={gameMode === 'CHARADES' ? 'reveal-charades' : `reveal-${activePlayerIndex}`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                className="space-y-8 py-4"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-black text-gray-900">
                    {gameMode === 'CHARADES' ? 'TẤT CẢ NGOÀI NGƯỜI ĐOÁN' : players[activePlayerIndex].name}
                  </h2>
                  <p className="text-sm font-bold text-[#65A30D] uppercase tracking-[0.2em] bg-lime-50 inline-block px-4 py-1 rounded-full">
                    {gameMode === 'CHARADES' ? 'HÃY XEM TỪ KHÓA' : 'Lượt của bạn'}
                  </p>
                </div>

                <div className="relative aspect-[3/4.2] max-w-[300px] mx-auto">
                  <motion.div
                    onPointerDown={() => setIsPressing(true)}
                    onPointerUp={() => setIsPressing(false)}
                    onPointerLeave={() => setIsPressing(false)}
                    className="w-full h-full relative cursor-none select-none touch-none"
                  >
                    <AnimatePresence mode="wait">
                      {!isPressing ? (
                        <motion.div
                          key="cover"
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 1.1, opacity: 0 }}
                          className={`absolute inset-0 rounded-[48px] shadow-2xl flex flex-col items-center justify-center p-8 border-[12px] border-white group ${gameMode === 'CHARADES' ? 'bg-blue-600' : 'bg-[#65A30D]'}`}
                        >
                          <motion.div 
                            animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2.5 }}
                            className="bg-white/20 p-8 rounded-full mb-8 backdrop-blur-sm border border-white/30"
                          >
                            <Eye size={56} className="text-white" />
                          </motion.div>
                          <div className="space-y-3 text-center">
                            <p className="text-white font-black text-2xl leading-tight tracking-tight uppercase">Ấn giữ để xem</p>
                            <p className="text-white/60 font-bold text-xs uppercase tracking-widest leading-none">Tuyệt đối bí mật</p>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="word"
                          initial={{ scale: 1.1, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          className={`absolute inset-0 bg-white rounded-[48px] shadow-inner flex flex-col items-center justify-center p-8 border-4 ring-8 ${gameMode === 'CHARADES' ? 'border-blue-600 ring-blue-50' : 'border-[#65A30D] ring-lime-100'}`}
                        >
                          <div className={`font-black text-xs uppercase tracking-[0.3em] mb-6 opacity-60 ${gameMode === 'CHARADES' ? 'text-blue-600' : 'text-[#65A30D]'}`}>Từ khóa bí mật</div>
                          <motion.div 
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            className={`text-5xl font-black text-gray-900 border-b-8 pb-4 mb-8 ${gameMode === 'CHARADES' ? 'border-blue-400' : 'border-lime-400'}`}
                          >
                            {gameMode === 'CHARADES' ? currentCharadesWord : players[activePlayerIndex].word}
                          </motion.div>
                          {gameMode === 'CHARADES' && currentActor && (
                            <div className="text-center mb-4">
                               <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Người đoán</p>
                               <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-black">{currentActor.name}</span>
                            </div>
                          )}
                          <div className="flex flex-col items-center gap-2 opacity-30">
                            <EyeOff size={32} className="text-gray-400" />
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Đừng để người đoán thấy</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                <div className="pt-6 flex justify-center">
                  <button
                    onClick={() => {
                      if (gameMode === 'CHARADES') {
                        setStage('DISCUSSION'); // Go to discussion/play mode
                      } else {
                        nextReveal();
                      }
                    }}
                    className="w-full max-w-[300px] h-16 bg-gray-900 text-white rounded-[24px] font-black text-lg shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 border-4 border-white"
                  >
                    XONG, BẮT ĐẦU <ChevronRight size={22} strokeWidth={3} />
                  </button>
                </div>
              </motion.div>
            )}

            {stage === 'DISCUSSION' && (
              <motion.div 
                key="discussion"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 text-center">
                  <h2 className="text-2xl font-black mb-1 text-lime-600">{gameMode === 'CHARADES' ? '🎮 Đang chơi Charades' : '🗣️ Thảo luận'}</h2>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{gameMode === 'CHARADES' ? 'Mọi người hãy diễn tả!' : 'Điểm danh theo thứ tự'}</p>
                </div>

                {gameMode === 'CHARADES' && (
                   <div className="bg-blue-600 rounded-[32px] p-8 text-white text-center shadow-2xl space-y-4">
                      <div className="flex flex-col items-center gap-2">
                        <Theater size={48} className="text-white/40" />
                        <div className="text-xs font-black uppercase tracking-widest opacity-70">Từ khóa cần đoán</div>
                        <div className="text-4xl font-black">{currentCharadesWord}</div>
                      </div>
                      
                      <div className="pt-4 border-t border-white/20">
                         <div className="flex items-center justify-center gap-4">
                            <div className="text-left">
                               <p className="text-[10px] font-black uppercase opacity-60">Người đoán</p>
                               <p className="text-lg font-black">{currentActor?.name}</p>
                            </div>
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                               <User size={20} />
                            </div>
                         </div>
                      </div>
                   </div>
                )}

                {gameMode === 'IMPOSTER' && (
                  <div className="space-y-2">
                    {talkOrder.map((pid, idx) => {
                      const p = players.find(player => player.id === pid);
                      const isFirst = idx === 0;
                      return (
                        <motion.div 
                          key={pid}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`p-4 rounded-3xl border flex items-center justify-between transition-all ${
                            isFirst 
                            ? 'bg-[#B2FF3D] border-[#B2FF3D] shadow-lg shadow-lime-100' 
                            : 'bg-white border-gray-50 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                              isFirst ? 'bg-black text-white' : 'bg-[#F2F2F7] text-gray-400'
                            }`}>
                              {idx + 1}
                            </div>
                            <span className={`text-lg font-black ${isFirst ? 'text-black' : ''}`}>{p?.name}</span>
                          </div>
                          {isFirst && (
                            <span className="text-[10px] font-black uppercase text-black bg-white/30 px-2 py-1 rounded-lg">
                              Mở màn
                            </span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 space-y-4">
                  <div className="flex items-center gap-2 text-lime-600 font-black text-sm">
                    <Info size={16} /> {gameMode === 'CHARADES' ? 'HƯỚNG DẪN' : 'QUY TẮC CHƠI'}
                  </div>
                  <ul className="space-y-3">
                    {(gameMode === 'CHARADES' 
                      ? [
                          `Người đoán (${currentActor?.name}) tuyệt đối không được nhìn màn hình.`,
                          charadesSettings.mode === 'ACTIONS_ONLY' ? 'Chỉ được dùng hành động, không được nói.' : 'Có thể dùng hành động và lời nói gợi ý (không nói từ khóa).',
                          'Nhấn Kết thúc khi người đoán đã tìm ra từ khóa hoặc hết thời gian.'
                        ]
                      : [
                          'Mô tả từ khóa của mình nhưng đừng quá lộ liễu.',
                          'Lắng nghe xem ai là người có từ khóa "khác biệt".',
                          'Kết thúc lượt nói, hãy vote cho người bạn nghi là Imposter.'
                        ]
                    ).map((rule, i) => (
                      <li key={i} className="flex gap-3 text-xs leading-relaxed font-medium text-gray-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-lime-400 mt-1.5 shrink-0" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                        if (gameMode === 'CHARADES') {
                            resetGame();
                        } else {
                            setStage('VOTING');
                        }
                    }}
                    className={`w-full h-16 rounded-[24px] font-black text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 ${
                        gameMode === 'CHARADES' ? 'bg-black text-white' : 'bg-lime-400 text-black shadow-lime-200/50'
                    }`}
                  >
                    {gameMode === 'CHARADES' ? '🎉 KẾT THÚC VÒNG CHƠI' : '🚀 BẮT ĐẦU BÌNH CHỌN'}
                  </button>
                </div>
              </motion.div>
            )}

            {stage === 'VOTING' && (
              <motion.div 
                key="voting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
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
                        onClick={() => {
                          if (hasVoted) return;
                          setVotes(prev => ({ ...prev, [p.id]: (prev[p.id] || 0) + 1 }));
                        }}
                        className={`p-4 rounded-3xl border-2 flex items-center justify-between transition-all ${
                          hasVoted ? 'opacity-80 pointer-events-none' : 'active:bg-gray-50'
                        } ${votes[p.id] ? 'border-orange-200 bg-orange-50/30' : 'border-gray-50 bg-white'}`}
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
                    onClick={() => {
                        setHasVoted(true);
                    }}
                    disabled={hasVoted}
                    className={`flex-1 h-14 rounded-2xl font-black text-sm transition-all ${
                        hasVoted ? 'bg-gray-100 text-gray-400' : 'bg-black text-white active:scale-95'
                    }`}
                  >
                    CHỐT PHIẾU
                  </button>
                  {hasVoted && (
                    <button
                        onClick={() => setStage('RESULT')}
                        className="flex-[2] h-14 bg-red-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-red-200 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        LẬT MẶT IMPOSTER <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {stage === 'RESULT' && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 text-center">
                  <h2 className="text-2xl font-black mb-1">🎭 Kết quả</h2>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Kẻ giả mạo đã lộ diện</p>
                </div>

                <div className="bg-blue-600 rounded-[32px] p-8 text-white text-center shadow-2xl space-y-4">
                  <div className="text-xs font-black uppercase tracking-widest opacity-70">Từ khóa của Citizen</div>
                  <div className="text-4xl font-black">{currentWordPair?.citizen}</div>
                  <hr className="border-white/20" />
                  <div className="text-xs font-black uppercase tracking-widest opacity-70">Từ khóa của Imposter</div>
                  <div className="text-4xl font-black">{settings.difficulty === 'EASY' ? currentWordPair?.imposter_hint : 'Không có gợi ý'}</div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest px-4">Danh sách Imposter</p>
                  {players.filter(p => p.role === 'IMPOSTER').map(p => (
                    <div key={p.id} className="bg-white border border-red-100 p-5 rounded-[24px] flex items-center gap-4 shadow-sm">
                      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl">
                        😈
                      </div>
                      <div>
                        <div className="text-lg font-black">{p.name}</div>
                        <div className="text-xs font-bold text-red-400 uppercase">Kẻ giả mạo</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={resetGame}
                  className="w-full h-16 bg-black text-white rounded-[24px] font-black text-lg shadow-lg active:scale-95 transition-transform mt-8"
                >
                   CHƠI VÁN MỚI
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer Buttons */}
        {stage === 'DASHBOARD' ? null : (
          <footer className="fixed bottom-6 left-4 right-4 z-40 max-w-lg mx-auto">
            {stage === 'SETUP' || stage === 'CHARADES_SETUP' ? (
              <button
                onClick={stage === 'SETUP' ? startGameLogic : initiateCharades}
                className={`w-full h-18 rounded-[24px] text-gray-900 font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 border-4 border-white ${
                  stage === 'CHARADES_SETUP' ? 'bg-[#B2FF3D] shadow-lime-200/50' : 'bg-[#B2FF3D] shadow-lime-200/50'
                }`}
              >
                <Play size={24} fill="currentColor" /> BẮT ĐẦU VÒNG {stage === 'CHARADES_SETUP' ? 'CHARADES' : 'GAME'}
              </button>
            ) : (
              <button
                onClick={resetGame}
                className="w-full bg-white/80 backdrop-blur-xl border border-gray-100 text-red-500 h-14 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-transform"
              >
                <RotateCcw size={18} /> KẾT THÚC VÒNG CHƠI
              </button>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}
