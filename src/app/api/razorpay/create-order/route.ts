import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.error('RAZORPAY_ENV_MISSING:', { key_id: !!key_id, key_secret: !!key_secret });
      return NextResponse.json({ 
        error: 'Razorpay configuration is missing in .env.local. Please restart your server.' 
      }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });

    const { amount, currency, receipt } = await req.json();

    if (!amount || amount < 100) {
      return NextResponse.json({ error: 'Minimum amount is 100 paise' }, { status: 400 });
    }

    const options = {
      amount: Math.round(amount),
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    // Surface the exact Razorpay rejection message
    const errorMessage = error.error?.description || error.message || 'Failed to create order';
    console.error('RAZORPAY_ORDER_ERROR:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
