import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface UploadSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    created: any[];
    updated: any[];
    created_count?: number;
    updated_count?: number;
  };
  title?: string;
}

const UploadSummaryModal = ({ isOpen, onClose, data, title }: UploadSummaryModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-25" />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-6">
            <Dialog.Panel className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl">
              <Dialog.Title className="text-lg font-semibold text-blue-800 mb-2">
                {title || "Résumé de l'import"}
              </Dialog.Title>

              <div className="text-sm text-gray-700 space-y-6">
                <div>
                  <h3 className="font-semibold text-green-700 mb-1">
                    🟢 {data.created_count || data.created?.length || 0} élément(s) créé(s)
                  </h3>
                  <ul className="list-disc list-inside max-h-40 overflow-auto">
                    {data.created?.map((item, i) => (
                      <li key={i} className="text-green-700">
                        {Object.values(item).join(" - ")}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-yellow-700 mb-1">
                    🔁 {data.updated_count || data.updated?.length || 0} élément(s) mis à jour
                  </h3>
                  <ul className="list-disc list-inside max-h-40 overflow-auto">
                    {data.updated?.map((item, i) => (
                      <li key={i} className="text-yellow-700">
                        {Object.values(item).join(" - ")}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 text-right">
                <button
                  onClick={onClose}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Fermer
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UploadSummaryModal;
