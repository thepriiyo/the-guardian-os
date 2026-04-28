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
  FileText,
  Gift,
  Ticket,
  Shield,
  X,
  Loader2
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Assessment, RoadmapWeek, RoadmapTask } from '@/types';
import { generateTacticalPDF } from '@/lib/pdf-generator';
import { validateAccessCode, checkUnlockStatus } from '@/app/actions';
import { getTacticalReportAction } from '@/app/actions/report';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { GlobalPaywallCTA } from '@/components/global-paywall-cta';

declare global {
  interface Window {
    LemonSqueezy: any;
    Razorpay: any;
  }
}

export default function RoadmapClient({ assessment }: { assessment: Assessment }) {
  const report = assessment.report_data;
  const roadmap = report?.roadmap || [];
  
  // Intelligence Control States
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  
  // Monetization States
  const [accessCode, setAccessCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [noCoupon, setNoCoupon] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Timer Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGenerating && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (!isGenerating) {
      setTimeLeft(20);
    }
    return () => clearInterval(timer);
  }, [isGenerating, timeLeft]);

  // Monetization Logic
  const visibleRoadmap = isUnlocked ? roadmap : roadmap.slice(0, 4);
  const showPaywall = !isUnlocked;

  // Unlock Polling Protocol: Continuously check DB if currently locked
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!isUnlocked) {
      interval = setInterval(async () => {
        const unlocked = await checkUnlockStatus(assessment.id);
        if (unlocked) {
          setIsUnlocked(true);
          clearInterval(interval);
        }
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isUnlocked, assessment.id]);

  const handleValidateCode = async () => {
    if (!accessCode) return;
    setIsValidating(true);
    setError(null);
    try {
      const result = await validateAccessCode(accessCode);
      if (result.success) {
        setDiscount(result.discount!);
        setDiscountType(result.discountType as 'percentage' | 'fixed');
        if (result.discountType === 'percentage' && result.discount === 100) setIsUnlocked(true);
      } else {
        setError(result.message!);
      }
    } catch (e) {
      setError('Communication Failure');
    } finally {
      setIsValidating(false);
    }
  };

  const getCurrencyData = (location: string) => {
    const isIndia = location.toLowerCase().includes('india') || location.toLowerCase().includes('in');
    // Base Price Anchor: 200 INR / ~2.49 USD
    return isIndia ? { symbol: '₹', amount: 200, code: 'INR' } : { symbol: '$', amount: 2.49, code: 'USD' };
  };

  const pricing = getCurrencyData(assessment.location);
  const baseAmount = pricing.amount;
  
  // Hard-coded conversion for fixed discounts: 199 INR = ~2.48 USD
  const fixedDiscount = discountType === 'fixed' 
    ? (pricing.code === 'INR' ? discount : 2.48) 
    : 0;

  const finalAmount = discountType === 'percentage' 
    ? Math.max(0.01, baseAmount * (1 - discount / 100))
    : Math.max(0.01, baseAmount - fixedDiscount);

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
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase italic bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            Tactical Roadmap
          </h1>
          <p className="text-muted-foreground font-light text-lg">Your 12-week survival execution plan for <span className="text-white font-bold">{assessment.job_title}</span>.</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          {isUnlocked ? (
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
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-widest animate-pulse">
              <Lock className="w-3 h-3" /> Intelligence Payload Locked
            </div>
          )}
          <Link href={`/dashboard?id=${assessment.id}`} className={cn(buttonVariants({ variant: "outline" }), "rounded-full bg-white/5 border-white/10 hover:bg-white/10 px-8 py-6")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to HUD
          </Link>
        </div>
      </motion.div>

      {/* Top Paywall CTA */}
      {!isUnlocked && (
        <motion.div variants={item}>
          <GlobalPaywallCTA assessmentId={assessment.id} />
        </motion.div>
      )}

      {/* Scanning HUD Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#020617]/95 backdrop-blur-3xl flex items-center justify-center p-6"
          >
            <div className="max-w-xl w-full space-y-12 text-center relative">
              <div className="absolute -inset-40 bg-blue-500/5 blur-[160px] rounded-full animate-pulse pointer-events-none" />
              
              <div className="relative flex flex-col items-center">
                 <div className="w-40 h-40 border border-blue-500/10 rounded-full flex items-center justify-center mb-10 relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-t border-blue-500/40 rounded-full"
                    />
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-4 border-b border-blue-500/20 rounded-full"
                    />
                    <Zap className="w-12 h-12 text-blue-500 animate-pulse" />
                 </div>
                 
                 <div className="space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                      <span className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.5em]">Establishing // Neural_Payload_Uplink</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
                      Decrypting <span className="text-blue-500">Sector.</span>
                    </h2>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-muted-foreground font-light text-lg max-w-sm mx-auto leading-relaxed">
                        Compiling 20-page tactical dossier using regional geospatial data.
                      </p>
                      <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 inline-block">
                        <span className="text-blue-400 font-mono text-sm tracking-widest uppercase">
                          Estimated Time Remaining: <span className="text-white font-bold">{timeLeft}s</span>
                        </span>
                      </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-4 max-w-xs mx-auto">
                <div className="flex justify-between text-[9px] font-mono text-white/30 uppercase tracking-widest mb-1">
                  <span>Processing Dossier</span>
                  <span className="text-blue-500 animate-pulse">Running Scan...</span>
                </div>
                <div className="h-0.5 bg-white/5 w-full rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 8, ease: "easeInOut" }}
                    className="h-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/5 opacity-50">
                 <div className="space-y-1">
                    <div className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Neural_Sync</div>
                    <div className="text-lg font-bold italic">99.9%</div>
                 </div>
                 <div className="space-y-1">
                    <div className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Payload</div>
                    <div className="text-lg font-bold italic">20 PAGES</div>
                 </div>
                 <div className="space-y-1">
                    <div className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Status</div>
                    <div className="text-lg font-bold italic text-blue-500 animate-pulse uppercase">Active</div>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Roadmap Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        {isUnlocked ? (
          <motion.div variants={item} className="pt-10 pb-10">
            <Card className="glass border-green-500/20 bg-green-500/5 overflow-hidden rounded-[2.5rem] relative flex flex-col justify-center border-2 shadow-2xl shadow-green-500/5 min-h-[500px]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />
              <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                  <Unlock className="w-6 h-6 text-green-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-white">Tactical Access Granted</h3>
                  <p className="text-muted-foreground font-light max-w-md mx-auto text-lg">
                    Your 12-week survival strategy is now fully decrypted. Download your complete 20-page tactical dossier for offline execution.
                  </p>
                </div>
                <Button 
                  disabled={isGenerating}
                  className="rounded-full bg-blue-600 hover:bg-blue-500 px-12 py-8 font-black text-xl shadow-[0_0_50px_-15px_rgba(59,130,246,0.5)] flex items-center gap-3 group mt-4 w-full sm:w-auto"
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
                      <Loader2 className="w-6 h-6 animate-spin" /> Synchronizing Neural Link...
                    </>
                  ) : (
                    <>
                      <Download className="w-6 h-6 group-hover:animate-bounce" /> Download Stylized PDF Report
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          visibleRoadmap.length > 0 ? (
            <>
              {visibleRoadmap.map((week, i) => (
                <motion.div key={i} variants={item}>
                <Card className="glass border-white/5 hover:border-blue-500/30 transition-all duration-500 group overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/20 group-hover:bg-blue-500 transition-colors" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 p-8 pb-4">
                    <div className="flex items-center gap-6">
                      <div className="text-2xl sm:text-4xl font-black italic text-white/10 group-hover:text-blue-500/20 transition-colors">
                        W{week.week < 10 ? `0${week.week}` : week.week}
                      </div>
                      <div>
                        <CardTitle className="text-lg sm:text-2xl font-bold tracking-tight uppercase italic">{week.title}</CardTitle>
                        <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-1">Phase {Math.floor(i / 4) + 1} // Active_Objective</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-blue-500/20 text-blue-400 font-mono text-[10px] uppercase py-1">
                      {week.type}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-5 sm:p-8 pt-0 pl-12 sm:pl-24">
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
              <motion.div variants={item} className="relative group pt-10" id="paywall">
                <div className="absolute inset-0 bg-blue-500/10 blur-3xl -z-10 animate-pulse" />
                <Card className="glass border-white/20 bg-black/40 overflow-hidden rounded-[2.5rem] relative min-h-[500px] flex flex-col justify-center border-2 shadow-2xl">
                  {/* Paywall Overlay */}
                  <div className="relative z-30 flex flex-col items-center justify-center p-10 text-center space-y-8">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 relative z-10">
                        <Lock className="w-8 h-8 text-blue-500" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-3xl font-black tracking-tighter uppercase italic text-white leading-none">Unlock Tactical Access</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto font-light leading-relaxed">
                        Authorize intelligence transfer to reveal the full 12-week deployment strategy and download your 20-page dossier.
                      </p>
                    </div>

                    {/* Gift Card HUD */}
                    <div className="w-full max-w-sm space-y-4 bg-white/5 p-6 rounded-3xl border border-white/5">
                      <div className="flex items-center justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">
                        <span>Intelligence Access Code</span>
                        {discount > 0 && <span className="text-blue-400">-{discount}% Applied</span>}
                      </div>
                      
                      {!noCoupon ? (
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <Input 
                              placeholder="Enter Code..." 
                              value={accessCode}
                              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                              className="bg-black/40 border-white/10 pl-10 h-12 rounded-xl focus:border-blue-500/50 transition-all font-mono"
                            />
                          </div>
                          <Button 
                            variant="secondary" 
                            className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                            onClick={handleValidateCode}
                            disabled={isValidating || !accessCode}
                          >
                            {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                          </Button>
                        </div>
                      ) : (
                        <div className="h-12 flex items-center justify-center text-[10px] font-mono text-white/20 border border-white/5 rounded-xl bg-white/[0.02]">
                          Direct Authorization Protocol Active
                        </div>
                      )}

                      {error && <div className="text-[10px] font-mono text-red-400 mt-2 flex items-center justify-center gap-2 uppercase"><X className="w-3 h-3" /> {error}</div>}

                      <div className="flex items-center gap-3 pt-2">
                        <Checkbox 
                          id="no-coupon" 
                          checked={noCoupon} 
                          onCheckedChange={(checked) => {
                            setNoCoupon(!!checked);
                            if (checked) {
                              setAccessCode('');
                              setDiscount(0);
                              setError(null);
                            }
                          }}
                          className="border-white/20 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                        />
                        <label htmlFor="no-coupon" className="text-[10px] font-mono text-white/40 uppercase tracking-widest cursor-pointer select-none">
                          I don't have an access code
                        </label>
                      </div>
                    </div>
                    {discount > 0 && (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 w-fit mx-auto mb-2 animate-pulse">
                        <Gift className="w-3 h-3 text-green-400" />
                        <span className="text-[10px] font-mono text-green-400 uppercase tracking-widest">
                          {discountType === 'percentage' ? `-${discount}%` : `₹${discount}`} Intelligence Discount Applied
                        </span>
                      </div>
                    )}

                    <div className="pt-4 space-y-4 w-full max-w-sm">
                      <div className="flex items-center justify-between px-2 text-[10px] font-mono uppercase tracking-widest">
                        <span className="text-white/40">Authorization Fee</span>
                        <span className="text-white text-lg font-black italic">
                          ₹{Math.max(1, 200 - (discountType === 'percentage' ? (200 * discount / 100) : (discount === 199 ? 199 : 0)))} / ${Math.max(0.01, 2.49 - (discountType === 'percentage' ? (2.49 * discount / 100) : (discount === 199 ? 2.48 : 0))).toFixed(2)}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <Button 
                          className="w-full rounded-2xl py-6 bg-blue-600 hover:bg-blue-500 font-black text-lg shadow-[0_0_50px_-15px_rgba(59,130,246,0.5)] group flex flex-col items-center h-auto"
                          onClick={async () => {
                            if (finalAmount <= 0) {
                              setIsUnlocked(true);
                              return;
                            }
                            
                            if (!window.Razorpay) {
                              alert("PAYMENT UPLINK OFFLINE. Please retry.");
                              return;
                            }

                            try {
                              const upiBase = 200;
                              const upiDiscount = discountType === 'percentage' 
                                ? upiBase * (discount / 100) 
                                : (discount === 199 ? 199 : 0);
                              const upiFinal = Math.max(1, upiBase - upiDiscount);

                              const orderResponse = await fetch('/api/razorpay/create-order', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  amount: Math.round(upiFinal) * 100,
                                  currency: "INR",
                                  receipt: `rcpt_${assessment.id.slice(0, 10)}`
                                }),
                              });
                              const orderData = await orderResponse.json();
                              if (orderData.error) throw new Error(orderData.error);

                              const options = {
                                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                                amount: orderData.amount,
                                currency: orderData.currency,
                                name: "The Guardian OS",
                                description: "Tactical Dossier Authorization (UPI)",
                                order_id: orderData.id,
                                handler: async function(response: any) {
                                  try {
                                    const verifyResponse = await fetch('/api/razorpay/verify-payment', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ ...response, assessment_id: assessment.id }),
                                    });
                                    const verifyData = await verifyResponse.json();
                                    if (verifyData.success) setIsUnlocked(true);
                                    else alert(`VERIFICATION FAILED: ${verifyData.error}`);
                                  } catch (err: any) {
                                    alert(`CRITICAL UPLINK ERROR: ${err.message}`);
                                  }
                                },
                                prefill: { email: "operative@guardian-os.com" },
                                theme: { color: "#2563eb" }
                              };
                              const rzp = new window.Razorpay(options);
                              rzp.open();
                            } catch (err: any) {
                              alert("TACTICAL UPLINK ERROR: " + err.message);
                            }
                          }}
                        >
                          <span className="flex items-center gap-3"><Shield className="w-5 h-5" /> Authorize via UPI</span>
                          <span className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-50 font-normal">GPay // PhonePe // Netbanking</span>
                        </Button>

                        <Button 
                          variant="outline"
                          className="w-full rounded-2xl py-6 border-white/10 bg-white/5 hover:bg-white/10 font-black text-lg group flex flex-col items-center h-auto"
                          onClick={() => {
                            if (finalAmount <= 0) {
                              setIsUnlocked(true);
                              return;
                            }

                            if (window.LemonSqueezy) {
                              const checkoutUrl = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL || '#';
                              const discountParam = accessCode ? `&checkout[discount_code]=${accessCode}` : '';
                              window.LemonSqueezy.Url.Open(checkoutUrl + `?checkout[custom][assessment_id]=${assessment.id}${discountParam}`);
                            } else {
                              alert("PAYMENT UPLINK OFFLINE. Please retry.");
                            }
                          }}
                        >
                          <span className="flex items-center gap-3"><CreditCard className="w-5 h-5" /> Authorize via Global Cards</span>
                          <span className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-50 font-normal">VISA // Mastercard // PayPal</span>
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-center gap-4 text-[9px] font-mono text-white/20 uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> SSL Encrypted</span>
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="flex items-center gap-1.5"><Zap className="w-3 h-3" /> 2026 Ready</span>
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
          )
        )}
      </div>
    </motion.div>
  );
}
