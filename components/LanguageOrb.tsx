
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../types';

interface LanguageOrbProps {
  languages: Language[];
  onSelect: (lang: Language) => void;
  onBack: () => void;
}

const LanguageOrb: React.FC<LanguageOrbProps> = ({ languages, onSelect, onBack }) => {
  const [hoveredLang, setHoveredLang] = useState<Language | null>(null);

  return (
    <div className="w-full h-full flex items-center justify-center relative bg-[#0b0d10]">
      <button 
        onClick={onBack}
        className="absolute top-12 left-12 text-slate-500 hover:text-white transition-colors flex items-center space-x-2 z-10"
      >
        <span className="text-lg">←</span>
        <span className="font-mono text-xs uppercase tracking-widest">Abort Selection</span>
      </button>

      <div className="relative w-[600px] h-[600px] flex items-center justify-center">
        {/* The "Orb" Core */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-[1px] border-blue-500/10 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[50px] border-[1px] border-cyan-400/20 rounded-full"
        />

        <div className="relative z-10 text-center pointer-events-none">
          <AnimatePresence mode="wait">
            {hoveredLang ? (
              <motion.div
                key={hoveredLang.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h3 className="text-5xl font-black text-white" style={{ textShadow: `0 0 20px ${hoveredLang.color}` }}>
                  {hoveredLang.name}
                </h3>
                <p className="text-slate-500 font-mono text-xs mt-2">NEURAL SYNTAX ENGAGED</p>
              </motion.div>
            ) : (
              <motion.div key="default">
                <h3 className="text-4xl font-bold text-slate-700">Select Syntax</h3>
                <p className="text-slate-800 font-mono text-xs mt-2">CHOOSE LANGUAGE CORE</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {languages.map((lang, idx) => {
          const angle = (idx / languages.length) * Math.PI * 2;
          const radius = 220;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={lang.id}
              className="absolute cursor-pointer"
              style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, x: '-50%', y: '-50%' }}
              whileHover={{ scale: 1.5 }}
              onClick={() => onSelect(lang)}
              onMouseEnter={() => setHoveredLang(lang)}
              onMouseLeave={() => setHoveredLang(null)}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg"
                style={{ backgroundColor: lang.color, color: '#fff' }}
              >
                {lang.name.slice(0, 2).toUpperCase()}
              </div>
              <div 
                className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{ backgroundColor: lang.color }}
              />
            </motion.div>
          );
        })}
      </div>

      <div className="absolute bottom-12 right-12 text-right opacity-30">
        <p className="text-xs font-mono">NEURAL GRAPH v2.4</p>
        <p className="text-[10px] text-slate-500">DISTRIBUTED SYNTAX PROCESSING</p>
      </div>
    </div>
  );
};

export default LanguageOrb;
