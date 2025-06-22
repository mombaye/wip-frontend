import api from "./api";
import { WIPRow } from "@/types/types";

export async function fetchWIP(month: string, year: string) {
  const res = await api.get('/wip', { params: { month, year } });
  return res.data as WIPRow[];
}

export async function updateWIP(entries: Partial<WIPRow>[]) {
  const res = await api.post('/wip/batch-update', entries);
  return res.data;
}

export async function importWIPFile(file: File, month: string, year: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("month", month);
  formData.append("year", year);
  const res = await api.post('/wip/import-file', formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
}
