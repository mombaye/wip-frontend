import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import { useForm } from 'react-hook-form';


interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}


const AccountMappingModal = ({ isOpen, onClose, onSubmit, initialData }: Props) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const submit = (data: any) => {
    onSubmit({
      ...data,
      active_account: data.active_account === 'true', // cast string to boolean
    });
    reset();
    onClose();
  };

  useEffect(() => {
  if (initialData) {
    reset({
      ...initialData,
      active_account: initialData.active_account?.toString(), // convertir en "true"/"false"
    });
  }
}, [initialData, reset]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl">
                <Dialog.Title className="text-lg font-bold text-blue-900">
                  Ajouter un compte
                </Dialog.Title>

                <form onSubmit={handleSubmit(submit)} className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium">Code Pays</label>
                    <input {...register('country_code', { required: true })}
                      className="w-full border px-3 py-2 rounded" />
                    {errors.country_code && <p className="text-red-500 text-sm">Requis</p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium">Compte</label>
                    <input {...register('account', { required: true })}
                      className="w-full border px-3 py-2 rounded" />
                    {errors.account && <p className="text-red-500 text-sm">Requis</p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium">Libellé</label>
                    <input {...register('description')}
                      className="w-full border px-3 py-2 rounded" />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Type de compte</label>
                    <input {...register('account_type')}
                      className="w-full border px-3 py-2 rounded" />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Actif ?</label>
                    <select {...register('active_account')} className="w-full border px-3 py-2 rounded">
                      <option value="true">Oui</option>
                      <option value="false">Non</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <button type="button" onClick={onClose}
                      className="px-4 py-2 bg-gray-200 rounded">
                      Annuler
                    </button>
                    <button type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Enregistrer
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AccountMappingModal;
