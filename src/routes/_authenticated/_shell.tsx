import { useState } from "react";
import { createFileRoute, Link, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import {
  HeartPulse,
  Home,
  LayoutGrid,
  ShieldCheck,
  Smile,
  Stethoscope,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { profileQuery } from "@/lib/viva/queries";
import { Logo } from "@/components/viva/Logo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/_shell")({
  beforeLoad: async ({ context }) => {
    const profile = await context.queryClient.ensureQueryData(profileQuery(context.user.id));
    if (!profile?.onboarding_completed) throw redirect({ to: "/boas-vindas" });
  },
  component: Shell,
});

const BOTTOM_NAV = [
  { to: "/inicio", label: "Início", icon: Home, center: false },
  { to: "/comunidades", label: "Comunidade", icon: Users, center: false },
  { to: "/checkin", label: "Check-in", icon: Smile, center: true },
  { to: "/desafios", label: "Desafios", icon: Trophy, center: false },
] as const;

const MORE_NAV = [
  {
    to: "/minha-saude",
    label: "Minha saúde",
    icon: ShieldCheck,
    tone: "bg-indigo-soft text-primary",
  },
  {
    to: "/bem-estar",
    label: "Bem-estar",
    icon: HeartPulse,
    tone: "bg-mint-soft text-secondary-foreground",
  },
  { to: "/cuidado", label: "APS", icon: Stethoscope, tone: "bg-peach text-brick" },
  { to: "/perfil", label: "Meu perfil", icon: UserRound, tone: "bg-pink-soft text-brick" },
] as const;

const DESKTOP_NAV = [
  { to: "/inicio", label: "Início" },
  { to: "/checkin", label: "Check-in" },
  { to: "/desafios", label: "Desafios" },
  { to: "/comunidades", label: "Comunidade" },
  { to: "/minha-saude", label: "Minha saúde" },
  { to: "/bem-estar", label: "Bem-estar" },
  { to: "/cuidado", label: "APS" },
] as const;

function Shell() {
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const moreActive = MORE_NAV.some((item) => item.to === pathname);

  return (
    <div className="min-h-screen pb-safe-nav md:pb-12">
      <header className="sticky top-0 z-30 bg-background/70 backdrop-blur-xl md:border-b md:border-white/70 md:bg-card/70">
        <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-3 px-4">
          <Logo to="/inicio" />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
            {DESKTOP_NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-full px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-indigo-soft hover:text-primary"
                activeProps={{ className: "bg-indigo-soft text-primary shadow-soft" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            to="/perfil"
            aria-label="Meu perfil"
            className="relative grid size-11 place-items-center rounded-full bg-primary text-white shadow-blue transition-transform hover:scale-105 active:scale-95"
            activeProps={{ className: "ring-2 ring-ring ring-offset-2 ring-offset-background" }}
          >
            <UserRound className="size-5" />
            <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-background bg-mint" />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-5 md:py-8">
        <Outlet />
      </main>

      <nav
        aria-label="Navegação principal no celular"
        className="fixed inset-x-3 bottom-3 z-40 md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="mx-auto grid max-w-md grid-cols-5 items-end gap-1 rounded-[2rem] border border-white/80 bg-card/90 px-2 pb-2 pt-2 shadow-lift backdrop-blur-xl">
          {BOTTOM_NAV.map((item) =>
            item.center ? (
              <li key={item.to} className="flex justify-center">
                <Link
                  to={item.to}
                  className="group flex flex-col items-center gap-1 text-[10px] font-bold text-muted-foreground"
                  activeProps={{ className: "text-primary" }}
                >
                  <span className="-mt-8 grid size-14 place-items-center rounded-full bg-primary text-white shadow-blue ring-4 ring-background transition-transform group-active:scale-95">
                    <item.icon className="size-6" aria-hidden />
                  </span>
                  {item.label}
                </Link>
              </li>
            ) : (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1.5 text-[10px] font-bold text-muted-foreground"
                  activeProps={{ className: "text-primary [&_.nav-dot]:bg-indigo-soft" }}
                >
                  <span className="nav-dot grid size-9 place-items-center rounded-xl transition-colors">
                    <item.icon className="size-[1.35rem]" aria-hidden />
                  </span>
                  {item.label}
                </Link>
              </li>
            ),
          )}
          <li>
            <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Abrir mais opções"
                  className={cn(
                    "flex min-h-14 w-full flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1.5 text-[10px] font-bold",
                    moreActive ? "bg-indigo-soft text-primary" : "text-muted-foreground",
                  )}
                >
                  <span className="grid size-9 place-items-center rounded-xl">
                    <LayoutGrid className="size-[1.35rem]" aria-hidden />
                  </span>
                  Mais
                </button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="rounded-t-[2rem] border-white/60 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
              >
                <SheetHeader className="text-left">
                  <SheetTitle className="text-2xl font-extrabold text-primary">
                    Mais opções
                  </SheetTitle>
                  <SheetDescription>Escolha para onde quer ir.</SheetDescription>
                </SheetHeader>
                <nav className="mt-4 grid gap-2" aria-label="Mais opções">
                  {MORE_NAV.map((item) => (
                    <SheetClose key={item.to} asChild>
                      <Link
                        to={item.to}
                        className="flex min-h-14 items-center gap-3 rounded-2xl border border-border bg-card px-3 text-base font-bold text-foreground transition-colors hover:border-primary/30 hover:bg-indigo-soft/60"
                        activeProps={{ className: "border-primary/40 bg-indigo-soft text-primary" }}
                      >
                        <span
                          className={cn("grid size-10 place-items-center rounded-xl", item.tone)}
                        >
                          <item.icon className="size-5" aria-hidden />
                        </span>
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </li>
        </ul>
      </nav>
    </div>
  );
}
