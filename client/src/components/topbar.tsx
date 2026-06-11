import { Bell, LogOut, Moon, Sun, User as UserIcon } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { getDisplayName, getUserInitials } from "@/lib/user";
import { useDB, db } from "@/lib/store";
import { toast } from "sonner";

const typeColor: Record<string, string> = {
  info: "bg-info text-info-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  error: "bg-destructive text-destructive-foreground",
};

export function Topbar() {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const notifications = useDB((d) => d.notifications);
  const unread = notifications.filter((n) => !n.read).length;
  const userName = getDisplayName(user);
  const initials = getUserInitials(user);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur">
      <SidebarTrigger />
      <div className="ml-auto flex items-center gap-1.5">
        <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                  {unread}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-2 py-1.5">
              <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
              <Button
                variant="ghost" size="sm" className="h-7 text-xs"
                onClick={() => { db.markAllNotificationsRead(); toast.success("All notifications marked as read"); }}
              >
                Mark all read
              </Button>
            </div>
            <DropdownMenuSeparator />
            <ScrollArea className="h-80">
              {notifications.length === 0 && (
                <div className="px-3 py-8 text-center text-sm text-muted-foreground">No notifications</div>
              )}
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => db.markNotificationRead(n.id)}
                  className={`flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm hover:bg-accent ${n.read ? "opacity-60" : ""}`}
                >
                  <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${typeColor[n.type]}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium leading-tight">{n.title}</span>
                    <span className="block text-xs text-muted-foreground">{n.description}</span>
                    <span className="mt-0.5 block text-[10px] text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</span>
                  </span>
                  {!n.read && <Badge variant="secondary" className="text-[10px]">new</Badge>}
                </button>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="h-7 w-7"><AvatarFallback>{initials}</AvatarFallback></Avatar>
              <span className="hidden text-sm font-medium sm:inline">{userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="text-sm font-medium">{userName}</div>
              <div className="text-xs text-muted-foreground">{user?.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled><UserIcon className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => { logout(); toast.success("Signed out"); navigate({ to: "/login", search: { redirect: "/login" }, replace: true }); }}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
