import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDB, db } from "@/lib/store";

export const Route = createFileRoute("/dashboard/records")({
  head: () => ({ meta: [{ title: "Medical Records — MediCore" }] }),
  component: RecordsPage,
});

function RecordsPage() {
  const records = useDB((d) => d.records);
  const patients = useDB((d) => d.patients);
  const doctors = useDB((d) => d.doctors);
  const consultations = useDB((d) => d.consultations);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ patientId: "", doctorId: "", consultationId: "", diagnosis: "", treatmentNote: "", medicalHistory: "" });

  const submit = () => {
    if (!form.patientId || !form.doctorId || !form.diagnosis.trim()) { toast.error("Please fill required fields"); return; }
    db.addRecord({ ...form, medicalHistory: form.medicalHistory ? form.medicalHistory.split('\n').filter(Boolean) : [] });
    toast.success("Record added");
    setOpen(false);
    setForm({ patientId: "", doctorId: "", consultationId: "", diagnosis: "", treatmentNote: "", medicalHistory: "" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Medical records"
        description="Patient history, diagnosis and treatment notes."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" />Add record</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New medical record</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5"><Label>Patient</Label>
                  <Select value={form.patientId} onValueChange={(v) => setForm({ ...form, patientId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                    <SelectContent>{patients.map((p) => <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Doctor</Label>
                  <Select value={form.doctorId} onValueChange={(v) => setForm({ ...form, doctorId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                    <SelectContent>{doctors.map((d) => <SelectItem key={d.id} value={d.id}>{d.firstName} {d.lastName}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Consultation</Label>
                  <Select value={form.consultationId} onValueChange={(v) => setForm({ ...form, consultationId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select consultation" /></SelectTrigger>
                    <SelectContent>
                      {consultations.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.diagnosis}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Diagnosis</Label><Textarea value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Treatment notes</Label><Textarea value={form.treatmentNote} onChange={(e) => setForm({ ...form, treatmentNote: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Medical history</Label><Textarea value={form.medicalHistory} onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })} /></div>
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit}>Save record</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <Card><CardContent className="p-4 overflow-x-auto">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Patient</TableHead><TableHead>Doctor</TableHead><TableHead>Diagnosis</TableHead>
            <TableHead>Symptoms</TableHead><TableHead>Notes</TableHead><TableHead>Date</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {records.map((r) => {
              const p = patients.find((x) => x.id === r.patientId);
              const d = doctors.find((x) => x.id === r.doctorId);
              return (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{p ? `${p.firstName} ${p.lastName}` : "—"}</TableCell>
                  <TableCell>{d ? `${d.firstName} ${d.lastName}` : "—"}</TableCell>
                  <TableCell>{r.diagnosis}</TableCell>
                  <TableCell className="text-muted-foreground">{r.medicalHistory?.length ? r.medicalHistory.join(", ") : "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{r.treatmentNote || "—"}</TableCell>
                  <TableCell>{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              );
            })}
            {records.length === 0 && <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No records yet.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
