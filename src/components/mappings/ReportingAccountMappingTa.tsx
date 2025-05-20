import { useEffect, useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import {
  uploadReportingMappingFile,
  fetchReportingMappings,
  deleteReportingMapping,
} from '@/services/reportingAccountMappingService';
import { toast } from 'react-toastify';
import { showUploadSummaryToast } from './UploadSummaryToast';
import UploadSummaryModal from './UploadSummaryModal';

const ReportingAccountMappingTab = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadSummary, setUploadSummary] = useState<any | null>(null);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadData = async () => {
    try {
      const res = await fetchReportingMappings();
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
    setUploading(true);
    try {
      const res = await uploadReportingMappingFile(file);
      await loadData();
      showUploadSummaryToast(res, "✅ Reporting Mapping importé");
      setUploadSummary(res);
      setSummaryModalOpen(true);
    } catch (err) {
      toast.error("❌ Erreur lors de l'import");
      console.error(err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce reporting ?")) return;
    try {
      await deleteReportingMapping(id);
      await loadData();
      toast.success("🗑️ Mapping supprimé");
    } catch (err) {
      toast.error("❌ Erreur de suppression");
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-blue-800">Reporting Account Mapping</h2>

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
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          accept=".xlsx"
          className="hidden"
        />
      </div>

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
        ) : (
          <table className="min-w-full text-sm border rounded">
            <thead className="bg-blue-50 text-blue-900 font-semibold">
              <tr>
                <th className="px-3 py-2 text-left">ReportingAccountId</th>
                <th className="px-3 py-2 text-left">Groupe</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-t hover:bg-blue-50">
                  <td className="px-3 py-2">{item.reporting_account_id}</td>
                  <td className="px-3 py-2">{item.reporting_group}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      🗑️ Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-gray-500 italic py-4">
                    Aucun mapping trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {uploadSummary && (
        <UploadSummaryModal
          isOpen={summaryModalOpen}
          onClose={() => setSummaryModalOpen(false)}
          data={uploadSummary}
          title="Détail import Reporting Mapping"
        />
      )}
    </div>
  );
};

export default ReportingAccountMappingTab;