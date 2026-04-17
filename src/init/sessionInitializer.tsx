import { useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { bootstrapSession } from "@/services/users/authentication";

/**
 * Au chargement : tente un refresh cookie puis charge le profil via `GET …/sessions/me` (sans stockage navigateur).
 */
function SessionInitializer() {
  const { refreshUser } = useAuth();

  useEffect(() => {
    let cancelled = false;

    async function initSession() {
      try {
        await bootstrapSession();
      } catch {
        return;
      }
      if (cancelled) return;
      try {
        await refreshUser();
      } catch {
        /* fetchCurrentUser ne rejette pas aujourd’hui ; garde-fou si le contrat change */
      }
    }

    void initSession();

    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

  return null;
}

export default SessionInitializer;
