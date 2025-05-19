import api from './api';

// Créer un utilisateur
export const createUser = async (userData: any) => {
  const response = await api.post('/register', userData);
  return response.data;
};

// Lister tous les utilisateurs
export const fetchUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// Modifier un utilisateur
export const updateUser = async (userId: number, updates: any) => {
  const response = await api.put(`/users/${userId}`, updates);
  return response.data;
};

// Supprimer un utilisateur
export const deleteUser = async (userId: number) => {
  await api.delete(`/users/${userId}`);
};

// Réinitialiser le mot de passe
export const resetPassword = async (email: string) => {
  const response = await api.post(`/users/reset-password`, { email });
  return response.data;
};
