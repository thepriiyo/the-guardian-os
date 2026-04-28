'use client';

import { motion } from 'framer-motion';
import { Shield, TrendingUp, Cpu, ChevronLeft, ArrowRight, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';
import { blogPosts } from '@/lib/blog-data';

const iconMap: Record<string, React.ReactNode> = {
  shield: <Shield className="w-5 h-5" />,
  trending: <TrendingUp className="w-5 h-5" />,
  cpu: <Cpu className="w-5 h-5" />,
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto space-y-16">

          {/* Header */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-blue-400/60 hover:text-blue-400 transition-colors group">
              <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Command Center
            </Link>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic">
                Intelligence <span className="text-blue-500">Briefings.</span>
              </h1>
              <p className="text-lg text-muted-foreground font-light max-w-2xl leading-relaxed">
                Strategic analysis on AI automation, career resilience, and the tactical intelligence powering The Guardian OS.
              </p>
            </div>
          </div>

          {/* Featured Article */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link href={`/blog/${blogPosts[0].slug}`} className="group block">
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 hover:border-blue-500/30 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="p-8 md:p-12 space-y-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono uppercase tracking-widest">
                      Featured Briefing
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-white/30 uppercase tracking-widest">
                      <Clock className="w-3 h-3" /> {blogPosts[0].readTime}
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic group-hover:text-blue-400 transition-colors leading-tight">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-3xl">
                    {blogPosts[0].description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-blue-400 font-mono uppercase tracking-widest group-hover:gap-4 transition-all">
                    Read Briefing <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Article Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts.slice(1).map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <div className="h-full p-8 rounded-[2rem] border border-white/10 bg-white/5 hover:border-blue-500/30 transition-all duration-500 space-y-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                          {iconMap[post.icon]}
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-mono text-white/30 uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {post.readTime}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="text-[10px] font-mono text-blue-400/60 uppercase tracking-widest">{post.category}</div>
                        <h3 className="text-xl font-black tracking-tight uppercase italic group-hover:text-blue-400 transition-colors leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground font-light leading-relaxed">
                          {post.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-blue-400/60 font-mono uppercase tracking-widest group-hover:text-blue-400 group-hover:gap-3 transition-all">
                        Read <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center space-y-8 py-20 border-t border-white/5"
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">
              Stop Reading. <span className="text-blue-500">Start Scanning.</span>
            </h2>
            <p className="text-muted-foreground font-light max-w-lg mx-auto">
              Initialize your career resilience diagnostic and get a personalized tactical dossier in minutes.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-[0_0_30px_-10px_rgba(59,130,246,0.5)]"
            >
              <Shield className="w-4 h-4" /> Initialize Career Scan
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
