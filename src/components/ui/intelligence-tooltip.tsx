'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';

interface IntelligenceTooltipProps {
  children: React.ReactNode;
  content: string;
  className?: string;
}

export function IntelligenceTooltip({ children, content, className }: IntelligenceTooltipProps) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX + 15);
    mouseY.set(e.clientY + 15);
  };

  return (
    <div 
      className={cn("relative cursor-none-on-hover w-full", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{ x, y, position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }}
            className="px-3 py-1.5 glass border-blue-500/30 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.2)]"
          >
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest whitespace-nowrap">
                {content}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
