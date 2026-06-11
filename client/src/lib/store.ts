// client/src/lib/store.ts

import { useEffect, useState } from "react";
import { api, getToken } from "./api";

export type ID = string;

export interface Department { id: ID; name: string; description: string; status: "active" | "inactive"; createdAt: string; }
export interface Doctor { id: ID; firstName: string; lastName: string; email: string; phone: string; specialization: string; departmentId: ID; availability: boolean; status: "active" | "inactive"; createdAt: string; }
export interface Patient { id: ID; firstName: string; lastName: string; gender: "male" | "female" | "other"; dateOfBirth: string; phone: string; address: string; bloodGroup: string; allergies: string[]; emergencyContact: { name: string; phone: string; relationship: string }; medicalHistory: string[]; createdAt: string; }
export interface Appointment { id: ID; patientId: ID; doctorId: ID; date: string; time: string; status: "booked" | "confirmed" | "completed" | "cancelled"; reason?: string; createdAt: string; }
export interface Consultation { id: ID; appointmentId: ID; patientId: ID; doctorId: ID; symptoms: string[]; diagnosis: string; treatmentPlan: string; status: "ongoing" | "completed";   createdAt: string; }
export interface MedicalRecord { id: ID; patientId: ID; doctorId: ID; consultationId: ID; diagnosis: string; treatmentNote: string; medicalHistory: string[]; createdAt: string; }
export interface LabRequest { id: ID; patientId: ID; doctorId: ID; consultationId: ID; testName: string; instructions: string; status: "pending" | "completed"; createdAt: string; }
export interface LabResult { id: ID; labRequestId: ID; patientId: ID; result: string; remarks: string; uploadedBy: string; createdAt: string; }
export interface Prescription { id: ID; patientId: ID; doctorId: ID; consultationId: ID; medications: [{ medicationName: string; dosage: string; frequency: string; duration: string, instructions: string }]; status: "pending" | "dispensed"; createdAt: string; }
export interface Pharmacy { id: ID; prescriptionId: ID; patientId: ID; pharmacistId: ID; drugsDispensed: string[]; dispensedAt: string; createdAt: string; }
export interface BillItem { itemName: string; quantity: number; unitPrice: number; totalPrice: number; }
export interface Bill { id: ID; invoiceNumber: string; patientId: ID; appointmentId?: ID; consultationId?: ID; billItems: BillItem[]; totalAmount: number; paymentStatus: "pending" | "paid"; paymentMethod: "cash" | "card" | "transfer" | "insurance"; paidAt?: string; notes: string; createdAt: string; }
export interface Notification { id: ID; title: string; description: string; type: "info" | "success" | "warning" | "error"; createdAt: string; read: boolean; }

export interface DBShape {
  departments: Department[];
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  consultations: Consultation[];
  records: MedicalRecord[];
  labRequests: LabRequest[];
  labResults: LabResult[];
  prescriptions: Prescription[];
  pharmacies: Pharmacy[];
  billings: Bill[];
  notifications: Notification[];
}

const EMPTY: DBShape = {
  departments: [], doctors: [], patients: [], appointments: [],
  consultations: [], records: [], labRequests: [], labResults: [],
  prescriptions: [], pharmacies: [], billings: [], notifications: [],
};

const listeners = new Set<() => void>();
let state: DBShape = { ...EMPTY };
let booted = false;

const emit = () => listeners.forEach((l) => l());
const set = (patch: Partial<DBShape>) => { state = { ...state, ...patch }; emit(); };
const now = () => new Date().toISOString();

// ---------- bootstrap & refresh ----------

// Endpoint map keyed by the DBShape field name.
const ENDPOINTS: Record<keyof DBShape, string> = {
  departments: "/departments",
  doctors: "/doctors",
  patients: "/patients",
  appointments: "/appointments",
  consultations: "/consultations",
  records: "/medical-records",
  labResults: "/lab-results",
  labRequests: "/lab-requests",
  prescriptions: "/prescriptions",
  pharmacies: "/pharmacies",
  billings: "/billings",
  notifications: "/notifications",
};

// Some backends wrap arrays as { data: [...] } or { items: [...] } — accept both.
function unwrapList<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === "object") {
    const r = raw as { data?: unknown; items?: unknown; results?: unknown };
    if (Array.isArray(r.data)) return r.data as T[];
    if (Array.isArray(r.items)) return r.items as T[];
    if (Array.isArray(r.results)) return r.results as T[];
  }
  return [];
}

async function refresh<K extends keyof DBShape>(key: K): Promise<void> {
  try {
    const raw = await api.get<unknown>(ENDPOINTS[key]);
    const list = unwrapList<DBShape[K][number]>(raw);
    set({ [key]: list } as unknown as Partial<DBShape>);
  } catch (e) {
    // Surface fetch failures in console; UI continues with whatever cache exists.
    console.error(`[store] failed to load ${key}:`, e);
  }
}

export async function bootstrap(): Promise<void> {
  if (booted) return;
  booted = true;
  if (!getToken()) {
    // Without a token, protected endpoints would 401. Wait until login triggers reload.
    return;
  }
  await Promise.all((Object.keys(ENDPOINTS) as (keyof DBShape)[]).map((k) => refresh(k)));
}

export async function reloadAll(): Promise<void> {
  booted = false;
  await bootstrap();
}

// ---------- React bindings ----------

export function getDB(): DBShape { return state; }

export function useDB<T>(selector: (db: DBShape) => T): T {
  const [, force] = useState(0);
  useEffect(() => {
    // Lazy bootstrap — first component to mount triggers initial load.
    void bootstrap();
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  return selector(state);
}

// ---------- Notifications ----------
// Optimistic local push so toast-style alerts appear instantly; backend
// persistence is best-effort (ignored if endpoint isn't implemented).
export function notify(n: Omit<Notification, "id" | "createdAt" | "read">) {
  const local: Notification = {
    ...n,
    id: `local-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now(),
    read: false,
  };
  set({ notifications: [local, ...state.notifications] });
  api.post("/notifications", n).then(() => refresh("notifications")).catch(() => {});
}

// ---------- Mutation helpers ----------
async function create<K extends keyof DBShape>(key: K, body: unknown, successMsg?: { title: string; description: string }): Promise<DBShape[K][number]> {
  const created = await api.post<DBShape[K][number]>(ENDPOINTS[key], body);
  await refresh(key);
  if (successMsg) notify({ ...successMsg, type: "success" });
  return created;
}

async function update<K extends keyof DBShape>(key: K, id: ID, patch: unknown): Promise<void> {
  await api.patch(`${ENDPOINTS[key]}/${id}`, patch);
  await refresh(key);
}

async function remove<K extends keyof DBShape>(key: K, id: ID): Promise<void> {
  await api.delete(`${ENDPOINTS[key]}/${id}`);
  await refresh(key);
}

// ---------- Public API (same shape the pages already call) ----------
export const db = {
  // Departments
  async addDepartment(input: Omit<Department, "id" | "createdAt" | "status"> & { status?: Department["status"] }) {
    const item = await create("departments", { status: "active", ...input }, { title: "Department created", description: input.name });
    return item;
  },
  async updateDepartment(id: ID, patch: Partial<Department>) { await update("departments", id, patch); },
  async removeDepartment(id: ID) { await remove("departments", id); notify({ title: "Department removed", description: id, type: "warning" }); },

  // Doctors
  async addDoctor(input: Omit<Doctor, "id">) {
    return create("doctors", input, { title: "Doctor added", description: `${input.firstName} ${input.lastName}` });
  },
  async updateDoctor(id: ID, patch: Partial<Doctor>) { await update("doctors", id, patch); },
  async removeDoctor(id: ID) { await remove("doctors", id); },

  // Patients
  async addPatient(input: Omit<Patient, "id" | "createdAt">) {
    return create("patients", input, { title: "Patient registered", description: `${input.firstName} ${input.lastName}` });
  },
  async updatePatient(id: ID, patch: Partial<Patient>) { await update("patients", id, patch); },
  async removePatient(id: ID) { await remove("patients", id); },

  // Appointments
  async bookAppointment(input: Omit<Appointment, "id" | "status"> & { status?: Appointment["status"] }) {
    // Client-side guards mirror common server validation; server is still source of truth.
    const slot = new Date(`${input.date}T${input.time}`);
    if (slot.getTime() < Date.now() - 60_000) throw new Error("Cannot book an appointment in the past");
    const clash = state.appointments.some((a) =>
      a.doctorId === input.doctorId && a.date === input.date && a.time === input.time && a.status !== "cancelled",
    );
    if (clash) throw new Error("Doctor already has an appointment at this time");

    const item = await create("appointments", { status: "booked", ...input });
    notify({ title: "Appointment booked", description: `${input.date} at ${input.time}`, type: "info" });
    return item;
  },
  async setAppointmentStatus(id: ID, status: Appointment["status"]) {
    await update("appointments", id, { status });
    notify({ title: `Appointment ${status}`, description: id, type: status === "cancelled" ? "warning" : "info" });
  },

  // Consultations
  async addConsultation(input: Omit<Consultation, "id" | "createdAt">) {
    return create("consultations", input, { title: "Consultation recorded", description: input.diagnosis });
  },

  // Medical records
  async addRecord(input: Omit<MedicalRecord, "id" | "createdAt">) {
    const item = await create("records", input);
    notify({ title: "Medical record added", description: input.diagnosis, type: "info" });
    return item;
  },

  // Lab
  async addLabRequest(input: Omit<LabRequest, "id" | "createdAt" | "status">) {
    const item = await create("labRequests", { status: "pending", ...input });
    notify({ title: "Lab request created", description: input.testName, type: "info" });
    return item;
  },
  async addLabResult(input: { labRequestId: ID; result: string }) {
    if (state.labResults.some((r) => r.labRequestId === input.labRequestId)) {
      throw new Error("Result already uploaded for this request");
    }
    const item = await create("labResults", input);
    // Sync the request status so UI updates without a manual refresh.
    await refresh("labRequests");
    notify({ title: "Lab result uploaded", description: input.result.slice(0, 40), type: "success" });
    return item;
  },

  // Prescriptions
  async addPrescription(input: Omit<Prescription, "id" | "status" | "createdAt">) {
    const item = await create("prescriptions", { status: "pending", ...input });
    notify({ title: "Prescription created", description: `${input.medications.length} medication(s)`, type: "info" });
    return item;
  },
  async dispensePrescription(input: { prescriptionId: ID; patientId: ID; pharmacistId: ID; drugs: string[] }) {
    if (state.pharmacies.some((x) => x.prescriptionId === input.prescriptionId)) {
      throw new Error("Prescription already dispensed");
    }
    const created = await api.post<Pharmacy>(`/prescriptions/${input.prescriptionId}/dispense`, input);
    await Promise.all([refresh("pharmacies"), refresh("prescriptions")]);
    notify({ title: "Prescription dispensed", description: input.drugs.join(", "), type: "success" });
    return created;
  },

  // Billing
  async addBill(input: Omit<Bill, "id" | "paymentStatus" | "createdAt">) {
    const item = await create("billings", { paymentStatus: "pending", ...input });
    notify({
      title: "Invoice generated",
      description: `Total ${input.billItems.reduce((s, i) => s + i.totalPrice, 0).toLocaleString()}`,
      type: "info",
    });
    return item;
  },
  async payBill(id: ID) {
    await api.post(`/billings/${id}/pay`, {});
    await refresh("billings");
    notify({ title: "Payment received", description: `Bill ${id}`, type: "success" });
  },

  // Notifications
  async markNotificationRead(id: ID) {
    set({ notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) });
    try { await api.patch(`/notifications/${id}`, { read: true }); } catch {}
  },
  async markAllNotificationsRead() {
    set({ notifications: state.notifications.map((n) => ({ ...n, read: true })) });
    try { await api.post("/notifications/read-all", {}); } catch {}
  },
};
