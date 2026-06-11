// client/src/routes/login.tsx

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import iconAsset from "@/assets/icon.png";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: (s.redirect as string) || "/dashboard" }),
  head: () => ({ meta: [{ title: "Sign in - MediCore" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setSubmitting(true);
    try {
      // const u = await login(parsed.data.email, parsed.data.password);
      // // User type may not have a `name` property; fall back to email or generic label
      // const displayName = (u as any)?.name
      //   ? (u as any).name.split(" ")[0]
      //   : (u as any)?.email
      //   ? (u as any).email.split("@")[0]
      //   : "user";
      // toast.success(`Welcome back, ${displayName(u)}`);
      await login(parsed.data.email, parsed.data.password);
      toast.success("Welcome back");
      navigate({ to: search.redirect || "/dashboard", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally { setSubmitting(false); }
  };

  return <AuthShell title="Welcome back" subtitle="Sign in to your MediCore workspace.">
    <Card>
      <CardContent className="p-6">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john@example.com" onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Sign in
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">Create an account</Link>
          </p>
          <div className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
            <div className="font-medium text-foreground">Demo accounts</div>
            <div>receptionist@medicore.com / recep123</div>
          </div>
        </form>
      </CardContent>
    </Card>
  </AuthShell>;
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-linear-to-br from-primary/20 via-info/10 to-background p-10 lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <img src={iconAsset} alt="MediCore" className="h-8 w-8" />
          <span className="font-display text-lg font-semibold">MediCore</span>
        </Link>
        <div className="max-w-md">
          <h2 className="font-display text-3xl font-semibold tracking-tight">A calmer way to run a hospital.</h2>
          <p className="mt-3 text-muted-foreground">From patient registration to pharmacy dispensing, every workflow, one workspace.</p>
        </div>
        <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} MediCore</div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 lg:hidden">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground font-bold">M</div>
            <span className="font-display font-semibold">MediCore</span>
          </Link>
          <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
