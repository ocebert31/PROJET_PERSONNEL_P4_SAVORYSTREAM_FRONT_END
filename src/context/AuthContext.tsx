import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { UserPublic } from "../types/User";
import { fetchCurrentUser } from "../services/users/authentication";

type AuthContextValue = {
  user: UserPublic | null;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserPublic | null>(null);

  const refreshUser = useCallback(async () => {
    setUser(await fetchCurrentUser());
  }, []);

  const value = useMemo(() => ({ user, refreshUser }), [user, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider.");
  }
  return ctx;
}
