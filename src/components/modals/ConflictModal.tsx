import { useState } from 'react';
import { Dialog } from '@mui/material';
import { Button } from '@/ui/button'; // ✅ Ton composant Tailwind
import { CheckCircle } from 'lucide-react';

type ConflictModalProps = {
  conflicts: string[];
  onClose: () => void;
  onConfirm: (actions: Record<string, string>) => void;
};

const ConflictModal = ({ conflicts, onClose, onConfirm }: ConflictModalProps) => {
  const [actions, setActions] = useState<Record<string, string>>(
    Object.fromEntries(conflicts.map((month) => [month, 'update']))
  );

  const setAction = (month: string, action: string) => {
    setActions((prev) => ({ ...prev, [month]: action }));
  };

  return (
    <Dialog open fullWidth maxWidth="sm" onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 text-blue-800">Conflits détectés</h2>
        <p className="text-sm text-gray-700 mb-4">
          Des données existent déjà pour les mois suivants. Choisissez une action pour chacun.
        </p>

        <table className="w-full text-sm border mb-4">
          <thead>
            <tr className="bg-blue-50">
              <th className="border px-3 py-2 text-left">Mois</th>
              <th className="border px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {conflicts.map((month) => (
              <tr key={month}>
                <td className="border px-3 py-2">{month}</td>
                <td className="border px-3 py-2">
                  <div className="flex gap-2">
                    <Button
                      variant={actions[month] === 'update' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAction(month, 'update')}
                    >
                      🔁 Remplacer
                    </Button>
                    <Button
                      variant={actions[month] === 'add' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAction(month, 'add')}
                    >
                      ➕ Ajouter
                    </Button>
                    <Button
                      variant={actions[month] === 'cancel' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAction(month, 'cancel')}
                    >
                      ❌ Ignorer
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button
            className="gap-2"
            onClick={() => onConfirm(actions)}
          >
            <CheckCircle size={16} /> Valider
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConflictModal;
