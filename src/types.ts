/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'CITIZEN' | 'IMPOSTER';
export type GameMode = 'DASHBOARD' | 'IMPOSTER' | 'CHARADES';

export interface Player {
  id: string;
  name: string;
  age?: number;
  role?: Role;
  word?: string;
  isRevealed: boolean;
}

export interface WordPair {
  citizen: string;
  imposter_hint: string;
  difficulty?: Difficulty;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  pairs: WordPair[];
}

export type Difficulty = 'VERY_EASY' | 'EASY' | 'HARD';

export interface GameSettings {
  timeLimit: boolean;
  imposterCount: number;
  difficulty: Difficulty;
  selectedCategories: string[];
}

export interface CharadesSettings {
  selectedCategories: string[];
  timeLimit: boolean;
  timeSeconds: number;
  actorId: string | 'RANDOM';
  mode: 'ACTIONS_AND_HINTS' | 'ACTIONS_ONLY';
}

export type GameStage = 'DASHBOARD' | 'SETUP' | 'REVEAL' | 'DISCUSSION' | 'VOTING' | 'RESULT' | 'CHARADES_SETUP';
