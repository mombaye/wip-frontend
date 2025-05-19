import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { Upload, Plus } from 'lucide-react';
import { fetchAccountMappings, uploadAccountMappingFile, createAccountMapping, updateAccountMapping, deleteAccountMapping } from '@/services/accountMappingService';
import AccountMappingModal from './AccountMappingModal';


const AccountMappingTab = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<any | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchAccountMappings();
        setData(result);
      } catch (error) {
        console.error("Erreur chargement données :", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);


  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    try {
      const result = await uploadAccountMappingFile(file);
      alert("✅ Fichier importé avec succès");
      console.log("📥 Réponse backend :", result);
      // TODO: reload table
    } catch (error) {
      console.error("❌ Erreur d'import :", error);
      alert("Erreur lors de l'import du fichier.");
    }
  }
};

const handleAddMapping = async (newData: any) => {
  try {
    await createAccountMapping(newData);
    const updated = await fetchAccountMappings();
    setData(updated);
  } catch (error) {
    alert("Erreur lors de la création.");
    console.error(error);
  }
};

const handleEditMapping = async (updatedData: any) => {
  try {
    await updateAccountMapping(editingMapping.id, updatedData);
    const refreshed = await fetchAccountMappings();
    setData(refreshed);
    setEditingMapping(null);
  } catch (error) {
    alert("Erreur de mise à jour.");
    console.error(error);
  }
};

const handleDelete = async (id: number) => {
  const confirm = window.confirm("Voulez-vous vraiment supprimer ce mapping ?");
  if (!confirm) return;

  try {
    await deleteAccountMapping(id);
    const refreshed = await fetchAccountMappings();
    setData(refreshed);
  } catch (error) {
    alert("Erreur lors de la suppression.");
    console.error(error);
  }
};



  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-blue-800">Account Mapping</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <Plus size={16} />
            Ajouter
          </button>

          <button
            onClick={handleUploadClick}
            className="flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 border border-gray-300"
          >
            <Upload size={16} />
            Importer un fichier
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      <AccountMappingModal
        isOpen={modalOpen || !!editingMapping}
        onClose={() => {
          setModalOpen(false);
          setEditingMapping(null);
        }}
        onSubmit={editingMapping ? handleEditMapping : handleAddMapping}
        initialData={editingMapping}
      />



      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-sm text-gray-500 italic">Chargement...</p>
        ) : data.length === 0 ? (
          <p className="text-sm text-gray-500 italic">Aucun compte trouvé.</p>
        ) : (
          <table className="min-w-full text-sm border border-gray-200 rounded">
            <thead className="bg-blue-50 text-blue-800 font-semibold">
              <tr>
                <th className="px-3 py-2 text-left">Code Pays</th>
                <th className="px-3 py-2 text-left">Compte</th>
                <th className="px-3 py-2 text-left">Libellé</th>
                <th className="px-3 py-2 text-left">Actif</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-t border-gray-100 hover:bg-blue-50">
                  <td className="px-3 py-2">{item.country_code}</td>
                  <td className="px-3 py-2">{item.account}</td>
                  <td className="px-3 py-2">{item.description}</td>
                  <td className="px-3 py-2">{item.active_account ? "Oui" : "Non"}</td>
                  <td className="px-3 py-2">{item.account_type}</td>
                  

                  <td className="px-3 py-2 space-x-3">
                    <div className="flex gap-3 items-center">
                      <button
                        onClick={() => setEditingMapping(item)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                </td>


                 

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default AccountMappingTab;
