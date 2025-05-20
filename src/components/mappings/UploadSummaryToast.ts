import { toast } from 'react-toastify';

export const showUploadSummaryToast = (res: any, title = 'Import terminé') => {
  if (!res) return toast.error("❌ Erreur inconnue lors de l'import");

  const created = res.created_count ?? 0;
  const updated = res.updated_count ?? 0;

  toast.success(
    `${title} : ${created} créé(s), ${updated} mis à jour`,
    {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
    }
  );
};
