// client/src/routes/dashboard.users.tsx
// Admin-only Users & Roles page with full CRUD against the backend
// (`/users` for create/list/update/delete, see backend/src/routes/user.routes.js).

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { useAuth, type Role, type User } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/users")({
  head: () => ({ meta: [{ title: "Users — MediCore" }] }),
  component: UsersPage,
});

function unwrapList<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === "object") {
    const r = raw as { data?: unknown; items?: unknown; results?: unknown; users?: unknown };
    if (Array.isArray(r.data)) return r.data as T[];
    if (Array.isArray(r.items)) return r.items as T[];
    if (Array.isArray(r.results)) return r.results as T[];
    if (Array.isArray(r.users)) return r.users as T[];
    if (r.data && typeof r.data === "object") {
      const d = r.data as { users?: unknown };
      if (Array.isArray(d.users)) return d.users as T[];
    }
  }
  return [];
}


const roleColor: Record<Role, string> = {
  admin: "bg-destructive/15 text-destructive",
  doctor: "bg-primary/15 text-primary",
  nurse: "bg-info/15 text-info",
  receptionist: "bg-success/15 text-success",
  pharmacist: "bg-warning/15 text-warning",
  lab_scientist: "bg-accent text-accent-foreground",
};

const ROLES: Role[] = ["admin", "doctor", "nurse", "receptionist", "pharmacist", "lab_scientist"];

type UserForm = { firstName: string; lastName: string; email: string; password: string; role: Role };
const blank = (): UserForm => ({ firstName: "", lastName: "", email: "", password: "", role: "receptionist" });

function UsersPage() {
  const { user: current } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<UserForm>(blank);
  const [editing, setEditing] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<UserForm>(blank);
  const [busy, setBusy] = useState(false);

  useEffect(() => {

    if (current && current.role !== "admin") navigate({ to: "/dashboard", replace: true });
  }, [current, navigate]);
  async function reload() {
    try {
      const raw = await api.get<unknown>("/users");
      setUsers(unwrapList<User>(raw));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!current || current.role !== "admin") return;
    void reload();
  }, [current]);

  if (current && current.role !== "admin") {
    return <div className="text-sm text-muted-foreground">Access denied. Admins only.</div>;
  }

    const submitCreate = async () => {
    if (!createForm.firstName.trim() || !createForm.lastName.trim() || !createForm.email.trim() || !createForm.password) {
      toast.error("All fields are required"); return;
    }
    setBusy(true);
    try {
      await api.post("/users", createForm);
      toast.success("User created");
      setCreateOpen(false);
      setCreateForm(blank());
      await reload();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed to create user"); }
    finally { setBusy(false); }
  };
  const openEdit = (u: User) => {
    setEditing(u);
    setEditForm({
      firstName: u.firstName ?? (u.name?.split(" ")[0] ?? ""),
      lastName: u.lastName ?? (u.name?.split(" ").slice(1).join(" ") ?? ""),
      email: u.email,
      password: "",
      role: u.role,
    });
  };
  const submitEdit = async () => {
    if (!editing) return;
    const patch: Partial<UserForm> = {
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      email: editForm.email,
      role: editForm.role,
    };
    if (editForm.password) patch.password = editForm.password;
    setBusy(true);
    try {
      await api.put(`/users/${editing.id}`, patch);
      toast.success("User updated");
      setEditing(null);
      await reload();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed to update user"); }
    finally { setBusy(false); }
  };
  const removeUser = async (u: User) => {
    if (u.id === current?.id) { toast.error("You cannot delete your own account"); return; }
    if (!confirm(`Delete ${u.email}? This cannot be undone.`)) return;
    try {
      await api.delete(`/users/${u.id}`);
      toast.success("User deleted");
      await reload();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed to delete user"); }
  };

  const byRole = users.reduce<Record<string, number>>((acc, u) => { acc[u.role] = (acc[u.role] ?? 0) + 1; return acc; }, {});

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & roles"
        description="People with access to your MediCore workspace."
        actions={
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-1 h-4 w-4" />New user</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create user</DialogTitle></DialogHeader>
              <UserFields form={createForm} setForm={setCreateForm} includePassword />
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={submitCreate} disabled={busy}>{busy ? "Saving…" : "Create"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {ROLES.map((r) => (
          <Card key={r}><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{r.replace("_", " ")}</div>
            <div className="mt-1 font-display text-2xl font-semibold">{byRole[r] ?? 0}</div>
          </CardContent></Card>
        ))}
      </div>

      <Card><CardContent className="p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => {
              const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || u.name || u.email || "—";
              const initials = name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
              return (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7"><AvatarFallback>{initials}</AvatarFallback></Avatar>
                      <span className="font-medium">{name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell><Badge variant="secondary" className={`${roleColor[u.role] ?? ""} capitalize`}>{(u.role ?? "—").replace("_", " ")}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-1">
                      <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => openEdit(u)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => removeUser(u)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {loading && <TableRow><TableCell colSpan={4} className="py-10 text-center text-muted-foreground">Loading users…</TableCell></TableRow>}
            {!loading && error && <TableRow><TableCell colSpan={4} className="py-10 text-center text-destructive">{error}</TableCell></TableRow>}
            {!loading && !error && users.length === 0 && <TableRow><TableCell colSpan={4} className="py-10 text-center text-muted-foreground">No users yet.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit user</DialogTitle></DialogHeader>
          <UserFields form={editForm} setForm={setEditForm} includePassword passwordOptional />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={submitEdit} disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

function UserFields({
  form, setForm, includePassword, passwordOptional,
}: {
  form: UserForm;
  setForm: (f: UserForm) => void;
  includePassword?: boolean;
  passwordOptional?: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label>First name</Label>
        <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label>Last name</Label>
        <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label>Email</Label>
        <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      {includePassword && (
        <div className="space-y-1.5 sm:col-span-2">
          <Label>{passwordOptional ? "New password (leave blank to keep current)" : "Password"}</Label>
          <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
      )}
      <div className="space-y-1.5 sm:col-span-2">
        <Label>Role</Label>
        <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as Role })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {ROLES.map((r) => <SelectItem key={r} value={r} className="capitalize">{r.replace("_", " ")}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}