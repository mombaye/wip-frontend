import api from "./api";

export const saveFinalCogs = async (entries: any[]) => {
  const response = await api.post('/upload/cogs/final-save', entries);
  return response.data;
};