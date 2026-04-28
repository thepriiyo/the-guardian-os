import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Ensure they are loaded before importing
import { submitAssessment } from './src/app/actions';

async function run() {
  console.log('Testing submitAssessment...');
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  try {
    const res = await submitAssessment({
      jobTitle: 'Software Engineer',
      skills: 'React, Node, TypeScript',
      location: 'New York',
      incomeTarget: '150000'
    });
    console.log('Result:', res);
  } catch(e) {
    console.error('Caught:', e);
  }
}
run();
