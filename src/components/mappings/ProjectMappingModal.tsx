import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const ProjectMappingModal = ({ isOpen, onClose, onSubmit, initialData }: Props) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const submit = (data: any) => {
    onSubmit({
      ...data,
      active_project: data.active_project === 'true',
    });
    reset();
    onClose();
  };

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        active_project: initialData.active_project?.toString(),
      });
    }
  }, [initialData, reset]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                {initialData ? 'Modifier un projet' : 'Ajouter un projet'}
              </Dialog.Title>

              <form onSubmit={handleSubmit(submit)} className="grid grid-cols-2 gap-4 mt-4">
                {[
                  'subproject', 'project_link', 'main_project_code', 'field1', 'client',
                  'category', 'final_client', 'country_of_project', 'invoiced_company',
                  'po_number', 'po_date', 'po_value', 'po_currency', 'country_code',
                  'client_tagetik', 'client_family', 'client_type'
                ].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {field.replace(/_/g, ' ')}
                    </label>
                    <input
                      type="text"
                      {...register(field)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Projet Actif</label>
                  <select
                    {...register("active_project")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  >
                    <option value="true">Oui</option>
                    <option value="false">Non</option>
                  </select>
                </div>

                <div className="col-span-2 flex justify-end space-x-2 mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    onClick={onClose}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {initialData ? 'Mettre à jour' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProjectMappingModal;
