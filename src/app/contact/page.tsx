import { ContactForm } from '@/components/contact-form';
import { Shield, MessageSquare, Radio, Terminal } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Command // GUARDIAN OS",
  description: "Secure intelligence transmission line. Report anomalies, request tactical assistance, or provide mission-critical feedback.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Background Neural Network Aesthetic */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center space-y-4 mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase">
            Contact <span className="text-blue-500">Command</span>
          </h1>
          
          <p className="text-white/40 font-mono text-xs md:text-sm uppercase tracking-[0.3em] max-w-2xl mx-auto leading-relaxed">
            Secure intelligence transmission line. Report anomalies, request tactical assistance, or provide mission-critical feedback.
          </p>
        </div>

        <div className="grid md:col-span-1 gap-12">
          <ContactForm />
        </div>

        <div className="mt-20 pt-12 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 text-[9px] font-mono uppercase tracking-[0.2em] opacity-30">
          <div className="space-y-2">
            <div className="text-blue-500 flex items-center gap-2"><Radio className="w-3 h-3" /> Frequency</div>
            <div className="text-white">Encrypted-VHF</div>
          </div>
          <div className="space-y-2">
            <div className="text-blue-500 flex items-center gap-2"><Shield className="w-3 h-3" /> Security</div>
            <div className="text-white">End-to-End Node</div>
          </div>
          <div className="space-y-2">
            <div className="text-blue-500 flex items-center gap-2"><Terminal className="w-3 h-3" /> Protocol</div>
            <div className="text-white">Gemma-Alpha-7</div>
          </div>
          <div className="space-y-2">
            <div className="text-blue-500 flex items-center gap-2"><MessageSquare className="w-3 h-3" /> Status</div>
            <div className="text-white">Listening...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
