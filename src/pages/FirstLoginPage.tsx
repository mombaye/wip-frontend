import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { changePasswordService } from '@/services/authService';

const FirstLoginPage = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      return alert('Le mot de passe doit contenir au moins 6 caractères.');
    }

    if (password !== confirm) {
      return alert('Les mots de passe ne correspondent pas.');
    }

    try {
      setLoading(true);
  
      if (!token) {
        throw new Error('Token is missing. Please log in again.');
      }
      const res = await changePasswordService(token, password);

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || 'Erreur lors du changement de mot de passe');
      }

      alert('Mot de passe changé avec succès. Veuillez vous reconnecter.');
      logout();
      navigate('/login');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">Changement de mot de passe</h2>

        <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
        <input
          type="password"
          className="w-full mb-4 p-2 border border-gray-300 rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
        <input
          type="password"
          className="w-full mb-4 p-2 border border-gray-300 rounded-md"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-900 text-white p-2 rounded-md hover:bg-blue-800 transition"
        >
          {loading ? 'Traitement...' : 'Valider'}
        </button>
      </form>
    </div>
  );
};

export default FirstLoginPage;
