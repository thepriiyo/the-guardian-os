'use server';

import { getRiskReport, getRoleSuggestions, getSkillSuggestions } from '@/lib/ai';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rate-limit';

export async function submitAssessment(formData: {
  jobTitle: string;
  skills: string;
  location: string;
  incomeTarget: string;
}) {
  const rateLimit = await checkRateLimit('assessment', 3);
  if (!rateLimit.allowed) {
    throw new Error(rateLimit.message);
  }
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
  const { data, error } = await supabase
    .from('discount_codes')
    .select('discount_type, value, is_active, usage_limit, usage_count')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return { success: false, message: 'Invalid or Expired Intelligence Access Code' };
  }

  if (data.usage_limit && data.usage_count >= data.usage_limit) {
    return { success: false, message: 'Tactical Authorization Limit Reached' };
  }

  return { 
    success: true, 
    discount: data.value,
    discountType: data.discount_type 
  };
}

export async function captureLead(email: string, assessmentId?: string) {
  const { error } = await supabase
    .from('crm_leads')
    .insert([{ email, assessment_id: assessmentId }]);

  if (error && error.code !== '23505') { // Ignore duplicate emails
    console.error('CRM_LEAD_CAPTURE_ERROR:', error);
    return { success: false };
  }
  return { success: true };
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

export async function fetchRoleSuggestions(query: string) {
  const rateLimit = await checkRateLimit('role_suggestions', 50);
  if (!rateLimit.allowed) return [];
  return await getRoleSuggestions(query);
}

export async function fetchSkillSuggestions(role: string) {
  const rateLimit = await checkRateLimit('skill_suggestions', 50);
  if (!rateLimit.allowed) return [];
  return await getSkillSuggestions(role);
}

export async function getAssessmentCount() {
  const { count, error } = await supabase
    .from('assessments')
    .select('*', { count: 'exact', head: true });

  if (error) return 127; // Default fallback for museum-tier aesthetic
  return (count || 0) + 127; // Adding base seed for social proof
}
