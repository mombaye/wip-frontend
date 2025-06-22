// src/hooks/useUnsavedChangesWarning.ts
import { useEffect } from "react";
import { useNavigate, UNSAFE_NavigationContext } from "react-router-dom";

// Simple version: bloque navigation navigateur + interne
export function useUnsavedChangesWarning(shouldBlock: boolean, message = "Des modifications non sauvegardées. Voulez-vous vraiment quitter ?") {
  // Blocage fermeture navigateur/onglet
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!shouldBlock) return;
      e.preventDefault();
      e.returnValue = message;
      return message;
    };
    if (shouldBlock) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [shouldBlock, message]);
}
