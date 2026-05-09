import { supabase } from '../lib/supabase';
import { getEmployeeProfile } from './aiPromptService';
import { LeaveType, LoaApplication } from '../types/loa';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function generateLoaReferenceNumber(): string {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `LOA-${randomDigits}`;
}

function mockCheckTeamCoverage(teamAssignment: string, startDate: string): boolean {
  void teamAssignment;
  void startDate;
  return Math.random() < 0.9;
}

function getRequestedLeaveDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error('processAutomatedLoa failed: startDate or endDate is invalid.');
  }

  if (end < start) {
    throw new Error('processAutomatedLoa failed: endDate must be on or after startDate.');
  }

  return Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY) + 1;
}

export async function processAutomatedLoa(
  userId: string,
  triageLogId: string,
  startDate: string,
  endDate: string,
  leaveType: LeaveType,
): Promise<LoaApplication> {
  const cleanUserId = userId.trim();
  const cleanTriageLogId = triageLogId.trim();

  if (!cleanUserId) {
    throw new Error('processAutomatedLoa failed: userId is required.');
  }

  if (!cleanTriageLogId) {
    throw new Error('processAutomatedLoa failed: triageLogId is required.');
  }

  const profile = await getEmployeeProfile(cleanUserId);
  if (!profile) {
    throw new Error(`processAutomatedLoa failed: no employee profile for user ${cleanUserId}.`);
  }

  const referenceNumber = generateLoaReferenceNumber();
  const requestedDays = getRequestedLeaveDays(startDate, endDate);

  const availableBalance =
    leaveType === 'Sick Leave'
      ? profile.sick_leave_balance
      : profile.wellness_leave_balance;
  const hasSufficientBalance = availableBalance >= requestedDays;
  const isRegularEmployee = profile.employment_status === 'regular';
  const coverageVerified = mockCheckTeamCoverage(profile.team_id, startDate);

  const autoApproved =
    hasSufficientBalance && isRegularEmployee && coverageVerified;

  const status: LoaApplication['status'] = autoApproved
    ? 'Auto-Approved'
    : 'Flagged for HR Review';

  const reasonParts: string[] = [];
  reasonParts.push(
    autoApproved
      ? 'Auto-approved: leave balance is sufficient, employee status is regular, and team coverage is maintained.'
      : 'Flagged for HR review due to one or more unmet automation conditions.',
  );
  reasonParts.push(
    `${leaveType} requested for ${requestedDays} day(s); available balance=${availableBalance}.`,
  );
  reasonParts.push(`Employment status=${profile.employment_status}.`);
  reasonParts.push(`Team coverage verified=${coverageVerified}.`);

  const payload: Omit<LoaApplication, 'id' | 'created_at'> = {
    user_id: cleanUserId,
    triage_log_id: cleanTriageLogId,
    start_date: startDate,
    end_date: endDate,
    leave_type: leaveType,
    status,
    ai_decision_reason: reasonParts.join(' '),
    coverage_verified: coverageVerified,
    reference_number: referenceNumber,
  };

  const { data, error } = await supabase
    .from('loa_applications')
    .insert(payload)
    .select('*')
    .single<LoaApplication>();

  if (error) {
    throw new Error(
      `processAutomatedLoa failed: unable to insert loa application. ${error.message}`,
    );
  }

  return data;
}
