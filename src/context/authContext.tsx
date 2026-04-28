import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { UserPublic } from "../types/user";
import { fetchCurrentUser, revokeAndClear } from "../services/users/authentication";

type AuthContextValue = {
  user: UserPublic | null;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserPublic | null>(null);

  const refreshUser = useCallback(async () => {
    setUser(await fetchCurrentUser());
  }, []);

  const logout = useCallback(async () => {
    await revokeAndClear();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, refreshUser, logout }), [user, refreshUser, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider.");
  }
  return ctx;
}
