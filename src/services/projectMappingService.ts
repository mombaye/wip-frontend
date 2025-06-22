import api from './api';

/// ✅ Upload fichier Excel ProjectMapping
export const uploadProjectMappingFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload/project-mappings', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/// ✅ Récupérer tous les ProjectMappings
export const fetchProjectMappings = async () => {
  const response = await api.get('/project-mappings');
  return response.data;
};

/// ✅ Créer un ProjectMapping
export const createProjectMapping = async (data: any) => {
  const response = await api.post('/project-mappings', data);
  return response.data;
};

/// ✅ Mettre à jour un ProjectMapping
export const updateProjectMapping = async (id: number, data: any) => {
  const response = await api.put(`/project-mappings/${id}`, data);
  return response.data;
};

/// ✅ Supprimer un ProjectMapping
export const deleteProjectMapping = async (id: number) => {
  const response = await api.delete(`/project-mappings/${id}`);
  return response.data;
};
