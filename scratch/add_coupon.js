const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addCoupon() {
  console.log('--- INITIATING_COUPON_INJECTION ---');
  
  const { data, error } = await supabase
    .from('discount_codes')
    .insert([
      {
        code: 'MISSION_1110',
        value: 1110,
        discount_type: 'fixed',
        is_active: true
      }
    ])
    .select();

  if (error) {
    console.error('INJECTION_FAILURE:', error);
  } else {
    console.log('INJECTION_SUCCESS:', data);
  }
}

addCoupon();
