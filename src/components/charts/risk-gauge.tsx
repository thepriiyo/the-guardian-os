'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function RiskGauge({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s < 30) return 'text-emerald-400';
    if (s < 70) return 'text-blue-400';
    return 'text-rose-500';
  };

  const getBorderColor = (s: number) => {
    if (s < 30) return 'stroke-emerald-400';
    if (s < 70) return 'stroke-blue-400';
    return 'stroke-rose-500';
  };

  const circumference = 2 * Math.PI * 44;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-full max-w-[280px] aspect-square mx-auto">
      {/* Decorative Outer Ring */}
      <div className="absolute inset-0 rounded-full border border-white/5 pointer-events-none" />
      
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full transform -rotate-90 drop-shadow-[0_0_20px_rgba(59,130,246,0.1)]"
      >
        {/* Background Track */}
        <circle
          cx="50"
          cy="50"
          r="44"
          className="text-white/5 stroke-current"
          strokeWidth="2"
          fill="transparent"
        />
        
        {/* Progress Ring */}
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          cx="50"
          cy="50"
          r="44"
          className={cn('transition-all duration-1000 ease-out', getBorderColor(score))}
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeLinecap="round"
          fill="transparent"
          style={{ 
            filter: score > 70 ? 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.6))' : 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.6))'
          }}
        />
      </svg>

      {/* Internal Text Data */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className={cn('text-6xl font-black italic tracking-tighter leading-none mb-2', getColor(score))}>
            {score.toFixed(1)}%
          </div>
          <div className="text-[12px] font-mono font-bold text-white/40 uppercase tracking-[0.4em] italic border-t border-white/10 pt-2">
            Risk_Ratio
          </div>
        </motion.div>
      </div>

      {/* Pulsing Scan Indicator */}
      <div className="absolute inset-4 rounded-full border border-blue-500/5 animate-pulse" />
    </div>
  );
}
