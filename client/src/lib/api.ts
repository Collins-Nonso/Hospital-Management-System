// client/src/lib/api.ts

// Thin fetch wrapper for the Express + MongoDB backend.
// - Base URL from VITE_API_URL (defaults to http://localhost:5000/api)
// - Attaches JWT from localStorage on every request
// - Normalizes Mongo `_id` -> `id` recursively
// - Translates between the frontend's `*Id` field names and the backend's
//   Mongoose ref names (e.g. patientId <-> patient, departmentId <-> department,
//   date/time <-> appointmentDate/appointmentTime).
// - Throws Error(message) on non-2xx, using the server-provided message.

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

// Keys that the backend stores as ObjectId refs.  The frontend uses `${ref}Id`
// (e.g. patientId), so we translate both directions.
const REF_KEYS = [
  "patient", "doctor", "department", "consultation", "appointment",
  "consultant", "prescription", "pharmacist", "labRequest", "user", "uploadedBy",
] as const;
type RefKey = (typeof REF_KEYS)[number];
const REF_SET = new Set<string>(REF_KEYS);
const ID_KEY_TO_REF: Record<string, RefKey> = REF_KEYS.reduce(
  (acc, k) => { acc[`${k}Id`] = k; return acc; },
  {} as Record<string, RefKey>,
);
function extractId(val: unknown): string | undefined {
  if (typeof val === "string") return val;
  if (val && typeof val === "object") {
    const o = val as Record<string, unknown>;
    if (typeof o._id === "string") return o._id;
    if (typeof o.id === "string") return o.id;
    if (o._id) return String(o._id);
  }
  return undefined;
}
// Normalize a response object: `_id` -> `id`, drop `__v`, and for any
// populated ref field also expose `${key}Id` so existing UI code keeps working.
function normalize<T = unknown>(v: unknown): T {
  if (Array.isArray(v)) return v.map((x) => normalize(x)) as unknown as T;
  if (v && typeof v === "object") {
    const obj = v as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(obj)) {
      if (k === "__v") continue;
      if (k === "_id") {
        out.id = typeof val === "string" ? val : String(val);
        continue;
      }
      const normalized = normalize(val);
      out[k] = normalized;
      if (REF_SET.has(k)) {
        const id = extractId(val);
        if (id && !(`${k}Id` in obj)) out[`${k}Id`] = id;
      }
    }
    if (!("id" in out) && "_id" in obj) out.id = String(obj._id);
    // Appointment compatibility: surface `date` / `time` from the backend
    // fields so existing components don't need to know about Mongoose names.
    if ("appointmentDate" in out && !("date" in out)) {
      const d = out.appointmentDate;
      if (typeof d === "string") {
        // ISO -> YYYY-MM-DD
        out.date = d.length >= 10 ? d.slice(0, 10) : d;
      } else if (d instanceof Date) {
        out.date = d.toISOString().slice(0, 10);
      }
    }
    if ("appointmentTime" in out && !("time" in out)) {
      out.time = out.appointmentTime;
    }
    return out as T;
  }
  return v as T;
}

// Translate outgoing body keys so the backend's Mongoose validators are happy.
function denormalizeBody(path: string, body: unknown): unknown {
  if (body == null || typeof body !== "object" || Array.isArray(body)) return body;
  const src = body as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(src)) {
    const refName = ID_KEY_TO_REF[k];
    if (refName) {
      // patientId -> patient (only if the ref name isn't already set)
      if (!(refName in src)) out[refName] = v;
      continue;
    }
    out[k] = v;
  }
  // Path-specific re-mapping.
  if (path.startsWith("/appointments")) {
    if ("date" in out && !("appointmentDate" in out)) {
      out.appointmentDate = out.date;
      delete out.date;
    }
    if ("time" in out && !("appointmentTime" in out)) {
      out.appointmentTime = out.time;
      delete out.time;
    }
  }
  return out;
}
async function request<T>(path: string, init: RequestInit = {}, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const payload = body !== undefined ? denormalizeBody(path, body) : undefined;
  const finalInit: RequestInit = {
    ...init,
    headers,
    body: payload !== undefined ? JSON.stringify(payload) : init.body,
    // Always hit the network so toggles/edits don't get masked by stale 304 caches.
    cache: "no-store",
  };


  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, finalInit);
  } catch {
    throw new Error(`Network error: cannot reach ${BASE}. Is the backend running?`);
  }

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && (data as { message?: string; error?: string }).message) ||
      (data && typeof data === "object" && (data as { error?: string }).error) ||
      `Request failed (${res.status})`;
    const err = new Error(String(msg));
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }
  return normalize<T>(data);
}

function safeJson(s: string): unknown {
  try { return JSON.parse(s); } catch { return s; }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST" }, body),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH" }, body),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: "PUT" }, body),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  baseUrl: BASE,
};
