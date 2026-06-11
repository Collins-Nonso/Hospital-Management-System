import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity, CalendarClock, FlaskConical, Pill, Receipt, ShieldCheck,
  Stethoscope, Users, ArrowRight, Moon, Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import iconAsset from "@/assets/icon.png";
import logoAsset from "@/assets/logo.png";
import { getToken } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Welcome to MediCore - A Modern Hospital Management Platform" },
      { name: "description", content: "An end-to-end platform for patient care, appointments, lab, pharmacy and billing — built for modern hospitals." },
      { property: "og:title", content: "MediCore Modern Hospital Management" },
      { property: "og:description", content: "An end-to-end platform for patient care, appointments, lab, pharmacy and billing." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Users, title: "Patient Management", text: "Profiles, history, allergies and emergency contacts in one place." },
  { icon: CalendarClock, title: "Smart Appointments", text: "Booking with double-booking and past-date protection." },
  { icon: Stethoscope, title: "Consultations & Records", text: "Capture symptoms, diagnosis and treatment plans." },
  { icon: FlaskConical, title: "Lab Workflow", text: "Requests, results and duplicate-upload prevention." },
  { icon: Pill, title: "Prescriptions & Pharmacy", text: "Dispense with tracking and double-dispense protection." },
  { icon: Receipt, title: "Billing & Payments", text: "Invoices, item-level pricing and payment status." },
];

function Landing() {
  const { theme, toggle } = useTheme();
  const { user, loading } = useAuth();
  const isAuthenticated = !loading && Boolean(user && getToken());

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={iconAsset} alt="MediCore logo" className="h-9 w-9" />
            <span className="font-display text-lg font-semibold">MediCore</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#features" className="text-muted-foreground hover:text-foreground">Features</a>
            <a href="#modules" className="text-muted-foreground hover:text-foreground">Modules</a>
            <a href="#security" className="text-muted-foreground hover:text-foreground">Security</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            {isAuthenticated ? (
              <Button asChild><Link to="/dashboard">Open dashboard</Link></Button>
            ) : (
              <>
                <Button variant="ghost" asChild><a href="/login">Sign in</a></Button>
                <Button asChild><a href="/register">Get started</a></Button>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{ background: "radial-gradient(60% 60% at 50% 0%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 70%)" }}
        />
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              Built for modern hospital teams
            </div>
            <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              Run your hospital with{" "}
              <span className="bg-linear-to-r from-primary to-info bg-clip-text text-transparent">calm, modern software</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
              MediCore unifies patients, doctors, appointments, lab, pharmacy and billing into one
              cohesive workspace, with role-based access for every team member.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <Button size="lg" asChild>
                <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                  {isAuthenticated ? "Go to dashboard" : "Create your account"} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild><a href="/login">Sign in</a></Button>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Demo accounts: <code className="rounded bg-muted px-1.5 py-0.5">receptionist@medicore.com / recep123</code>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Everything a hospital needs</h2>
          <p className="mt-2 text-muted-foreground">Each module is designed to fit clinical workflows: fast to use, easy to learn.</p>
        </div>
        <div id="modules" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="group border-border/70 transition hover:border-primary/40 hover:shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="security" className="border-t bg-secondary/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-sm text-primary">
              <ShieldCheck className="h-4 w-4" /> Security first
            </div>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Role-based access for every team member
            </h2>
            <p className="mt-3 text-muted-foreground">
              Admins, doctors, nurses, receptionists, pharmacists and lab scientists get a tailored
              experience without ever seeing what they shouldn't.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["Admin", "Doctor", "Nurse", "Receptionist", "Pharmacist", "Lab Scientist"].map((r) => (
              <div key={r} className="rounded-xl border bg-card p-4">
                <Activity className="h-4 w-4 text-primary" />
                <div className="mt-2 font-medium">{r}</div>
                <div className="text-xs text-muted-foreground">Scoped permissions</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} MediCore. All rights reserved.</div>
          <div className="flex items-center gap-1">Designed with ❤️ by <a href="https://github.com/Collins-Nonso" className="hover:text-foreground" target="_blank" rel="noopener noreferrer">Collins-Nonso</a></div>
          <div className="flex items-center gap-4">
            <a href="/login" className="hover:text-foreground">Sign in</a>
            <a href="/register" className="hover:text-foreground">Register</a>
          </div>
        </div>
      </footer> */}

            <footer className="border-t bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-10 flex items-center gap-3">
            <img src={logoAsset} alt="MediCore — Unifying Healthcare, Streamlining Care" className="h-12 w-auto dark:brightness-0 dark:invert" />
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <h3 className="mb-3 font-display text-sm font-semibold">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground">Features</a></li>
                <li><a href="#modules" className="hover:text-foreground">Modules</a></li>
                <li><a href="#security" className="hover:text-foreground">Security</a></li>
                <li><Link to="/register" className="hover:text-foreground">Get started</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-display text-sm font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About us</a></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
                <li><a href="#" className="hover:text-foreground">Press</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-display text-sm font-semibold">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground">Help center</a></li>
                <li><a href="#" className="hover:text-foreground">Privacy policy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms of service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-sm text-muted-foreground md:flex-row">
            <div>© {new Date().getFullYear()} MediCore. All rights reserved.</div>
            <div className="flex items-center gap-1">Designed with ❤️ by <a href="https://github.com/Collins-Nonso" className="hover:text-foreground" target="_blank" rel="noopener noreferrer">Collins-Nonso</a></div>
            <div className="flex items-center gap-4">
              <a href="/login" className="hover:text-foreground">Sign in</a>
              <a href="/register" className="hover:text-foreground">Register</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
