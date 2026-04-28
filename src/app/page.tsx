'use client';

import { HeroSection, TacticalIntro, AssessmentStage } from '@/components/home-client';
import { Shield, Globe, Cpu, Lock, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative">
      {/* 1. Cinematic Hero Stage */}
      <HeroSection />

      {/* 2. Tactical Intelligence Stage */}
      <section className="min-h-screen py-16 md:py-32 relative z-20 bg-gradient-to-b from-transparent via-[#020617]/80 to-transparent">
        <div className="container mx-auto px-4">
          <TacticalIntro />

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
          <AssessmentStage />
        </div>
      </section>

      {/* 4. Depth Footer Section */}
      <footer className="relative z-20 py-20 border-t border-white/5 bg-[#020617]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="space-y-6">
              <div className="text-2xl font-black tracking-tighter uppercase italic">
                GUARDIAN<span className="text-blue-500">OS</span>
              </div>
              <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-xs">
                A high-performance diagnostic engine protecting your career from the accelerating curve of AI automation.
              </p>
            </div>
            

            <div className="space-y-6">
              <h4 className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30">Intelligence & Legal</h4>
              <nav className="flex flex-col gap-3">
                <Link href="/blog" className="text-sm text-white/60 hover:text-blue-400 transition-colors">Intelligence Briefings</Link>
                <Link href="/legal" className="text-sm text-white/60 hover:text-blue-400 transition-colors">Privacy Policy</Link>
                <Link href="/legal" className="text-sm text-white/60 hover:text-blue-400 transition-colors">Terms of Service</Link>
                <Link href="/legal" className="text-sm text-white/60 hover:text-blue-400 transition-colors">Security Protocol</Link>
              </nav>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30">Command Center</h4>
              <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                <div className="text-[10px] font-mono text-blue-400 mb-1">STATUS: OPERATIONAL</div>
                <div className="text-[9px] text-white/30 uppercase tracking-widest">Neural Link: Gemma 3</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-8">
            <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
              © 2026 THE GUARDIAN OS // ENGINEERED BY PRIIYO
            </div>
            <div className="flex items-center gap-6">
              <Shield className="w-4 h-4 text-white/10" />
              <Lock className="w-4 h-4 text-white/10" />
              <Globe className="w-4 h-4 text-white/10" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="group space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-all duration-500">
        {icon}
      </div>
      <h3 className="text-lg font-bold tracking-tight text-white">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed font-light">
        {desc}
      </p>
    </div>
  );
}
