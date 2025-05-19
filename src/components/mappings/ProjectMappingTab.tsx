import { useEffect, useState, useRef } from 'react';
import { Upload, Plus } from 'lucide-react';
import {
  fetchProjectMappings,
  uploadProjectMappingFile,
  createProjectMapping,
  updateProjectMapping,
  deleteProjectMapping,
} from '@/services/projectMappingService';
import ProjectMappingModal from './ProjectMappingModal';

const ProjectMappingTab = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); // ⬅️ Nouveau
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadData = async () => {
    try {
      const res = await fetchProjectMappings();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  setUploading(true); // ⬅️ Début animation
  try {
    await uploadProjectMappingFile(file);
    await loadData();
    alert("✅ Fichier importé avec succès");
  } catch (err) {
    alert("Erreur lors de l'import");
    console.error(err);
  } finally {
    setUploading(false); // ⬅️ Fin animation
    e.target.value = ""; // ⬅️ Permet de re-uploader le même fichier
  }
};

  const handleAdd = async (formData: any) => {
    try {
      await createProjectMapping(formData);
      await loadData();
    } catch (err) {
      alert("Erreur lors de l'ajout");
      console.error(err);
    }
  };

  const handleEdit = async (formData: any) => {
    try {
      await updateProjectMapping(editingItem.id, formData);
      await loadData();
      setEditingItem(null);
    } catch (err) {
      alert("Erreur de mise à jour");
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    const confirm = window.confirm("Supprimer ce mapping ?");
    if (!confirm) return;
    try {
      await deleteProjectMapping(id);
      await loadData();
    } catch (err) {
      alert("Erreur de suppression");
      console.error(err);
    }
  };

  const columns = [
    { key: 'corporate_project_code', label: 'Code Projet' },
    { key: 'country_code', label: 'Pays' },
    { key: 'client', label: 'Client' },
    { key: 'category', label: 'Catégorie' },
    { key: 'subproject', label: 'Sous-Projet' },
    { key: 'project_link', label: 'Lien Projet' },
    { key: 'active_project', label: 'Actif' },
    { key: 'main_project_code', label: 'Code Projet Principal' },
   
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-blue-800">Project Mapping</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <Plus size={16} />
            Ajouter
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className={`flex items-center gap-2 px-4 py-2 rounded-md border ${
                uploading
                ? 'bg-blue-100 text-blue-600 cursor-wait'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            disabled={uploading}
            >
            {uploading ? (
                <>
                <span className="animate-pulse">⌛ Import…</span>
                </>
            ) : (
                <>
                <Upload size={16} />
                Importer fichier
                </>
            )}
            </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            accept=".xlsx"
            className="hidden"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <p className="italic text-sm text-gray-500">Chargement…</p>
        ) : (
          <table className="min-w-full text-sm border rounded">
            <thead className="bg-blue-50 text-blue-900 font-semibold">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-3 py-2 text-left">{col.label}</th>
                ))}
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-t hover:bg-blue-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-3 py-2">
                      {col.key === 'active_project'
                        ? item[col.key] ? '✅' : '❌'
                        : item[col.key]}
                    </td>
                  ))}
                  
                 <td className="px-3 py-2">
                  <div className="flex gap-3 items-center">
                    <button
                      onClick={() => setEditingItem(item)}
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
              {data.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center text-gray-500 italic py-4">
                    Aucun mapping trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <ProjectMappingModal
        isOpen={modalOpen || !!editingItem}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={editingItem ? handleEdit : handleAdd}
        initialData={editingItem}
      />
    </div>
  );
};

export default ProjectMappingTab;
