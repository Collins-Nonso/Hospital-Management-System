import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CalendarPlus, X, CheckCircle2, Check } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDB, db, type Appointment } from "@/lib/store";

export const Route = createFileRoute("/dashboard/appointments")({
  head: () => ({ meta: [{ title: "Appointments - MediCore" }] }),
  component: AppointmentsPage,
});

const statusColor: Record<Appointment["status"], string> = {
  booked: "bg-info/15 text-info",
  confirmed: "bg-success/15 text-success",
  completed: "bg-muted text-foreground",
  cancelled: "bg-destructive/15 text-destructive",
};

function AppointmentsPage() {
  const appointments = useDB((d) => d.appointments);
  const patients = useDB((d) => d.patients);
  const doctors = useDB((d) => d.doctors);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"all" | Appointment["status"]>("all");
  const [form, setForm] = useState({ patientId: "", doctorId: "", date: "", time: "", status: "booked" as const, reason: "" });

  const filtered = tab === "all" ? appointments : appointments.filter((a) => a.status === tab);

  const submit = () => {
    if (!form.patientId || !form.doctorId || !form.date || !form.time) { toast.error("Please complete all required fields"); return; }
    try {
      db.bookAppointment({ ...form, createdAt: new Date().toISOString() });
      toast.success("Appointment booked");
      setOpen(false);
      setForm({ patientId: "", doctorId: "", date: "", time: "", status: "booked", reason: "" });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Could not book"); }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Book, confirm, complete or cancel patient appointments."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><CalendarPlus className="mr-1 h-4 w-4" />Book appointment</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Book appointment</DialogTitle></DialogHeader>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2"><Label>Patient</Label>
                  <Select value={form.patientId} onValueChange={(v) => setForm({ ...form, patientId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                    <SelectContent>{patients.map((p) => <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 sm:col-span-2"><Label>Doctor</Label>
                  <Select value={form.doctorId} onValueChange={(v) => setForm({ ...form, doctorId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                    <SelectContent>{doctors.filter((d) => d.availability).map((d) => <SelectItem key={d.id} value={d.id}>{`${d.firstName} ${d.lastName}`} — {d.specialization}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Time</Label><Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></div>
                <div className="space-y-1.5 sm:col-span-2"><Label>Reason</Label><Textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Optional notes" /></div>
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit}>Book</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="booked">Booked</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-4">
          <Card><CardContent className="p-4 overflow-x-auto">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Patient</TableHead><TableHead>Doctor</TableHead><TableHead>When</TableHead>
                <TableHead>Reason</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filtered.map((a) => {
                  const p = patients.find((x) => x.id === a.patientId);
                  const doc = doctors.find((x) => x.id === a.doctorId);
                  return (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{p ? `${p.firstName} ${p.lastName}` : "—"}</TableCell>
                      <TableCell>{doc ? `${doc.firstName} ${doc.lastName}` : "—"}</TableCell>
                      <TableCell>{a.date} · {a.time}</TableCell>
                      <TableCell className="text-muted-foreground">{a.reason || "—"}</TableCell>
                      <TableCell><Badge className={statusColor[a.status]} variant="secondary">{a.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {a.status === "booked" && <Button size="sm" variant="outline" onClick={() => db.setAppointmentStatus(a.id, "confirmed")}><Check className="mr-1 h-3.5 w-3.5" />Confirm</Button>}
                          {(a.status === "booked" || a.status === "confirmed") && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => db.setAppointmentStatus(a.id, "completed")}><CheckCircle2 className="mr-1 h-3.5 w-3.5" />Complete</Button>
                              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => db.setAppointmentStatus(a.id, "cancelled")}><X className="mr-1 h-3.5 w-3.5" />Cancel</Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No appointments here.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
