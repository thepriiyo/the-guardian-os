'use client';

import { motion } from 'framer-motion';
import { Shield, ChevronLeft, Clock, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { BlogPost } from '@/lib/blog-data';

function renderMarkdown(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-2xl md:text-3xl font-black tracking-tight uppercase italic text-white mt-16 mb-6">
          {line.replace('## ', '')}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-lg font-bold tracking-tight text-white mt-10 mb-3">
          {line.replace('### ', '')}
        </h3>
      );
    } else if (line.startsWith('---')) {
      elements.push(<hr key={i} className="border-white/5 my-12" />);
    } else if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].replace('- ', ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-3 my-6">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-white/70 font-light leading-relaxed">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    } else if (line.match(/^\d+\. /)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(lines[i].replace(/^\d+\. /, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-3 my-6">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-4 text-white/70 font-light leading-relaxed">
              <span className="text-blue-400 font-mono text-sm font-bold mt-0.5">{j + 1}.</span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ol>
      );
      continue;
    } else if (line.startsWith('[') && line.includes('](')) {
      const match = line.match(/\[(.+?)\]\((.+?)\)/);
      if (match) {
        elements.push(
          <div key={i} className="my-10">
            <Link
              href={match[2]}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-[0_0_30px_-10px_rgba(59,130,246,0.5)]"
            >
              <Shield className="w-4 h-4" /> {match[1]}
            </Link>
          </div>
        );
      }
    } else if (line.trim() !== '') {
      elements.push(
        <p key={i} className="text-white/70 font-light leading-relaxed my-4 text-lg" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
      );
    }

    i++;
  }

  return elements;
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-sm font-mono">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline underline-offset-4">$1</a>');
}

export default function ArticleContent({ post }: { post: BlogPost }) {
  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <article className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl mx-auto">

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-mono text-blue-400/60 hover:text-blue-400 transition-colors group">
              <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> All Briefings
            </Link>
          </motion.div>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 mb-16"
          >
            <div className="flex items-center gap-4 flex-wrap">
              <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono uppercase tracking-widest">
                {post.category}
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono text-white/30 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {post.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {post.readTime}</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-6xl font-black tracking-tighter uppercase italic leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-muted-foreground font-light leading-relaxed">
              {post.description}
            </p>
            <div className="h-px bg-white/5" />
          </motion.header>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {renderMarkdown(post.content)}
          </motion.div>

          {/* Footer CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-20 pt-16 border-t border-white/5 space-y-8"
          >
            <div className="p-8 md:p-12 rounded-[2rem] bg-white/5 border border-white/10 text-center space-y-6">
              <h3 className="text-2xl md:text-4xl font-black tracking-tighter uppercase italic">
                Ready to Scan <span className="text-blue-500">Your Risk?</span>
              </h3>
              <p className="text-muted-foreground font-light max-w-lg mx-auto">
                Initialize your career resilience diagnostic and receive a personalized tactical dossier.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-[0_0_30px_-10px_rgba(59,130,246,0.5)]"
              >
                <Shield className="w-4 h-4" /> Initialize Career Scan <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-white/20 uppercase tracking-widest py-6">
              <span>The Guardian OS // Intelligence Briefing</span>
              <span>Engineered by Priiyo</span>
            </div>
          </motion.div>
        </div>
      </article>
    </main>
  );
}
