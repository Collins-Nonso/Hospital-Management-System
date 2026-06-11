import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useDB, db, type Medication } from "@/lib/store";

export const Route = createFileRoute("/dashboard/prescriptions")({
  head: () => ({ meta: [{ title: "Prescriptions — MediCore" }] }),
  component: PrescriptionsPage,
});

function PrescriptionsPage() {
  const prescriptions = useDB((d) => d.prescriptions);
  const patients = useDB((d) => d.patients);
  const doctors = useDB((d) => d.doctors);

  const [open, setOpen] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [meds, setMeds] = useState<Medication[]>([{ name: "", dosage: "", frequency: "", duration: "" }]);

  const submit = () => {
    if (!patientId || !doctorId) { toast.error("Select patient and doctor"); return; }
    const valid = meds.every((m) => m.name.trim() && m.dosage.trim() && m.frequency.trim() && m.duration.trim());
    if (!valid) { toast.error("Complete all medication fields"); return; }
    db.addPrescription({ patientId, doctorId, medications: meds });
    toast.success("Prescription created");
    setOpen(false); setPatientId(""); setDoctorId(""); setMeds([{ name: "", dosage: "", frequency: "", duration: "" }]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prescriptions"
        description="Create prescriptions to be dispensed at the pharmacy."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" />New prescription</Button></DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>New prescription</DialogTitle></DialogHeader>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>Patient</Label>
                  <Select value={patientId} onValueChange={setPatientId}>
                    <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                    <SelectContent>{patients.map((p) => <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Doctor</Label>
                  <Select value={doctorId} onValueChange={setDoctorId}>
                    <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                    <SelectContent>{doctors.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Medications</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setMeds([...meds, { name: "", dosage: "", frequency: "", duration: "" }])}><Plus className="mr-1 h-3.5 w-3.5" />Add</Button>
                </div>
                {meds.map((m, i) => (
                  <div key={i} className="grid gap-2 rounded-md border p-3 sm:grid-cols-5">
                    <Input className="sm:col-span-2" placeholder="Name (e.g. Paracetamol)" value={m.name} onChange={(e) => setMeds(meds.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
                    <Input placeholder="Dosage (500mg)" value={m.dosage} onChange={(e) => setMeds(meds.map((x, j) => j === i ? { ...x, dosage: e.target.value } : x))} />
                    <Input placeholder="Frequency (BID)" value={m.frequency} onChange={(e) => setMeds(meds.map((x, j) => j === i ? { ...x, frequency: e.target.value } : x))} />
                    <div className="flex gap-1">
                      <Input placeholder="Duration (5 days)" value={m.duration} onChange={(e) => setMeds(meds.map((x, j) => j === i ? { ...x, duration: e.target.value } : x))} />
                      {meds.length > 1 && <Button variant="ghost" size="icon" onClick={() => setMeds(meds.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                    </div>
                  </div>
                ))}
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit}>Create</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {prescriptions.map((rx) => {
          const p = patients.find((x) => x.id === rx.patientId);
          const d = doctors.find((x) => x.id === rx.doctorId);
          return (
            <Card key={rx.id}><CardContent className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <div className="font-display text-base font-semibold">{p ? `${p.firstName} ${p.lastName}` : "—"}</div>
                  <div className="text-xs text-muted-foreground">Prescribed by {d?.name ?? "—"} · {new Date(rx.createdAt).toLocaleDateString()}</div>
                </div>
                <Badge variant={rx.status === "dispensed" ? "default" : "secondary"} className="capitalize">{rx.status}</Badge>
              </div>
              <ul className="mt-3 space-y-1.5 text-sm">
                {rx.medications.map((m, i) => (
                  <li key={i} className="rounded-md border bg-muted/40 px-3 py-2">
                    <span className="font-medium">{m.name}</span>
                    <span className="text-muted-foreground"> · {m.dosage} · {m.frequency} · {m.duration}</span>
                  </li>
                ))}
              </ul>
            </CardContent></Card>
          );
        })}
        {prescriptions.length === 0 && <div className="col-span-full rounded-md border bg-card p-10 text-center text-sm text-muted-foreground">No prescriptions yet.</div>}
      </div>
    </div>
  );
}
