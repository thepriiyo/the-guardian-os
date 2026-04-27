import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(process.cwd(), '.env.local') });

async function testAI() {
  try {
    const { text } = await generateText({
      model: google('gemma-3-27b-it'),
      prompt: 'Hello, how are you?',
    });
    console.log('Success:', text);
  } catch (error) {
    console.error('AI Error:', error);
  }
}

testAI();
