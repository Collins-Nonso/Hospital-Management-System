// Shared client-side validation primitives.
//
// Goal: reject malicious characters (HTML tags, control chars, common XSS
// vectors, SQL-comment / NoSQL operator markers) BEFORE the form is submitted,
// and back the check with strict zod schemas per entity. The store layer
// (sanitizeDeep in store.ts) is the safety net — these schemas give users
// instant feedback and prevent obviously bad payloads from being sent.
import { z } from "zod";
import { toast } from "sonner";
// Reject angle brackets, ASCII control chars, and a few injection markers.
// Keep the allow-list pragmatic so legitimate punctuation still works.
export const SAFE_RE = /^[^<>${}\\\u0000-\u001F\u007F]*$/;
// Block obvious script/javascript/data/vbscript URIs and HTML event handlers.
// Negated via lookahead so it can be chained with other ZodString methods.
export const NO_INJECTION_RE =
  /^(?!.*(<\s*\/?\s*(script|style|iframe|object|embed)|javascript\s*:|data\s*:|vbscript\s*:|\bon\w+\s*=))/i;
export function safeText(max: number, label = "Value") {
  return z
    .string()
    .trim()
    .max(max, `${label} must be ${max} characters or fewer`)
    .regex(SAFE_RE, `${label} contains disallowed characters`)
    .regex(NO_INJECTION_RE, `${label} contains potentially unsafe content`);
}
export const safeName = (max = 60, label = "Name") =>
  safeText(max, label).regex(/^[A-Za-z][A-Za-z' .\-]*$/, `${label}: letters, spaces, ' . - only`);
export const safePhone = (label = "Phone") =>
  safeText(20, label).regex(/^[+\d][\d\s-]{6,}$/, `${label} must be digits, spaces, dashes`);
export const safeEmail = (_label = "Email") =>
  z.string().trim().email(`${_label} must be a valid email`).max(120);
export const safeFreeText = (max: number, label = "Text") =>
  safeText(max, label);
export const safeOptional = (max: number, label = "Value") =>
  z.string().trim().max(max)
    .regex(SAFE_RE, `${label} contains disallowed characters`)
    .regex(NO_INJECTION_RE, `${label} contains potentially unsafe content`)
    .optional()
    .default("");
export const isoDate = (label = "Date") =>
  z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, `${label} must be a valid date`);
export const isoTime = (label = "Time") =>
  z.string().trim().regex(/^\d{2}:\d{2}(:\d{2})?$/, `${label} must be a valid time`);
// Convenience: parse + toast the first error. Returns parsed data or null.
export function validate<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> | null {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
    return null;
  }
  return parsed.data;
}
// ---------- Per-entity schemas ----------
export const departmentSchema = z.object({
  name: safeName(80, "Department name"),
  description: safeOptional(500, "Description"),
});
export const doctorSchema = z.object({
  name: safeName(80, "Doctor name"),
  email: safeEmail(),
  specialization: safeText(80, "Specialization").min(2),
  departmentId: z.string().min(1, "Select a department"),
  availability: z.boolean(),
});
export const appointmentSchema = z.object({
  patientId: z.string().min(1, "Select a patient"),
  doctorId: z.string().min(1, "Select a doctor"),
  date: isoDate(),
  time: isoTime(),
  reason: safeOptional(300, "Reason"),
});
export const consultationSchema = z.object({
  appointmentId: z.string().min(1, "Select an appointment"),
  symptoms: z.string().min(1),
  diagnosis: safeFreeText(1000, "Diagnosis").min(2, "Diagnosis required"),
  treatmentPlan: safeOptional(1000, "Treatment plan"),
});
export const recordSchema = z.object({
  patientId: z.string().min(1, "Select a patient"),
  doctorId: z.string().min(1, "Select a doctor"),
  diagnosis: safeFreeText(1000, "Diagnosis").min(2, "Diagnosis required"),
  symptoms: safeOptional(1000, "Symptoms"),
  notes: safeOptional(2000, "Notes"),
});
export const medicationSchema = z.object({
  name: safeText(80, "Medication").min(1, "Medication name required"),
  dosage: safeText(40, "Dosage").min(1, "Dosage required"),
  frequency: safeText(40, "Frequency").min(1, "Frequency required"),
  duration: safeText(40, "Duration").min(1, "Duration required"),
});
export const prescriptionSchema = z.object({
  patientId: z.string().min(1, "Select a patient"),
  doctorId: z.string().min(1, "Select a doctor"),
  medications: z.array(medicationSchema).min(1, "Add at least one medication"),
});
export const labRequestSchema = z.object({
  patientId: z.string().min(1, "Select a patient"),
  doctorId: z.string().min(1, "Select a doctor"),
  testType: safeText(120, "Test type").min(2, "Test type required"),
});
export const labResultSchema = z.object({
  labRequestId: z.string().min(1),
  result: safeFreeText(2000, "Result").min(2, "Result required"),
});
export const billItemSchema = z.object({
  name: safeText(120, "Item").min(1, "Item required"),
  amount: z.number().positive("Amount must be greater than 0").max(10_000_000),
});
export const billSchema = z.object({
  patientId: z.string().min(1, "Select a patient"),
  items: z.array(billItemSchema).min(1, "Add at least one item"),
});
// Used inline on Inputs to strip the worst characters as the user types.
export function scrub(value: string): string {
  return value.replace(/[<>${}\\\u0000-\u001F\u007F]/g, "");
}