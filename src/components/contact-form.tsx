'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { submitContactForm } from '@/app/actions';

export function ContactForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage(null);

    try {
      const result = await submitContactForm({ email, message });
      if (result.success) {
        setStatus('success');
        setEmail('');
        setMessage('');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Transmission failed.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-8 rounded-[2rem] bg-green-500/10 border border-green-500/20 text-center space-y-4"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-xl font-black italic uppercase text-green-400">Payload Received</h3>
              <p className="text-xs font-mono text-green-500/60 uppercase tracking-widest">Neural Link Synchronized</p>
            </div>
            <Button 
              onClick={() => setStatus('idle')}
              variant="outline" 
              className="border-green-500/20 hover:bg-green-500/10 text-green-400"
            >
              Send Another
            </Button>
          </motion.div>
        ) : (
          <motion.form 
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-1000"></div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <Input 
                    type="email"
                    placeholder="OPERATIVE_EMAIL"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-black/40 border-white/5 pl-12 h-14 rounded-2xl focus:border-blue-500/50 transition-all font-mono text-sm placeholder:opacity-20"
                  />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition duration-1000"></div>
                <div className="relative">
                  <Textarea 
                    placeholder="TACTICAL_MESSAGE_INPUT"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="bg-black/40 border-white/5 p-4 min-h-[160px] rounded-2xl focus:border-blue-500/50 transition-all font-mono text-sm placeholder:opacity-20 resize-none"
                  />
                </div>
              </div>
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono uppercase tracking-widest">
                <AlertCircle className="w-4 h-4" />
                {errorMessage}
              </div>
            )}

            <Button 
              type="submit"
              disabled={status === 'loading'}
              className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 font-black text-lg shadow-[0_0_50px_-15px_rgba(59,130,246,0.5)] group overflow-hidden"
            >
              <div className="flex items-center gap-3 relative z-10">
                {status === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    <span>INITIATE UPLINK</span>
                  </>
                )}
              </div>
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
