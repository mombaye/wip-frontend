import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { JSX } from 'react';

function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
  } catch {
    return true;
  }
}

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token, logout } = useAuth();

  if (!token || isTokenExpired(token)) {
    logout(); // clear localStorage + reset auth
    return <Navigate to="/login" replace />;
  }

  return children;
}
