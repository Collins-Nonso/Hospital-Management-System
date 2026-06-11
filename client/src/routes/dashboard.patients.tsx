import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Trash2, Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDB, db, type Patient } from "@/lib/store";

export const Route = createFileRoute("/dashboard/patients")({
  head: () => ({ meta: [{ title: "Patients — MediCore" }] }),
  component: PatientsPage,
});

const schema = z.object({
  firstName: z.string().trim().min(1, "First name required").max(50),
  lastName: z.string().trim().min(1, "Last name required").max(50),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.string().min(1, "Date of birth required"),
  phone: z.string().trim().min(7, "Phone required").max(20),
  address: z.string().trim().max(200).optional().default(""),
  bloodGroup: z.string().max(5).optional().default(""),
  allergies: z.string().max(200).optional().default(""),
  emergencyContactName: z.string().trim().max(50).optional().default(""),
  emergencyContactPhone: z.string().trim().max(20).optional().default(""),
  emergencyContactRelationship: z.string().trim().max(50).optional().default(""),
  medicalHistory: z.string().max(200).optional().default(""),
});

function PatientsPage() {
  const patients = useDB((d) => d.patients);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", gender: "male" as Patient["gender"], dateOfBirth: "",
    phone: "", address: "", bloodGroup: "", allergies: "",
    emergencyContactName: "", emergencyContactPhone: "", emergencyContactRelationship: "", medicalHistory: "",
  });

  const filtered = patients.filter((p) => `${p.firstName} ${p.lastName} ${p.phone}`.toLowerCase().includes(q.toLowerCase()));

  const submit = () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      phone,
      address,
      bloodGroup,
      allergies,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
      medicalHistory,
    } = parsed.data;

    db.addPatient({
      firstName,
      lastName,
      gender,
      dateOfBirth,
      phone,
      address,
      bloodGroup,
      allergies: allergies ? allergies.split(",").map((s) => s.trim()).filter(Boolean) : [],
      emergencyContact: {
        name: emergencyContactName,
        phone: emergencyContactPhone,
        relationship: emergencyContactRelationship,
      },
      medicalHistory: medicalHistory ? medicalHistory.split(",").map((s) => s.trim()).filter(Boolean) : [],
    });
    toast.success("Patient registered");
    setOpen(false);
    setForm({
      firstName: "", lastName: "", gender: "male", dateOfBirth: "", phone: "", address: "", bloodGroup: "", allergies: "",
      emergencyContactName: "", emergencyContactPhone: "", emergencyContactRelationship: "", medicalHistory: "",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        description="Register new patients and manage their records."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" /> New patient</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Register patient</DialogTitle></DialogHeader>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="First name"><Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></Field>
                <Field label="Last name"><Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></Field>
                <Field label="Gender">
                  <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v as Patient["gender"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Date of birth"><Input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} /></Field>
                <Field label="Phone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
                <Field label="Address" full><Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
                <Field label="Blood group"><Input value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} placeholder="O+" /></Field>
                <Field label="Allergies (comma separated)" full><Input value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} placeholder="Dust, Peanuts" /></Field>
                <Field label="Emergency contact name"><Input value={form.emergencyContactName} onChange={(e) => setForm({ ...form, emergencyContactName: e.target.value })} /></Field>
                <Field label="Emergency contact phone"><Input value={form.emergencyContactPhone} onChange={(e) => setForm({ ...form, emergencyContactPhone: e.target.value })} /></Field>
                <Field label="Emergency contact relationship"><Input value={form.emergencyContactRelationship} onChange={(e) => setForm({ ...form, emergencyContactRelationship: e.target.value })} /></Field>
                <Field label="Medical history" full><Textarea value={form.medicalHistory} onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })} placeholder="Diabetes, Hypertension" /></Field>
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit}>Save patient</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardContent className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-8" placeholder="Search by name or phone…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <Badge variant="secondary">{filtered.length} of {patients.length}</Badge>
          </div>
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>firstName</TableHead>
                <TableHead>lastName</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>DOB</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Blood group</TableHead>
                <TableHead>Allergies</TableHead>
                <TableHead>Emergency contact</TableHead>
                <TableHead>Medical history</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.firstName}</TableCell>
                  <TableCell className="font-medium">{p.lastName}</TableCell>
                  <TableCell className="capitalize">{p.gender}</TableCell>
                  <TableCell>{p.dateOfBirth}</TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell>{p.address || "—"}</TableCell>
                  <TableCell>{p.bloodGroup || "—"}</TableCell>
                  <TableCell>{p.allergies.length ? p.allergies.join(", ") : "—"}</TableCell>
                  <TableCell>{p.emergencyContact.name ? `${p.emergencyContact.name} (${p.emergencyContact.relationship}, ${p.emergencyContact.phone})` : "—"}</TableCell>
                  <TableCell>{p.medicalHistory.length ? p.medicalHistory.join(", ") : "—"}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon" aria-label="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Remove patient?</AlertDialogTitle><AlertDialogDescription>This will permanently remove {p.firstName} {p.lastName}.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { db.removePatient(p.id); toast.success("Patient removed"); }}>Remove</AlertDialogAction></AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={11} className="py-10 text-center text-muted-foreground">No patients yet.</TableCell></TableRow>}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={`space-y-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
