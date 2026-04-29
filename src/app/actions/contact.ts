'use server';

import { supabaseAdmin } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function submitContactForm(formData: { email: string; message: string }) {
  console.log('--- INITIATING_CONTACT_UPLINK ---', { email: formData.email });

  if (!formData.email || !formData.message) {
    throw new Error('Mission-critical data missing (Email/Message required).');
  }

  try {
    const { error } = await supabaseAdmin
      .from('contact_messages')
      .insert([
        {
          email: formData.email,
          message: formData.message,
        }
      ]);

    if (error) {
      console.error('CONTACT_UPLINK_FAILURE:', error);
      throw new Error(`Satellite link failed: ${error.message}`);
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    console.error('CRITICAL_CONTACT_ERROR:', err);
    throw new Error(err.message || 'Fatal uplink synchronization error.');
  }
}
