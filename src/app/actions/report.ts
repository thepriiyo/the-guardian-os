'use server';

import { generateFullReport, getMarketPulse } from '@/lib/ai';

export async function getTacticalReportAction(assessment: any) {
  const jobTitle = assessment.job_title;
  const location = assessment.location;
  
  const report = await generateFullReport(jobTitle, location, assessment);
  return report;
}

export async function getMarketPulseAction(location: string, role: string) {
  return await getMarketPulse(location, role);
}
