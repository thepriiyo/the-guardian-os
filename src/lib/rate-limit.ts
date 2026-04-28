import { headers } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';

export async function checkRateLimit(action: string, limit: number = 3) {
  // ARCHITECT BYPASS: No limits in development mode
  if (process.env.NODE_ENV === 'development') return { allowed: true };

  const forwarded = (await headers()).get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  
  // ARCHITECT BYPASS: Explicit Admin IP exemption
  if (process.env.ADMIN_IP && ip === process.env.ADMIN_IP) return { allowed: true };
  
  try {
    // Standard tactical timeout for DB check
    const { data, error } = await Promise.race([
      supabaseAdmin
        .from('rate_limits')
        .select('count, last_request')
        .eq('ip', ip)
        .eq('action', action)
        .single(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('DB_TIMEOUT')), 5000))
    ]) as any;

  const now = new Date();
  const windowMs = 3600000; // 1 hour window

  if (data) {
    const lastRequest = new Date(data.last_request);
    if (now.getTime() - lastRequest.getTime() < windowMs) {
      if (data.count >= limit) {
        return { allowed: false, message: 'Tactical Frequency Limit Reached. Operational reset in 60 minutes.' };
      }
      await supabaseAdmin
        .from('rate_limits')
        .update({ count: data.count + 1, last_request: now.toISOString() })
        .eq('ip', ip)
        .eq('action', action);
    } else {
      // Reset window
      await supabaseAdmin
        .from('rate_limits')
        .update({ count: 1, last_request: now.toISOString() })
        .eq('ip', ip)
        .eq('action', action);
    }
  } else {
    await supabaseAdmin
      .from('rate_limits')
      .insert([{ ip, action, count: 1, last_request: now.toISOString() }]);
  }

  return { allowed: true };
  } catch (e) {
    console.error('Rate Limit Shield Failure:', e);
    return { allowed: true }; // Fallback to allow if DB fails
  }
}
