import RoadmapClient from '@/components/roadmap-client';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Search } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function RoadmapPage({
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
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">No Roadmap Found</h2>
          <p className="text-muted-foreground max-w-sm mx-auto font-light leading-relaxed text-lg">
            Our systems need a career scan to generate your custom tactical roadmap. Initialize your first scan to begin.
          </p>
        </div>
        <Link href="/">
          <Button className="rounded-full px-12 py-8 bg-blue-600 hover:bg-blue-500 font-bold text-xl shadow-[0_0_50px_-10px_rgba(59,130,246,0.5)] hover:scale-105 transition-all duration-500">
            Initialize First Scan
          </Button>
        </Link>
      </div>
    );
  }

  return <RoadmapClient assessment={assessment} />;
}
