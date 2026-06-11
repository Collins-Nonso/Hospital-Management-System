// client/src/lib/api.ts

// Thin fetch wrapper for the Express + MongoDB backend.
// - Base URL from VITE_API_URL (defaults to http://localhost:5000/api)
// - Attaches JWT from localStorage on every request
// - Normalizes Mongo's `_id` → `id` recursively
// - Throws Error(message) on non-2xx, using server-provided message when available

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:5000/api";
const TOKEN_KEY = "hms.token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(t: string | null) {
  if (typeof window === "undefined") return;
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}

// Recursively map _id → id so the rest of the app stays Mongo-agnostic.
function normalize<T = unknown>(v: unknown): T {
  if (Array.isArray(v)) return v.map((x) => normalize(x)) as unknown as T;
  if (v && typeof v === "object") {
    const obj = v as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(obj)) {
      if (k === "_id") out.id = typeof val === "string" ? val : String(val);
      else if (k === "__v") continue;
      else out[k] = normalize(val);
    }
    if (!("id" in out) && "_id" in obj) out.id = String(obj._id);
    return out as T;
  }
  return v as T;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, { ...init, headers });
  } catch (e) {
    throw new Error(
      `Network error: cannot reach ${BASE}. Is the backend running and reachable?`,
    );
  }

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && (data as { message?: string; error?: string }).message) ||
      (data && typeof data === "object" && (data as { error?: string }).error) ||
      `Request failed (${res.status})`;
    throw new Error(String(msg));
  }
  return normalize<T>(data);
}

function safeJson(s: string): unknown {
  try { return JSON.parse(s); } catch { return s; }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  baseUrl: BASE,
};
