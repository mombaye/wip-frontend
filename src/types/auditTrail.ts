// src/types/auditTrail.ts
export interface AuditTrailRow {
  id: number;
  created_at: string; // ISO date string
  account_desc?: string;
  tr_code?: string;
  description?: string;
  project?: string;
  user?: string;
  debit?: number;
  credit?: number;
  net?: number;
  country_report?: string;
  bl_category?: string;
  month?: string;
  year?: string;
  project_margin?: string;
  talentia_account?: string;
  talentia_reporting?: string;
  ebitda?: string;
  category?: string;
  final_client?: string;
  country_of_project?: string;
  country_code?: string;
  talentia_code?: string;
}
