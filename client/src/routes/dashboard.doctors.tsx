import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDB, db, type Doctor } from "@/lib/store";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/doctors")({
  head: () => ({ meta: [{ title: "Doctors — MediCore" }] }),
  component: DoctorsPage,
});

type DoctorForm = {
  firstName: string; lastName: string; email: string; phone: string;
  specialization: string; departmentId: string;
  availability: boolean; status: "active" | "inactive";
};
const blank = (): DoctorForm => ({
  firstName: "", lastName: "", email: "", phone: "",
  specialization: "", departmentId: "", availability: true, status: "active",
});
const fromDoctor = (d: Doctor): DoctorForm => ({
  firstName: d.firstName ?? "", lastName: d.lastName ?? "", email: d.email ?? "",
  phone: d.phone ?? "", specialization: d.specialization ?? "",
  departmentId: d.departmentId ?? "", availability: !!d.availability,
  status: d.status ?? "active",
});

function DoctorsPage() {
  const doctors = useDB((d) => d.doctors);
  const departments = useDB((d) => d.departments);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<DoctorForm>(blank);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [editForm, setEditForm] = useState<DoctorForm>(blank);
  const valid = (f: DoctorForm) =>
    f.firstName.trim() && f.lastName.trim() && f.email.trim() && f.phone.trim() &&
    f.specialization.trim() && f.departmentId;
  const submit = async () => {
    if (!valid(form)) { toast.error("Please fill all required fields"); return; }
    try {
      await db.addDoctor({ ...form, createdAt: new Date().toISOString() });
      toast.success("Doctor added");
      setOpen(false); setForm(blank());
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  };
  const openEdit = (d: Doctor) => { setEditing(d); setEditForm(fromDoctor(d)); };
  const submitEdit = async () => {
    if (!editing) return;
    if (!valid(editForm)) { toast.error("Please fill all required fields"); return; }
    try {
      await db.updateDoctor(editing.id, editForm);
      toast.success("Doctor updated");
      setEditing(null);
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctors"
        description="Manage doctor profiles, specializations and availability."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" />Add doctor</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New doctor</DialogTitle></DialogHeader>
              <DoctorFormFields form={form} setForm={setForm} departments={departments} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={submit}>Add doctor</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <Card>
        <CardContent className="p-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Name</TableHead>
                <TableHead className="whitespace-nowrap">Specialization</TableHead>
                <TableHead className="whitespace-nowrap">Department</TableHead>
                <TableHead className="whitespace-nowrap">Email</TableHead>
                <TableHead className="whitespace-nowrap">Phone</TableHead>
                <TableHead className="whitespace-nowrap">Available</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
                <TableHead className="whitespace-nowrap text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="w-full">
              {doctors.map((d) => {
                const dept = departments.find((x) => x.id === d.departmentId);
                return (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{`${d.firstName} ${d.lastName}`}</TableCell>
                    <TableCell>{d.specialization}</TableCell>
                    <TableCell>{dept?.name ?? "N/A"}</TableCell>
                    <TableCell className="text-muted-foreground">{d.email}</TableCell>
                    <TableCell>{d.phone}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          disabled={!isAdmin}
                          checked={!!d.availability}
                          onCheckedChange={async (v) => {
                            try {
                              await db.updateDoctor(d.id, { availability: v });
                              toast.success(v ? "Marked available" : "Marked unavailable");
                            } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
                          }}
                        />
                        <span className="text-xs text-muted-foreground">{d.availability ? "Available" : "Unavailable"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={d.status === "active" ? "default" : "secondary"} className="capitalize">
                        {d.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={d.status === "active" ? "secondary" : "destructive"}>
                        {d.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {isAdmin ? (
                          <>
                            <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => openEdit(d)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Delete"
                              onClick={async () => {
                                try { await db.removeDoctor(d.id); toast.success("Doctor removed"); }
                                catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {doctors.length === 0 && (
                <TableRow><TableCell colSpan={8} className="py-10 text-center text-muted-foreground">No doctors yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>

        <Badge variant="secondary">
        {doctors.filter((d) => d.availability).length} available ·{" "}
        {doctors.filter((d) => !d.availability).length} unavailable
      </Badge>
          
        <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit doctor</DialogTitle></DialogHeader>
          <DoctorFormFields form={editForm} setForm={setEditForm} departments={departments} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={submitEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

        </CardContent>
      </Card>

    </div>
  );
}

function DoctorFormFields({
  form, setForm, departments,
}: { form: DoctorForm; setForm: (f: DoctorForm) => void; departments: { id: string; name: string }[] }) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5"><Label>First Name</Label>
        <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
      </div>
      <div className="space-y-1.5"><Label>Last Name</Label>
        <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
      </div>
      <div className="space-y-1.5"><Label>Email</Label>
        <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div className="space-y-1.5"><Label>Phone</Label>
        <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </div>
      <div className="space-y-1.5"><Label>Specialization</Label>
        <Input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
      </div>
      <div className="space-y-1.5"><Label>Department</Label>
        <Select value={form.departmentId} onValueChange={(v) => setForm({ ...form, departmentId: v })}>
          <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
          <SelectContent>{departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between rounded-md border p-3">
        <div className="space-y-0.5 w-full">
          <div className="text-sm font-medium">Available</div>
          <div className="text-xs text-muted-foreground">Accepts new appointments</div>
        </div>
        <Switch checked={form.availability} onCheckedChange={(v) => setForm({ ...form, availability: v })} />
      </div>
      <div className="flex items-center justify-between rounded-md border p-3">
        <div className="space-y-0.5 w-full">
          <div className="text-sm font-medium">Status</div>
          <div className="text-xs text-muted-foreground">Doctor's current status</div>
        </div>
        <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "active" | "inactive" })}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
