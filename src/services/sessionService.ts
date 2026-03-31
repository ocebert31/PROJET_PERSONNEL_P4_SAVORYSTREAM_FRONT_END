import { fetchRequest, ApiError } from "./apiRequest";
import type { LoginFormData, UserPublic } from "../types/User";

export type SessionCreateResponse = {
  message: string;
  access_token: string;
  access_expires_in: number;
  refresh_expires_at: string;
  remember_me: boolean;
  user: UserPublic;
};

export type SessionRefreshResponse = {
  access_token: string;
  access_expires_in: number;
  refresh_expires_at: string;
};

// Access token uniquement en mémoire (pas de localStorage / sessionStorage).
let inMemoryAccessToken: string | null = null;

function getAccessToken(): string | null {
  return inMemoryAccessToken;
}

function setAccessToken(accessToken: string | null) {
  inMemoryAccessToken = accessToken;
}

async function loginAndStore(data: LoginFormData): Promise<SessionCreateResponse> {
  const result = await fetchRequest<SessionCreateResponse>("users/sessions", { method: "POST", body: data });
  // Le refresh token est dans un cookie HttpOnly ; on ne le stocke pas côté JS.
  setAccessToken(result.access_token);
  return result;
}

async function refreshAccessToken(): Promise<SessionRefreshResponse> {
  const result = await fetchRequest<SessionRefreshResponse>("users/sessions/refresh", {
    method: "POST",
    body: {},
  });
  setAccessToken(result.access_token);
  return result;
}

async function revokeAndClear(): Promise<void> {
  setAccessToken(null);
  try {
    await fetchRequest("users/sessions/revoke", { method: "POST", body: {} });
  } catch {
    // On ignore : côté UX, logout = suppression locale + best-effort côté serveur.
  }
}

/**
 * À appeler au démarrage de l'app : si un cookie HttpOnly de refresh existe,
 * on tente de récupérer un access token (et on le garde côté client).
 */
async function bootstrapSession(): Promise<boolean> {
  try {
    await refreshAccessToken();
    return true;
  } catch {
    setAccessToken(null);
    return false;
  }
}

/**
 * Appel API authentifié :
 * - ajoute le Bearer access token
 * - si 401 : tente une fois `/refresh`, puis rejoue la requête
 */
async function authFetchRequest<T = unknown>(
  endpoint: string,
  options: { method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"; body?: unknown } = {},
): Promise<T> {
  let token = getAccessToken();
  try {
    // Si on n'a pas encore d'access token (ex. reload), on tente un refresh via cookie.
    if (!token) {
      await refreshAccessToken();
      token = getAccessToken();
    }
    return await fetchRequest<T>(endpoint, { ...options, token });
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      await refreshAccessToken();
      const retryToken = getAccessToken();
      return await fetchRequest<T>(endpoint, { ...options, token: retryToken });
    }
    throw e;
  }
}

export {
  loginAndStore,
  refreshAccessToken,
  revokeAndClear,
  authFetchRequest,
  bootstrapSession,
  getAccessToken,
  setAccessToken,
};

