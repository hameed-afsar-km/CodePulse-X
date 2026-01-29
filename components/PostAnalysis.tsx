
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, YAxis } from 'recharts';
import { PerformanceMetrics, Language, GameMode } from '../types';
import { getAICoachSummary } from '../services/aiCoach';

interface PostAnalysisProps {
  metrics: PerformanceMetrics;
  mode: GameMode;
  language: Language;
  onRestart: () => void;
}

const PostAnalysis: React.FC<PostAnalysisProps> = ({ metrics, mode, language, onRestart }) => {
  const [aiData, setAiData] = useState<{ summary: string; archetype: string; recommendations: string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAI = async () => {
      setLoading(true);
      const res = await getAICoachSummary(metrics, mode);
      setAiData(res);
      setLoading(false);
    };
    fetchAI();
  }, [metrics, mode]);

  return (
    <div className="w-full h-full bg-[#050505] p-6 md:p-12 overflow-y-auto no-scrollbar relative">
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        
        <button 
          onClick={onRestart}
          className="absolute top-10 right-10 z-50 flex items-center gap-4 group bg-stone-900/90 p-3 px-6 border border-white/20 hover:border-[var(--accent)] transition-all rounded shadow-2xl"
        >
          <span className="text-[11px] font-mono text-white group-hover:text-[var(--accent)] uppercase tracking-widest font-black">
            [ Go Back ]
          </span>
        </button>

        <div className="flex flex-col border-b border-white/10 pb-8">
           <p className="text-[var(--accent)] font-mono text-xs uppercase tracking-[0.5em] mb-2">Final Report</p>
           <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none">Your Results.</h1>
        </div>

        {/* GRID DIVISION 1: SPEED, CPM, ACCURACY, AND GRAPH */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border border-white/10 bg-stone-900/10 overflow-hidden">
          {/* Main Stats */}
          <div className="lg:col-span-4 border-r border-white/10 p-10 space-y-12">
            <div className="space-y-10">
              <StatDisplay label="Words Per Minute" value={metrics.wpm} sub="Typing Speed" color="white" />
              <StatDisplay label="Accuracy Score" value={metrics.accuracy} suffix="%" sub="Typing Precision" color="var(--accent)" />
              <StatDisplay label="Total Mistakes" value={metrics.totalMistakes} sub="Keystroke Errors" color="white" />
            </div>
            <div className="pt-8 border-t border-white/5 flex justify-between items-center">
              <div>
                <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest font-black">Time Taken</p>
                <p className="text-xl font-mono text-white font-black">{metrics.elapsedTime} Seconds</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest font-black">Final Errors</p>
                <p className="text-xl font-mono text-red-500 font-black">{metrics.errorPositions.length}</p>
              </div>
            </div>
          </div>

          {/* Combined Progress Graph */}
          <div className="lg:col-span-8 p-10 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-10">
               <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest font-black">Speed Performance Over Time</p>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.history}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ background: '#0c0a09', border: '1px solid #292524', fontSize: '10px', color: '#fff', fontFamily: 'JetBrains Mono' }}
                    itemStyle={{ color: 'var(--accent)' }}
                  />
                  <XAxis hide dataKey="time" />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Area 
                    type="monotone" 
                    dataKey="wpm" 
                    stroke="var(--accent)" 
                    strokeWidth={4} 
                    fill="url(#chartGradient)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* GRID DIVISION 2: ERROR HEATMAP */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-white/10 bg-stone-900/10 p-10"
        >
          <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest font-black">Syntax Audit (Detailed View)</p>
            <span className="text-xs font-mono text-red-500 font-black">{metrics.errorPositions.length} Unresolved Errors</span>
          </div>
          <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-all opacity-80 max-h-60 overflow-y-auto custom-scrollbar pr-4">
            {language.snippet.split('').map((char, i) => {
              const isError = metrics.errorPositions.includes(i);
              return (
                <span key={i} className={`${isError ? 'text-red-500 bg-red-500/10 underline decoration-red-500/80 font-bold' : 'text-white/40'}`}>
                  {char === '\n' ? '↵\n' : char}
                </span>
              );
            })}
          </div>
        </motion.div>

        {/* GRID DIVISION 3: AI ANALYSIS AND IMPROVEMENT */}
        <div className="border border-white/10 bg-stone-900/10 p-10 lg:p-14">
          <div className="flex items-center gap-6 mb-12">
             <div className="w-1.5 h-8 bg-[var(--accent)]" />
             <p className="text-xs font-mono text-white/40 uppercase tracking-widest font-black">AI Performance Analysis</p>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <div className="space-y-8 animate-pulse">
                <div className="h-6 bg-white/5 w-full rounded" />
                <div className="h-6 bg-white/5 w-5/6 rounded" />
                <div className="h-6 bg-white/5 w-4/6 rounded" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
                <div className="md:col-span-7 space-y-8">
                   <div className="space-y-2">
                     <p className="text-[9px] font-mono text-[var(--accent)] uppercase tracking-widest font-black">Your Typing Style</p>
                     <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">{aiData?.archetype}</h3>
                   </div>
                   <p className="text-white/70 text-lg leading-relaxed font-medium">
                     {aiData?.summary}
                   </p>
                </div>

                <div className="md:col-span-5 md:border-l border-white/10 md:pl-16 space-y-10">
                   <p className="text-[10px] font-mono text-[var(--accent)] uppercase tracking-widest font-black">How to Improve</p>
                   <div className="space-y-8">
                     {aiData?.recommendations.map((tip, idx) => (
                       <div key={idx} className="flex gap-6 group">
                         <span className="text-xs font-mono text-white/20 mt-1 font-black">0{idx+1}</span>
                         <p className="text-sm font-bold text-white/90 uppercase tracking-wide leading-tight group-hover:text-[var(--accent)] transition-colors">{tip}</p>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const StatDisplay = ({ label, value, suffix = "", sub, color }: any) => (
  <div className="group">
    <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest font-black mb-2">{label}</p>
    <div className="flex items-baseline gap-2 mb-1">
      <p className="text-7xl font-black italic tracking-tighter leading-none" style={{ color }}>{value}</p>
      <span className="text-xs font-mono text-white/30 font-black">{suffix}</span>
    </div>
    <p className="text-[8px] font-mono text-stone-500 uppercase tracking-widest font-black group-hover:text-[var(--accent)] transition-colors">{sub}</p>
  </div>
);

export default PostAnalysis;
