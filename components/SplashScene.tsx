
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SplashSceneProps {
  onFinish: () => void;
}

const SplashScene: React.FC<SplashSceneProps> = ({ onFinish }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const count = 150;
    
    // Get current accent color from document computed styles
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#f59e0b';

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        size: Math.random() * 1.5 + 0.2,
        color: Math.random() > 0.3 ? accentColor : '#dc2626'
      });
    }

    let animationFrame: number;
    const render = () => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.rect(p.x, p.y, p.size, p.size); // Industrial square particles
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.2;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 180) {
            ctx.beginPath();
            ctx.strokeStyle = accentColor;
            ctx.lineWidth = (1 - dist / 180) * 0.4;
            ctx.globalAlpha = (1 - dist / 180) * 0.08;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-[#050505]"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      <div className="relative text-center z-10 w-full max-w-4xl px-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="space-y-12"
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-1 bg-[var(--accent)] mb-8" />
            <div className="inline-flex items-center space-x-4 mb-2">
              <span className="text-[var(--accent)] text-[10px] font-mono tracking-[0.5em] uppercase font-bold">Session Initialization</span>
            </div>
            <h1 className="text-[10vw] font-black tracking-tighter text-white leading-none uppercase italic">
              Code<span className="text-[var(--accent)] line-through decoration-white/20">Pulse</span>
            </h1>
          </div>
          
          <div className="grid grid-cols-3 gap-8 text-left border-t border-white/5 pt-8 max-w-2xl mx-auto">
             <div>
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-2">Protocol</p>
                <p className="text-xs font-mono text-[var(--accent)]">SOLAR_INDUSTRIAL_V4</p>
             </div>
             <div>
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-2">Core Status</p>
                <p className="text-xs font-mono text-white animate-pulse">OVERDRIVE_MODE</p>
             </div>
             <div>
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-2">Linkage</p>
                <p className="text-xs font-mono text-white">SECURE_DASH</p>
             </div>
          </div>

          <div className="relative w-full h-[2px] bg-white/5 overflow-hidden">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 bottom-0 w-1/3 bg-[var(--accent)] shadow-[0_0_15px_var(--accent)]"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SplashScene;
