import { CheckCircle2, Clock3, PiggyBank, Stethoscope, TrendingUp } from "lucide-react";
import { savingsMetrics, type SavingsMetric } from "@/lib/viva/mockData";
import type { PreventiveInsights } from "@/lib/viva/types";
import { cn } from "@/lib/utils";

const METRIC_ICON: Record<SavingsMetric["id"], typeof Stethoscope> = {
  visits: Stethoscope,
  money: PiggyBank,
  queue: Clock3,
  health: TrendingUp,
};

const METRIC_TONE: Record<SavingsMetric["id"], string> = {
  visits: "bg-secondary text-secondary-foreground",
  money: "bg-peach text-brick",
  queue: "bg-sky-soft text-primary",
  health: "bg-success-soft text-secondary-foreground",
};

export function SavingsReport({ insights }: { insights: PreventiveInsights }) {
  return (
    <section id="poupanca" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue">Relatório pessoal</p>
          <h2 className="text-2xl font-extrabold text-primary">Sua poupança em saúde</h2>
          <p className="text-muted-foreground">
            O que você está ganhando ao se cuidar antes de precisar de urgência.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-lift">
          <div
            aria-hidden
            className="absolute -right-10 -top-10 size-40 rounded-full bg-sun-orb opacity-80"
          />
          <div className="relative">
            <span className="grid size-14 place-items-center rounded-2xl bg-sun text-sun-foreground shadow-soft">
              <PiggyBank className="size-7" aria-hidden />
            </span>
            <p className="mt-4 text-sm font-bold uppercase tracking-wider opacity-85">
              No último ano você poupou
            </p>
            <p className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
              {insights.savings}
            </p>
            <p className="mt-2 max-w-md text-base opacity-90">
              {insights.avoidedVisits ?? 0} idas ao pronto-socorro evitadas e{" "}
              {insights.avoidedQueueHours ?? 0} horas de fila que você não precisou enfrentar.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1.5 text-sm font-bold">
              <TrendingUp className="size-4" aria-hidden />
              Sua saúde melhorou {insights.improvedPercent ?? 0}%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {savingsMetrics.map((metric) => {
            const Icon = METRIC_ICON[metric.id];
            return (
              <article key={metric.id} className="card-surface p-4">
                <span
                  className={cn(
                    "grid size-11 place-items-center rounded-2xl",
                    METRIC_TONE[metric.id],
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <p className="mt-3 font-display text-2xl font-extrabold text-primary">
                  {metric.value}
                </p>
                <p className="text-sm font-bold text-foreground">{metric.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{metric.detail}</p>
              </article>
            );
          })}
        </div>
      </div>

      <div className="card-surface p-5">
        <h3 className="text-lg font-extrabold text-primary">O que você está evitando</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {insights.futureRisksAvoided.map((risk) => (
            <li
              key={risk}
              className="flex items-start gap-2 rounded-2xl bg-success-soft/70 p-3 text-sm font-semibold text-foreground"
            >
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
              {risk}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Estimativa educativa baseada nos seus registros de prevenção. Não é cobrança, diagnóstico
          nem promessa de resultado.
        </p>
      </div>
    </section>
  );
}
