// client/src/lib/auth.tsx

// Real auth wired to the Express/MongoDB backend via JWT.
// Backend response shape: { success, message, data: { user, token } }
// /auth/me returns: { success, data: <user> }  (user object directly under data)
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
// Backend always wraps in { success, message, data }. Unwrap permissively:
// - { data: { user, token } }  -> { user, token }
// - { data: <user> }            -> { user: <user> }
// - { user, token }             -> as-is (fallback)
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const sessionVersion = useRef(0);

  useEffect(() => {
    let cancelled = false;
    async function restoreSession() {
      const runVersion = sessionVersion.current;
      if (!getToken()) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await api.get<unknown>("/auth/me");
        const { user: restoredUser } = unwrapAuth(res);
        if (!cancelled && sessionVersion.current === runVersion && getToken()) {
          setUser(restoredUser?.id ? restoredUser : null);
        }
      } catch {
        setToken(null);
        if (sessionVersion.current === runVersion) {
          setToken(null);
          if (!cancelled) setUser(null);
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
    setUser(registeredUser);
    setLoading(false);
    return registeredUser;
  };

  const logout = () => {
    sessionVersion.current += 1;
    setToken(null);
    setUser(null);
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