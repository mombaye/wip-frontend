import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any; // 👈 Ajouté pour l'édition
}

const roles = ['admin_local', 'admin_regional', 'finance_local', 'finance_regional'];
const countries = ['Sénégal', 'Côte d’Ivoire', 'Mali'];


const UserFormModal = ({ isOpen, onClose, onSubmit, initialData }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {},
  });

  useEffect(() => {
    reset(initialData || {}); // reset quand les données changent
  }, [initialData, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const submit = (data: any) => {
    onSubmit(data);
    handleClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
                <Dialog.Title className="text-lg font-bold text-blue-900">
                  {initialData ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
                </Dialog.Title>

                <form onSubmit={handleSubmit(submit)} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      {...register('email', { required: true })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && <p className="text-red-500 text-sm">Email requis</p>}
                  </div>

                  {!initialData && (
                    <div>
                      <label className="block text-sm font-medium">Mot de passe</label>
                      <input
                        type="password"
                        {...register('password', { required: true })}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {errors.password && <p className="text-red-500 text-sm">Mot de passe requis</p>}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium">Rôle</label>
                    <select
                      {...register('role', { required: true })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner...</option>
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    {errors.role && <p className="text-red-500 text-sm">Rôle requis</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Pays</label>
                    <select
                      {...register('country', { required: true })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner un pays...</option>
                      {countries.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>

                    {errors.country && <p className="text-red-500 text-sm">Pays requis</p>}
                  </div>

                  

                  <div className="pt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
                      onClick={handleClose}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      {initialData ? 'Modifier' : 'Enregistrer'}
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

export default UserFormModal;
