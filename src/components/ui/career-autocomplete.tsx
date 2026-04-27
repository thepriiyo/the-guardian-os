'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Briefcase, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const commonCareers = [
  "Paralegal",
  "Accountant",
  "Creative Director",
  "Software Engineer",
  "Customer Support",
  "Data Entry Specialist",
  "Legal Secretary",
  "Content Writer",
  "Graphic Designer",
  "Project Manager",
  "Financial Analyst",
  "HR Specialist",
  "Logistics Coordinator",
  "Sales Representative",
  "Marketing Strategist"
];

export function CareerAutocomplete({ 
  value, 
  onChange,
  placeholder = "Select your role..." 
}: { 
  value: string; 
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCareers = commonCareers.filter(c => 
    c.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        onClick={() => setOpen(!open)}
        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all group"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <Briefcase className="w-5 h-5 text-blue-500/50 group-hover:text-blue-500 transition-colors shrink-0" />
          <span className={cn("truncate text-sm", !value && "text-muted-foreground")}>
            {value || placeholder}
          </span>
        </div>
        <ChevronsUpDown className="w-4 h-4 text-muted-foreground opacity-50 shrink-0" />
      </div>

      {open && (
        <div className="absolute top-full left-0 w-full mt-2 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden z-[100] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3 border-b border-white/5 flex items-center gap-3">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input 
              autoFocus
              className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-white/20"
              placeholder="Search or type custom role..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputValue) {
                  onChange(inputValue);
                  setOpen(false);
                }
              }}
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-2 no-scrollbar">
            {filteredCareers.length > 0 ? (
              filteredCareers.map((career) => (
                <div 
                  key={career}
                  onClick={() => {
                    onChange(career);
                    setInputValue(career);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-blue-500/10 cursor-pointer group transition-colors"
                >
                  <span className="text-sm text-white/70 group-hover:text-white">{career}</span>
                  {value === career && <Check className="w-4 h-4 text-blue-500" />}
                </div>
              ))
            ) : inputValue && (
              <div 
                onClick={() => {
                  onChange(inputValue);
                  setOpen(false);
                }}
                className="px-4 py-3 rounded-xl hover:bg-blue-500/10 cursor-pointer text-blue-400 text-xs italic"
              >
                Use custom role: "{inputValue}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
