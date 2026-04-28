'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getCurrencySymbol } from '@/lib/utils';
import { useGeolocation } from '@/hooks/use-geolocation';
import { LocationAutocomplete } from '@/components/ui/location-autocomplete';
import { CareerAutocomplete } from '@/components/ui/career-autocomplete';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Briefcase, Target, ArrowRight, Loader2, Banknote, Sparkles } from 'lucide-react';
import { submitAssessment, fetchSkillSuggestions } from '@/app/actions';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  jobTitle: z.string().min(2, 'Professional role is required'),
  skills: z.string().min(5, 'Please list your core technical competencies'),
  location: z.string().min(2, 'Market location is required'),
  incomeTarget: z.string().min(1, 'Target income is required'),
});

type FormValues = z.infer<typeof formSchema>;

export function AssessmentForm() {
  const router = useRouter();
  const { location, loading: geoLoading } = useGeolocation();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [statusIndex, setStatusIndex] = useState(0);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [isSkillsLoading, setIsSkillsLoading] = useState(false);

  const statusMessages = [
    "Establishing secure neural uplink...",
    "Scanning regional geospatial labor nodes...",
    "Parsing local industry volatility indices...",
    "Calculating automation risk delta...",
    "Generating multi-vector pivot roadmaps...",
    "Hardening career survival strategy...",
    "Decrypting industry benchmarks...",
    "Optimizing income bridge logic..."
  ];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    shouldUnregister: false,
    defaultValues: {
      jobTitle: '',
      skills: '',
      location: '',
      incomeTarget: '',
    },
  });

  const jobTitle = form.watch('jobTitle');

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (jobTitle && jobTitle.length > 2) {
        setIsSkillsLoading(true);
        try {
          const skills = await fetchSkillSuggestions(jobTitle);
          setSuggestedSkills(skills);
        } catch (error) {
          console.error('Failed to fetch skill suggestions:', error);
        } finally {
          setIsSkillsLoading(false);
        }
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [jobTitle]);

  const toggleSkill = (skill: string) => {
    const currentSkills = form.getValues('skills');
    const skillList = currentSkills.split(',').map(s => s.trim()).filter(s => s !== '');
    
    if (skillList.includes(skill)) {
      const newSkills = skillList.filter(s => s !== skill).join(', ');
      form.setValue('skills', newSkills);
    } else {
      const newSkills = [...skillList, skill].join(', ');
      form.setValue('skills', newSkills);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let statusTimer: NodeJS.Timeout;

    if (isSubmitting && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);

      statusTimer = setInterval(() => {
        setStatusIndex((prev) => (prev + 1) % statusMessages.length);
      }, 4000);
    }

    return () => {
      if (timer) clearInterval(timer);
      if (statusTimer) clearInterval(statusTimer);
    };
  }, [isSubmitting, timeLeft]);

  useEffect(() => {
    if (location.detected && !form.getValues('location')) {
      form.setValue('location', `${location.city}, ${location.country}`);
    }
  }, [location, form]);

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const result = await submitAssessment(values);
      if (result.success) {
        router.push(`/dashboard?id=${result.id}`);
        router.refresh();
      }
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Strategic analysis failure. The neural link timed out. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const validateStep = async (currentStep: number) => {
    let fields: (keyof FormValues)[] = [];
    if (currentStep === 1) fields = ['jobTitle', 'location'];
    if (currentStep === 2) fields = ['skills'];
    
    const isValid = await form.trigger(fields);
    if (isValid) setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  return (
    <>
      <Card className="max-w-2xl mx-auto glass border-white/5 bg-black/20 backdrop-blur-3xl shadow-2xl shadow-blue-500/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30" />
        
        <CardHeader className="space-y-4 p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl sm:text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3">
                <Target className="w-6 h-6 sm:w-8 h-8 text-blue-500" />
                Career Resilience Scan
              </CardTitle>
              <CardDescription className="text-[10px] font-mono uppercase tracking-[0.3em] text-blue-400/60">
                Protocol v1.2 // Sector_{step === 1 ? 'Primary' : step === 2 ? 'Competency' : 'Objective'}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black italic text-white/10">0{step}</div>
            </div>
          </div>
          
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
              className="bg-blue-500 h-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            />
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-8 pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Professional Role</FormLabel>
                        <FormControl>
                          <CareerAutocomplete 
                            value={field.value} 
                            onChange={field.onChange} 
                          />
                        </FormControl>
                        <FormMessage className="text-xs italic text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Market Location</FormLabel>
                        <FormControl>
                          <LocationAutocomplete 
                            value={field.value} 
                            onChange={field.onChange}
                            placeholder={geoLoading ? "Detecting Satellite Data..." : "Select operational theater..."}
                          />
                        </FormControl>
                        <FormMessage className="text-xs italic text-red-400" />
                      </FormItem>
                    )}
                  />
                  <Button type="button" className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/20" onClick={() => validateStep(1)}>
                    Next: Skill Matrix <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                          <span>Core Competencies</span>
                          {isSkillsLoading && <Loader2 className="w-3 h-3 animate-spin text-blue-500" />}
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <textarea 
                              className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500/50 transition-all text-sm font-light leading-relaxed"
                              placeholder="e.g. LLM Integration, Strategic Forecasting, Full-Stack Engineering, Crisis Management..."
                              {...field}
                            />
                            
                            {suggestedSkills.length > 0 && (
                              <div className="space-y-3 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="text-[9px] font-mono uppercase tracking-widest text-blue-400/60 mb-2 flex items-center gap-2">
                                  <Sparkles className="w-3 h-3" /> Neural Suggestions // 2026_Calibrated
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {suggestedSkills.map((skill) => {
                                    const isSelected = form.watch('skills').split(',').map(s => s.trim()).includes(skill);
                                    return (
                                      <button
                                        key={skill}
                                        type="button"
                                        onClick={() => toggleSkill(skill)}
                                        className={cn(
                                          "px-3 py-1.5 rounded-full text-[10px] font-medium transition-all border",
                                          isSelected 
                                            ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
                                            : "bg-white/5 text-white/40 border-white/5 hover:bg-white/10 hover:text-white/60"
                                        )}
                                      >
                                        {skill}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription className="text-[10px] italic opacity-40">List the high-leverage tools and methodologies you deploy daily.</FormDescription>
                        <FormMessage className="text-xs italic text-red-400" />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" className="flex-1 h-14 rounded-2xl border-white/5 bg-white/5" onClick={prevStep}>
                      Back
                    </Button>
                    <Button type="button" className="flex-1 h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/20" onClick={() => validateStep(2)}>
                      Next: Target <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
                  <FormField
                    control={form.control}
                    name="incomeTarget"
                    render={({ field }) => {
                      const locationValue = form.watch('location');
                      const currency = getCurrencySymbol(locationValue);
                      return (
                        <FormItem>
                          <FormLabel className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Income Target (Monthly)</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 font-bold font-mono">{currency}</div>
                              <input 
                                type="text"
                                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500/50 transition-all font-mono"
                                placeholder="e.g. 100,000"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs italic text-red-400" />
                        </FormItem>
                      );
                    }}
                  />
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" className="flex-1 h-14 rounded-2xl border-white/5 bg-white/5" onClick={prevStep}>
                      Back
                    </Button>
                    <Button type="submit" className="flex-1 h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/20" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Operational Data...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4" /> Initialize Analysis
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      <AnimatePresence>
        {isSubmitting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#020617]/98 backdrop-blur-3xl flex items-center justify-center p-6"
          >
            <div className="max-w-xl w-full space-y-12 text-center relative">
              <div className="absolute -inset-40 bg-blue-500/10 blur-[160px] rounded-full animate-pulse pointer-events-none" />
              
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
                    <Sparkles className="w-12 h-12 text-blue-500 animate-pulse" />
                 </div>
                 
                 <div className="space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                      <span className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.5em]">Initializing // Neural_Career_Scan</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
                      Analyzing <span className="text-blue-500">Market.</span>
                    </h2>
                    <div className="flex flex-col items-center gap-4">
                      <p className="text-blue-400/80 font-mono text-xs tracking-widest uppercase h-4">
                        {statusMessages[statusIndex]}
                      </p>
                      <div className="px-6 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 inline-block">
                        <span className="text-blue-400 font-mono text-sm tracking-widest uppercase">
                          Est. Time: <span className="text-white font-bold">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                        </span>
                      </div>
                      <p className="text-red-400/60 font-mono text-[10px] uppercase tracking-[0.2em] animate-pulse">
                        Do not exit browser // Uplink Active
                      </p>
                    </div>
                 </div>
              </div>

              <div className="space-y-4 max-w-xs mx-auto">
                <div className="flex justify-between text-[9px] font-mono text-white/30 uppercase tracking-widest mb-1">
                  <span>Processing Assessment</span>
                  <span className="text-blue-500 animate-pulse">{Math.round(((180 - timeLeft) / 180) * 100)}% Complete</span>
                </div>
                <div className="h-0.5 bg-white/5 w-full rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: `${((180 - timeLeft) / 180) * 100}%` }}
                    className="h-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
