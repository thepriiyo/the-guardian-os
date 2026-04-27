import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { sendAuthorizationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('x-signature');

  if (!signature) {
    return new NextResponse('Missing Signature', { status: 400 });
  }

  // Verify Webhook Signature
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || '';
  const hmac = crypto.createHmac('sha256', secret);
  const digest = Buffer.from(hmac.update(body).digest('hex'), 'utf8');
  const signatureBuffer = Buffer.from(signature, 'utf8');

  if (signatureBuffer.length !== digest.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
    return new NextResponse('Invalid Signature', { status: 401 });
  }

  const payload = JSON.parse(body);
  const eventName = payload.meta.event_name;
  const customData = payload.meta.custom_data; // We will pass assessment_id here

  console.log(`[LEMON_SQUEEZY_WEBHOOK] Processing event: ${eventName}`);

  if (eventName === 'order_created') {
    const assessmentId = customData?.assessment_id;

    if (assessmentId) {
      console.log(`[LEMON_SQUEEZY_WEBHOOK] Authorizing Access for Assessment: ${assessmentId}`);
      
      const { error } = await supabaseAdmin
        .from('assessments')
        .update({ is_unlocked: true })
        .eq('id', assessmentId);

      if (error) {
        console.error('[LEMON_SQUEEZY_WEBHOOK] Supabase Update Error:', error);
        return new NextResponse('Internal Error', { status: 500 });
      }

      // TRIGGER AUTOMATED DISPATCH
      try {
        const { data: meta } = await supabaseAdmin
          .from('assessments')
          .select('email, job_title')
          .eq('id', assessmentId)
          .single();

        if (meta?.email) {
          await sendAuthorizationEmail(meta.email, assessmentId, meta.job_title);
        }
      } catch (emailErr) {
        console.error('[LEMON_SQUEEZY_EMAIL_ERROR]:', emailErr);
      }
    }
  }

  return new NextResponse('OK', { status: 200 });
}
