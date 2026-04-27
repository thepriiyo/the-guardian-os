import { createGoogleGenerativeAI } from '@ai-sdk/google';
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

async function run() {
  console.log('Checking Gemma 3...');
  try {
    // We can't easily list, but we can try to call a small prompt
    // Wait, I'll just check the environment variables first.
  } catch(e) {}
}
run();
