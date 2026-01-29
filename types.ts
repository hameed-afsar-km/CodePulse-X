
export enum AppState {
  SPLASH = 'SPLASH',
  MODE_SELECT = 'MODE_SELECT',
  LANG_SELECT = 'LANG_SELECT',
  TERMINAL = 'TERMINAL',
  ANALYSIS = 'ANALYSIS',
  PROGRESS_LAB = 'PROGRESS_LAB'
}

export enum GameMode {
  SPEED = 'SPEED',
  DEBUG = 'DEBUG',
  SILENT_ERROR = 'SILENT_ERROR',
  BUG_INJECTION = 'BUG_INJECTION',
  CONTEXT_SWITCH = 'CONTEXT_SWITCH',
  MIRROR = 'MIRROR',
  DISTRACTION = 'DISTRACTION',
  BOSS_FIGHT = 'BOSS_FIGHT'
}

export interface Language {
  id: string;
  name: string;
  color: string;
  accent: string;
  snippet: string;
  buggySnippet?: string; // For Debug modes
}

export interface SessionAttempt {
  id: string;
  timestamp: number;
  wpm: number;
  cpm: number;
  accuracy: number;
  mode: GameMode;
  language: string;
  load: number;
}

export interface PerformanceMetrics {
  wpm: number;
  cpm: number;
  accuracy: number;
  totalMistakes: number;
  syntaxScore: number;
  cognitiveLoad: number; // 0-100
  consistency: number;
  elapsedTime: number;
  history: {
    time: number;
    wpm: number;
    accuracy: number;
    load: number;
  }[];
  errorPositions: number[];
  distractionHits?: number;
  adaptationScore?: number;
}

export type CoderArchetype = 
  | 'Calm Coder' 
  | 'Panic Fixer' 
  | 'Flow Specialist' 
  | 'Precision Thinker' 
  | 'Adaptive Switcher';
