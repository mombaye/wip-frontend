// src/services/authService.ts
import api from './api';


export const loginService = async (email: string, password: string) => {
  const response = await api.post('/login', { email, password });
  return response.data; // { access_token, first_login }
};

export const changePasswordService = async (token: string, newPassword: string) => {
  const response = await api.post(
    '/auth/change-password',
    { password: newPassword },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};


// services/authService.ts
export const refreshTokenService = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include', // ⬅️ si tu utilises le cookie httpOnly côté backend
  });

  if (!response.ok) throw new Error('Refresh token invalide');
  return await response.json(); // { access_token: '...' }
};

