'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, ChevronDown, Users } from 'lucide-react';
import { AssessmentForm } from '@/components/assessment-form';
import { useEffect, useState } from 'react';
import { getAssessmentCount } from '@/app/actions';

export function HeroSection() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    getAssessmentCount().then(setCount);
  }, []);

  return (
    <section className="h-screen flex flex-col items-center justify-center text-center px-4 relative z-20">
      <motion.div 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="space-y-8"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-400 text-xs font-mono tracking-[0.2em] uppercase">
            <Zap className="w-3 h-3 animate-pulse" /> Initialize // Secure_Connection
          </div>
          
          {count !== null && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]"
            >
              <Users className="w-3 h-3 text-blue-500" /> {count.toLocaleString()}+ Tactical Scans Completed
            </motion.div>
          )}
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-[10rem] font-black tracking-tighter leading-none bg-gradient-to-b from-white via-white to-white/20 bg-clip-text text-transparent">
          THE GUARDIAN
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-2xl text-muted-foreground/80 font-light tracking-wide leading-relaxed">
          A high-performance diagnostic engine protecting your career from the accelerating curve of AI automation.
        </p>
        <div className="flex flex-col items-center gap-4 pt-12">
          <div className="text-[10px] font-mono text-blue-500/50 uppercase tracking-[0.4em]">
            [ Scroll to Decrypt Strategy ]
          </div>
          <ChevronDown className="w-8 h-8 text-blue-500/30 animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}

export function TacticalIntro() {
  return (
    <div className="max-w-4xl mx-auto text-center mb-32 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">
          PROTECT YOUR <br />
          <span className="text-blue-500">ASSETS.</span>
        </h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto mt-8" />
      </motion.div>
      <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
        Our diagnostic core analyzes local geospatial datasets and predictive AI benchmarks to calculate your tactical survival probability.
      </p>
    </div>
  );
}

export function AssessmentStage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      className="relative"
    >
      <div className="absolute -inset-20 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="text-center mb-12 space-y-4">
        <h3 className="text-sm font-mono text-blue-400 uppercase tracking-[0.3em]">Phase 1 // Core_Scan</h3>
        <h2 className="text-4xl font-bold tracking-tight text-white">Initialize Career Resilience Diagnostic</h2>
      </div>
      <AssessmentForm />
    </motion.div>
  );
}
