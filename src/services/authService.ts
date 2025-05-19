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
