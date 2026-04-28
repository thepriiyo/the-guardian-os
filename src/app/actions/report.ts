'use server';

import { generateFullReport, getMarketPulse } from '@/lib/ai';
import { checkRateLimit } from '@/lib/rate-limit';

export async function getTacticalReportAction(assessment: any) {
  const jobTitle = assessment.job_title;
  const location = assessment.location;
  
  const report = await generateFullReport(jobTitle, location, assessment);
  return report;
}

export async function getMarketPulseAction(location: string, role: string) {
  const rateLimit = await checkRateLimit('market_pulse', 10); // 10 per hour (generous for dashboard)
  if (!rateLimit.allowed) {
    throw new Error(rateLimit.message);
  }
  return await getMarketPulse(location, role);
}
