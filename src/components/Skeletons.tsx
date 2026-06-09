import React from 'react';
import { GameStage, GameMode } from '../types';

interface StageSkeletonProps {
  stage?: GameStage;
  gameMode?: GameMode;
}

export const StageSkeleton: React.FC<StageSkeletonProps> = ({ stage, gameMode }) => {
  // 1. DASHBOARD LOADING
  if (stage === 'DASHBOARD') {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Player Manager Skeleton */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 space-y-3">
          <div className="h-4 bg-gray-200 rounded-full w-24" />
          <div className="flex gap-2 flex-wrap">
            <div className="h-7 bg-gray-100 border border-gray-50 rounded-full w-20" />
            <div className="h-7 bg-gray-100 border border-gray-50 rounded-full w-24" />
            <div className="h-7 bg-gray-100 border border-gray-50 rounded-full w-28" />
            <div className="h-7 bg-gray-100 border border-gray-50 rounded-full w-16" />
          </div>
        </div>
        {/* Games Grid Heading */}
        <div className="h-6 bg-gray-200 rounded-full w-40" />
        {/* Games Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-[32px] p-5 border border-gray-100 aspect-[1/1.05] flex flex-col justify-between">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                <div className="h-3 bg-gray-100 rounded-full w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. SETUPS LOADING (Imposter, Charades, Caro, DoanTu setup screens)
  if (
    stage === 'SETUP' ||
    stage === 'CHARADES_SETUP' ||
    stage === 'CARO_SETUP' ||
    stage === 'DOAN_TU_SETUP'
  ) {
    return (
      <div className="space-y-6 animate-pulse px-1">
        {/* Info Card */}
        <div className="h-24 rounded-3xl bg-[#1D1D1F] opacity-90 p-6" />
        
        {/* Players Summary */}
        <div className="bg-white rounded-3xl p-4 border border-gray-100 space-y-2">
          <div className="h-3 bg-gray-200 rounded-full w-28" />
          <div className="flex gap-2">
            <div className="h-6 bg-gray-100 rounded-full w-20" />
            <div className="h-6 bg-gray-100 rounded-full w-24" />
          </div>
        </div>

        {/* Categories / Board selection */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded-full w-36" />
            <div className="h-3 bg-gray-100 rounded-full w-24" />
          </div>
          <div className="space-y-2 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-gray-50 border border-gray-100 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. CARO GAME PLAY LOADING
  if (gameMode === 'CARO' && stage === 'CARO_PLAY') {
    return (
      <div className="space-y-4 animate-pulse h-[100svh] overflow-hidden pb-4">
        {/* Turn Header */}
        <div className="bg-white rounded-3xl p-4 border border-gray-100 flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded-full w-20" />
            <div className="h-6 bg-gray-200 rounded-full w-8" />
          </div>
          <div className="h-10 bg-gray-900 opacity-90 rounded-xl w-28" />
        </div>
        {/* Board grid skeleton */}
        <div className="bg-white rounded-3xl p-3 border border-gray-100 aspect-square flex items-center justify-center">
          <div className="grid grid-cols-5 gap-1.5 w-full h-full p-2">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-50 border border-gray-200 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 4. DOAN TU GAME PLAY LOADING
  if (gameMode === 'DOAN_TU' && stage === 'DOAN_TU_PLAY') {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Scoreboard */}
        <div className="bg-white rounded-3xl p-4 border border-gray-100 flex justify-between">
          <div className="space-y-2 w-1/3"><div className="h-4 bg-gray-200 rounded-full w-full" /><div className="h-6 bg-gray-100 rounded-full w-12" /></div>
          <div className="space-y-2 w-1/3 flex flex-col items-end"><div className="h-4 bg-gray-200 rounded-full w-full" /><div className="h-6 bg-gray-100 rounded-full w-12" /></div>
        </div>
        {/* Word card */}
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 h-64 flex flex-col justify-between items-center">
          <div className="h-4 bg-gray-100 rounded-full w-24" />
          <div className="h-10 bg-gray-200 rounded-full w-48" />
          <div className="h-4 bg-gray-100 rounded-full w-36" />
        </div>
      </div>
    );
  }

  // 5. GENERIC / STAGES / OUTCOME LOADING
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-24 rounded-3xl bg-white/80 border border-gray-100" />
      <div className="h-40 rounded-3xl bg-white/80 border border-gray-100" />
      <div className="h-40 rounded-3xl bg-white/80 border border-gray-100" />
    </div>
  );
};
