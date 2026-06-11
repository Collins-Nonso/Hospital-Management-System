// client/src/routes/register.tsx

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useAuth, type Role } from "@/lib/auth";
import { useAuth, type Role } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { AuthShell } from "./login";

const schema = z.object({
  firstName: z.string().trim().min(2, "First name is too short").max(100),
  lastName: z.string().trim().min(2, "Last name is too short").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
  role: z.enum(["admin", "doctor", "nurse", "receptionist", "pharmacist", "lab_scientist"]),
});

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account - MediCore" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("receptionist");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
   const parsed = schema.safeParse({ firstName, lastName, email, password, role });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setSubmitting(true);
    try {
      await register(parsed.data.firstName, parsed.data.lastName, parsed.data.email, parsed.data.password, parsed.data.role);
      toast.success(`Welcome, ${parsed.data.firstName}`);
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally { setSubmitting(false); }
  };

  return <AuthShell title="Create your account" subtitle="Get your hospital workspace running in minutes.">
    <Card>
      <CardContent className="p-6">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="John" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Doe" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="john@example.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin" disabled>Admin</SelectItem>
                <SelectItem value="doctor" disabled>Doctor</SelectItem>
                <SelectItem value="nurse" disabled>Nurse</SelectItem>
                <SelectItem value="receptionist">Receptionist</SelectItem>
                <SelectItem value="pharmacist" disabled>Pharmacist</SelectItem>
                <SelectItem value="lab_scientist" disabled>Lab Scientist</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create account
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-primary hover:underline">Sign in</a>
          </p>
        </form>
      </CardContent>
    </Card>
  </AuthShell>;
}
