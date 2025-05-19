import { useEffect, useState } from 'react';
import { Search, PlusCircle } from 'lucide-react';
import UserFormModal from '@/components/UserFormModal';
import { createUser, fetchUsers, deleteUser, updateUser, resetPassword } from '@/services/userService';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>(''); // "" = tous les rôles


  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error: any) {
        console.error("Erreur chargement utilisateurs :", error.response?.data?.detail || error.message);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [])

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async (newUser: any) => {
    try {
      const created = await createUser(newUser);
      setUsers((prev) => [...prev, created]);
    } catch (error: any) {
      console.error("Erreur création :", error.response?.data?.detail || error.message);
      alert("Erreur lors de la création de l'utilisateur");
    }
  };

  const handleDelete = async (userId: number) => {
    const confirm = window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?");
    if (!confirm) return;

    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error: any) {
      console.error("Erreur suppression :", error.response?.data?.detail || error.message);
      alert("Erreur lors de la suppression.");
    }
  };

  const handleEditSubmit = async (updatedData: any) => {
    try {
      const updated = await updateUser(editingUser.id, updatedData);
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? updated : u))
      );
      setEditingUser(null);
    } catch (error: any) {
      console.error("Erreur mise à jour :", error.response?.data?.detail || error.message);
      alert("Erreur lors de la modification.");
    }
  };



  const handleResetPassword = async (email: string) => {
    const confirm = window.confirm(`Réinitialiser le mot de passe de ${email} ?`);
    if (!confirm) return;

    try {
      const res = await resetPassword(email);
      alert(res.message || "Mot de passe réinitialisé et envoyé par email.");
    } catch (error: any) {
      console.error("Erreur réinitialisation :", error.response?.data?.detail || error.message);
      alert("Erreur lors de la réinitialisation.");
    }
  };



  return (
    <div className="space-y-6">
      <main className="flex-1 ml-0 lg:ml-64 bg-gray-100 p-6 min-h-screen">
      {/* En-tête + bouton Ajouter */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-900"></h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition text-sm font-medium"
        >
          <PlusCircle size={20} />
          Ajouter
        </button>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4">
        {/* Barre de recherche */}
        <div className="relative max-w-sm w-full sm:w-auto">
          <input
            type="text"
            placeholder="Rechercher par email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      </div>

      {/* Select filtre par rôle */}
      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
      
        <option value="">Tous les rôles</option>
        <option value="admin_local">admin_local</option>
        <option value="admin_regional">admin_regional</option>
        <option value="finance_local">finance_local</option>
        <option value="finance_regional">finance_regional</option>
      </select>
      </div>
      

      {/* Tableau */}
      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-50 text-left text-blue-900 font-semibold">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3">Pays</th>
              <th className="px-4 py-3">BL</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t border-gray-100 hover:bg-blue-50">
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">{user.role}</span>
                </td>
                <td className="px-4 py-3">{user.country}</td>
                <td className="px-4 py-3">{user.business_line}</td>
                <td className="px-4 py-3 space-y-1 space-x-2">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setEditingUser(user)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Supprimer
                  </button>
                  <button
                    onClick={() => handleResetPassword(user.email)}
                    className="text-sm text-yellow-600 hover:underline"
                  >
                    Réinitialiser
                  </button>
                </div>
              </td>

              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-3 text-center text-gray-500 italic">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </main>
      

      <UserFormModal
        isOpen={isModalOpen || !!editingUser}
        onClose={() => {
          setModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={editingUser ? handleEditSubmit : handleAddUser}
        initialData={editingUser}
      />

    </div>
  );
};

export default UsersPage;
