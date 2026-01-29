
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SessionAttempt } from '../types';

interface ProgressLabProps {
  history: SessionAttempt[];
  onBack: () => void;
  onClear: () => void;
}

const ProgressLab: React.FC<ProgressLabProps> = ({ history, onBack, onClear }) => {
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [isWiping, setIsWiping] = useState(false);

  const avgWpm = history.length > 0 
    ? Math.round(history.reduce((acc, s) => acc + s.wpm, 0) / history.length) 
    : 0;
  
  const avgAcc = history.length > 0 
    ? Math.round(history.reduce((acc, s) => acc + s.accuracy, 0) / history.length) 
    : 0;

  const peakWpm = history.length > 0
    ? Math.max(...history.map(s => s.wpm))
    : 0;

  const handleResetAction = () => {
    setIsWiping(true);
    setTimeout(() => {
      onClear();
      setIsWiping(false);
      setIsConfirmingReset(false);
    }, 1500);
  };

  return (
    <div className="w-full h-full bg-[#050505] p-12 md:p-24 overflow-y-auto no-scrollbar relative">
      <AnimatePresence>
        {isWiping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          >
            <div className="text-center space-y-4">
              <motion.div 
                animate={{ width: ['0%', '100%'] }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="w-64 h-1 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]" 
              />
              <p className="text-red-600 font-mono text-[10px] uppercase tracking-[1em] font-black animate-pulse">Wiping Core Memory...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto relative z-10">
        <button 
          onClick={onBack}
          className="absolute top-0 right-0 md:-top-4 z-50 flex items-center gap-4 group bg-stone-900/90 p-3 px-6 border border-white/20 hover:border-[var(--accent)] transition-all rounded shadow-2xl"
        >
          <span className="text-[11px] font-mono text-white group-hover:text-[var(--accent)] uppercase tracking-widest font-black">
            [ Go Back ]
          </span>
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-2 h-2 bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />
              <p className="text-[var(--accent)] font-mono text-[10px] uppercase tracking-widest font-black">Personal Performance Records</p>
            </div>
            <h2 className="text-7xl font-black text-white tracking-tighter uppercase italic leading-none">History.</h2>
          </div>

          <div className="flex items-center gap-4">
            {!isConfirmingReset ? (
              <button 
                onClick={() => setIsConfirmingReset(true)}
                className="px-8 py-3 border border-white/10 text-white/40 text-[10px] font-mono uppercase tracking-widest hover:border-red-600 hover:text-red-600 transition-all rounded font-black"
              >
                Purge Archives
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleResetAction}
                  className="px-8 py-3 bg-red-600 text-white text-[10px] font-mono uppercase tracking-widest hover:bg-red-700 transition-all rounded font-black shadow-[0_0_30px_rgba(220,38,38,0.3)]"
                >
                  Confirm Delete
                </button>
                <button 
                  onClick={() => setIsConfirmingReset(false)}
                  className="px-4 py-3 border border-white/10 text-white/40 text-[10px] font-mono uppercase tracking-widest hover:text-white transition-all rounded font-black"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-16 border-2 border-white/5 bg-stone-900/10">
          <HistoryTile label="Average Speed" value={avgWpm} suffix="WPM" color="white" />
          <HistoryTile label="Average Accuracy" value={avgAcc} suffix="%" color="var(--accent)" />
          <HistoryTile label="All-Time Best" value={peakWpm} suffix="WPM" color="white" />
        </div>

        <div className="space-y-12">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-xs font-mono text-white/40 uppercase tracking-widest font-black">Previous Sessions</h3>
            <span className="text-[10px] font-mono text-white/10 uppercase tracking-widest">{history.length} Sessions Stored</span>
          </div>

          {history.length === 0 ? (
            <div className="py-32 text-center border border-dashed border-white/10 rounded-lg">
              <p className="text-stone-700 font-mono text-sm uppercase tracking-widest">No session data in local cache.</p>
              <p className="text-stone-800 font-mono text-[9px] uppercase tracking-[0.5em] mt-4 font-black">Terminal Ready for Input</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-[9px] font-mono text-stone-500 uppercase tracking-widest text-left border-b border-white/10">
                    <th className="py-4 font-normal">Date</th>
                    <th className="py-4 font-normal">Mode</th>
                    <th className="py-4 font-normal text-right">Speed</th>
                    <th className="py-4 font-normal text-right">Accuracy</th>
                    <th className="py-4 font-normal text-right">Focus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {history.map((session) => (
                    <motion.tr initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} key={session.id} className="group hover:bg-white/5 transition-colors">
                      <td className="py-6 font-mono text-[11px] text-stone-400">
                        {new Date(session.timestamp).toLocaleDateString()}
                      </td>
                      <td className="py-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-white group-hover:text-[var(--accent)] transition-colors">
                            {session.mode.replace('_', ' ')}
                          </span>
                          <span className="text-[9px] font-mono text-stone-600 uppercase tracking-tighter">
                            {session.language}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 text-right font-mono text-sm text-white tabular-nums">
                        {session.wpm} <span className="text-[9px] text-stone-700 font-bold">WPM</span>
                      </td>
                      <td className="py-6 text-right">
                        <span className={`text-sm font-black tabular-nums ${session.accuracy > 95 ? 'text-[var(--accent)]' : 'text-stone-400'}`}>
                          {session.accuracy}%
                        </span>
                      </td>
                      <td className="py-6 text-right">
                        <div className="flex items-center justify-end space-x-3">
                          <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${session.load}%` }}
                              className="h-full bg-stone-700" 
                            />
                          </div>
                          <span className="text-[9px] font-mono text-stone-500 w-8">{session.load}%</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HistoryTile = ({ label, value, suffix, color }: any) => (
  <div className="p-10 border-r last:border-r-0 border-white/5 hover:bg-white/5 transition-colors group">
    <p className="text-[9px] font-mono text-stone-500 uppercase tracking-widest mb-4 font-black group-hover:text-[var(--accent)] transition-colors">{label}</p>
    <div className="flex items-baseline gap-3">
      <p className="text-5xl font-black italic tracking-tighter leading-none" style={{ color }}>{value}</p>
      <span className="text-[10px] font-mono text-stone-700 font-bold">{suffix}</span>
    </div>
  </div>
);

export default ProgressLab;
