import { useState, useEffect, useRef } from 'react';
import { Player, GameSettings, GameStage, Role, WordPair, GameMode, CharadesSettings, Difficulty } from '../types';
import { CATEGORIES, CHARADES_CATEGORIES } from '../constants';

export const useGameState = () => {
  const shuffleTimerRef = useRef<number | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('DASHBOARD');
  const [stage, setStage] = useState<GameStage>('DASHBOARD');
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('family-games-players');
    const parsed = saved ? JSON.parse(saved) : null;
    if (parsed && Array.isArray(parsed) && parsed.length >= 3) return parsed;
    return [
      { id: '1', name: 'Người chơi 1', isRevealed: false, isAdult: true },
      { id: '2', name: 'Người chơi 2', isRevealed: false, isAdult: true },
      { id: '3', name: 'Người chơi 3', isRevealed: false, isAdult: true },
      { id: '4', name: 'Người chơi 4', isRevealed: false, isAdult: true },
    ];
  });
  const [settings, setSettings] = useState<GameSettings>(() => {
    const saved = localStorage.getItem('family-games-settings');
    return saved ? JSON.parse(saved) : {
      timeLimit: false,
      imposterCount: 1,
      difficulty: 'EASY',
      selectedCategories: ['objects'],
    };
  });
  const [charadesSettings, setCharadesSettings] = useState<CharadesSettings>(() => {
    const saved = localStorage.getItem('family-games-charades-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        selectedCategories: parsed.selectedCategories || ['actions'],
        timeLimit: typeof parsed.timeLimit === 'boolean' ? parsed.timeLimit : true,
        timeSeconds: typeof parsed.timeSeconds === 'number' ? parsed.timeSeconds : 60,
        actorId: parsed.actorId || 'RANDOM',
        autoRotateActor: typeof parsed.autoRotateActor === 'boolean' ? parsed.autoRotateActor : false,
        mode: parsed.mode || 'ACTIONS_AND_HINTS',
      };
    }
    return {
      selectedCategories: ['actions'],
      timeLimit: true,
      timeSeconds: 60,
      actorId: 'RANDOM',
      autoRotateActor: false,
      mode: 'ACTIONS_AND_HINTS',
    };
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
  const [isPlayerManagerExpanded, setIsPlayerManagerExpanded] = useState<boolean>(() => {
    const saved = localStorage.getItem('family-games-pm-expanded');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('family-games-players', JSON.stringify(players.map(p => ({
      id: p.id,
      name: p.name,
      isAdult: p.isAdult
    }))));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('family-games-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('family-games-charades-settings', JSON.stringify(charadesSettings));
  }, [charadesSettings]);

  useEffect(() => {
    localStorage.setItem('family-games-pm-expanded', JSON.stringify(isPlayerManagerExpanded));
  }, [isPlayerManagerExpanded]);

  const getGameConditions = () => {
    const total = players.length;
    const adults = players.filter(p => p.isAdult !== false).length; 
    const children = players.filter(p => p.isAdult === false).length;
    
    if (players.length === 0) return { difficulty: 'EASY' as Difficulty, mode: 'NORMAL' };
    if (children === total) return { difficulty: 'VERY_EASY' as Difficulty, mode: 'KIDS_ONLY' };
    if (adults === total) return { difficulty: 'HARD' as Difficulty, mode: 'ADULTS_ONLY' };
    if (children > 0 && adults > 0) return { difficulty: 'EASY' as Difficulty, mode: 'MIXED' };
    
    return { difficulty: 'EASY' as Difficulty, mode: 'NORMAL' };
  };

  const addPlayer = () => {
    if (!newPlayerName.trim()) return;
    const newId = String(Date.now());
    setPlayers([...players, { id: newId, name: newPlayerName.trim(), isRevealed: false, isAdult: true }]);
    setNewPlayerName('');
  };

  const removePlayer = (id: string) => {
    if (players.length <= 3) return;
    setPlayers(players.filter(p => p.id !== id));
  };

  const updatePlayerName = (id: string, name: string) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name } : p));
  };

  const updatePlayerType = (id: string, isAdult: boolean) => {
    setPlayers(players.map(p => p.id === id ? { ...p, isAdult } : p));
  };

  const toggleCategory = (id: string) => {
    setSettings(prev => ({
      ...prev,
      selectedCategories: [id]
    }));
  };

  const toggleCharadesCategory = (id: string) => {
    setCharadesSettings(prev => ({
      ...prev,
      selectedCategories: [id]
    }));
  };

  const initiateGame = (overrideSettings?: GameSettings) => {
    let currentSettings = overrideSettings || settings;
    
    // Safety check: ensure at least 3 players
    if (players.length < 3) {
      alert("Cần ít nhất 3 người chơi để bắt đầu game Imposter!");
      return;
    }

    // Validate and fix categories
    const validCategoryIds = CATEGORIES.map(c => c.id);
    const rawCats = currentSettings.selectedCategories || [];
    let selectedCats = rawCats.filter(id => validCategoryIds.includes(id));
    
    if (selectedCats.length === 0) {
      selectedCats = [CATEGORIES[0].id];
      currentSettings = { ...currentSettings, selectedCategories: selectedCats };
      setSettings(currentSettings);
    }

    const { difficulty: autoDifficulty, mode } = getGameConditions();
    const effectiveDifficulty = overrideSettings ? currentSettings.difficulty : autoDifficulty;

    const randomCatId = selectedCats[Math.floor(Math.random() * selectedCats.length)];
    const category = CATEGORIES.find(c => c.id === randomCatId) || CATEGORIES[0];
    
    let availablePairs = category.pairs.filter(p => p.difficulty === effectiveDifficulty);
    if (availablePairs.length === 0) availablePairs = category.pairs;
    
    try {
      const wordPair = availablePairs[Math.floor(Math.random() * availablePairs.length)];
      if (!wordPair) throw new Error("Không tìm thấy từ khóa!");
      
      setCurrentWordPair(wordPair);

      let newPlayers = [...players].map(p => ({ ...p, isRevealed: false, role: 'CITIZEN' as Role }));
      
      if (mode === 'MIXED') {
          const adults = newPlayers.filter(p => p.isAdult !== false);
          const kids = newPlayers.filter(p => p.isAdult === false);
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
                  for(let j=weightedPool.length-1; j>=0; j--) {
                      if (weightedPool[j].id === chosen.id) weightedPool.splice(j, 1);
                  }
              } else {
                  i--;
              }
          }
      } else {
          const shuffledIdx = Array.from({ length: newPlayers.length }, (_, i) => i).sort(() => Math.random() - 0.5);
          for (let i = 0; i < Math.min(currentSettings.imposterCount, newPlayers.length - 1); i++) {
              newPlayers[shuffledIdx[i]].role = 'IMPOSTER';
          }
      }

      newPlayers = newPlayers.map(p => ({
        ...p,
        word: p.role === 'CITIZEN' 
          ? wordPair.citizen 
          : (effectiveDifficulty === 'HARD' ? 'Bạn không có gợi ý' : wordPair.imposter_hint)
      }));

      setPlayers(newPlayers);

      let order = [...newPlayers].sort(() => Math.random() - 0.5);
      const isInvalidFirstSpeaker = (p: typeof newPlayers[0]) => {
          if (p.role === 'IMPOSTER') return true;
          if (mode === 'MIXED' && p.isAdult === false) return true;
          return false;
      };

      if (isInvalidFirstSpeaker(order[0])) {
        const validFirstIdx = order.findIndex(p => !isInvalidFirstSpeaker(p));
        if (validFirstIdx !== -1) {
          [order[0], order[validFirstIdx]] = [order[validFirstIdx], order[0]];
        }
      }
      setTalkOrder(order.map(p => p.id));

      startShuffleThenReveal();
      setActivePlayerIndex(0);
      setIsPressing(false);
    } catch (error) {
      console.error("Lỗi khi bắt đầu game:", error);
      alert("Có lỗi xảy ra khi bắt đầu game. Vui lòng kiểm tra lại thiết lập.");
    }
  };

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

  const initiateCharades = () => {
    let currentSettings = charadesSettings;
    
    // Safety check: ensure at least 1 player
    if (players.length === 0) {
      alert("Cần ít nhất 1 người chơi để bắt đầu!");
      return;
    }

    // Validate categories
    const allValidCats = [...CHARADES_CATEGORIES.map(c => c.id), ...CATEGORIES.map(c => c.id)];
    const rawCats = currentSettings.selectedCategories || [];
    let selectedCats = rawCats.filter(id => allValidCats.includes(id));

    if (selectedCats.length === 0) {
      selectedCats = [CHARADES_CATEGORIES[0].id];
      currentSettings = { ...currentSettings, selectedCategories: selectedCats };
      setCharadesSettings(currentSettings);
    }
    const { difficulty: effectiveDifficulty } = getGameConditions();

    const randomCatId = selectedCats[Math.floor(Math.random() * selectedCats.length)];
    const category = CHARADES_CATEGORIES.find(c => c.id === randomCatId) || CATEGORIES.find(c => c.id === randomCatId) || CHARADES_CATEGORIES[0];
    
    let availablePairs = category.pairs.filter(p => p.difficulty === effectiveDifficulty);
    if (availablePairs.length === 0) availablePairs = category.pairs;
    
    const pair = availablePairs[Math.floor(Math.random() * availablePairs.length)];
    setCurrentCharadesWord(pair.citizen);

    if (currentSettings.autoRotateActor && players.length > 0) {
      const currentIdx = currentActor ? players.findIndex(p => p.id === currentActor.id) : -1;
      const nextIdx = currentIdx === -1 ? Math.floor(Math.random() * players.length) : (currentIdx + 1) % players.length;
      setCurrentActor(players[nextIdx]);
    } else if (currentSettings.actorId === 'RANDOM') {
      const randomActor = players[Math.floor(Math.random() * players.length)];
      setCurrentActor(randomActor);
    } else {
      const selectedActor = players.find(p => p.id === currentSettings.actorId);
      setCurrentActor(selectedActor || players[0]);
    }

    startShuffleThenReveal();
    setActivePlayerIndex(0);
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

  return {
    gameMode, setGameMode,
    stage, setStage,
    players, setPlayers,
    settings, setSettings,
    charadesSettings, setCharadesSettings,
    currentWordPair,
    activePlayerIndex,
    talkOrder,
    isPressing, setIsPressing,
    votes, setVotes,
    hasVoted, setHasVoted,
    newPlayerName, setNewPlayerName,
    expandedPlayerId, setExpandedPlayerId,
    showAllCategories, setShowAllCategories,
    showCharadesCategoryPopup, setShowCharadesCategoryPopup,
    currentCharadesWord,
    currentActor,
    getGameConditions,
    addPlayer,
    removePlayer,
    updatePlayerName,
    updatePlayerType,
    toggleCategory,
    toggleCharadesCategory,
    initiateGame,
    startQuickMode,
    initiateCharades,
    resetGame,
    nextReveal,
    isPlayerManagerExpanded,
    setIsPlayerManagerExpanded
  };
};
  useEffect(() => {
    return () => {
      if (shuffleTimerRef.current !== null) window.clearTimeout(shuffleTimerRef.current);
    };
  }, []);

  const startShuffleThenReveal = () => {
    if (shuffleTimerRef.current !== null) window.clearTimeout(shuffleTimerRef.current);
    setStage('SHUFFLE');
    shuffleTimerRef.current = window.setTimeout(() => {
      setStage('REVEAL');
      shuffleTimerRef.current = null;
    }, 300);
  };
