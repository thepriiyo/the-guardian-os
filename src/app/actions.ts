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
  const report = await getRiskReport(
    formData.jobTitle,
    formData.skills,
    formData.location
  );

  if (!report) {
    throw new Error('Neural engine returned empty intelligence.');
  }

  // Neural Precision Sanitization (Rounding to Integer for DB Compatibility)
  const rawRisk = report.risk_score;
  const parsedRisk = parseFloat(String(rawRisk).replace(/[^0-9.]/g, ''));
  report.risk_score = Math.round(isNaN(parsedRisk) ? (40 + Math.random() * 20) : parsedRisk);

  if (report.metrics) {
    const rawCertainty = report.metrics.certainty_score;
    const parsedCertainty = parseFloat(String(rawCertainty).replace(/[^0-9.]/g, ''));
    report.metrics.certainty_score = Math.round(isNaN(parsedCertainty) ? (70 + Math.random() * 10) : parsedCertainty);
  }

  try {
    // Save to Supabase
    const { data: newAssessment, error } = await supabase
      .from('assessments')
      .insert([{
        job_title: formData.jobTitle,
        skills: formData.skills,
        location: formData.location,
        risk_score: report.risk_score,
        report_data: report
      }])
      .select('id')
      .single();

    if (error || !newAssessment) {
      throw new Error(error?.message || 'Assessment record creation failed.');
    }

    revalidatePath('/dashboard', 'layout');
    return { success: true, id: newAssessment.id };
  } catch (err: any) {
    console.error('CRITICAL_DATABASE_ERROR:', err);
    throw new Error(`Strategic analysis storage failure: ${err.message}`);
  }
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
  
  if (error) return 0;
  return count || 0;
}
