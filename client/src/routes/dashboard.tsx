// client/src/routes/dashboard.tsx

import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Topbar } from "@/components/topbar";
import { useAuth, type Role } from "@/lib/auth";
import { getToken } from "@/lib/api";
import { reloadAll } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

// Route → roles allowed (mirrors AppSidebar). Lab Scientist is intentionally
// limited to the Lab page — and within that page only the "New lab request"
// action is enabled (see dashboard.lab.tsx).
const ROUTE_ROLES: Array<{ prefix: string; roles: Role[] }> = [
  { prefix: "/dashboard/users", roles: ["admin"] },
  { prefix: "/dashboard/departments", roles: ["admin"] },
  { prefix: "/dashboard/patients", roles: ["admin", "doctor", "nurse", "receptionist"] },
  { prefix: "/dashboard/doctors", roles: ["admin", "receptionist", "nurse"] },
  { prefix: "/dashboard/appointments", roles: ["admin", "doctor", "nurse", "receptionist"] },
  { prefix: "/dashboard/consultations", roles: ["admin", "doctor", "nurse"] },
  { prefix: "/dashboard/records", roles: ["admin", "doctor", "nurse"] },
  { prefix: "/dashboard/prescriptions", roles: ["admin", "doctor", "pharmacist"] },
  { prefix: "/dashboard/lab", roles: ["admin", "doctor", "lab_scientist", "nurse"] },
  { prefix: "/dashboard/pharmacy", roles: ["admin", "pharmacist", "doctor"] },
  { prefix: "/dashboard/billing", roles: ["admin", "receptionist"] },
];

function DashboardLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isAuthenticated = Boolean(user && getToken());

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate({ to: "/login", search: { redirect: "/dashboard" }, replace: true });
  }, [loading, isAuthenticated, navigate]);

  // Forbid direct URL access to pages outside the user's role permissions.
  // For lab_scientist this means only /dashboard and /dashboard/lab.
  const match = ROUTE_ROLES.find((r) => pathname.startsWith(r.prefix));
  const forbidden = Boolean(user && match && !match.roles.includes(user.role));

  // Real-time polling: refresh DB every 15s and on tab focus while authenticated.
  useEffect(() => {
    if (!isAuthenticated) return;
    const tick = () => { void reloadAll(); };
    const id = window.setInterval(tick, 15000);
    const onFocus = () => { if (document.visibilityState === "visible") tick(); };
    document.addEventListener("visibilitychange", onFocus);
    return () => { window.clearInterval(id); document.removeEventListener("visibilitychange", onFocus); };
  }, [isAuthenticated]);

  if (loading || !isAuthenticated) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Loading workspace…</div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-secondary/30">
        <AppSidebar />
        <SidebarInset className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="flex-1 p-4 md:p-6">
            {forbidden ? (
              <div className="grid place-items-center rounded-md border bg-card p-10 text-center text-sm text-muted-foreground">
                Access denied - permission is required to view this page.
              </div>
            ) : (
              <Outlet />
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
