export type DisplayableUser = {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
} | null | undefined;
export function getDisplayName(user: DisplayableUser): string {
  if (!user) return "user";
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return fullName || user.name || (user.email ? user.email.split("@")[0] : "user");
}
export function getUserInitials(user: DisplayableUser): string {
  return getDisplayName(user)
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";
}