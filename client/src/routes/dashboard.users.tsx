// client/src/routes/dashboard.users.tsx

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

function UsersPage() {
  const { user: current } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

      if (current && current.role !== "admin") {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [current, navigate]);
  useEffect(() => {
    if (!current || current.role !== "admin") return;
    let cancelled = false;
    (async () => {
      try {
        const raw = await api.get<unknown>("/users");
        if (!cancelled) setUsers(unwrapList<User>(raw));
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load users");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [current]);
  if (current && current.role !== "admin") {
    return <div className="text-sm text-muted-foreground">Access denied. Admins only.</div>;
  }

  const byRole = users.reduce<Record<string, number>>((acc, u) => { acc[u.role] = (acc[u.role] ?? 0) + 1; return acc; }, {});

  return (
    <div className="space-y-6">
      <PageHeader title="Users & roles" description="People with access to your MediCore workspace." />

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {(Object.keys(roleColor) as Role[]).map((r) => (
          <Card key={r}><CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{r.replace("_", " ")}</div>
            <div className="mt-1 font-display text-2xl font-semibold">{byRole[r] ?? 0}</div>
          </CardContent></Card>
        ))}
      </div>

      <Card><CardContent className="p-4 overflow-x-auto">
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead></TableRow></TableHeader>
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
                </TableRow>
              );
            })}
            {loading && <TableRow><TableCell colSpan={3} className="py-10 text-center text-muted-foreground">Loading users…</TableCell></TableRow>}
            {!loading && error && <TableRow><TableCell colSpan={3} className="py-10 text-center text-destructive">{error}</TableCell></TableRow>}
            {!loading && !error && users.length === 0 && <TableRow><TableCell colSpan={3} className="py-10 text-center text-muted-foreground">No users yet.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent></Card>

    </div>
  );
}
