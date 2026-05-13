import { useState } from 'react';
import { Player, GameSettings, GameStage, Role, WordPair, GameMode, CharadesSettings, Difficulty } from '../types';
import { CATEGORIES, CHARADES_CATEGORIES } from '../constants';

export const useGameState = () => {
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

  const getGameConditions = () => {
    const total = players.length;
    const adults = players.filter(p => p.isAdult !== false).length; // Default to adult if not specified
    const children = players.filter(p => p.isAdult === false).length;
    
    if (players.every(p => p.isAdult === undefined)) return { difficulty: 'EASY' as Difficulty, mode: 'NORMAL' };
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

  const togglePlayerType = (id: string) => {
    setPlayers(players.map(p => p.id === id ? { ...p, isAdult: !p.isAdult } : p));
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

    const targetCats = currentSettings.selectedCategories;
    const randomCatId = targetCats[Math.floor(Math.random() * targetCats.length)];
    const category = CATEGORIES.find(c => c.id === randomCatId);
    if (!category) return;

    let availablePairs = category.pairs.filter(p => p.difficulty === effectiveDifficulty);
    if (availablePairs.length === 0) availablePairs = category.pairs;
    
    const wordPair = availablePairs[Math.floor(Math.random() * availablePairs.length)];
    setCurrentWordPair(wordPair);

    let newPlayers = [...players].map(p => ({ ...p, isRevealed: false, role: 'CITIZEN' as Role }));
    
    let imposterCandidates = [...newPlayers];
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

    setStage('REVEAL');
    setActivePlayerIndex(0);
    setIsPressing(false);
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
    if (charadesSettings.selectedCategories.length === 0) return;
    const { difficulty: effectiveDifficulty } = getGameConditions();

    const randomCatId = charadesSettings.selectedCategories[Math.floor(Math.random() * charadesSettings.selectedCategories.length)];
    const category = CHARADES_CATEGORIES.find(c => c.id === randomCatId) || CATEGORIES.find(c => c.id === randomCatId);
    if (!category) return;
    
    let availablePairs = category.pairs.filter(p => p.difficulty === effectiveDifficulty);
    if (availablePairs.length === 0) availablePairs = category.pairs;
    
    const pair = availablePairs[Math.floor(Math.random() * availablePairs.length)];
    setCurrentCharadesWord(pair.citizen);

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
    togglePlayerType,
    toggleCategory,
    toggleCharadesCategory,
    initiateGame,
    startQuickMode,
    initiateCharades,
    resetGame,
    nextReveal
  };
};
