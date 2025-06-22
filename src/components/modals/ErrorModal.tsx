import React from 'react';
import { Button } from '@/ui/button';
import { BatchErrorReport } from '@/types/types';

type ErrorModalProps = {
  open: boolean;
  errors: BatchErrorReport[];
  onClose: () => void;
  onExport?: () => void;
};

export const ErrorModal: React.FC<ErrorModalProps> = ({ open, errors, onClose, onExport }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-3xl w-full border border-red-100">
        <h3 className="text-lg font-bold mb-4 text-red-800">
          Rapport d’erreurs lors de la sauvegarde ({errors.length})
        </h3>
        <div className="max-h-[400px] overflow-y-auto border rounded">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left py-2 px-2 bg-gray-50 border-b">Batch</th>
                <th className="text-left py-2 px-2 bg-gray-50 border-b">Type</th>
                <th className="text-left py-2 px-2 bg-gray-50 border-b">Erreur</th>
                <th className="text-left py-2 px-2 bg-gray-50 border-b">Entrée</th>
              </tr>
            </thead>
            <tbody>
              {errors.map((err, i) => (
                <tr key={i} className="border-b last:border-b-0">
                  <td className="py-1 px-2">{err.batch}</td>
                  <td className="py-1 px-2">{err.type}</td>
                  <td className="py-1 px-2 text-red-600">{err.error}</td>
                  <td className="py-1 px-2 max-w-xs">
                    <pre className="max-w-xs overflow-x-auto bg-gray-50 rounded">{JSON.stringify(err.entry, null, 2)}</pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          {onExport && (
            <Button variant="outline" onClick={onExport}>
              Exporter les erreurs (.xlsx)
            </Button>
          )}
          <Button onClick={onClose} variant="default">
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};
