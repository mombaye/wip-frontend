import api from './api';

/// ✅ Upload fichier Excel Reporting Mapping
export const uploadReportingMappingFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload/reporting-account-mappings', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/// ✅ Récupérer tous les ReportingAccountMappings
export const fetchReportingMappings = async () => {
  const response = await api.get('/reporting-account-mappings');
  return response.data;
};

/// ✅ Supprimer un ReportingAccountMapping
export const deleteReportingMapping = async (id: number) => {
  const response = await api.delete(`/reporting-account-mappings/${id}`);
  return response.data;
};
