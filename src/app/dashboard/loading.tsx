'use client';

import { motion } from 'framer-motion';
import { Loader2, Zap } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-1000">
      <div className="relative">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-24 h-24 rounded-full border-2 border-blue-500/10 flex items-center justify-center"
        >
          <div className="absolute inset-0 border-t-2 border-blue-500 rounded-full" />
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Zap className="w-8 h-8 text-blue-500 animate-pulse" />
        </div>
      </div>

      <div className="space-y-2 text-center">
        <div className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.5em] animate-pulse">
          Synchronizing // Neural_Link
        </div>
        <div className="text-xl font-black italic uppercase tracking-tighter text-white/40">
          Fetching Intelligence <span className="animate-pulse">...</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 w-64 pt-8 border-t border-white/5 opacity-20">
        <div className="h-1 bg-blue-500/20 rounded-full overflow-hidden">
          <motion.div 
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full bg-blue-500"
          />
        </div>
        <div className="h-1 bg-blue-500/20 rounded-full overflow-hidden">
          <motion.div 
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="w-full h-full bg-blue-500"
          />
        </div>
        <div className="h-1 bg-blue-500/20 rounded-full overflow-hidden">
          <motion.div 
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="w-full h-full bg-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
