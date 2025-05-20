import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { Upload, Plus } from 'lucide-react';
import { fetchAccountMappings, uploadAccountMappingFile, createAccountMapping, updateAccountMapping, deleteAccountMapping } from '@/services/accountMappingService';
import AccountMappingModal from './AccountMappingModal';
import { toast } from 'react-toastify';
import { showUploadSummaryToast } from './UploadSummaryToast';
import UploadSummaryModal from './UploadSummaryModal';


const AccountMappingTab = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false); // ⬅️ Nouveau
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [uploadSummary, setUploadSummary] = useState<any | null>(null);

  
  const loadData = async () => {
      try {
        const result = await fetchAccountMappings();
        setData(result);
      } catch (error) {
        toast.error("❌ Erreur chargement données :");
      } finally {
        setLoading(false);
      }
  };
  
  


   useEffect(() => {
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
      await loadData()
      showUploadSummaryToast(result, "✅ Project Mapping importé");
      setUploadSummary(result);         // ⬅️ conserve les données
      setSummaryModalOpen(true);  
      // TODO: reload table
    } catch (error) {
      toast.error("❌ Erreur lors de l'import");
    }
  }
};

const handleAddMapping = async (newData: any) => {
  try {
    await createAccountMapping(newData);
    const updated = await fetchAccountMappings();
    setData(updated);
    toast.success("✅ Mapping ajouté");
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
    toast.success("✅ Mapping ajouté");
  } catch (error) {
    toast.error("❌ Une erreur s'est produite");
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
    toast.success("✅ Mapping ajouté");
  } catch (error) {
    toast.error("❌ Une erreur s'est produite");
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

             {uploading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3.5-3.5L12 1v4a8 8 0 100 16v-4l-3.5 3.5L12 23v-4a8 8 0 01-8-8z"
                    ></path>
                  </svg>
                  <span>Import...</span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Importer fichier
                </>
              )}
            
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
           <div className="flex justify-center items-center h-60">
            <div className="flex flex-col items-center gap-2 text-blue-700">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3.5-3.5L12 1v4a8 8 0 100 16v-4l-3.5 3.5L12 23v-4a8 8 0 01-8-8z"
                ></path>
              </svg>
              <span className="text-sm">Chargement des mappings...</span>
            </div>
          </div>
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
      {uploadSummary && (
        <UploadSummaryModal
          isOpen={summaryModalOpen}
          onClose={() => setSummaryModalOpen(false)}
          data={uploadSummary}
          title="Détail import Project Mapping"
        />
      )}


    </div>
  );
};

export default AccountMappingTab;
