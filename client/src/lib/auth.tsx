// client/src/lib/auth.tsx

//
// Auth wired to the Express/MongoDB backend in this repo.
// IMPORTANT: the backend does NOT expose `GET /api/auth/me` — only
// `POST /api/auth/login`, `POST /api/auth/register` and the per-id routes
// `GET /api/auth/:id`, `PUT /api/auth/:id`, `DELETE /api/auth/:id` (see
// `backend/src/routes/auth.routes.js` in the upstream repo).
//
// To keep the user signed in across page refreshes we persist the user
// object alongside the JWT in localStorage and only re-validate against
// `GET /auth/:id` when we already know the user's id.
import { createContext, createElement, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { api, getToken, setToken } from "./api";

export type Role = "admin" | "doctor" | "nurse" | "receptionist" | "pharmacist" | "lab_scientist";
export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  role: Role;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (firstName: string, lastName: string, email: string, password: string, role: Role) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const USER_KEY = "hms.user";
function loadStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as User;
    return parsed?.id ? parsed : null;
  } catch { return null; }
}
function storeUser(u: User | null) {
  if (typeof window === "undefined") return;
  if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
  else localStorage.removeItem(USER_KEY);
}
// Backend wraps responses as { success, message, data }. Unwrap permissively.
function unwrapAuth(raw: unknown): { user: User; token?: string } {
  const response = (raw ?? {}) as Record<string, unknown>;
  const payload = (response.data ?? response) as Record<string, unknown>;
  if (payload && typeof payload === "object" && "user" in payload) {
    return {
      user: payload.user as User,
      token: typeof payload.token === "string" ? payload.token : undefined,
    };
  }
  return {
    user: payload as unknown as User,
    token: typeof response.token === "string" ? response.token : undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => (getToken() ? loadStoredUser() : null));
  const [loading, setLoading] = useState(true);
  const sessionVersion = useRef(0);

  useEffect(() => {
    let cancelled = false;
    async function restoreSession() {
      const runVersion = sessionVersion.current;
      const token = getToken();
      const cached = loadStoredUser();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      if (!cached?.id) {
        // No cached user — nothing to re-validate. Keep the token; the next
        // protected request will fail with 401 if it's bad.
        setLoading(false);
        return;
      }
      try {
        // Re-validate the session using the existing per-id endpoint.
        const res = await api.get<unknown>(`/auth/${cached.id}`);
        const { user: fresh } = unwrapAuth(res);
        if (cancelled || sessionVersion.current !== runVersion) return;
        if (fresh?.id) {
          storeUser(fresh);
          setUser(fresh);
        }
      } catch (err) {
        // Only sign out on true auth failures (401/403). Network errors, CORS
        // hiccups, or server hiccups must NOT silently log the user out on
        // page refresh — keep the token and let the next request retry.
        const msg = err instanceof Error ? err.message : String(err);
        const isAuthFailure =
          /\b(401|403)\b/.test(msg) || /unauthori[sz]ed/i.test(msg) || /forbidden/i.test(msg);
        if (isAuthFailure) {
          setToken(null);
          storeUser(null);
          if (!cancelled && sessionVersion.current === runVersion) setUser(null);
        } else {
          // Network / 404 / 5xx — keep the cached session so refresh doesn't log out.
          console.warn("[auth] session re-validation failed, keeping cached user:", msg);
        }
        
      } finally {
        if (!cancelled && sessionVersion.current === runVersion) setLoading(false);
      }
    }
    void restoreSession();
    return () => { cancelled = true; };
  }, []);

  const login: AuthContextValue["login"] = async (email, password) => {
    const runVersion = sessionVersion.current + 1;
    sessionVersion.current = runVersion;
    const res = await api.post<unknown>("/auth/login", { email, password });
    const { user: loggedInUser, token } = unwrapAuth(res);
    if (!token) throw new Error("Login response missing token");
    if (!loggedInUser?.id) throw new Error("Login response missing user");
    if (sessionVersion.current !== runVersion) throw new Error("Login was cancelled");
    setToken(token);
    storeUser(loggedInUser);
    setUser(loggedInUser);
    setLoading(false);
    return loggedInUser;
  };

  const register: AuthContextValue["register"] = async (firstName, lastName, email, password, role) => {
    const runVersion = sessionVersion.current + 1;
    sessionVersion.current = runVersion;
    const res = await api.post<unknown>("/auth/register", { firstName, lastName, email, password, role });
    const { user: registeredUser, token } = unwrapAuth(res);
    if (!token) throw new Error("Register response missing token");
    if (!registeredUser?.id) throw new Error("Register response missing user");
    if (sessionVersion.current !== runVersion) throw new Error("Registration was cancelled");
    setToken(token);
    storeUser(registeredUser);
    setLoading(false);
    return registeredUser;
  };

  const logout = () => {
    sessionVersion.current += 1;
    setToken(null);
    setUser(null);
    storeUser(null);
    setLoading(false);
  };

  return createElement(AuthContext.Provider, {
    value: { user, loading, login, register, logout },
  }, children);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
