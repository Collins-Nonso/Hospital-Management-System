// Shared client-side validation primitives.
//
// Goal: reject malicious characters (HTML tags, control chars, common XSS
// vectors, SQL-comment / NoSQL operator markers) BEFORE the form is submitted,
// and back the check with strict zod schemas per entity. The store layer
// (sanitizeDeep in store.ts) is the safety net — these schemas give users
// instant feedback and prevent obviously bad payloads from being sent.
import { z } from "zod";
import { toast } from "sonner";
import { Phone } from "lucide-react";
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
  firstName: safeName(80, "First name"),
  lastName: safeName(80, "Last name"),
  email: safeEmail(),
  specialization: safeText(80, "Specialization").min(2),
  departmentId: safeText(24, "Department ID").min(1),
  phone: safePhone(),
});
export const appointmentSchema = z.object({
  patientId: safeText(24, "Patient ID").min(1, "Select a patient"),
  doctorId: safeText(24, "Doctor ID").min(1, "Select a doctor"),
  date: isoDate(),
  time: isoTime(),
  reason: safeOptional(300, "Reason"),
});
export const consultationSchema = z.object({
  appointmentId: safeText(24, "Appointment ID").min(1, "Select an appointment"),
  symptoms: safeOptional(1000, "Symptoms"),
  diagnosis: safeFreeText(1000, "Diagnosis").min(2, "Diagnosis required"),
  treatmentPlan: safeOptional(1000, "Treatment plan"),
});
export const recordSchema = z.object({
  patientId: safeText(24, "Patient ID").min(1, "Select a patient"),
  doctorId: safeText(24, "Doctor ID").min(1, "Select a doctor"),
  consultationId: safeText(24, "Consultation ID").min(1, "Select a consultation"),
  diagnosis: safeFreeText(1000, "Diagnosis").min(2, "Diagnosis required"),
  treatmentNote: safeOptional(2000, "Treatment note"),
  medicalHistory: safeOptional(2000, "Medical history"),
});
export const medicationSchema = z.object({
  medicationName: safeOptional(120, "Medication name"),
  dosage: safeOptional(40, "Dosage"),
  frequency: safeOptional(40, "Frequency"),
  duration: safeOptional(40, "Duration"),
  instructions: safeOptional(1000, "Instructions"),
});
export const prescriptionSchema = z.object({
  patientId: safeText(24, "Patient ID").min(1, "Select a patient"),
  doctorId: safeText(24, "Doctor ID").min(1, "Select a doctor"),
  consultationId: safeText(24, "Consultation ID").optional(),
  medications: medicationSchema.array().min(1, "Add at least one medication"),
});
export const labRequestSchema = z.object({
  patientId: safeText(24, "Patient ID").min(1, "Select a patient"),
  doctorId: safeText(24, "Doctor ID").min(1, "Select a doctor"),
  consultationId: safeText(24, "Consultation ID").optional(),
  testName: safeText(120, "Test type").min(2, "Test type required"),
  instructions: safeOptional(1000, "Instructions"),
});
export const labResultSchema = z.object({
  labRequestId: safeText(24, "Lab Request ID").min(1),
  // patientId: safeText(24, "Patient ID").min(1, "Select a patient"),
  result: safeFreeText(2000, "Result").min(2, "Result required"),
  // remarks: safeOptional(1000, "Remarks"),
  // uploadedBy: safeText(80, "Uploaded by").min(2, "Uploader name required"),
});
export const billItemSchema = z.object({
  itemName: safeText(120, "Item description").min(1, "Item description required"),
  quantity: safeText(10, "Quantity").regex(/^\d+$/, "Quantity must be a positive integer").transform(Number),
  unitPrice: safeText(20, "Unit price").regex(/^\d+(\.\d{1,2})?$/, "Unit price must be a valid number").transform(Number),
  totalPrice: safeText(20, "Total price").regex(/^\d+(\.\d{1,2})?$/, "Total price must be a valid number").transform(Number),
});
export const billSchema = z.object({
  // patientId: safeText(24, "Patient ID").min(1, "Select a patient"),
  // paymentMethod: safeText(20, "Payment method").min(1, "Select a payment method"),
  // itemName: billItemSchema.shape.itemName,
  // quantity: billItemSchema.shape.quantity,
  // unitPrice: billItemSchema.shape.unitPrice,
  // notes: safeOptional(1000, "Notes"),
});
// Used inline on Inputs to strip the worst characters as the user types.
export function scrub(value: string): string {
  return value.replace(/[<>${}\\\u0000-\u001F\u007F]/g, "");
}