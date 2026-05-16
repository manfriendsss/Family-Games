/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw } from 'lucide-react';

import { GameHeader } from './components/GameHeader';
import { PlayerManager } from './components/PlayerManager';
import { Dashboard } from './components/Dashboard';
import { ImposterSetup } from './components/ImposterSetup';
import { CharadesSetup } from './components/CharadesSetup';
import { CharadesCategoryPopup } from './components/CharadesCategoryPopup';
import { RevealStage, DiscussionStage, VotingStage, ResultStage, CharadesResultStage } from './components/GameStages';

import { useGameState } from './hooks/useGameState';

export default function App() {
  const {
    gameMode, setGameMode,
    stage, setStage,
    players,
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
  } = useGameState();
  const isRevealStage = stage === 'REVEAL';

  useEffect(() => {
    if (!isRevealStage) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [isRevealStage]);

  return (
    <div className={`min-h-screen bg-[#F5F7F9] text-[#1D1D1F] font-sans flex justify-center ${isRevealStage ? 'p-0 overflow-hidden h-[100svh]' : 'p-4 md:p-8 pb-24'}`}>
      <div className={`w-full max-w-lg flex flex-col ${isRevealStage ? 'gap-0 h-[100svh]' : 'gap-6'}`}>
        {!isRevealStage && (
          <GameHeader
            stage={stage}
            gameMode={gameMode}
            onBack={() => { setGameMode('DASHBOARD'); setStage('DASHBOARD'); }}
          />
        )}

        <main className={isRevealStage ? 'h-full overflow-hidden' : 'space-y-6 pb-32'}>
          <AnimatePresence mode="wait">
            {stage === 'DASHBOARD' && (
              <motion.div
                key="dashboard-wrapper"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <PlayerManager
                  players={players}
                  newPlayerName={newPlayerName}
                  expandedPlayerId={expandedPlayerId}
                  onNewPlayerNameChange={setNewPlayerName}
                  onAddPlayer={addPlayer}
                  onRemovePlayer={removePlayer}
                  onUpdatePlayerName={updatePlayerName}
                  onUpdatePlayerType={updatePlayerType}
                  onSetExpandedPlayerId={setExpandedPlayerId}
                  gameConditions={getGameConditions()}
                  isExpanded={isPlayerManagerExpanded}
                  onToggleExpand={() => setIsPlayerManagerExpanded(!isPlayerManagerExpanded)}
                />
                <Dashboard
                  onGoToImposter={() => { setGameMode('IMPOSTER'); setStage('SETUP'); }}
                  onGoToCharades={() => { setGameMode('CHARADES'); setStage('CHARADES_SETUP'); }}
                />
              </motion.div>
            )}

            {stage === 'SETUP' && (
              <ImposterSetup
                settings={settings}
                players={players}
                showAllCategories={showAllCategories}
                onToggleCategory={toggleCategory}
                onShowAllCategories={() => setShowAllCategories(true)}
                onStartQuickMode={startQuickMode}
                onUpdateSettings={setSettings}
              />
            )}

            {stage === 'CHARADES_SETUP' && (
              <>
                <CharadesSetup
                  settings={charadesSettings}
                  players={players}
                  onToggleCategory={toggleCharadesCategory}
                  onUpdateSettings={setCharadesSettings}
                  onShowCategoryPopup={() => setShowCharadesCategoryPopup(true)}
                />
                <CharadesCategoryPopup
                  isOpen={showCharadesCategoryPopup}
                  selectedCategories={charadesSettings.selectedCategories}
                  onToggleCategory={toggleCharadesCategory}
                  onClose={() => setShowCharadesCategoryPopup(false)}
                />
              </>
            )}

            {stage === 'REVEAL' && (
              <RevealStage
                gameMode={gameMode}
                activePlayerIndex={activePlayerIndex}
                players={players}
                isPressing={isPressing}
                currentCharadesWord={currentCharadesWord}
                currentActor={currentActor}
                setIsPressing={setIsPressing}
                onNext={() => gameMode === 'CHARADES' ? setStage('DISCUSSION') : nextReveal()}
              />
            )}

            {stage === 'DISCUSSION' && (
              <DiscussionStage
                gameMode={gameMode}
                currentCharadesWord={currentCharadesWord}
                currentActor={currentActor}
                talkOrder={talkOrder}
                players={players}
                charadesSettings={charadesSettings}
                onNext={() => setStage('VOTING')}
              />
            )}

            {stage === 'VOTING' && (
              <VotingStage
                players={players}
                votes={votes}
                hasVoted={hasVoted}
                onVote={(id) => { if (!hasVoted) setVotes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 })); }}
                onLockVotes={() => setHasVoted(true)}
                onShowResult={() => setStage('RESULT')}
              />
            )}

            {stage === 'RESULT' && (
              <ResultStage
                currentWordPair={currentWordPair}
                players={players}
                settings={settings}
                onNewGame={resetGame}
              />
            )}

            {stage === 'CHARADES_RESULT' && (
              <CharadesResultStage
                currentCharadesWord={currentCharadesWord}
                currentActor={currentActor}
                onNewRound={resetGame}
              />
            )}
          </AnimatePresence>
        </main>

        {stage !== 'DASHBOARD' && (
          <footer className="fixed bottom-6 left-4 right-4 z-40 max-w-lg mx-auto">
            {stage === 'SETUP' || stage === 'CHARADES_SETUP' ? (
              <button
                onClick={() => (stage === 'SETUP' ? initiateGame() : initiateCharades())}
                className="w-full h-18 rounded-[24px] bg-[#B2FF3D] text-gray-900 font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 border-4 border-white shadow-lime-200/50"
              >
                <Play size={24} fill="currentColor" /> BẮT ĐẦU {stage === 'CHARADES_SETUP' ? 'TRÒ CHƠI' : 'GAME'}
              </button>
            ) : (gameMode === 'CHARADES' && stage === 'DISCUSSION') ? (
              <button
                onClick={() => setStage('CHARADES_RESULT')}
                className="w-full bg-white/80 backdrop-blur-xl border border-gray-100 text-red-500 h-14 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-transform"
              >
                <RotateCcw size={18} /> KẾT THÚC VÒNG CHƠI
              </button>
            ) : (gameMode === 'IMPOSTER' && (stage === 'DISCUSSION' || stage === 'VOTING' || stage === 'RESULT')) ? (
              <button
                onClick={resetGame}
                className="w-full bg-white/80 backdrop-blur-xl border border-gray-100 text-red-500 h-14 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-transform"
              >
                <RotateCcw size={18} /> KẾT THÚC VÒNG CHƠI
              </button>
            ) : null}
          </footer>
        )}
      </div>
    </div>
  );
}
