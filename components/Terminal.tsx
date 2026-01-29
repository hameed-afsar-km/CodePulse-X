
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, GameMode, PerformanceMetrics } from '../types';

interface TerminalProps {
  languages: Language[];
  mode: GameMode;
  onComplete: (metrics: PerformanceMetrics) => void;
  onAbort: () => void;
}

interface Distraction {
  id: number;
  type: 'notification' | 'popup' | 'chat';
  text: string;
  x: number;
  y: number;
  createdAt: number;
}

const Terminal: React.FC<TerminalProps> = ({ languages, mode, onComplete, onAbort }) => {
  const [currentLangIndex, setCurrentLangIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [keystrokes, setKeystrokes] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [distractions, setDistractions] = useState<Distraction[]>([]);
  
  const initialTime = mode === GameMode.BOSS_FIGHT ? 120 : (mode === GameMode.CONTEXT_SWITCH ? 60 + (languages.length - 1) * 30 : 60);

  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [showEndSequence, setShowEndSequence] = useState(false);
  
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    wpm: 0, cpm: 0, accuracy: 100, totalMistakes: 0, syntaxScore: 0, cognitiveLoad: 10, consistency: 100, elapsedTime: 0, history: [], errorPositions: []
  });
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const metricsRef = useRef(metrics);
  const distractionsRef = useRef(distractions);

  // Sync refs for stable handleFinish
  useEffect(() => { metricsRef.current = metrics; }, [metrics]);
  useEffect(() => { distractionsRef.current = distractions; }, [distractions]);

  const currentLanguage = languages[currentLangIndex];
  const targetCode = currentLanguage.snippet;
  const displayCode = (mode === GameMode.DEBUG || mode === GameMode.BUG_INJECTION) 
    ? (currentLanguage.buggySnippet || targetCode) 
    : targetCode;

  const handleFinish = useCallback(() => {
    if (showEndSequence) return;
    setShowEndSequence(true);
    
    // Immediate calculation for final state
    const finalMetrics = { 
      ...metricsRef.current, 
      elapsedTime: metricsRef.current.elapsedTime, 
      distractionHits: distractionsRef.current.length,
      totalMistakes: mistakes // Ensure the very latest mistake count is used
    };

    setTimeout(() => {
      onComplete(finalMetrics);
    }, 1800);
  }, [onComplete, showEndSequence, mistakes]);

  // Maintain Focus
  useEffect(() => {
    const focus = () => inputRef.current?.focus();
    focus();
    window.addEventListener('focus', focus);
    document.addEventListener('click', focus);
    return () => {
      window.removeEventListener('focus', focus);
      document.removeEventListener('click', focus);
    };
  }, []);

  // Timer Logic
  useEffect(() => {
    if (startTime && timeLeft > 0 && !showEndSequence) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (startTime && timeLeft === 0 && !showEndSequence) {
      handleFinish();
    }
  }, [startTime, timeLeft, handleFinish, showEndSequence]);

  // Context Switch Logic
  useEffect(() => {
    if (mode === GameMode.CONTEXT_SWITCH || mode === GameMode.BOSS_FIGHT) {
      const interval = setInterval(() => {
        setCurrentLangIndex((prev) => (prev + 1) % languages.length);
        setUserInput('');
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [mode, languages.length]);

  // Distraction Logic
  useEffect(() => {
    if (mode === GameMode.DISTRACTION || mode === GameMode.BOSS_FIGHT) {
      const interval = setInterval(() => {
        const types: Distraction['type'][] = ['notification', 'popup', 'chat'];
        const messages = ["Critical Error", "Update Available", "Incoming Call", "New Ticket Created", "Sync Interrupted"];
        const isLeft = Math.random() > 0.5;
        const x = isLeft ? Math.random() * 12 + 2 : Math.random() * 12 + 86;
        const y = Math.random() * 70 + 15;
        const newDist: Distraction = { id: Date.now(), createdAt: Date.now(), type: types[Math.floor(Math.random() * types.length)], text: messages[Math.floor(Math.random() * messages.length)], x, y };
        setDistractions(prev => [...prev, newDist]);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [mode]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setDistractions(prev => prev.filter(d => now - d.createdAt < 5000));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const updateMetrics = useCallback((input: string, k: number, m: number) => {
    if (!startTime) return;
    const now = Date.now();
    const elapsed = (now - startTime) / 1000 / 60;
    const wpm = elapsed > 0 ? Math.round((input.length / 5) / elapsed) : 0;
    const cpm = elapsed > 0 ? Math.round(input.length / elapsed) : 0;
    
    const currentErrors: number[] = [];
    for (let i = 0; i < input.length; i++) {
      if (input[i] !== targetCode[i]) currentErrors.push(i);
    }

    const sessionAccuracy = k > 0 ? Math.max(0, Math.round(((k - m) / k) * 100)) : 100;
    const load = Math.min(100, Math.max(0, 50 - sessionAccuracy + (wpm / 10)));

    setMetrics(prev => ({
      ...prev, 
      wpm, 
      cpm, 
      accuracy: sessionAccuracy, 
      totalMistakes: m,
      cognitiveLoad: Math.round(load), 
      errorPositions: currentErrors,
      elapsedTime: Math.round((now - startTime!) / 1000),
      history: [...prev.history, { time: Math.round((now - startTime!) / 1000), wpm, accuracy: sessionAccuracy, load }]
    }));

    // Auto-advance if finished snippet perfectly
    if (input === targetCode) {
      if (currentLangIndex < languages.length - 1 && mode !== GameMode.CONTEXT_SWITCH && mode !== GameMode.BOSS_FIGHT) {
        setCurrentLangIndex(prev => prev + 1);
        setUserInput('');
      } else if (mode !== GameMode.CONTEXT_SWITCH && mode !== GameMode.BOSS_FIGHT) {
        handleFinish();
      }
    }
  }, [startTime, targetCode, currentLangIndex, languages.length, mode, handleFinish]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!startTime) setStartTime(Date.now());
    const newVal = e.target.value;
    let nextKeystrokes = keystrokes;
    let nextMistakes = mistakes;

    if (newVal.length > userInput.length) {
      const addedCount = newVal.length - userInput.length;
      nextKeystrokes += addedCount;
      
      // Check each new character added
      for (let i = 0; i < addedCount; i++) {
        const charIndex = userInput.length + i;
        if (newVal[charIndex] !== targetCode[charIndex]) {
          nextMistakes++;
        }
      }
    }
    
    setKeystrokes(nextKeystrokes);
    setMistakes(nextMistakes);
    setUserInput(newVal);
    updateMetrics(newVal, nextKeystrokes, nextMistakes);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!startTime) setStartTime(Date.now());

      const nextCharInTarget = targetCode[userInput.length];
      let extension = '';
      let isMistake = false;

      if (nextCharInTarget === '\n') {
        extension = '\n';
        let lookAhead = userInput.length + 1;
        while (lookAhead < targetCode.length && (targetCode[lookAhead] === ' ' || targetCode[lookAhead] === '\t')) {
          extension += targetCode[lookAhead];
          lookAhead++;
        }
      } else {
        extension = '\n';
        isMistake = true;
      }

      const newUserInput = userInput + extension;
      setUserInput(newUserInput);
      const newKeystrokes = keystrokes + 1;
      const newMistakes = mistakes + (isMistake ? 1 : 0);
      setKeystrokes(newKeystrokes);
      setMistakes(newMistakes);
      updateMetrics(newUserInput, newKeystrokes, newMistakes);
    }
  };

  const isMirrored = mode === GameMode.MIRROR || (mode === GameMode.BOSS_FIGHT && timeLeft % 60 < 20);
  const isSilent = mode === GameMode.SILENT_ERROR;

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center p-8 md:p-20 bg-[#050505] relative overflow-hidden ${mode === GameMode.BOSS_FIGHT ? 'boss-atmosphere' : ''}`}>
      <style>{`
        .boss-atmosphere { background: radial-gradient(circle at center, #1a0505 0%, #050505 100%); }
        .mirrored { transform: scaleX(-1); }
      `}</style>
      
      <button 
        onClick={onAbort}
        className="absolute top-10 right-10 z-[300] flex items-center gap-4 group bg-stone-900/90 p-3 px-6 border border-white/20 hover:border-[var(--accent)] transition-all rounded shadow-2xl"
      >
        <span className="text-[11px] font-mono text-white group-hover:text-[var(--accent)] uppercase tracking-widest font-black">
          [ Go Back ]
        </span>
      </button>

      <div className="absolute top-0 left-0 w-full h-2 bg-white/5">
        <motion.div 
          className="h-full bg-[var(--accent)] shadow-[0_0_20px_var(--accent)]" 
          animate={{ width: `${(timeLeft / initialTime) * 100}%` }} 
          transition={{ ease: "linear" }}
        />
      </div>

      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-end mb-12 relative z-10 gap-8">
        <div className="space-y-2">
          <p className="text-[var(--accent)] font-mono text-xs uppercase tracking-widest font-black">{mode.replace('_', ' ')}</p>
          <h2 className="text-6xl font-black text-white tracking-tighter uppercase italic">{currentLanguage.name}</h2>
        </div>
        
        <div className="flex space-x-12 font-mono text-right pb-1">
          <div><p className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Speed</p><p className="text-5xl font-black text-white">{metrics.wpm} WPM</p></div>
          <div><p className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Accuracy</p><p className="text-5xl font-black text-[var(--accent)]">{metrics.accuracy}%</p></div>
          <div className="text-red-500"><p className="text-[9px] uppercase tracking-widest mb-1">Time Left</p><p className="text-5xl font-black tabular-nums">{timeLeft}s</p></div>
        </div>
      </div>

      <div 
        className={`relative w-full max-w-6xl h-[520px] bg-stone-900/60 p-16 font-mono text-xl md:text-2xl overflow-hidden border border-white/10 shadow-2xl ${isMirrored ? 'mirrored' : ''}`} 
        onClick={() => inputRef.current?.focus()}
      >
        <div className="relative z-10 whitespace-pre-wrap break-words leading-relaxed select-none tracking-wider font-medium">
          {targetCode.split('').map((targetChar, i) => {
            const isTyped = i < userInput.length;
            const isCorrect = userInput[i] === targetCode[i];
            const isBuggyInView = displayCode[i] !== targetChar;
            
            let color = 'text-white/10';
            let charToDisplay = targetChar;

            if (isTyped) {
              if (isSilent) {
                color = 'text-white/40';
              } else {
                color = isCorrect ? 'text-[var(--accent)]' : 'text-white bg-red-600 px-1';
              }
            } else if (isBuggyInView && (mode === GameMode.DEBUG || mode === GameMode.BUG_INJECTION)) {
              color = 'text-orange-500/50 underline decoration-orange-500/30';
              charToDisplay = displayCode[i];
            }

            return (
              <span key={i} className={`${color} transition-colors duration-75`}>
                {charToDisplay === '\n' ? '↵\n' : charToDisplay}
              </span>
            );
          })}
          <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="inline-block w-4 h-8 bg-[var(--accent)] align-middle ml-1" />
        </div>
        <textarea 
          ref={inputRef} 
          autoFocus 
          spellCheck={false} 
          autoComplete="off" 
          className="absolute inset-0 opacity-0 cursor-default" 
          value={userInput} 
          onChange={handleInputChange} 
          onKeyDown={handleKeyDown}
        />
      </div>

      <AnimatePresence>
        {distractions.map(d => (
          <motion.div key={d.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.2 }} className="absolute z-[100] pointer-events-none" style={{ left: `${d.x}%`, top: `${d.y}%` }}>
            <div className="bg-stone-900 border border-white/20 p-4 shadow-2xl border-l-4 border-l-[var(--accent)] min-w-[200px]">
              <p className="text-[10px] text-white/80 font-mono uppercase font-black">{d.text}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {showEndSequence && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="absolute inset-0 bg-black/95 z-[500] flex items-center justify-center text-center"
          >
             <div className="space-y-4">
               <h1 className="text-7xl font-black text-white italic uppercase tracking-tighter">Test Finished!</h1>
               <p className="text-[var(--accent)] font-mono text-xs uppercase tracking-[1em] font-black animate-pulse">Analyzing Performance...</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Terminal;
