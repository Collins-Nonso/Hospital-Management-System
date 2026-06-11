// client/src/components/app-sidebar.tsx

import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, Stethoscope, Building2, CalendarClock,
  ClipboardList, FileHeart, FlaskConical, Pill, Store, Receipt, ShieldCheck,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth";
import iconAsset from "@/assets/icon.png";

import type { Role } from "@/lib/auth";
interface NavItem { title: string; url: string; icon: typeof LayoutDashboard; roles?: Role[] }
interface NavGroup { label: string; items: NavItem[]; roles?: Role[] }
// roles undefined = visible to everyone authenticated.
const groups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Clinical",
    items: [
      { title: "Patients", url: "/dashboard/patients", icon: Users, roles: ["admin", "doctor", "nurse", "receptionist"] },
      { title: "Doctors", url: "/dashboard/doctors", icon: Stethoscope, roles: ["admin", "receptionist", "nurse"] },
      { title: "Departments", url: "/dashboard/departments", icon: Building2, roles: ["admin"] },
      { title: "Appointments", url: "/dashboard/appointments", icon: CalendarClock, roles: ["admin", "doctor", "nurse", "receptionist"] },
    ],
  },
  {
    label: "Treatment",
    items: [
      { title: "Consultations", url: "/dashboard/consultations", icon: ClipboardList, roles: ["admin", "doctor", "nurse"] },
      { title: "Medical Records", url: "/dashboard/records", icon: FileHeart, roles: ["admin", "doctor", "nurse"] },
      { title: "Prescriptions", url: "/dashboard/prescriptions", icon: Pill, roles: ["admin", "doctor", "pharmacist"] },
    ],
  },
  {
    label: "Services",
    items: [
      { title: "Laboratory", url: "/dashboard/lab", icon: FlaskConical, roles: ["admin", "doctor", "lab_scientist", "nurse"] },
      { title: "Pharmacy", url: "/dashboard/pharmacy", icon: Store, roles: ["admin", "pharmacist", "doctor"] },
      { title: "Billing", url: "/dashboard/billing", icon: Receipt, roles: ["admin", "receptionist"] },
    ],
  },
  {
    label: "Admin",
    roles: ["admin"],
    items: [
      { title: "Users & Roles", url: "/dashboard/users", icon: ShieldCheck, roles: ["admin"] },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { user } = useAuth();

  const isActive = (url: string) =>
    url === "/dashboard" ? pathname === url : pathname.startsWith(url);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <Link to="/" className="flex items-center gap-2 px-2 py-3">
          <img src={iconAsset} alt="MediCore" className="h-8 w-8" />
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-display text-base font-semibold">MediCore</div>
              <div className="text-[11px] text-muted-foreground">Hospital Management System</div>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {groups
          .filter((g) => !g.roles || (user && g.roles.includes(user.role)))
          .map((g) => {
            const visibleItems = g.items.filter((it) => !it.roles || (user && it.roles.includes(user.role)));
            if (visibleItems.length === 0) return null;
            return (
              <SidebarGroup key={g.label}>
                <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {visibleItems.map((item) => (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                          <Link to={item.url} className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            {!collapsed && <span>{item.title}</span>}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          })}
      </SidebarContent>

      <SidebarFooter className="border-t">
        {!collapsed && user && (
          <div className="px-2 py-2 text-xs">
            <div className="font-medium truncate">
              {[user.firstName, user.lastName].filter(Boolean).join(" ") || user.name || user.email}
            </div>
            <div className="text-muted-foreground capitalize">{(user.role ?? "").replace("_", " ")}</div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
