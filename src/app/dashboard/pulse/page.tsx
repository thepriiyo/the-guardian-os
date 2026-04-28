import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Newspaper, 
  Globe, 
  MapPin,
  Zap,
  ArrowUpRight,
  Target,
  Search
} from 'lucide-react';
import { getMarketPulse } from '@/lib/ai';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GlobalPaywallCTA } from '@/components/global-paywall-cta';

export const dynamic = 'force-dynamic';

export default async function PulsePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  const query = supabase.from('assessments').select('*');
  if (id) {
    query.eq('id', id);
  } else {
    query.order('created_at', { ascending: false });
  }

  const { data: assessments } = await query.limit(1);
  const assessment = assessments?.[0];

  if (!assessment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-10 text-center px-4">
        <div className="relative">
          <div className="absolute -inset-4 bg-blue-500/10 blur-3xl rounded-full animate-pulse" />
          <div className="w-24 h-24 rounded-full bg-blue-500/5 flex items-center justify-center border border-blue-500/10 relative z-10">
            <Search className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">No Pulse Detected</h2>
          <p className="text-muted-foreground max-w-sm mx-auto font-light leading-relaxed text-lg">
            We need an active career scan to tune into the market pulse of your industry. Initialize a scan to begin.
          </p>
        </div>
        <Link href="/">
          <Button className="rounded-full px-12 py-8 bg-blue-600 hover:bg-blue-500 font-bold text-xl shadow-[0_0_50px_-10px_rgba(59,130,246,0.5)]">
            Initialize First Scan
          </Button>
        </Link>
      </div>
    );
  }

  const pulse = await getMarketPulse(assessment.location, assessment.job_title);
  const location = assessment.location;

  return (
    <div className="space-y-12 py-10 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono text-blue-400 uppercase tracking-[0.3em]">
            <TrendingUp className="w-3 h-3" /> Live // Market // Intel
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            Market Pulse
          </h1>
          <p className="text-muted-foreground font-light text-lg">Real-time sentiment and news for {assessment.job_title} in {location}.</p>
        </div>
        <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1 text-center">Local Sentiment</div>
          <div className="text-3xl font-black text-blue-500 tracking-tighter italic">{pulse.sentiment || "Positive"} // {pulse.growth_rate || "Stable"}</div>
        </div>
      </div>

      {!assessment.is_unlocked && (
        <GlobalPaywallCTA assessmentId={assessment.id} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sentiment Analysis Card */}
        <Card className="lg:col-span-1 glass border-white/10 overflow-hidden group">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-[0.3em] text-blue-400">Survival Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="relative p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 mb-8 italic font-light text-lg leading-relaxed">
              "{pulse.sentiment_summary || pulse.local_sentiment_summary}"
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-mono text-muted-foreground uppercase">
                <span>Volatility Index</span>
                <span className="text-blue-400">High // Stable</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-2/3 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Intelligence Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
              <Newspaper className="w-3 h-3" /> Intelligence Feed
            </h3>
            <span className="text-[10px] font-mono text-blue-500/50 uppercase tracking-widest">Model: Gemma 3 27B</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(pulse.news || pulse.breaking_news).map((news: any, i: number) => (
              <Card key={i} className="glass border-white/10 hover:border-blue-500/30 transition-all duration-500 group cursor-pointer">
                <CardContent className="p-8">
                  <Badge variant="outline" className="mb-4 border-blue-500/20 text-blue-400 font-mono text-[10px] uppercase">
                    Alert // {i + 1}
                  </Badge>
                  <h4 className="text-2xl font-bold tracking-tight mb-4 group-hover:text-blue-400 transition-colors leading-tight">{news.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed font-light mb-6">
                    {news.summary}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5 opacity-50 text-[10px] font-mono uppercase tracking-widest">
                    <span>{news.source || "Guardian Intel"}</span>
                    <ArrowUpRight className="w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {!assessment.is_unlocked && (
        <div className="pt-8">
          <GlobalPaywallCTA assessmentId={assessment.id} />
        </div>
      )}
    </div>
  );
}
