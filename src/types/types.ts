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
