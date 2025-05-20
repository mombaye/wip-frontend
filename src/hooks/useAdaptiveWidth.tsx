import { useSidebar } from '@/contexts/SidebarContext';

/**
 * Hook personnalisé pour adapter dynamiquement la largeur du contenu principal
 * en fonction de l'état de la sidebar (ouverte ou réduite).
 */
export const useAdaptiveWidth = (extraPadding: number = 48) => {
  const { isOpen } = useSidebar();
  const sidebarWidth = isOpen ? 256 : 80;
  const width = `calc(100vw - ${sidebarWidth + extraPadding}px)`;
  return width;
};
