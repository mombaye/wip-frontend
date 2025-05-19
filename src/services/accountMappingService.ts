import api from './api';

/// ✅ Upload fichier Excel
export const uploadAccountMappingFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload/account-mappings', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/// ✅ Récupérer tous les mappings
export const fetchAccountMappings = async () => {
  const response = await api.get('/account-mappings');
  return response.data;
};

/// ✅ Créer un mapping
export const createAccountMapping = async (data: any) => {
  const response = await api.post('/account-mappings', data);
  return response.data;
};

/// ✅ Mettre à jour un mapping
export const updateAccountMapping = async (id: number, data: any) => {
  const response = await api.put(`/account-mappings/${id}`, data);
  return response.data;
};

/// ✅ Supprimer un mapping
export const deleteAccountMapping = async (id: number) => {
  const response = await api.delete(`/account-mappings/${id}`);
  return response.data;
};
