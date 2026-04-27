import { supabase } from '../lib/supabase';
import { generateSystemPrompt, getEmployeeProfile } from './aiPromptService';
import { AITriagePathway, TriageLog } from '../types/triage';

interface MockAIResponse {
  ai_triage_pathway: AITriagePathway;
  loa_recommended: boolean;
  ai_reasoning: string;
  policy_basis?: string;
}

function generateReferenceNumber(): string {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `TRG-${randomDigits}`;
}

function getMockAIResponse(userInput: string, systemPrompt: string): MockAIResponse {
  const normalized = userInput.toLowerCase();
  const hasImmediateRisk =
    normalized.includes('suicide') ||
    normalized.includes('self-harm') ||
    normalized.includes('kill myself');

  if (hasImmediateRisk) {
    return {
      ai_triage_pathway: 'Immediate Escalation',
      loa_recommended: true,
      ai_reasoning:
        'High-acuity language detected in user report and must be escalated immediately per safety guardrails.',
      policy_basis:
        'CRITICAL CLINICAL GUARDRAILS: hospitalization/risk override and urgent safety-first routing.',
    };
  }

  const likelyPsychiatry = systemPrompt.includes('currentPsychiatricMedication=true');

  if (likelyPsychiatry) {
    return {
      ai_triage_pathway: 'Psychiatry',
      loa_recommended: true,
      ai_reasoning:
        'Medication-aware routing prioritizes psychiatric evaluation and continuity of existing treatment.',
      policy_basis:
        'Medication Routing guardrail: active psychiatric medication requires psychiatry pathway.',
    };
  }

  return {
    ai_triage_pathway: 'Counseling',
    loa_recommended: false,
    ai_reasoning:
      'No hard override trigger detected in mock triage; counseling-first pathway selected with policy-safe follow-up.',
    policy_basis: 'Standard scoring with HRIS-contextual checks and no critical override trigger.',
  };
}

export async function processTriageLog(
  userId: string,
  userInput: string,
  phq9Score: number,
  gad7Score: number,
): Promise<TriageLog> {
  const cleanUserId = userId.trim();
  const cleanInput = userInput.trim();

  if (!cleanUserId) {
    throw new Error('processTriageLog failed: userId is required.');
  }

  if (!cleanInput) {
    throw new Error('processTriageLog failed: userInput is required.');
  }

  if (!isFinite(phq9Score) || phq9Score < 0) {
    throw new Error('processTriageLog failed: phq9Score must be a non-negative number.');
  }

  if (!isFinite(gad7Score) || gad7Score < 0) {
    throw new Error('processTriageLog failed: gad7Score must be a non-negative number.');
  }

  const referenceNumber = generateReferenceNumber();
  const profile = await getEmployeeProfile(cleanUserId);

  if (!profile) {
    throw new Error(`processTriageLog failed: no employee profile for user ${cleanUserId}.`);
  }

  const systemPrompt = generateSystemPrompt(profile);
  const mockAI = getMockAIResponse(cleanInput, systemPrompt);

  const payload: Omit<TriageLog, 'id' | 'created_at'> = {
    user_id: cleanUserId,
    user_free_text: cleanInput,
    phq9_score: phq9Score,
    gad7_score: gad7Score,
    ai_triage_pathway: mockAI.ai_triage_pathway,
    loa_recommended: mockAI.loa_recommended,
    ai_reasoning: mockAI.ai_reasoning,
    policy_basis: mockAI.policy_basis,
    reference_number: referenceNumber,
    status: 'Pending',
  };

  const { data, error } = await supabase
    .from('triage_logs')
    .insert(payload)
    .select('*')
    .single<TriageLog>();

  if (error) {
    throw new Error(`processTriageLog failed: unable to insert triage log. ${error.message}`);
  }

  return data;
}
