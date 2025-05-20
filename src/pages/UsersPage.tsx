import { useEffect, useState } from 'react';
import { Search, PlusCircle, Download, MoreVertical } from 'lucide-react';
import UserFormModal from '@/components/UserFormModal';
import { createUser, fetchUsers, deleteUser, updateUser, resetPassword } from '@/services/userService';
import { toast } from 'react-toastify';
import { Menu } from '@headlessui/react';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error: any) {
        toast.error("Erreur chargement utilisateurs");
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, [])

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedRole === '' || user.role === selectedRole)
  );

  const handleAddUser = async (newUser: any) => {
    try {
      const created = await createUser(newUser);
      setUsers((prev) => [...prev, created]);
      toast.success("Utilisateur créé");
    } catch (error: any) {
      toast.error("Erreur création utilisateur");
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success("Utilisateur supprimé");
    } catch {
      toast.error("Erreur suppression utilisateur");
    }
  };

  const handleEditSubmit = async (updatedData: any) => {
    try {
      const updated = await updateUser(editingUser.id, updatedData);
      setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? updated : u)));
      toast.success("Utilisateur modifié");
      setEditingUser(null);
    } catch {
      toast.error("Erreur modification utilisateur");
    }
  };

  const handleResetPassword = async (email: string) => {
    if (!confirm(`Réinitialiser le mot de passe de ${email} ?`)) return;
    try {
      const res = await resetPassword(email);
      toast.success(res.message || "Mot de passe réinitialisé");
    } catch {
      toast.error("Erreur réinitialisation mot de passe");
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Email', 'Rôle', 'Pays', 'BL'],
      ...users.map(u => [u.email, u.role, u.country, u.business_line]),
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'users.csv';
    link.click();
  };

  const roleColor: Record<string, string> = {
    admin_local: 'bg-red-100 text-red-700',
    admin_regional: 'bg-purple-100 text-purple-700',
    finance_local: 'bg-blue-100 text-blue-700',
    finance_regional: 'bg-green-100 text-green-700',
  };

  return (
    <div className="space-y-6">
      
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900">Utilisateurs</h1>
          <div className="flex gap-3">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 text-sm text-gray-600 border px-3 py-2 rounded hover:bg-gray-100"
            >
              <Download size={16} /> Export CSV
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition text-sm font-medium"
            >
              <PlusCircle size={20} /> Ajouter
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4">
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

        <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 bg-white">
          {loading ? (
            <div className="text-center py-10 text-blue-600 text-sm">Chargement des utilisateurs…</div>
          ) : (
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
                      <span className={`px-2 py-1 text-xs rounded ${roleColor[user.role] || 'bg-gray-100 text-gray-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">{user.country}</td>
                    <td className="px-4 py-3">{user.business_line}</td>
                    <td className="px-4 py-3">
                      <Menu as="div" className="relative inline-block text-left">
                        <Menu.Button className="text-gray-600 hover:text-blue-600">
                          <MoreVertical size={18} />
                        </Menu.Button>
                        <Menu.Items className="absolute right-0 mt-2 w-40 bg-white border shadow-lg rounded-md text-sm z-10">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => setEditingUser(user)}
                                className={`block w-full px-4 py-2 text-left ${active ? 'bg-blue-50 text-blue-700' : ''}`}
                              >
                                ✏️ Modifier
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => handleResetPassword(user.email)}
                                className={`block w-full px-4 py-2 text-left ${active ? 'bg-yellow-50 text-yellow-700' : ''}`}
                              >
                                🔁 Réinitialiser
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => handleDelete(user.id)}
                                className={`block w-full px-4 py-2 text-left ${active ? 'bg-red-50 text-red-700' : ''}`}
                              >
                                🗑️ Supprimer
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Menu>
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
          )}
        </div>
  

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