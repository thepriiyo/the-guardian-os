'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Radio, Activity, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMarketPulseAction } from '@/app/actions/report';

interface MarketPulseData {
  sentiment: string;
  sentiment_summary: string;
  stability_warning: string;
  news: any[];
  hiring_firms?: any[];
}

export function MarketPulseHUD({ location, role, onSentimentChange }: { location: string; role: string; onSentimentChange?: (sentiment: string) => void }) {
  const [data, setData] = useState<MarketPulseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPulse() {
      try {
        const pulse = await getMarketPulseAction(location, role);
        setData(pulse);
        if (onSentimentChange && pulse?.sentiment) {
          onSentimentChange(pulse.sentiment);
        }
      } catch (e) {
        console.error('Pulse Fetch Error:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchPulse();
  }, [location, role]);

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center space-y-4 flex-col">
        <Radio className="w-8 h-8 text-blue-500 animate-pulse" />
        <div className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Scanning_Global_Nodes...</div>
      </div>
    );
  }

  if (!data) return null;

  const isAlert = data.sentiment === 'Volatile' || data.sentiment === 'Caution';

  return (
    <div className={isAlert ? "relative group" : ""}>
      {/* Sentiment HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
          <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Market_Sentiment</div>
          <div className={`text-2xl font-black italic uppercase ${isAlert ? 'text-red-500' : 'text-green-500'}`}>
            {data.sentiment}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
          <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Stability_Warning</div>
          <div className="text-sm font-light text-white/80">{data.stability_warning}</div>
        </div>
      </div>

      {/* Breaking News Feed */}
      <div className="space-y-4">
        <div className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
          <Activity className="w-3 h-3" /> Breaking_Intelligence_Feed
        </div>
        {data.news.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-sm font-bold uppercase tracking-tight group-hover:text-blue-400 transition-colors">{item.title}</h4>
              <span className="text-[9px] font-mono text-white/20 uppercase whitespace-nowrap ml-4">{item.time}</span>
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed line-clamp-2">{item.summary}</p>
          </motion.div>
        ))}
      </div>

      {/* Hiring Firms HUD (Premium Feature) */}
      {data.hiring_firms && data.hiring_firms.length > 0 && (
        <div className="mt-8 pt-6 border-t border-white/5">
          <div className="text-[10px] font-mono text-green-400 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
            <TrendingUp className="w-3 h-3" /> Premium_Hiring_Nodes
          </div>
          <div className="grid grid-cols-1 gap-2">
            {data.hiring_firms.map((firm, i) => (
              <a 
                key={i}
                href={firm.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/10 hover:bg-green-500/10 transition-all text-xs font-bold"
              >
                <span>{firm.name.toUpperCase()}</span>
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
