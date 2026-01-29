
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, GameMode } from '../types';

interface LanguageNetworkProps {
  languages: Language[];
  mode: GameMode;
  onSelect: (langs: Language[]) => void;
  onBack: () => void;
}

const LanguageNetwork: React.FC<LanguageNetworkProps> = ({ languages, mode, onSelect, onBack }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hoveredLang, setHoveredLang] = useState<Language | null>(null);

  const isMultiSelect = mode === GameMode.CONTEXT_SWITCH || mode === GameMode.BOSS_FIGHT;
  const maxSelection = mode === GameMode.BOSS_FIGHT ? 3 : (mode === GameMode.CONTEXT_SWITCH ? 5 : 1);

  // Nodes arranged in a slightly more compact circle to accommodate more items
  const nodes = useMemo(() => {
    return languages.map((lang, idx) => {
      const angle = (idx / languages.length) * Math.PI * 2;
      const radius = 320;
      return { ...lang, x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
    });
  }, [languages]);

  const toggleLang = (lang: Language) => {
    if (isMultiSelect) {
      if (selectedIds.includes(lang.id)) {
        setSelectedIds(prev => prev.filter(id => id !== lang.id));
      } else if (selectedIds.length < maxSelection) {
        setSelectedIds(prev => [...prev, lang.id]);
      }
    } else {
      onSelect([lang]);
    }
  };

  const handleStart = () => {
    if (mode === GameMode.BOSS_FIGHT && selectedIds.length !== 3) return;
    if (mode === GameMode.CONTEXT_SWITCH && selectedIds.length < 2) return;
    onSelect(languages.filter(l => selectedIds.includes(l.id)));
  };

  const isReady = mode === GameMode.BOSS_FIGHT 
    ? selectedIds.length === 3 
    : selectedIds.length >= (isMultiSelect ? 2 : 1);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative bg-[#050505]">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <button 
        onClick={onBack}
        className="absolute top-10 right-10 z-50 flex items-center gap-4 group bg-stone-900/80 p-3 px-6 border border-white/10 hover:border-[var(--accent)] transition-all rounded shadow-xl"
      >
        <span className="text-[11px] font-mono text-white group-hover:text-[var(--accent)] uppercase tracking-widest font-black">
          [ Go Back ]
        </span>
      </button>

      <div className="absolute top-12 left-12 text-left z-50">
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
          {mode === GameMode.BOSS_FIGHT ? "Construct Your Gauntlet" : "Select Syntax"}
        </h2>
        <div className="flex items-center gap-4 mt-2">
           <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em] font-bold">
            {mode === GameMode.BOSS_FIGHT 
              ? "Choose exactly 3 syntaxes"
              : (isMultiSelect ? `Select up to ${maxSelection}` : "Pick Your Environment")}
          </p>
          {mode === GameMode.BOSS_FIGHT && (
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className={`w-3 h-3 border ${selectedIds[i] ? 'bg-[var(--accent)] border-[var(--accent)]' : 'border-white/20'}`} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          {nodes.map((node, i) => (
            nodes.map((target, j) => {
              const dist = Math.hypot(node.x - target.x, node.y - target.y);
              if (dist > 50 && dist < 420) {
                const isActive = selectedIds.includes(node.id) && selectedIds.includes(target.id);
                return (
                  <motion.line 
                    key={`${i}-${j}`} 
                    x1={`calc(50% + ${node.x}px)`} 
                    y1={`calc(50% + ${node.y}px)`} 
                    x2={`calc(50% + ${target.x}px)`} 
                    y2={`calc(50% + ${target.y}px)`} 
                    stroke={isActive ? "var(--accent)" : "rgba(255, 255, 255, 0.05)"} 
                    strokeWidth={isActive ? "3" : "0.5"} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                  />
                );
              }
              return null;
            })
          ))}
        </svg>

        {/* Central Display */}
        <div className="relative z-10 text-center select-none pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div 
              key={hoveredLang?.id || 'idle'} 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 1.2 }} 
              className="flex flex-col items-center"
            >
              <h3 className="text-[12vw] font-black text-white tracking-tighter uppercase tabular-nums opacity-90 italic">
                {hoveredLang ? hoveredLang.id.slice(0, 3) : (selectedIds.length > 0 ? "INIT" : "SYNTAX")}
              </h3>
              <div className="h-1.5 w-48 bg-[var(--accent)] mt-4 shadow-[0_0_25px_var(--accent)]" />
              <p className="text-stone-500 font-mono text-xs mt-8 tracking-[1em] uppercase font-black">
                {hoveredLang ? hoveredLang.name : (selectedIds.length > 0 ? `${selectedIds.length} / ${maxSelection} LOCKED` : "Core Selection Required")}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Language Nodes */}
        {nodes.map((node) => {
          const isSelected = selectedIds.includes(node.id);
          const selectionIndex = selectedIds.indexOf(node.id);
          const isDisabled = !isSelected && selectedIds.length >= maxSelection;
          
          return (
            <motion.div 
              key={node.id} 
              className="absolute" 
              style={{ left: `calc(50% + ${node.x}px)`, top: `calc(50% + ${node.y}px)`, x: '-50%', y: '-50%' }} 
              onMouseEnter={() => setHoveredLang(node)} 
              onMouseLeave={() => setHoveredLang(null)} 
              onClick={() => !isDisabled && toggleLang(node)}
            >
              <motion.div 
                whileHover={!isDisabled ? { scale: 1.2, rotate: 15 } : {}} 
                className={`w-14 h-14 flex items-center justify-center cursor-pointer transition-all duration-300 border-2 ${
                  isSelected 
                    ? 'bg-[var(--accent)] border-[var(--accent)] text-black shadow-[0_0_40px_var(--accent-transparent)]' 
                    : (isDisabled ? 'bg-stone-900 text-white/5 border-white/5 cursor-not-allowed opacity-20' : 'bg-stone-900 text-[var(--accent)] border-white/10 hover:border-[var(--accent)] hover:text-white')
                }`}
              >
                <span className="text-[10px] font-mono font-black">{node.id.toUpperCase()}</span>
                {isSelected && isMultiSelect && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-black text-[var(--accent)] flex items-center justify-center text-[10px] font-bold border border-[var(--accent)] rotate-45">
                     <span className="-rotate-45">{selectionIndex + 1}</span>
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {isMultiSelect && (
        <motion.div 
          animate={{ opacity: selectedIds.length >= 1 ? 1 : 0, y: selectedIds.length >= 1 ? 0 : 60 }} 
          className="absolute bottom-24 z-50"
        >
          <button 
            onClick={handleStart} 
            disabled={!isReady} 
            className={`px-16 py-5 font-black text-xs uppercase tracking-[0.5em] transition-all duration-500 border-2 ${
              isReady 
                ? 'bg-[var(--accent)] text-black border-[var(--accent)] hover:bg-white hover:border-white shadow-[0_20px_40px_var(--accent-transparent)] scale-110' 
                : 'bg-white/5 text-white/20 border-white/10 cursor-not-allowed'
            }`}
          >
            {isReady ? `Start ${mode.replace('_', ' ')}` : (mode === GameMode.BOSS_FIGHT ? `Select ${3 - selectedIds.length} more` : `Select at least 2`)}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default LanguageNetwork;
