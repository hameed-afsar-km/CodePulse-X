
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MODES, ACCENT_COLORS } from '../constants';
import { GameMode } from '../types';

interface ModeSelectorProps {
  onSelect: (mode: GameMode) => void;
  onAccentChange: (color: string) => void;
  currentAccent: string;
  onOpenHistory: () => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelect, onAccentChange, currentAccent, onOpenHistory }) => {
  const [hoveredMode, setHoveredMode] = useState<GameMode | null>(MODES[0].id);

  return (
    <div className="w-full h-full flex bg-[#050505] relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--accent)_0%,transparent_70%)] opacity-10" />
      </div>

      {/* Left: Tactical List */}
      <div className="w-1/2 h-full border-r border-white/5 flex flex-col relative z-10 overflow-y-auto no-scrollbar scroll-smooth p-12 md:p-24">
        <div className="mb-20">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-2 h-2 bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />
            <p className="text-[var(--accent)] font-mono text-[10px] uppercase tracking-[0.5em] font-black">System Terminal 0x1</p>
          </div>
          <h2 className="text-7xl font-black text-white tracking-tighter uppercase italic leading-none">Select Mode.</h2>

          <div className="mt-8 flex items-center space-x-6">
            <button
              onClick={onOpenHistory}
              className="px-6 py-2 border border-white/10 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all font-mono text-[9px] uppercase tracking-[0.2em] bg-white/5 rounded-sm"
            >
              [ View_Archives ]
            </button>
            <div className="h-px w-24 bg-white/5" />
            <div className="flex space-x-2">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => onAccentChange(color.value)}
                  className={`w-3 h-3 rounded-full border border-white/10 transition-transform hover:scale-150 ${currentAccent === color.value ? 'ring-2 ring-white/50' : ''}`}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {MODES.map((mode, i) => (
            <motion.div
              key={mode.id}
              onMouseEnter={() => setHoveredMode(mode.id)}
              onClick={() => onSelect(mode.id)}
              className={`group cursor-pointer p-6 border transition-all duration-300 relative overflow-hidden ${hoveredMode === mode.id
                  ? 'border-[var(--accent)] bg-white/5 translate-x-4'
                  : 'border-white/5 hover:border-white/20'
                }`}
            >
              {hoveredMode === mode.id && (
                <motion.div
                  layoutId="active-bar"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)]"
                />
              )}
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-6">
                  <span className={`font-mono text-xs ${hoveredMode === mode.id ? 'text-[var(--accent)]' : 'text-white/20'}`}>
                    0{i + 1}
                  </span>
                  <h3 className={`text-3xl font-black uppercase tracking-tight transition-colors ${hoveredMode === mode.id ? 'text-white italic' : 'text-white/40'
                    }`}>
                    {mode.name}
                  </h3>
                </div>
                <div className={`transition-all duration-500 ${hoveredMode === mode.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                  <span className="text-[var(--accent)] font-mono text-xs">READY_TO_BOOT {'>>'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer padding */}
        <div className="h-32 flex-shrink-0" />
      </div>

      {/* Right: Preview Panel */}
      <div className="w-1/2 h-full bg-stone-900/10 flex items-center justify-center p-24 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {hoveredMode && (
            <motion.div
              key={hoveredMode}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -20 }}
              className="max-w-xl space-y-12"
            >
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 bg-[var(--accent)] text-black font-mono text-[10px] font-black uppercase tracking-widest">
                  Unit_{MODES.findIndex(m => m.id === hoveredMode) + 1}
                </div>
                <h1 className="text-8xl font-black text-white tracking-tighter uppercase italic leading-none">
                  {MODES.find(m => m.id === hoveredMode)?.name}
                </h1>
              </div>

              <div className="space-y-6">
                <p className="text-xl text-stone-400 font-medium leading-relaxed">
                  {MODES.find(m => m.id === hoveredMode)?.desc}
                </p>
                <div className="flex items-center space-x-12 pt-8 border-t border-white/5">
                  <div>
                    <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-1">Authorization</p>
                    <p className="text-xs font-mono text-[var(--accent)] font-bold">LVL_4_CLEARANCE</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-1">Stress Level</p>
                    <p className="text-xs font-mono text-white font-bold uppercase">
                      {hoveredMode === GameMode.BOSS_FIGHT ? 'EXTREME' : 'OPTIMAL'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tactical UI Decoration */}
        <div className="absolute top-12 right-12 text-right">
          <p className="text-[9px] font-mono text-white/10 uppercase tracking-[0.5em] mb-1">Codepulse Engine v.4.2</p>
          <div className="w-48 h-1 bg-white/5 overflow-hidden">
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-1/3 h-full bg-[var(--accent)]/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;
