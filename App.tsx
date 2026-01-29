
import React, { useState, useEffect } from 'react';
import { AppState, GameMode, Language, PerformanceMetrics, SessionAttempt } from './types';
import { LANGUAGES, ACCENT_COLORS } from './constants';
import SplashScene from './components/SplashScene';
import ModeSelector from './components/ModeSelector';
import LanguageNetwork from './components/LanguageNetwork';
import Terminal from './components/Terminal';
import PostAnalysis from './components/PostAnalysis';
import CustomCursor from './components/CustomCursor';
import ProgressLab from './components/ProgressLab';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SPLASH);
  const [selectedMode, setSelectedMode] = useState<GameMode>(GameMode.SPEED);
  const [selectedLangs, setSelectedLangs] = useState<Language[]>([]);
  const [finalMetrics, setFinalMetrics] = useState<PerformanceMetrics | null>(null);
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0].value);
  const [history, setHistory] = useState<SessionAttempt[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('codepulse_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', accentColor);
    root.style.setProperty('--accent-transparent', `${accentColor}66`);
    root.style.setProperty('--grid-color', `${accentColor}08`);
    root.style.setProperty('--scanline-color', `${accentColor}05`);
  }, [accentColor]);

  useEffect(() => {
    if (appState === AppState.SPLASH) {
      const timer = setTimeout(() => {
        setAppState(AppState.MODE_SELECT);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    setAppState(AppState.LANG_SELECT);
    setSelectedLangs([]); 
  };

  const handleLangsSelect = (langs: Language[]) => {
    setSelectedLangs(langs);
    setAppState(AppState.TERMINAL);
  };

  const handleTestComplete = (metrics: PerformanceMetrics) => {
    const newAttempt: SessionAttempt = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      wpm: metrics.wpm,
      cpm: metrics.cpm,
      accuracy: metrics.accuracy,
      mode: selectedMode,
      language: selectedLangs.map(l => l.name).join(', '),
      load: metrics.cognitiveLoad
    };

    const updatedHistory = [newAttempt, ...history].slice(0, 50);
    setHistory(updatedHistory);
    localStorage.setItem('codepulse_history', JSON.stringify(updatedHistory));

    setFinalMetrics(metrics);
    setAppState(AppState.ANALYSIS);
  };

  const handleClearHistory = () => {
    localStorage.removeItem('codepulse_history');
    setHistory([]);
  };

  const reset = () => {
    setAppState(AppState.MODE_SELECT);
    setFinalMetrics(null);
    setSelectedLangs([]);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050505] text-slate-100 selection:bg-[var(--accent)]/30">
      <CustomCursor />

      {appState === AppState.SPLASH && (
        <SplashScene onFinish={() => setAppState(AppState.MODE_SELECT)} />
      )}

      {appState === AppState.MODE_SELECT && (
        <ModeSelector 
          onSelect={handleModeSelect} 
          onAccentChange={setAccentColor}
          currentAccent={accentColor}
          onOpenHistory={() => setAppState(AppState.PROGRESS_LAB)}
        />
      )}

      {appState === AppState.PROGRESS_LAB && (
        <ProgressLab 
          history={history} 
          onBack={() => setAppState(AppState.MODE_SELECT)} 
          onClear={handleClearHistory}
        />
      )}

      {appState === AppState.LANG_SELECT && (
        <LanguageNetwork 
          languages={LANGUAGES} 
          mode={selectedMode}
          onSelect={handleLangsSelect} 
          onBack={() => setAppState(AppState.MODE_SELECT)}
        />
      )}

      {appState === AppState.TERMINAL && selectedLangs.length > 0 && (
        <Terminal 
          languages={selectedLangs} 
          mode={selectedMode} 
          onComplete={handleTestComplete}
          onAbort={() => setAppState(AppState.MODE_SELECT)}
        />
      )}

      {appState === AppState.ANALYSIS && finalMetrics && (
        <PostAnalysis 
          metrics={finalMetrics} 
          mode={selectedMode} 
          language={selectedLangs[0]}
          onRestart={reset}
        />
      )}
    </div>
  );
};

export default App;
