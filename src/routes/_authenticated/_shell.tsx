import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { HeartPulse, Home, Smile, Stethoscope, Trophy, UserRound } from "lucide-react";
import { profileQuery } from "@/lib/viva/queries";
import { Logo } from "@/components/viva/Logo";

export const Route = createFileRoute("/_authenticated/_shell")({
  beforeLoad: async ({ context }) => {
    const profile = await context.queryClient.ensureQueryData(profileQuery(context.user.id));
    if (!profile?.onboarding_completed) throw redirect({ to: "/boas-vindas" });
  },
  component: Shell,
});

const NAV = [
  { to: "/inicio", label: "Início", icon: Home },
  { to: "/checkin", label: "Check-in", icon: Smile },
  { to: "/desafios", label: "Desafios", icon: Trophy },
  { to: "/bem-estar", label: "Bem-estar", icon: HeartPulse },
  { to: "/cuidado", label: "SUS", icon: Stethoscope },
] as const;

function Shell() {
  return (
    <div className="min-h-screen pb-safe-nav md:pb-10">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Logo to="/inicio" />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
                activeProps={{ className: "bg-secondary text-primary" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <Link
            to="/perfil"
            aria-label="Meu perfil"
            className="grid size-11 place-items-center rounded-full bg-secondary text-primary hover:bg-sky-soft"
            activeProps={{ className: "ring-2 ring-sky" }}
          >
            <UserRound className="size-5" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>

      <nav
        aria-label="Navegação"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-5">
          {NAV.map((n) => (
            <li key={n.to}>
              <Link
                to={n.to}
                className="flex flex-col items-center gap-1 py-2.5 text-xs font-semibold text-muted-foreground"
                activeProps={{ className: "text-primary [&_.nav-dot]:bg-sun" }}
              >
                <span className="nav-dot grid h-8 w-12 place-items-center rounded-full transition-colors">
                  <n.icon className="size-5" />
                </span>
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
