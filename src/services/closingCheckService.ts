// src/services/closingCheckService.ts

import api from './api';

/// ✅ Upload du fichier Excel Closing Check (PL brut)
export const uploadClosingCheckFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload/closing-checks', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/// ✅ Récupérer les données Closing Check (traitées et enrichies)
export const fetchClosingChecks = async () => {
  const response = await api.get('/closing-checks');
  return response.data;
};

/// ✅ Sauvegarder en masse les données modifiées
export const saveClosingChecks = async (data: any[]) => {
  const response = await api.post('/upload/closing-checks/bulk-save', data);
  return response.data;
};
