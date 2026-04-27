import { supabase } from './supabase';
async function run() {
  const { data } = await supabase.from('assessments').select('*').order('created_at', { ascending: false }).limit(1);
  console.log('LATEST:', JSON.stringify(data?.[0]?.job_title));
}
run();
