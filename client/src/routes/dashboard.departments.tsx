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
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { useDB, db, type Department } from "@/lib/store";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/departments")({
  head: () => ({ meta: [{ title: "Departments — MediCore" }] }),
  component: DepartmentsPage,
});

type Form = { name: string; description: string; status: "active" | "inactive" };
const blank = (): Form => ({ name: "", description: "", status: "active" });
const fromDept = (d: Department): Form => ({
  name: d.name, description: d.description ?? "", status: d.status ?? "active",
});

function DepartmentsPage() {
  const departments = useDB((d) => d.departments);
  const doctors = useDB((d) => d.doctors);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(blank);
  const [editing, setEditing] = useState<Department | null>(null);
  const [editForm, setEditForm] = useState<Form>(blank);
  const openEdit = (d: Department) => { setEditing(d); setEditForm(fromDept(d)); };
  const submitEdit = async () => {
    if (!editing) return;
    if (!editForm.name.trim()) { toast.error("Name is required"); return; }
    try {
      await db.updateDepartment(editing.id, editForm);
      toast.success("Department updated");
      setEditing(null);
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments"
        description="Organize the hospital into specialties."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-1 h-4 w-4" />New department</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create department</DialogTitle></DialogHeader>
              <DeptForm form={form} setForm={setForm} />
              <DialogFooter>
               <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button
                  onClick={async () => {
                    if (!form.name.trim()) { toast.error("Name is required"); return; }
                    try {
                      await db.addDepartment(form);
                      toast.success("Department created");
                      setOpen(false);
                      setForm(blank());
                    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
                  }}
                >
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((d) => {
          const count = doctors.filter((x) => x.departmentId === d.id).length;
          return (
            <Card key={d.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-semibold">{d.name}</h3>
                      <Badge variant={d.status === "active" ? "default" : "secondary"} className="capitalize">
                        {d.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{d.description || "No description"}</p>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => openEdit(d)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete"
                        onClick={async () => {
                          try { await db.removeDepartment(d.id); toast.success("Department removed"); }
                          catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between border-t pt-3 text-sm">
                  <div className="text-muted-foreground">
                    {count} doctor{count === 1 ? "" : "s"}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    Active
                    <Switch
                      disabled={!isAdmin}
                      onCheckedChange={async (v) => {
                        try {
                          await db.updateDepartment(d.id, { status: v ? "active" : "inactive" });
                          toast.success("Status updated");
                        } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
            <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit department</DialogTitle></DialogHeader>
          <DeptForm form={editForm} setForm={setEditForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={submitEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DeptForm({ form, setForm }: { form: Form; setForm: (f: Form) => void }) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label>Name</Label>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label>Description</Label>
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div className="flex items-center justify-between rounded-md border p-3">
        <div className="space-y-0.5 w-full">
          <div className="text-sm font-medium">Status</div>
          <div className="text-xs text-muted-foreground">Department's current status</div>
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