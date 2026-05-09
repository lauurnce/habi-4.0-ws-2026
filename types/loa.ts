export type LeaveType = 'Sick Leave' | 'Wellness Leave';

export type LoaStatus =
  | 'Pending'
  | 'Auto-Approved'
  | 'Flagged for HR Review'
  | 'Rejected';

export interface LoaApplication {
  id: string;
  user_id: string;
  triage_log_id?: string;
  created_at: string;
  start_date: string;
  end_date: string;
  leave_type: LeaveType;
  status: LoaStatus;
  ai_decision_reason: string;
  coverage_verified: boolean;
  reference_number: string;
}
