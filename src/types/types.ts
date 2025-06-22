// src/types/batchSave.ts

export type BatchErrorType = 'cogs' | 'invoices' | 'wip';

// L’entrée (entry) sera souvent une ligne d’import (par exemple AuditTrailRow ou COGSRow…)
// Donc tu peux utiliser "any" ou un type générique si tu veux : <T = any>

export interface BatchSaveError<T = any> {
  entry: T;              // L’objet de donnée qui a provoqué l’erreur
  error: string;         // Message d’erreur (du backend, ou “invalid month”, etc.)
}

export interface BatchErrorReport<T = any> extends BatchSaveError<T> {
  batch: number;         // N° du batch (1, 2, ...)
  type: BatchErrorType;  // "cogs" | "invoices" | "wip"
}



export interface WIPRow {
  nr_crt?: string;
  project_code: string;
  client?: string;
  location_description?: string;
  business_line?: string;
  status?: string;
  po_number?: string;
  po_date?: string;
  start_date?: string;
  estimated_completion_date?: string;
  initial_value_po?: number;
  final_value_po_currency?: number;
  po_currency?: string;
  exchange_rate?: number;
  final_value_local_currency?: number;
  estimated_margin?: number;
  estimated_profit?: number;
  estimated_costs?: number;
  degree_of_completion?: number;
  revenue_completion?: number;
  fae?: number;
  pca?: number;
  provision_for_losses?: number;
  invoices_local_ex_vat?: number;
  total_expenses?: number;
  deferred_cost?: number;
  pv_acceptance?: string;
  cancelled_amount_local?: number;
  cancel_reason?: string;
  month?: string;
  year?: string;
  [key: string]: any; // pour accès dynamique
}
