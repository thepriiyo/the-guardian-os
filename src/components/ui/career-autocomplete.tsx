'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Briefcase, Search, Command as CommandIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

import { fetchRoleSuggestions } from '@/app/actions';
import { Loader2 } from 'lucide-react';

export function CareerAutocomplete({ 
  value, 
  onChange,
  placeholder = "Select professional role..." 
}: { 
  value: string; 
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState(value);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2 && open) {
        setIsLoading(true);
        try {
          const results = await fetchRoleSuggestions(searchQuery);
          setSuggestions(results);
        } catch (error) {
          console.error('Failed to fetch roles:', error);
        } finally {
          setIsLoading(false);
        }
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <div 
            className={cn(
              "w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all group relative overflow-hidden",
              open && "border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
            )}
          />
        }
      >
          <div className="flex items-center gap-3 overflow-hidden">
            <Briefcase className={cn(
              "w-5 h-5 transition-colors shrink-0",
              value ? "text-blue-500" : "text-muted-foreground opacity-50"
            )} />
            <span className={cn("truncate text-sm font-medium", !value && "text-muted-foreground font-normal")}>
              {value || placeholder}
            </span>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-muted-foreground opacity-50 shrink-0" />
          {open && (
            <motion.div 
              layoutId="glow"
              className="absolute inset-0 bg-blue-500/5 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-[#020617]/95 backdrop-blur-3xl border-white/10 p-0 overflow-hidden rounded-3xl shadow-2xl shadow-blue-500/10">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center gap-3 text-blue-400 mb-2">
            <CommandIcon className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Sector // Selection // HUD</span>
          </div>
          <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-white">
            Identify <span className="text-blue-500">Professional</span> Role
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-blue-500 transition-colors" />
            <input 
              autoFocus
              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500/50 transition-all font-light"
              placeholder="Search or type custom role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery) {
                  onChange(searchQuery);
                  setOpen(false);
                }
              }}
            />
            {isLoading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-blue-500" />}
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto px-2 pb-4 no-scrollbar">
          <div className="space-y-1">
            {suggestions.length > 0 ? (
              suggestions.map((career) => (
                <div 
                  key={career}
                  onClick={() => {
                    onChange(career);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between px-6 py-4 rounded-2xl hover:bg-white/5 cursor-pointer group transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center border transition-all",
                      value === career ? "bg-blue-500/20 border-blue-500/50" : "bg-white/5 border-white/5 group-hover:border-white/10"
                    )}>
                      <Briefcase className={cn(
                        "w-4 h-4",
                        value === career ? "text-blue-500" : "text-white/20 group-hover:text-white/40"
                      )} />
                    </div>
                    <span className={cn(
                      "text-sm transition-colors",
                      value === career ? "text-white font-bold" : "text-white/60 group-hover:text-white"
                    )}>{career}</span>
                  </div>
                  {value === career && <Check className="w-4 h-4 text-blue-500" />}
                </div>
              ))
            ) : searchQuery && !isLoading ? (
              <div 
                onClick={() => {
                  onChange(searchQuery);
                  setOpen(false);
                }}
                className="mx-4 p-6 rounded-3xl border border-dashed border-blue-500/20 bg-blue-500/5 text-center cursor-pointer group hover:border-blue-500/40 transition-all"
              >
                <div className="text-blue-400 text-sm font-bold mb-1">DEPLOY CUSTOM ROLE</div>
                <div className="text-white/40 text-xs font-mono uppercase tracking-widest">"{searchQuery}"</div>
              </div>
            ) : !isLoading && (
              <div className="px-6 py-12 text-center text-xs text-white/20 uppercase tracking-[0.3em] font-mono italic">
                Awaiting neural role identification...
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 bg-white/[0.02] border-t border-white/5 flex justify-center items-center gap-4">
           <div className="flex items-center gap-2 text-[9px] font-mono text-white/20 uppercase tracking-widest">
             <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5">↑↓</kbd> Navigate
           </div>
           <div className="flex items-center gap-2 text-[9px] font-mono text-white/20 uppercase tracking-widest">
             <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5">Enter</kbd> Select
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


