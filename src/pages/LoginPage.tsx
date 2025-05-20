import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '@/components/Input';
import { useAuth } from '@/contexts/AuthContext';
import { loginService } from '@/services/authService';
import camusat from '../assets/images/camusat-logo.png';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await loginService(email, password);
      login(data.access_token);
      navigate(data.first_login ? '/first-login' : '/dashboard');
    } catch (err: any) {
      setError('Email ou mot de passe incorrect.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50">
      <motion.form
        onSubmit={handleSubmit}
        aria-label="Login Form"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 px-4 rounded-2xl shadow-md w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-6">
          <img src={camusat} alt="Camusat Logo" className="h-16 w-16 mb-2" />
          <h1 className="text-xl font-bold text-blue-900">CAMUSAT <span className="text-red-600">Senegal</span></h1>
          <p className="text-sm italic text-gray-600 text-center">Plateforme WIP Digital – Gestion eFinance</p>
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

        {error && <p className="text-sm text-red-600 mt-2 text-center">{error}</p>}

        <button
          type="submit"
          aria-label="Se connecter"
          disabled={isLoading}
          className="mt-4 w-full bg-blue-900 text-white p-2 rounded-md hover:bg-blue-800 transition flex justify-center items-center"
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Se connecter'}
        </button>

        <div className="text-center mt-3">
          <a
            href="#"
            className="text-sm text-blue-700 hover:underline cursor-not-allowed"
            title="Fonctionnalité à venir"
          >
            Mot de passe oublié ?
          </a>
        </div>
      </motion.form>
    </div>
  );
};

export default LoginPage;
