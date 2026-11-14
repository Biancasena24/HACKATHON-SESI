import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  HeartHandshake,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import type { Dependent } from "@/lib/viva/types";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function DependentsSection({ dependents }: { dependents: Dependent[] }) {
  const attention = dependents.filter((d) => d.healthStatus === "Atenção").length;

  return (
    <section id="familia" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue">Visão da família</p>
          <h2 className="text-2xl font-extrabold text-primary">Quem você ama também se cuida</h2>
          <p className="text-muted-foreground">
            Acompanhe a saúde de quem está perto de você. É mais um motivo para se cuidar.
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1.5 text-sm font-bold",
            attention > 0 ? "bg-brick text-white" : "bg-success text-success-foreground",
          )}
        >
          {attention > 0 ? `${attention} atenção` : "Todos em dia"}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {dependents.map((dependent) => {
          const isAttention = dependent.healthStatus === "Atenção";
          return (
            <article key={dependent.id} className="card-surface p-5">
              <div className="flex items-start gap-4">
                <span
                  className={cn(
                    "grid size-14 shrink-0 place-items-center rounded-full font-display text-xl font-extrabold",
                    isAttention
                      ? "bg-brick-soft text-brick"
                      : "bg-success-soft text-secondary-foreground",
                  )}
                  aria-hidden
                >
                  {initials(dependent.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="rounded-full bg-blue-soft px-2.5 py-1 text-xs font-bold text-blue-deep">
                    {dependent.relation}
                  </span>
                  <h3 className="mt-2 text-lg font-extrabold text-primary">{dependent.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {dependent.age ? `${dependent.age} anos` : "Acompanhamento familiar"}
                  </p>
                </div>
              </div>

              <div
                className={cn(
                  "mt-4 flex items-center gap-2 rounded-2xl p-3 text-sm font-bold",
                  isAttention
                    ? "bg-brick-soft text-brick"
                    : "bg-success-soft text-secondary-foreground",
                )}
              >
                {isAttention ? (
                  <TriangleAlert className="size-5 shrink-0" aria-hidden />
                ) : (
                  <CheckCircle2 className="size-5 shrink-0" aria-hidden />
                )}
                {dependent.healthStatus}
              </div>

              {dependent.nextCare && (
                <p className="mt-3 flex items-start gap-2 text-sm text-foreground">
                  <CalendarCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  {dependent.nextCare}
                </p>
              )}
            </article>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 rounded-3xl bg-gradient-blue-soft p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-blue text-white shadow-blue">
            <HeartHandshake className="size-6" aria-hidden />
          </span>
          <div>
            <p className="font-extrabold text-blue-deep">Cuidar de quem você ama começa por você</p>
            <p className="text-sm text-foreground/80">
              Quando você faz seu check-in e mantém a prevenção em dia, sua família sente a
              diferença.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/cuidado"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-5 font-bold text-primary-foreground shadow-soft transition-colors hover:bg-primary/90"
          >
            <UserRound className="size-5" aria-hidden /> Cuidados da família
          </Link>
          <Link
            to="/checkin"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border-2 border-blue/30 bg-card px-5 font-bold text-blue-deep transition-colors hover:border-blue/50 hover:bg-blue-soft"
          >
            Fazer check-in <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
