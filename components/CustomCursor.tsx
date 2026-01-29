
import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  const springConfig = { damping: 30, stiffness: 250 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX - 20);
      cursorY.set(e.clientY - 20);

      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' || 
        ['BUTTON', 'A', 'INPUT', 'TEXTAREA'].includes(target.tagName)
      );
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Reticle Center */}
      <div 
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ 
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`,
        }}
      >
        <div className="w-1 h-1 bg-[var(--accent)] rounded-full shadow-[0_0_8px_var(--accent)]" />
      </div>

      {/* Crosshair Frame */}
      <motion.div 
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ x: cursorX, y: cursorY }}
      >
        <motion.div 
          animate={{ 
            scale: isPointer ? 1.5 : 1,
            rotate: isPointer ? 45 : 0,
            opacity: isPointer ? 0.9 : 0.4
          }}
          className="w-10 h-10 border border-[var(--accent)] relative"
        >
          {/* Corner Marks */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[var(--accent)]" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[var(--accent)]" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[var(--accent)]" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[var(--accent)]" />
          
          {/* Centering Cross */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[var(--accent)]/20 -translate-y-1/2" />
          <div className="absolute left-1/2 top-0 h-full w-[1px] bg-[var(--accent)]/20 -translate-x-1/2" />
        </motion.div>
      </motion.div>
    </>
  );
};

export default CustomCursor;
