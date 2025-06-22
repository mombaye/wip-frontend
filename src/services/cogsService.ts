import api from "./api";

export const saveFinalCogs = async (entries: any[]) => {
  const response = await api.post('/upload/cogs/final-save', entries);
  return response.data;
};



export async function fetchCogs(month: string, year: string) {
  const res = await api.get('/cogs', { params: { month, year } });
  return res.data; // Array de lignes COGS "plates"
}
