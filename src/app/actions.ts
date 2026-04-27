'use server';

import { getRiskReport } from '@/lib/ai';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';

export async function submitAssessment(formData: {
  jobTitle: string;
  skills: string;
  location: string;
  incomeTarget: string;
}) {
  console.log('STEP 1: Starting AI Generation with Gemma 3...');
  const report = await getRiskReport(
    formData.jobTitle,
    formData.skills,
    formData.location
  );

  if (!report) {
    console.error('STEP 2 FAIL: AI report generation returned null');
    throw new Error('Failed to generate risk report');
  }

  console.log('STEP 2 SUCCESS: AI Report generated. Saving to Supabase...');

  // Save to Supabase
  const { data: newAssessment, error } = await supabase
    .from('assessments')
    .insert([{
      job_title: formData.jobTitle,
      skills: formData.skills,
      location: formData.location,
      risk_score: Math.round(Number(report.risk_score)),
      report_data: report
    }])
    .select()
    .single();

  if (error) {
    console.error('STEP 3 FAIL: Supabase save error:', error);
    throw new Error(`Intelligence storage failed: ${error.message}`);
  }
  
  console.log('STEP 3 SUCCESS: Assessment saved with ID:', newAssessment?.id);

  revalidatePath('/dashboard', 'layout');
  
  return { success: true, id: newAssessment?.id };
}

export async function validateAccessCode(code: string) {
  const codes: Record<string, number> = {
    'GUARDIAN20': 20,
    'SECURITY40': 40,
    'NEURAL50': 50,
    'ABSOLUTE100': 100,
  };

  const discount = codes[code.toUpperCase()];
  if (discount) {
    return { success: true, discount };
  }
  return { success: false, message: 'Invalid Intelligence Access Code' };
}

export async function checkUnlockStatus(id: string) {
  const { data, error } = await supabase
    .from('assessments')
    .select('is_unlocked')
    .eq('id', id)
    .single();

  if (error || !data) return false;
  return data.is_unlocked;
}
