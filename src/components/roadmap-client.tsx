'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Circle, 
  Map,
  ChevronRight,
  Target,
  Zap,
  ArrowLeft,
  Download,
  Lock,
  Unlock,
  CreditCard,
  FileText
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Assessment, RoadmapWeek, RoadmapTask } from '@/types';
import { generateTacticalPDF } from '@/lib/pdf-generator';
import { getTacticalReportAction } from '@/app/actions/report';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function RoadmapClient({ assessment }: { assessment: Assessment }) {
  const report = assessment.report_data;
  const roadmap = report?.roadmap || [];
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Monetization Logic: Only show first 4 weeks
  const visibleRoadmap = roadmap.slice(0, 4);
  
  // Force show the paywall to encourage upgrading to full 12 weeks
  const showPaywall = true;

  const getCurrencyData = (location: string) => {
    const isUS = location.toLowerCase().includes('usa') || location.toLowerCase().includes('united states') || location.toLowerCase().includes('us');
    return isUS ? { symbol: '$', amount: '2.49', code: 'USD' } : { symbol: '₹', amount: '200', code: 'INR' };
  };

  const pricing = getCurrencyData(assessment.location);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12 py-10"
    >
      {/* Header Section */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono text-blue-400 uppercase tracking-[0.3em]">
            <Target className="w-3 h-3" /> Strategic // Deployment // Map
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            Tactical Roadmap
          </h1>
          <p className="text-muted-foreground font-light text-lg">Your 12-week survival execution plan for <span className="text-white font-bold">{assessment.job_title}</span>.</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Button 
            disabled={isGenerating}
            className="rounded-full bg-blue-600 hover:bg-blue-500 px-8 py-6 font-bold shadow-[0_0_30px_-10px_rgba(59,130,246,0.5)] flex items-center gap-2 group min-w-[260px]"
            onClick={async () => {
              setIsGenerating(true);
              try {
                const aiReport = await getTacticalReportAction(assessment);
                await generateTacticalPDF(assessment, aiReport);
              } catch (e) {
                console.error(e);
                alert("Failed to synchronize with Gemma. Using standard metrics payload.");
                await generateTacticalPDF(assessment);
              } finally {
                setIsGenerating(false);
              }
            }}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Synchronizing Neural Link...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 group-hover:animate-bounce" /> Download Stylized PDF Report
              </>
            )}
          </Button>
          <Link href={`/dashboard?id=${assessment.id}`} className={cn(buttonVariants({ variant: "outline" }), "rounded-full bg-white/5 border-white/10 hover:bg-white/10 px-8 py-6")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to HUD
          </Link>
        </div>
      </motion.div>

      {/* Scanning HUD Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <div className="max-w-2xl w-full space-y-12 text-center relative">
              <div className="absolute -inset-20 bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
              
              <div className="relative flex flex-col items-center">
                 <div className="w-32 h-32 border-2 border-blue-500/20 rounded-full flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-0 border-t-2 border-blue-500 rounded-full animate-spin" />
                    <Zap className="w-12 h-12 text-blue-500 animate-pulse" />
                 </div>
                 
                 <div className="space-y-4">
                    <div className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.5em] animate-pulse">
                      Establishing // Secure_Gemma_Link
                    </div>
                    <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">
                      Generating Intelligence <span className="text-blue-500">Payload.</span>
                    </h2>
                    <p className="text-muted-foreground font-light text-lg max-w-md mx-auto">
                      Calculating 20-page tactical dossier based on 2026 market benchmarks and regional displacement vectors.
                    </p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/5">
                 <div className="space-y-1">
                    <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Neural_Confidence</div>
                    <div className="text-xl font-bold italic">98.4%</div>
                 </div>
                 <div className="space-y-1">
                    <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Dossier_Depth</div>
                    <div className="text-xl font-bold italic">20 PAGES</div>
                 </div>
                 <div className="space-y-1">
                    <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Protocol_Status</div>
                    <div className="text-xl font-bold italic text-blue-500 animate-pulse">ENCRYPTING</div>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Roadmap List */}
      <div className="max-w-4xl mx-auto space-y-6">
        {visibleRoadmap.length > 0 ? (
          <>
            {visibleRoadmap.map((week, i) => (
              <motion.div key={i} variants={item}>
                <Card className="glass border-white/5 hover:border-blue-500/30 transition-all duration-500 group overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/20 group-hover:bg-blue-500 transition-colors" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 p-8 pb-4">
                    <div className="flex items-center gap-6">
                      <div className="text-4xl font-black italic text-white/10 group-hover:text-blue-500/20 transition-colors">
                        W{week.week < 10 ? `0${week.week}` : week.week}
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold tracking-tight uppercase italic">{week.title}</CardTitle>
                        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">Phase {Math.floor(i / 4) + 1} // Active_Objective</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-blue-500/20 text-blue-400 font-mono text-[10px] uppercase py-1">
                      {week.type}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 pl-24">
                    <p className="text-muted-foreground mb-8 leading-relaxed font-light text-lg">{week.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {week.tasks.map((task, j) => (
                        <div key={j} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group/task">
                          <div className="mt-1 w-5 h-5 rounded border border-blue-500/30 flex items-center justify-center flex-shrink-0 group-hover/task:border-blue-500 transition-colors">
                            <div className="w-2 h-2 rounded-sm bg-blue-500 opacity-0 group-hover/task:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-sm text-muted-foreground group-hover/task:text-white transition-colors leading-relaxed">
                            {typeof task === 'object' ? (task as RoadmapTask).text : task}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Blurred Week 5 Paywall */}
            {showPaywall && (
              <motion.div variants={item} className="relative group pt-10">
                <div className="absolute inset-0 bg-blue-500/10 blur-3xl -z-10 animate-pulse" />
                <Card className="glass border-dashed border-white/20 bg-white/[0.02] overflow-hidden rounded-[2.5rem] relative min-h-[400px] flex flex-col justify-center">
                  <div className="absolute inset-0 backdrop-blur-xl z-10" />
                  
                  <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent" />

                  {/* Ghost Content (Safari Fix: Explicit content to ensure blur visibility) */}
                  <div className="absolute top-0 left-0 w-full h-full p-8 opacity-5 z-0 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                       <div className="w-24 h-24 bg-white/20 rounded-full" />
                       <div className="w-32 h-4 bg-white/20 rounded-full" />
                    </div>
                    <div className="space-y-4">
                       <div className="w-full h-4 bg-white/20 rounded-full" />
                       <div className="w-3/4 h-4 bg-white/20 rounded-full" />
                    </div>
                  </div>
                  
                  {/* Paywall Overlay */}
                  <div className="relative z-30 flex flex-col items-center justify-center p-10 text-center space-y-8">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full animate-ping" />
                      <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 relative z-10 shadow-[0_0_50px_-10px_rgba(59,130,246,0.5)]">
                        <Lock className="w-10 h-10 text-blue-500" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-4xl font-black tracking-tighter uppercase italic text-white leading-none">Unlock Full Intelligence</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto font-light leading-relaxed text-lg">
                        Upgrade to access the complete 12-week roadmap and your 20-page <span className="text-white font-bold italic underline underline-offset-4 decoration-blue-500/50">Stylized Tactical Report</span>.
                      </p>
                    </div>

                    <div className="pt-6">
                      <Button 
                        className="rounded-full px-12 py-9 bg-blue-600 hover:bg-blue-500 font-bold text-2xl shadow-[0_0_60px_-15px_rgba(59,130,246,0.6)] hover:scale-105 transition-all duration-500 flex items-center gap-4 group"
                        onClick={() => {
                          console.log("PAYMENT_GATEWAY_INITIALIZED");
                          alert("INITIALIZING SECURE PAYMENT GATEWAY...\n\nTransaction ID: SEC_" + Math.random().toString(36).substring(7).toUpperCase() + "\nAmount: " + pricing.symbol + pricing.amount);
                        }}
                      >
                        <Unlock className="w-6 h-6 group-hover:rotate-12 transition-transform" /> Get Full Access for {pricing.symbol}{pricing.amount}
                      </Button>
                      <div className="mt-6 flex items-center justify-center gap-6 text-[11px] font-mono text-white/30 uppercase tracking-[0.3em]">
                        <span className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-blue-500/50" /> Secure Checkout</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-blue-500/50" /> 20-Page PDF</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">
            <div className="text-muted-foreground font-mono text-xs uppercase tracking-widest">No Tactical Data Found</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
