// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '@/components/Input';
import { useAuth } from '@/contexts/AuthContext';
import { loginService } from '@/services/authService';
import camusat from '../assets/images/camusat-logo.png'

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginService(email, password);
      login(data.access_token);
      navigate(data.first_login ? '/first-login' : '/dashboard');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <img src={camusat} alt="Camusat Logo" className="h-16 w-16 mb-2" />
          <h1 className="text-xl font-bold text-blue-900">CAMUSAT <span className="text-red-600">Senegal</span></h1>
          <p className="text-sm italic text-gray-600">Plateforme WIP Digital – Gestion eFinance</p>
        </div>

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="ex: user@camusat.com"
        />

        <Input
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-900 text-white p-2 rounded-md hover:bg-blue-800 transition"
        >
          Se connecter
        </button>

        <div className="text-center mt-3">
          <a href="#" className="text-sm text-blue-700 hover:underline">
            Mot de passe oublié ?
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
