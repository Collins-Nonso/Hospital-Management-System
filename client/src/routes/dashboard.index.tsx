import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users, Stethoscope, CalendarClock, Receipt, ArrowUpRight,
  AlertTriangle, CheckCircle2, Info,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDB } from "@/lib/store";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Dashboard — MediCore" }] }),
  component: DashboardHome,
});

function DashboardHome() {
  const { user } = useAuth();
  const db = useDB((d) => d);

  const today = new Date().toISOString().slice(0, 10);
  const todays = (db.appointments ?? []).filter((a) => a.date === today && a.status !== "cancelled");
  const unpaid = (db.billings ?? []).filter((b) => b.paymentStatus === "pending");
  const paid = (db.billings ?? []).filter((b) => b.paymentStatus === "paid");
  const pendingLabs = (db.labRequests ?? []).filter((r) => r.status === "pending");

  const stats = [
    { label: "Patients", value: db.patients.length, icon: Users, to: "/dashboard/patients", color: "text-primary" },
    { label: "Doctors", value: db.doctors.length, icon: Stethoscope, to: "/dashboard/doctors", color: "text-info" },
    { label: "Appointments today", value: todays.length, icon: CalendarClock, to: "/dashboard/appointments", color: "text-success" },
    { label: "Unpaid invoices", value: unpaid.length, icon: Receipt, to: "/dashboard/billing", color: "text-warning" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${(user?.firstName || user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "back")}`}
        description="Here's what's happening across your hospital today."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="block">
            <Card className="transition hover:border-primary/40 hover:shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">{s.label}</div>
                    <div className="mt-1 font-display text-3xl font-semibold">{s.value}</div>
                  </div>
                  <div className={`grid h-10 w-10 place-items-center rounded-lg bg-muted ${s.color}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 inline-flex items-center text-xs text-muted-foreground">
                  View <ArrowUpRight className="ml-0.5 h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Today's appointments</h2>
              <Link to="/dashboard/appointments" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            <div className="divide-y">
              {todays.length === 0 && <div className="py-8 text-center text-sm text-muted-foreground">Nothing scheduled today.</div>}
              {todays.map((a) => {
                const p = db.patients.find((x) => x.id === a.patientId);
                const doc = db.doctors.find((x) => x.id === a.doctorId);
                return (
                  <div key={a.id} className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium">{p ? `${p.firstName} ${p.lastName}` : "—"}</div>
                      <div className="text-xs text-muted-foreground">{doc ? `${doc.firstName} ${doc.lastName}` : "—"} · {a.time}</div>
                    </div>
                    <Badge variant="secondary" className="capitalize">{a.status}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h2 className="mb-3 font-display text-lg font-semibold">Attention needed</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-7 w-7 place-items-center rounded-md bg-warning/15 text-warning"><AlertTriangle className="h-4 w-4" /></span>
                <div>
                  <div className="font-medium">{pendingLabs.length} lab request(s) pending</div>
                  <Link to="/dashboard/lab" className="text-xs text-primary hover:underline">Review</Link>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-7 w-7 place-items-center rounded-md bg-destructive/15 text-destructive"><Receipt className="h-4 w-4" /></span>
                <div>
                  <div className="font-medium">{unpaid.length} unpaid invoice(s)</div>
                  <Link to="/dashboard/billing" className="text-xs text-primary hover:underline">Open billing</Link>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-7 w-7 place-items-center rounded-md bg-info/15 text-info"><Info className="h-4 w-4" /></span>
                <div>
                  <div className="font-medium">{db.notifications.filter((n) => !n.read).length} unread notifications</div>
                  <div className="text-xs text-muted-foreground">Check the bell in the top bar.</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-7 w-7 place-items-center rounded-md bg-success/15 text-success"><CheckCircle2 className="h-4 w-4" /></span>
                <div>
                  <div className="font-medium">{paid.length} invoice(s) paid</div>
                  <div className="text-xs text-muted-foreground">Nice work today.</div>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
