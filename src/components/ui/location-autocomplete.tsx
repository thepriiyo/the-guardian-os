'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, MapPin, Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LocationAutocomplete({ 
  value, 
  onChange,
  placeholder = "Select location..." 
}: { 
  value: string; 
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
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

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      const results = data.map((item: any) => {
        const city = item.address.city || item.address.town || item.address.village || item.address.suburb || '';
        const country = item.address.country || '';
        return city && country ? `${city}, ${country}` : item.display_name.split(',').slice(0, 2).join(', ');
      });
      setSuggestions(Array.from(new Set(results)) as string[]);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue && inputValue !== value) {
        fetchSuggestions(inputValue);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [inputValue]);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        onClick={() => setOpen(!open)}
        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all group"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <MapPin className="w-5 h-5 text-blue-500/50 group-hover:text-blue-500 transition-colors shrink-0" />
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
              placeholder="Search city..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputValue) {
                  onChange(inputValue);
                  setOpen(false);
                }
              }}
            />
            {loading && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
          </div>
          <div className="max-h-60 overflow-y-auto p-2 no-scrollbar">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
                <div 
                  key={suggestion}
                  onClick={() => {
                    onChange(suggestion);
                    setInputValue(suggestion);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-blue-500/10 cursor-pointer group transition-colors"
                >
                  <span className="text-sm text-white/70 group-hover:text-white">{suggestion}</span>
                  {value === suggestion && <Check className="w-4 h-4 text-blue-500" />}
                </div>
              ))
            ) : inputValue && !loading && (
              <div 
                onClick={() => {
                  onChange(inputValue);
                  setOpen(false);
                }}
                className="px-4 py-3 rounded-xl hover:bg-blue-500/10 cursor-pointer text-blue-400 text-xs italic"
              >
                Use "{inputValue}"
              </div>
            )}
            {!loading && suggestions.length === 0 && !inputValue && (
              <div className="px-4 py-6 text-center text-xs text-muted-foreground uppercase tracking-widest font-mono opacity-40">
                Awaiting Search Data...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
