/**
 * Hook pour retourner une hauteur dynamique en fonction de l'espace visible,
 * utile pour les tableaux, graphiques ou sections scrollables.
 *
 * @param headerHeight hauteur du header (par défaut 64px)
 * @param padding hauteur totale des marges/paddings (par défaut 48px)
 */
export const useAdaptiveHeight = (headerHeight: number = 64, padding: number = 48) => {
  return `calc(100vh - ${headerHeight + padding}px)`;
};
