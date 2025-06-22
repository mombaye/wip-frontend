import api from "./api";

export async function fetchInvoices(month: string, year: string) {
  const res = await api.get('/invoices', { params: { month, year } });
  return res.data; // Array de lignes COGS "plates"
}
