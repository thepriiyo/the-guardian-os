import { Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function GlobalPaywallCTA({ assessmentId }: { assessmentId: string }) {
  return (
    <div className="w-full bg-blue-500/[0.03] border border-blue-500/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
      {/* Cinematic Lighting */}
      <div className="absolute inset-0 bg-blue-500/5 blur-3xl -z-10 group-hover:bg-blue-500/10 transition-colors duration-700" />
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50 group-hover:bg-blue-500 transition-colors duration-700" />
      
      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
          <Lock className="w-6 h-6 text-blue-400" />
        </div>
        <div className="space-y-2">
          <h4 className="text-xl md:text-2xl text-white font-black uppercase tracking-tighter italic">Intelligence Payload Locked</h4>
          <p className="text-xs md:text-sm font-light text-muted-foreground leading-relaxed max-w-lg">
            Your comprehensive 20-page tactical survival dossier is ready. Authorize access to decrypt the full strategy.
          </p>
        </div>
      </div>
      
      <Link href={`/dashboard/roadmap?id=${assessmentId}#paywall`} className="relative z-10 w-full md:w-auto shrink-0">
        <Button className="w-full md:w-auto rounded-full bg-blue-600 hover:bg-blue-500 font-bold px-8 py-6 text-sm shadow-[0_0_30px_-10px_rgba(59,130,246,0.5)] group/btn flex items-center justify-center gap-2">
          Authorize Intelligence <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </div>
  );
}
