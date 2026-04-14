import { ApiError } from "../apiRequest/apiError";
import { fetchRequest } from "../apiRequest/fetchRequest";
import type {
  LoginFormData,
  RegisterFormData,
  RegisterSuccessResponse,
  SessionCreateResponse,
  SessionRefreshResponse,
} from "../../types/User";
import type { UserPublic, SessionMeResponse } from "../../types/User";

export async function postRegister(data: RegisterFormData): Promise<RegisterSuccessResponse> {
  return fetchRequest<RegisterSuccessResponse>("users/registrations", { method: "POST", body: data });
}

/**
 * Connexion : le serveur pose les cookies HttpOnly `ss_refresh` et `ss_access`.
 * Aucune donnée utilisateur n’est stockée dans le navigateur (ni localStorage ni sessionStorage).
 */
export async function postLogin(data: LoginFormData): Promise<SessionCreateResponse> {
  return fetchRequest<SessionCreateResponse>("users/sessions", { method: "POST", body: data });
}

/**
 * Nouveau JWT d’accès : renvoyé en JSON et posé en cookie `ss_access` par l’API.
 */
export async function refreshAccessToken(): Promise<SessionRefreshResponse> {
  return fetchRequest<SessionRefreshResponse>("users/sessions/refresh", {
    method: "POST",
    body: {},
  });
}

type SessionRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  url?: string;
};

/**
 * Cookies de session uniquement ; si l’access a expiré (401), un refresh puis une seconde tentative.
 */
export async function fetchSessionRequest<T = unknown>(
  endpoint: string,
  options: SessionRequestOptions = {},
): Promise<T> {
  const opts = { ...options, token: null };
  try {
    return await fetchRequest<T>(endpoint, opts);
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      await refreshAccessToken();
      return await fetchRequest<T>(endpoint, opts);
    }
    throw e;
  }
}

/**
 * Au chargement : si un refresh cookie existe, l’API émet un access cookie + corps JSON.
 */
export async function bootstrapSession(): Promise<boolean> {
  try {
    await refreshAccessToken();
    return true;
  } catch {
    return false;
  }
}

export async function revokeAndClear(): Promise<void> {
  try {
    await fetchRequest("users/sessions/revoke", { method: "POST", body: {} });
  } catch {
    // Best-effort : les cookies peuvent déjà être invalides.
  }
}

/**
 * Profil courant depuis l’API (cookies `ss_access` / refresh). Pas de persistance locale.
 */
export async function fetchCurrentUser(): Promise<UserPublic | null> {
  try {
    const data = await fetchSessionRequest<SessionMeResponse>("users/sessions/me", { method: "GET" });
    return data.user;
  } catch {
    return null;
  }
}
