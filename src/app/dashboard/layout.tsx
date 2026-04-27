'use client';

import { Sidebar } from '@/components/sidebar';
import { LayoutDashboard, Map, TrendingUp } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Mobile Top Header */}
      <div className="lg:hidden h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.3em]">Guardian_OS</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 lg:pb-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </div>

      {/* Tactical Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-2xl border-t border-white/10 z-50 flex items-center justify-around px-4">
        <MobileNavLink icon={LayoutDashboard} href="/dashboard" label="Overview" />
        <MobileNavLink icon={Map} href="/dashboard/roadmap" label="Roadmap" />
        <MobileNavLink icon={TrendingUp} href="/dashboard/pulse" label="Pulse" />
      </div>
    </div>
  );
}

function MobileNavLink({ icon: Icon, href, label }: { icon: any, href: string, label: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const fullHref = id ? `${href}?id=${id}` : href;
  const isActive = pathname === href;

  return (
    <Link href={fullHref} className="flex flex-col items-center gap-1.5 px-4">
      <div className={cn(
        "p-2.5 rounded-xl transition-all duration-300",
        isActive ? "bg-blue-500/10 text-blue-400" : "text-white/40"
      )}>
        <Icon className={cn("w-5 h-5", isActive && "animate-pulse")} />
      </div>
      <span className={cn(
        "text-[8px] font-mono uppercase tracking-widest transition-all",
        isActive ? "text-blue-400 opacity-100" : "text-white/20 opacity-50"
      )}>{label}</span>
    </Link>
  );
}
