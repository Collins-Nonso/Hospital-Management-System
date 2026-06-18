import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useDB, db, type Consultation } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { consultationSchema, scrub, validate } from "@/lib/validation";

export const Route = createFileRoute("/dashboard/consultations")({
  head: () => ({ meta: [{ title: "Consultations - MediCore" }] }),
  component: ConsultationsPage,
});

function ConsultationsPage() {
  const consultations = useDB((d) => d.consultations);
  const appointments = useDB((d) => d.appointments);
  const patients = useDB((d) => d.patients);
  const doctors = useDB((d) => d.doctors);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Consultation | null>(null);
  const [editForm, setEditForm] = useState({ symptoms: "", diagnosis: "", treatmentPlan: "", status: "ongoing" as "ongoing" | "completed" });
  const [form, setForm] = useState({
    appointmentId: "",
    patientId: "",
    doctorId: "",
    symptoms: "",
    diagnosis: "",
    treatmentPlan: "",
    status: "ongoing" as "ongoing" | "completed",
  });

    const openEdit = (c: Consultation) => {
    setEditing(c);
    setEditForm({
      symptoms: (c.symptoms ?? []).join(", "),
      diagnosis: c.diagnosis ?? "",
      treatmentPlan: c.treatmentPlan ?? "",
      status: c.status ?? "ongoing",
    });
  };
  const submitEdit = async () => {
    if (!editing) return;
    try {
      await db.updateConsultation(editing.id, {
        symptoms: [...new Set(editForm.symptoms.split(",").map((s) => s.trim()).filter(Boolean))],
        diagnosis: editForm.diagnosis,
        treatmentPlan: editForm.treatmentPlan,
        status: editForm.status,
      });
      toast.success("Consultation updated");
      setEditing(null);
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  };

const submit = () => {
  const data = validate(consultationSchema, form);
  if (!data) return;

  const appt = appointments.find(
    (a) => a.id === data.appointmentId
  );

  if (!appt) {
    toast.error("Choose an appointment");
    return;
  }

  db.addConsultation({
    appointmentId: appt.id,
    patientId: appt.patientId,
    doctorId: appt.doctorId,
    symptoms: data.symptoms
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    diagnosis: data.diagnosis,
    treatmentPlan: data.treatmentPlan,
    status: form.status,
  });

  toast.success("Consultation recorded");
  setOpen(false);

  setForm({
    appointmentId: "",
    patientId: "",
    doctorId: "",
    symptoms: "",
    diagnosis: "",
    treatmentPlan: "",
    status: "ongoing",
  });
};

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consultations"
        description="Capture symptoms, diagnosis and treatment plans."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-1 h-4 w-4" />
                New consultation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record consultation</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Appointment</Label>
                  <Select
                    value={form.appointmentId}
                    onValueChange={(v) => setForm({ ...form, appointmentId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointments.map((a) => {
                        const p = patients.find((x) => x.id === a.patientId);
                        const d = doctors.find((x) => x.id === a.doctorId);
                        return (
                          <SelectItem key={a.id} value={a.id}>
                            {p?.firstName} {p?.lastName} —{" "}
                            {d ? `${d.firstName} ${d.lastName}` : "—"} · {a.date}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Symptoms</Label><Textarea maxLength={1000} value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: scrub(e.target.value) })} /></div>
                <div className="space-y-1.5"><Label>Diagnosis</Label><Textarea maxLength={1000} value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: scrub(e.target.value) })} /></div>
                <div className="space-y-1.5"><Label>Treatment plan</Label><Textarea maxLength={1000} value={form.treatmentPlan} onChange={(e) => setForm({ ...form, treatmentPlan: scrub(e.target.value) })} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={submit}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {consultations.map((c) => {
          const p = patients.find((x) => x.id === c.patientId);
          const d = doctors.find((x) => x.id === c.doctorId);
          return (
            <Card key={c.id}>
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-display text-lg font-semibold">
                    {p ? `${p.firstName} ${p.lastName}` : "—"}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-muted-foreground">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                    {isAdmin && (
                      <Button size="icon" variant="ghost" aria-label="Edit consultation" onClick={() => openEdit(c)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  By {d ? `${d.firstName} ${d.lastName}` : "—"}
                </div>
                <Section
                  label="Symptoms"
                  value={Array.isArray(c.symptoms) ? c.symptoms.join(", ") : c.symptoms}
                />
                <Section
                  label="Diagnosis"
                  value={Array.isArray(c.diagnosis) ? c.diagnosis.join(", ") : c.diagnosis}
                />
                <Section
                  label="Treatment plan"
                  value={
                    Array.isArray(c.treatmentPlan) ? c.treatmentPlan.join(", ") : c.treatmentPlan
                  }
                />
              </CardContent>
            </Card>
          );
        })}
        {consultations.length === 0 && (
          <div className="col-span-full rounded-md border bg-card p-10 text-center text-sm text-muted-foreground">
            No consultations yet.
          </div>
        )}
      </div>

        <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit consultation</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Symptoms</Label>
              <Textarea value={editForm.symptoms} onChange={(e) => setEditForm({ ...editForm, symptoms: e.target.value })} />
            </div>
            <div className="space-y-1.5"><Label>Diagnosis</Label>
              <Textarea value={editForm.diagnosis} onChange={(e) => setEditForm({ ...editForm, diagnosis: e.target.value })} />
            </div>
            <div className="space-y-1.5"><Label>Treatment plan</Label>
              <Textarea value={editForm.treatmentPlan} onChange={(e) => setEditForm({ ...editForm, treatmentPlan: e.target.value })} />
            </div>
            <div className="space-y-1.5"><Label>Status</Label>
              <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v as "ongoing" | "completed" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={submitEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm">{value || "—"}</div>
    </div>
  );
}
