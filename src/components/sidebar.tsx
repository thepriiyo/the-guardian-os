'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Map, 
  BookOpen, 
  Settings, 
  ShieldAlert,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Pivot Roadmap', href: '/dashboard/roadmap', icon: Map },
  { name: 'Market Pulse', href: '/dashboard/pulse', icon: TrendingUp },
];

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return (
    <div className="flex flex-col w-64 bg-black/20 border-r border-white/10 h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-6 flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const href = id ? `${item.href}?id=${id}` : item.href;
          return (
            <Link
              key={item.name}
              href={href}
              className={cn(
                'flex items-center justify-between px-4 py-3 text-[10px] font-mono uppercase tracking-[0.2em] rounded-xl transition-all duration-500 group relative overflow-hidden',
                isActive 
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 glow-blue' 
                  : 'text-white/40 hover:bg-white/5 hover:text-white'
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-blue-500/5 -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="flex items-center gap-4">
                <item.icon className={cn('w-4 h-4 transition-transform duration-500', isActive ? 'text-blue-500 scale-110' : 'text-white/20 group-hover:text-white')} />
                {item.name}
              </div>
              {isActive && <ChevronRight className="w-3 h-3" />}
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 bg-blue-500/5 rounded-lg border border-blue-500/10">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">System Guard Active</span>
        </div>
      </div>
    </div>
  );
}
