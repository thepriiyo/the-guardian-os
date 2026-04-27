const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing Supabase Connection...');
  console.log('URL:', supabaseUrl);
  
  const { data, error } = await supabase
    .from('assessments')
    .select('count', { count: 'exact', head: true });

  if (error) {
    console.error('Connection Failed:', error.message);
    console.error('Hint:', error.hint);
    console.error('Details:', error.details);
  } else {
    console.log('Connection Successful! Assessment count:', data);
  }
}

testConnection();
