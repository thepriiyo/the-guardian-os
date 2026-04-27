import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';
import { sendAuthorizationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      assessment_id 
    } = await req.json();

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing verification fields' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // PROCEED WITH FULFILLMENT
      if (assessment_id) {
        const { error } = await supabaseAdmin
          .from('assessments')
          .update({ is_unlocked: true })
          .eq('id', assessment_id);

        if (error) {
          console.error('SUPABASE_UNLOCK_ERROR:', error);
          return NextResponse.json({ error: 'Payment verified but failed to unlock dossier' }, { status: 500 });
        }

        // TRIGGER AUTOMATED DISPATCH
        try {
          const { data: meta } = await supabaseAdmin
            .from('assessments')
            .select('email, job_title')
            .eq('id', assessment_id)
            .single();

          if (meta?.email) {
            await sendAuthorizationEmail(meta.email, assessment_id, meta.job_title);
          }
        } catch (emailErr) {
          console.error('[EMAIL_TRIGGER_ERROR]:', emailErr);
        }
      }

      return NextResponse.json({ success: true, message: 'Payment verified and dossier unlocked' });
    } else {
      return NextResponse.json({ error: 'Invalid signature. Payment verification failed.' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('RAZORPAY_VERIFY_ERROR:', error);
    return NextResponse.json({ error: error.message || 'Verification failed' }, { status: 500 });
  }
}
