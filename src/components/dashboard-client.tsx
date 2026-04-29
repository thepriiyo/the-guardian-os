'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Brain, 
  Map, 
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  Users,
  Zap,
  Target,
  FileCode,
  Heart,
  Globe,
  Radio,
  Navigation,
  Compass,
  ZapOff,
  Cpu,
  Waves,
  Scan,
  Activity,
  Shield,
  Search,
  Lock,
  TrendingDown,
  TrendingUp,
  Radar,
  Crosshair,
  Terminal,
  Database
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReplacementMapChart } from '@/components/charts/radar-chart';
import { RiskGauge } from '@/components/charts/risk-gauge';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Assessment, ReportData } from '@/types';
import { IntelligenceTooltip } from '@/components/ui/intelligence-tooltip';
import { useState, useEffect, useMemo } from 'react';
import { IncomeBridgeChart } from '@/components/charts/income-bridge-chart';
import { MarketPulseHUD } from '@/components/market-pulse-hud';
import { GlobalPaywallCTA } from '@/components/global-paywall-cta';

export default function DashboardClient({ assessment }: { assessment: Assessment }) {
  const [pulseSentiment, setPulseSentiment] = useState<string>('Stable');
  const report = assessment.report_data;
  const replacementMap = useMemo(() => Array.isArray(report?.replacement_map) ? report.replacement_map : [], [report?.replacement_map]);
  const pivotPaths = useMemo(() => Array.isArray(report?.pivot_paths) ? report.pivot_paths : [], [report?.pivot_paths]);
  const financialProjection = useMemo(() => Array.isArray(report?.financial_projection) ? report.financial_projection : [], [report?.financial_projection]);
  const localNetworking = useMemo(() => Array.isArray(report?.local_networking) ? report.local_networking : [], [report?.local_networking]);
  
  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertTriangle className="w-12 h-12 text-yellow-500 animate-pulse" />
        <h2 className="text-xl font-bold uppercase tracking-tighter">Incomplete Intelligence Payload</h2>
        <p className="text-muted-foreground font-light">The AI diagnostic report could not be processed.</p>
        <Link href="/">
          <Button variant="outline" className="rounded-full px-8 mt-4">Restart Scan</Button>
        </Link>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className={cn(
        "space-y-8 py-10 transition-all duration-1000",
        (pulseSentiment === 'Volatile' || pulseSentiment === 'Caution') && "shadow-[inset_0_0_100px_rgba(239,68,68,0.1)] bg-red-500/[0.02]"
      )}
    >
      {/* HUD Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono text-blue-400 uppercase tracking-[0.3em] mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> Diagnostics // Active_Session
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase italic bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            {assessment.job_title}
          </h1>
          <div className="flex items-center gap-3 text-muted-foreground font-light">
            <Map className="w-4 h-4 text-blue-500/50" />
            <span className="text-lg tracking-wide uppercase">{assessment.location}</span>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest">ID_{assessment.id.slice(0, 8)}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-4">
          <div className="flex flex-col items-end gap-1">
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest opacity-50">Local_Risk_Index</div>
            <div className={cn(
              "text-6xl font-black italic",
              report.risk_score < 30 ? "text-emerald-400" : report.risk_score < 70 ? "text-blue-400" : "text-rose-500"
            )}>
              {Number(report.risk_score).toFixed(1)}%
            </div>
          </div>
          
          <Button 
            onClick={() => {
              const text = `My AI Career Risk Score is ${Math.round(report.risk_score)}% on The Guardian OS. 🛰️\n\nInitialize your tactical survival scan here: https://the-guardian-os.vercel.app`;

              window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
            }}
            variant="outline" 
            className="rounded-full border-blue-500/20 bg-blue-500/5 text-blue-400 text-[9px] font-mono tracking-widest uppercase hover:bg-blue-500 hover:text-white transition-all"
          >
            Broadcast Strategy <Radio className="ml-2 w-3 h-3 animate-pulse" />
          </Button>
        </div>
      </motion.div>

      {/* Top Paywall CTA */}
      {!assessment.is_unlocked && (
        <motion.div variants={item}>
          <GlobalPaywallCTA assessmentId={assessment.id} />
        </motion.div>
      )}

      {/* Main Intelligence Grid - Safari Grid-Full Lock Pass */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Column 1: Safari Grid-Full Lock */}
        <div className="h-full min-h-full">
           <div className="grid grid-rows-[auto_1fr] gap-6 h-full min-h-full">
              
              {/* Phase 1 Card (Automation Scan) */}
              <motion.div variants={item} className="h-full">
                <Card className="h-full glass border-white/5 bg-black/40 backdrop-blur-3xl overflow-hidden group hover:border-blue-500/30 transition-all duration-700 rounded-[2.5rem] flex flex-col">
                  <CardHeader className="py-4 px-8 border-b border-white/5 bg-white/[0.02]">
                    <CardTitle className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-400 flex items-center justify-between">
                      <span>PHASE 1 // AUTOMATION_SCAN</span>
                      <ShieldAlert className="w-3 h-3 animate-pulse" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 p-8 flex flex-col items-center justify-center overflow-hidden">
                    <div className="w-full flex items-center justify-center -my-8">
                      <IntelligenceTooltip content="Real-time probability of role automation">
                        <div className="scale-75">
                          <RiskGauge score={report.risk_score} />
                        </div>
                      </IntelligenceTooltip>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                      <div className="space-y-2">
                        <div className="text-[9px] font-mono text-white/30 uppercase tracking-[0.3em]">Certainty</div>
                        <div className="text-4xl font-black italic tracking-tighter">{report.metrics?.certainty_score}%</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-[9px] font-mono text-white/30 uppercase tracking-[0.3em]">Growth</div>
                        <div className="text-xl font-black text-blue-400 italic uppercase leading-none">{report.metrics?.capability_growth}</div>
                      </div>

                    </div>

                    <div className="w-full space-y-4 pt-6 border-t border-white/5">
                      <MetricKey title="Risk_Ratio" desc="Probability of significant role automation within 5 years." />
                      <MetricKey title="Velocity" desc="The speed at which AI is absorbing your specific functions." />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* AI THREAT RADAR - GRID ROW 2 (Strict Safari Stretch) */}
              <motion.div variants={item} className="h-full min-h-0 flex flex-col">
                 <div className="flex-1 h-full min-h-full">
                   <AIThreatRadar jobTitle={assessment.job_title} report={report} />
                 </div>
              </motion.div>
           </div>
        </div>

        {/* Tactical Skill Delta HUD (Column 2+3) */}
        <motion.div variants={item} className="lg:col-span-2 h-full flex flex-col min-h-0">
          <Card className="flex-1 glass border-white/5 bg-black/40 hover:border-blue-500/30 transition-all duration-700 rounded-[2.5rem] flex flex-col overflow-hidden">
            <CardHeader className="py-4 px-8 border-b border-white/5 bg-white/[0.02]">
              <CardTitle className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-400 flex items-center justify-between">
                <span>PHASE 2 // TACTICAL_SKILL_DELTA</span>
                <Brain className="w-3 h-3 animate-pulse text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
              
              {/* TOP: Neural Centrum Hero (Compact) */}
              <div className="w-full h-[400px] border-b border-white/5 relative flex flex-col items-center justify-center bg-blue-500/[0.01]">
                <div className="absolute top-4 right-8 flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]" />
                   <span className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.5em] font-black">Neural_Spectrum_Active</span>
                </div>

                <IntelligenceTooltip content="Human vs. AI proficiency mapping">
                  <div className="relative z-10 flex items-center justify-center scale-90">
                    <ReplacementMapChart chartData={replacementMap} />
                  </div>
                </IntelligenceTooltip>
              </div>

              {/* BOTTOM: Intelligence Matrix */}
              <div className="w-full p-8 bg-white/[0.01] flex flex-col justify-center">
                <div className="mb-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.3em]">Intelligence_Analysis</div>
                    <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">Human Advantage Dimensions</h3>
                  </div>
                  <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest border border-white/10 px-4 py-1.5 rounded-full bg-white/5">
                    Strategic_Resilience_Matrix
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DimensionTile 
                    icon={<Lightbulb className="w-4 h-4" />} 
                    title="Creativity" 
                    desc="Ideation & solving." 
                    score={Array.isArray(replacementMap) ? (replacementMap.find(m => m.subject === 'Creativity')?.A || 50) : 50} 
                  />
                  <DimensionTile 
                    icon={<Users className="w-4 h-4" />} 
                    title="Social" 
                    desc="Negotiation." 
                    score={Array.isArray(replacementMap) ? (replacementMap.find(m => m.subject === 'Social')?.A || 50) : 50} 
                  />
                  <DimensionTile 
                    icon={<Zap className="w-4 h-4" />} 
                    title="Physical" 
                    desc="Dexterity." 
                    score={Array.isArray(replacementMap) ? (replacementMap.find(m => m.subject === 'Physical')?.A || 50) : 50} 
                  />
                  <DimensionTile 
                    icon={<Target className="w-4 h-4" />} 
                    title="Strategy" 
                    desc="Decision-making." 
                    score={Array.isArray(replacementMap) ? (replacementMap.find(m => m.subject === 'Strategy')?.A || 50) : 50} 
                  />
                  <DimensionTile 
                    icon={<FileCode className="w-4 h-4" />} 
                    title="Logic" 
                    desc="Automation." 
                    score={Array.isArray(replacementMap) ? (replacementMap.find(m => m.subject === 'Logic')?.A || 50) : 50} 
                  />
                  <DimensionTile 
                    icon={<Heart className="w-4 h-4" />} 
                    title="Empathy" 
                    desc="Intelligence." 
                    score={Array.isArray(replacementMap) ? (replacementMap.find(m => m.subject === 'Empathy')?.A || 50) : 50} 
                  />
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em]">
                    // Automated Dimensional Analysis Complete // Zero_Waste
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-1 h-1 bg-blue-500/20 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Pivot Paths HUD */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {pivotPaths.map((path, idx) => (
          <Card key={idx} className="glass border-white/5 hover:border-blue-500/30 transition-all duration-700 group cursor-pointer overflow-hidden rounded-[2rem]">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/10 group-hover:bg-blue-500 transition-colors" />
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <Badge variant="outline" className="text-[10px] font-mono tracking-widest uppercase py-1 border-blue-500/20 text-blue-400">
                  Pivot Path {idx + 1}
                </Badge>
                <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{path.demand} Demand</div>
              </div>
              <h3 className="text-3xl font-black tracking-tighter mb-2 group-hover:text-blue-400 transition-colors uppercase italic">{path.title}</h3>
              <div className="text-xl font-mono text-white/40 mb-8">{path.salary}</div>
              <Link href={`/dashboard/roadmap?id=${assessment.id}`} className={cn(buttonVariants({ variant: "ghost" }), "w-full rounded-full border border-white/5 hover:bg-blue-600 hover:text-white transition-all duration-500")}>
                Analyze Strategy <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Middle Intelligence HUD: Income Bridge & Geospatial */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Geospatial Exposure HUD */}
        <motion.div variants={item}>
          <Card className="glass border-white/5 bg-black/40 hover:border-blue-500/30 transition-all duration-700 rounded-[2.5rem] overflow-hidden group">
            <CardHeader className="py-4 px-8 border-b border-white/5 bg-white/[0.02]">
              <CardTitle className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-400 flex items-center justify-between">
                <span>PHASE 3 // GEOSPATIAL_EXPOSURE</span>
                <Globe className="w-3 h-3 text-blue-500 animate-pulse" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
              <div className="flex items-start justify-between gap-6">
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Region_Status</div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter">
                    {report.geospatial_metrics?.region_status || 'Active Transition Zone'}
                  </h3>
                </div>
                <div className="flex flex-col items-end">
                   <div className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-1">Exposure_Rating</div>
                   <div className="text-4xl font-black italic text-blue-500">
                     {Number(report.geospatial_metrics?.exposure_rating).toFixed(1)}%
                   </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                 <div className="flex items-center gap-2 text-[10px] font-mono text-yellow-500 uppercase tracking-widest">
                   <AlertTriangle className="w-3 h-3" /> Tactical_Insight
                 </div>
                 <p className="text-sm text-white/60 leading-relaxed font-light">
                   {report.geospatial_metrics?.local_insight || `Based on your location in ${assessment.location}, you are in a high-density AI integration hub.`}
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4">
                 <div className="space-y-1">
                   <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Pivot_Window</div>
                   <div className="text-xl font-bold uppercase italic tracking-tight">{report.geospatial_metrics?.pivot_window || '08-12 Months'}</div>
                 </div>
                 <div className="space-y-1">
                   <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Market_Volatility</div>
                   <div className="text-xl font-bold uppercase italic tracking-tight text-red-500">{report.geospatial_metrics?.market_volatility || 'Critical'}</div>
                 </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Income Bridge HUD */}
        <motion.div variants={item}>
          <Card className="glass border-white/5 bg-black/40 hover:border-blue-500/30 transition-all duration-700 rounded-[2.5rem] overflow-hidden group h-full">
            <CardHeader className="py-4 px-8 border-b border-white/5 bg-white/[0.02]">
              <CardTitle className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-400 flex items-center justify-between">
                <span>PHASE 4 // INCOME_BRIDGE_HUD</span>
                <TrendingUp className="w-3 h-3 text-blue-500 animate-pulse" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
             <IncomeBridgeChart currentSalary={report.income_target || report.current_income} projection={financialProjection} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Market Pulse & Hiring Intelligence */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="glass border-white/5 bg-black/40 hover:border-blue-500/30 transition-all duration-700 rounded-[2.5rem] overflow-hidden group h-full">
            <CardHeader className="py-4 px-8 border-b border-white/5 bg-white/[0.02]">
              <CardTitle className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-400 flex items-center justify-between">
                <span>PHASE 5 // MARKET_PULSE_INTELLIGENCE</span>
                <Radio className="w-3 h-3 text-blue-500 animate-pulse" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
               <MarketPulseHUD 
                  location={assessment.location} 
                  role={assessment.job_title} 
                  onSentimentChange={setPulseSentiment}
               />
            </CardContent>
          </Card>
        </motion.div>

      </div>

      {/* Bottom Intelligence Summary */}
      <motion.div variants={item}>
        <Card className="glass border-white/5 bg-black/40 p-10 relative overflow-hidden rounded-[2.5rem]">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShieldCheck className="w-48 h-48" />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-0.5 bg-blue-500" />
              <h2 className="text-2xl font-bold uppercase tracking-tight italic">Strategic Summary</h2>
            </div>
            <p className="text-xl text-white/60 font-light leading-relaxed max-w-4xl italic">
              "{report.analysis_summary}"
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Bottom Paywall CTA */}
      {!assessment.is_unlocked && (
        <motion.div variants={item} className="pt-8">
          <GlobalPaywallCTA assessmentId={assessment.id} />
        </motion.div>
      )}
    </motion.div>
  );
}

function AIThreatRadar({ jobTitle, report }: { jobTitle: string; report: ReportData }) {
  const [logIndex, setLogIndex] = useState(0);
  const logs = [
    `SCANNING: ${jobTitle.toUpperCase()} VULNERABILITIES...`,
    "ANALYZING: REGIONAL DISPLACEMENT VECTORS...",
    "DETECTING: AGENTIC AI PENETRATION NODES...",
    "CALIBRATING: TACTICAL SURVIVAL RESPONSE..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % logs.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="h-full glass border-white/5 bg-black/40 hover:border-red-500/50 transition-all duration-700 rounded-[2.5rem] flex flex-col overflow-hidden group/radar relative min-h-full">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.01)_1px,transparent_1px)] bg-[size:15px_15px] pointer-events-none" />
      
      <CardHeader className="py-4 px-8 border-b border-white/5 bg-white/[0.02] relative z-20">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
             <Radar className="w-4 h-4 text-red-500 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500">AI_THREAT_RADAR</span>
          </div>
          <Badge variant="outline" className="text-[7px] font-mono border-red-500/20 text-red-400 uppercase font-black px-2 py-0.5">ACTIVE</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 px-8 py-6 flex flex-col justify-between relative z-20 overflow-hidden min-h-0">
        
        {/* Intelligence Status (Static Top) */}
        <div className="w-full text-center space-y-1 mb-2">
          <div className="text-[8px] font-mono text-white/20 uppercase tracking-[0.4em]">INTELLIGENCE_STREAM</div>
          <div className="h-4 overflow-hidden">
            <motion.div
              key={logIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] font-mono text-white font-black uppercase italic tracking-tighter"
            >
              {report.radar_metrics?.logs?.[logIndex] || logs[logIndex]}
            </motion.div>
          </div>
        </div>

        {/* MAIN HUD AREA: Vertical Balance (Vacuum Fill) */}
        <div className="flex-1 flex flex-col items-center justify-center py-2 relative min-h-0">
           
           {/* Tactical Globe Instrument */}
           <div className="relative w-24 h-24 flex items-center justify-center mb-2">
              <div className="absolute inset-0 border border-red-500/10 rounded-full" />
              <div className="absolute -inset-1 border border-red-500/5 rounded-full animate-[spin_40s_linear_infinite]" />
              
              <Globe className="w-8 h-8 text-red-500 relative z-20 drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]" />
              
              {/* Scan Pulse */}
              <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 z-10 opacity-20 pointer-events-none"
              >
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-1/2 bg-gradient-to-b from-red-500 to-transparent shadow-[0_0_10px_#ef4444]" />
              </motion.div>
           </div>

           {/* Metrics Grid Overlay */}
            <div className="w-full grid grid-cols-2 gap-4">
               <div className="space-y-1 border-l-2 border-green-500/30 pl-3">
                  <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3 text-green-500" /> SAFE
                  </div>
                  <div className="text-lg font-black italic text-green-500 leading-none">
                    {report.radar_metrics?.safe_percentage}%
                  </div>
               </div>

               <div className="space-y-1 border-r-2 border-red-500/30 pr-3 text-right">
                  <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest flex items-center justify-end gap-1.5">
                    {report.radar_metrics?.threat_level?.toUpperCase() || 'CRITICAL'} <TrendingDown className="w-3 h-3 text-red-500" />
                  </div>
                  <div className="text-lg font-black italic text-red-500 leading-none uppercase">THREAT</div>
               </div>
            </div>
        </div>

        {/* Command Footer */}
        <div className="pt-4 border-t border-white/5 mt-auto">
           <Button className="w-full h-9 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 text-[9px] font-mono tracking-[0.3em] uppercase font-black hover:bg-red-600 hover:text-white transition-all duration-500">
              INIT_TACTICAL_MAP
           </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricKey({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="space-y-1 group/key rounded-xl transition-colors">
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 group-hover/key:text-white transition-colors">{title}</div>
      <p className="text-[11px] leading-relaxed text-white/40 font-light group-hover/key:text-white/80 transition-colors">
        {desc}
      </p>
    </div>
  );
}

function DimensionTile({ icon, title, desc, score }: { icon: React.ReactNode, title: string, desc: string, score: number }) {
  return (
    <div className="p-5 rounded-[1.5rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-blue-500/30 transition-all duration-500 group/tile flex flex-col justify-between">
      <div className="flex justify-between items-start mb-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover/tile:bg-blue-600 group-hover/tile:text-white transition-all">
          {icon}
        </div>
        <div className="text-right">
          <div className="text-xl font-black text-white italic tracking-tighter">{score}%</div>
        </div>
      </div>
      
      <div>
        <div className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-400 mb-0.5 group-hover/tile:text-white transition-colors">{title}</div>
        <p className="text-[10px] text-white/40 leading-tight group-hover/tile:text-white/60 transition-colors">{desc}</p>
      </div>
    </div>
  );
}
