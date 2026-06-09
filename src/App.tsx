/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw } from 'lucide-react';

import { GameHeader } from './components/GameHeader';
import { StageSkeleton } from './components/Skeletons';
import { Player } from './types';

import { useGameState } from './hooks/useGameState';

const PlayerManager = lazy(() => import('./components/PlayerManager').then((m) => ({ default: m.PlayerManager })));
const Dashboard = lazy(() => import('./components/Dashboard').then((m) => ({ default: m.Dashboard })));
const ImposterSetup = lazy(() => import('./components/ImposterSetup').then((m) => ({ default: m.ImposterSetup })));
const CharadesSetup = lazy(() => import('./components/CharadesSetup').then((m) => ({ default: m.CharadesSetup })));
const CharadesCategoryPopup = lazy(() => import('./components/CharadesCategoryPopup').then((m) => ({ default: m.CharadesCategoryPopup })));
const RevealStage = lazy(() => import('./components/stages/RevealStage').then((m) => ({ default: m.RevealStage })));
const DiscussionStage = lazy(() => import('./components/stages/DiscussionStage').then((m) => ({ default: m.DiscussionStage })));
const VotingStage = lazy(() => import('./components/stages/VotingStage').then((m) => ({ default: m.VotingStage })));
const ResultStage = lazy(() => import('./components/stages/ResultStage').then((m) => ({ default: m.ResultStage })));
const CharadesResultStage = lazy(() => import('./components/stages/CharadesResultStage').then((m) => ({ default: m.CharadesResultStage })));
const ShuffleStage = lazy(() => import('./components/stages/ShuffleStage').then((m) => ({ default: m.ShuffleStage })));
const CaroSetup = lazy(() => import('./components/CaroGame').then((m) => ({ default: m.CaroSetup })));
const CaroPlay = lazy(() => import('./components/CaroGame').then((m) => ({ default: m.CaroPlay })));
const DoanTuSetup = lazy(() => import('./components/DoanTuGame').then((m) => ({ default: m.DoanTuSetup })));
const DoanTuPlay = lazy(() => import('./components/DoanTuGame').then((m) => ({ default: m.DoanTuPlay })));

export default function App() {
  const [caroBoardSize, setCaroBoardSize] = useState<3 | 15>(15);
  const [doanTuDifficulty, setDoanTuDifficulty] = useState<'EASY' | 'HARD'>('EASY');
  const [doanTuTeams, setDoanTuTeams] = useState<Array<{ name: string; members: Player[] }>>([]);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; message: string; onConfirm: (() => void) | null }>({
    isOpen: false,
    message: '',
    onConfirm: null,
  });
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
  const isRevealStage = stage === 'REVEAL' || stage === 'SHUFFLE';
  const isCaroPlayStage = stage === 'CARO_PLAY';
  const isLockedViewportStage = isRevealStage || isCaroPlayStage;
  
  const handleBack = () => {
    if (gameMode === 'CARO' && stage === 'CARO_PLAY') {
      setConfirmModal({
        isOpen: true,
        message: 'Bạn có chắc chắn muốn thoát trận đấu Caro hiện tại không?',
        onConfirm: () => {
          setStage('CARO_SETUP');
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      });
      return;
    }
    if (gameMode === 'DOAN_TU' && stage === 'DOAN_TU_PLAY') {
      setConfirmModal({
        isOpen: true,
        message: 'Bạn có chắc chắn muốn thoát lượt chơi Đoán từ hiện tại không?',
        onConfirm: () => {
          setStage('DOAN_TU_SETUP');
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }
      });
      return;
    }
    setGameMode('DASHBOARD');
    setStage('DASHBOARD');
  };

  const handleEndRound = (onConfirm: () => void) => {
    setConfirmModal({
      isOpen: true,
      message: 'Bạn có chắc chắn muốn kết thúc vòng chơi này không?',
      onConfirm: () => {
        onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  useEffect(() => {
    if (!isLockedViewportStage) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [isLockedViewportStage]);

  useEffect(() => {
    if (!(gameMode === 'CARO' && stage === 'CARO_PLAY')) return;
    const onPopState = () => setStage('CARO_SETUP');
    window.history.pushState({ caroPlay: true }, '');
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [gameMode, stage, setStage]);

  return (
    <div className={`min-h-screen bg-[#F5F7F9] text-[#1D1D1F] font-sans flex justify-center ${isLockedViewportStage ? 'p-0 overflow-hidden h-[100svh]' : 'px-4 py-4 md:px-6 lg:px-8 pb-24'}`}>
      <div className={`w-full max-w-3xl flex flex-col ${isLockedViewportStage ? 'gap-0 h-[100svh]' : 'gap-6'}`}>
        {!isRevealStage && (
          <GameHeader
            stage={stage}
            gameMode={gameMode}
            onBack={handleBack}
          />
        )}

        <main className={isLockedViewportStage ? 'h-full overflow-hidden' : 'space-y-6 pb-32'}>
          <Suspense fallback={<StageSkeleton stage={stage} gameMode={gameMode} />}>
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
                  onGoToCaro={() => { setGameMode('CARO'); setStage('CARO_SETUP'); }}
                  onGoToDoanTu={() => { setGameMode('DOAN_TU'); setStage('DOAN_TU_SETUP'); }}
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

            {stage === 'SHUFFLE' && (
              <ShuffleStage gameMode={gameMode} />
            )}

            {stage === 'CARO_SETUP' && (
              <CaroSetup
                boardSize={caroBoardSize}
                onBoardSizeChange={setCaroBoardSize}
                onStart={() => setStage('CARO_PLAY')}
              />
            )}

            {stage === 'CARO_PLAY' && (
              <CaroPlay
                boardSize={caroBoardSize}
                onSwitchBoard={(size) => {
                  setCaroBoardSize(size);
                  setStage('CARO_SETUP');
                }}
              />
            )}

            {stage === 'DOAN_TU_SETUP' && (
              <DoanTuSetup
                players={players}
                difficulty={doanTuDifficulty}
                onDifficultyChange={setDoanTuDifficulty}
                onStart={(teams) => {
                  setDoanTuTeams(teams);
                  setStage('DOAN_TU_PLAY');
                }}
              />
            )}

            {stage === 'DOAN_TU_PLAY' && (
              <DoanTuPlay
                teams={doanTuTeams}
                difficulty={doanTuDifficulty}
                onBackToSetup={() => setStage('DOAN_TU_SETUP')}
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
                onNewGame={initiateGame}
              />
            )}

            {stage === 'CHARADES_RESULT' && (
              <CharadesResultStage
                currentCharadesWord={currentCharadesWord}
                currentActor={currentActor}
                onNewRound={initiateCharades}
              />
            )}
            </AnimatePresence>
          </Suspense>
        </main>

        {stage !== 'DASHBOARD' && gameMode !== 'CARO' && gameMode !== 'DOAN_TU' && (
          <footer className="fixed bottom-[calc(env(safe-area-inset-bottom)+12px)] left-4 right-4 z-40 max-w-3xl mx-auto">
            {stage === 'SETUP' || stage === 'CHARADES_SETUP' ? (
              <button
                onClick={() => (stage === 'SETUP' ? initiateGame() : initiateCharades())}
                className="w-full h-18 rounded-[24px] bg-[#B2FF3D] text-gray-900 font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 border-4 border-white shadow-lime-200/50"
              >
                <Play size={24} fill="currentColor" /> BẮT ĐẦU VÒNG CHƠI
              </button>
            ) : (gameMode === 'CHARADES' && stage === 'DISCUSSION') ? (
              <button
                onClick={() => handleEndRound(() => setStage('CHARADES_RESULT'))}
                className="w-full bg-white/80 backdrop-blur-xl border border-gray-100 text-red-500 h-14 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-transform"
              >
                <RotateCcw size={18} /> KẾT THÚC VÒNG CHƠI
              </button>
            ) : (gameMode === 'IMPOSTER' && (stage === 'DISCUSSION' || stage === 'VOTING' || stage === 'RESULT')) ? (
              <button
                onClick={() => handleEndRound(resetGame)}
                className="w-full bg-white/80 backdrop-blur-xl border border-gray-100 text-red-500 h-14 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-transform"
              >
                <RotateCcw size={18} /> KẾT THÚC VÒNG CHƠI
              </button>
            ) : null}
          </footer>
        )}
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative z-10 p-6 border border-gray-100 flex flex-col items-center text-center space-y-4"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 text-2xl">
                ⚠️
              </div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Xác nhận</h3>
              <p className="text-sm text-gray-500 font-bold leading-relaxed px-2">
                {confirmModal.message}
              </p>
              <div className="grid grid-cols-2 gap-3 w-full pt-2">
                <button
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="h-12 bg-gray-100 text-gray-700 rounded-2xl font-black active:scale-95 transition-all text-xs uppercase"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    if (confirmModal.onConfirm) confirmModal.onConfirm();
                  }}
                  className="h-12 bg-red-500 text-white rounded-2xl font-black active:scale-95 transition-all text-xs uppercase shadow-lg shadow-red-100"
                >
                  Đồng ý
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
