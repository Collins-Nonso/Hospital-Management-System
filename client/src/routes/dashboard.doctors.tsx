import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDB, db } from "@/lib/store";

export const Route = createFileRoute("/dashboard/doctors")({
  head: () => ({ meta: [{ title: "Doctors — MediCore" }] }),
  component: DoctorsPage,
});

function DoctorsPage() {
  const doctors = useDB((d) => d.doctors);
  const departments = useDB((d) => d.departments);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialization: string;
    departmentId: string;
    availability: boolean;
    status: "active" | "inactive";
  }>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialization: "",
    departmentId: "",
    availability: true,
    status: "active",
  });

  const submit = () => {
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.specialization.trim() ||
      !form.departmentId
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    db.addDoctor({ ...form, createdAt: new Date().toISOString() });
    toast.success("Doctor added");
    setOpen(false);
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialization: "",
      departmentId: "",
      availability: true,
      status: "active",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctors"
        description="Manage doctor profiles, specializations and availability."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-1 h-4 w-4" />
                Add doctor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New doctor</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>First Name</Label>
                  <Input
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Last Name</Label>
                  <Input
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Specialization</Label>
                  <Input
                    value={form.specialization}
                    onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Department</Label>
                  <Select
                    value={form.departmentId}
                    onValueChange={(v) => setForm({ ...form, departmentId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="space-y-0.5 w-full">
                    <div className="text-sm font-medium">Available</div>
                    <div className="text-xs text-muted-foreground">Accepts new appointments</div>
                  </div>
                  <Switch
                    checked={form.availability}
                    onCheckedChange={(v) => setForm({ ...form, availability: v })}
                  />
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="space-y-0.5 w-full">
                    <div className="text-sm font-medium">Status</div>
                    <div className="text-xs text-muted-foreground">Doctor's current status</div>
                  </div>
                  <Select
                    value={form.status}
                    onValueChange={(v) => setForm({ ...form, status: v as "active" | "inactive" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
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
                <TableHead>Name</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.map((d) => {
                const dept = departments.find((x) => x.id === d.departmentId);
                return (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{`${d.firstName} ${d.lastName}`}</TableCell>
                    <TableCell>{d.specialization}</TableCell>
                    <TableCell>{dept?.name ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{d.email}</TableCell>
                    <TableCell>{d.phone}</TableCell>
                    <TableCell>
                      <Switch
                        checked={d.availability}
                        onCheckedChange={(v) => {
                          db.updateDoctor(d.id, { availability: v });
                          toast.success(v ? "Marked available" : "Marked unavailable");
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          db.removeDoctor(d.id);
                          toast.success("Doctor removed");
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {doctors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                    No doctors yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Badge variant="secondary">
        {doctors.filter((d) => d.availability).length} available ·{" "}
        {doctors.filter((d) => !d.availability).length} unavailable
      </Badge>
    </div>
  );
}
