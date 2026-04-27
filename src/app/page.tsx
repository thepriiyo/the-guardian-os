'use client';

import { AssessmentForm } from '@/components/assessment-form';
import { Shield, Zap, TrendingUp, Globe, ChevronDown, Cpu, Lock, MapPin } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Home() {
  const { scrollYProgress } = useScroll();
  
  // Driving the 3D Core via scroll progress
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);

  return (
    <div className="relative">
      {/* 1. Cinematic Hero Stage - No sticky to prevent overlap */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-4 relative z-20">
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-400 text-xs font-mono tracking-[0.2em] uppercase">
            <Zap className="w-3 h-3 animate-pulse" /> Initialize // Secure_Connection
          </div>
          <h1 className="text-6xl md:text-[10rem] font-black tracking-tighter leading-none bg-gradient-to-b from-white via-white to-white/20 bg-clip-text text-transparent">
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

      {/* 2. Tactical Intelligence Stage */}
      <section className="min-h-screen py-32 relative z-20 bg-gradient-to-b from-transparent via-[#020617]/80 to-transparent">
        <div className="container mx-auto px-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureItem 
              icon={<Globe className="w-6 h-6 text-blue-500" />}
              title="Local Intel"
              desc="Specific geospatial data from your city's economy."
            />
            <FeatureItem 
              icon={<Cpu className="w-6 h-6 text-blue-500" />}
              title="LLM Benchmarks"
              desc="Predictive modeling of capability breakthroughs."
            />
            <FeatureItem 
              icon={<MapPin className="w-6 h-6 text-blue-500" />}
              title="Tactical Map"
              desc="Verified roadmaps to high-leverage pivot roles."
            />
            <FeatureItem 
              icon={<Lock className="w-6 h-6 text-blue-500" />}
              title="Zero-Storage"
              desc="All data is processed locally. Never stored for training."
            />
          </div>
        </div>
      </section>

      {/* 3. The Diagnostic Core Stage */}
      <section className="min-h-screen py-40 relative z-20 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute -inset-20 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="text-center mb-12 space-y-4">
              <h3 className="text-sm font-mono text-blue-400 uppercase tracking-[0.3em]">Phase 1 // Core_Scan</h3>
              <h2 className="text-4xl font-bold tracking-tight">Initialize Career Resilience Diagnostic</h2>
            </div>
            <AssessmentForm />
          </motion.div>
        </div>
      </section>

      {/* 4. Depth Footer Section */}
      <section className="h-[50vh] flex items-center justify-center pointer-events-none opacity-[0.02]">
        <div className="text-[20rem] font-black italic tracking-tighter uppercase leading-none select-none">
          GUARDIAN
        </div>
      </section>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="group space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-all duration-500">
        {icon}
      </div>
      <h3 className="text-lg font-bold tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed font-light">
        {desc}
      </p>
    </div>
  );
}
