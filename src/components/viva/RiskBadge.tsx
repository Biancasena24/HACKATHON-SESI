import { Activity, ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { riskRule, type RiskClassification } from "@/lib/viva/types";

const SIZES = {
  sm: { pill: "px-2.5 py-1 text-xs", icon: "size-3.5" },
  md: { pill: "px-3 py-1.5 text-sm", icon: "size-4" },
  lg: { pill: "px-4 py-2 text-base", icon: "size-5" },
} as const;

export function RiskBadge({
  risk,
  size = "md",
  className,
}: {
  risk: RiskClassification;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const rule = riskRule(risk);
  const Icon = risk === 4 ? ShieldAlert : risk === 3 ? Activity : ShieldCheck;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-bold",
        rule.badgeClass,
        SIZES[size].pill,
        className,
      )}
    >
      <Icon className={SIZES[size].icon} aria-hidden />
      Risco {risk} · {rule.label}
    </span>
  );
}

export function RiskStatusCard({
  risk,
  nextReturn,
  className,
}: {
  risk: RiskClassification;
  nextReturn?: string | undefined;
  className?: string;
}) {
  const rule = riskRule(risk);
  const Icon = risk === 4 ? ShieldAlert : risk === 3 ? Activity : ShieldCheck;
  return (
    <section className={cn("rounded-3xl border-2 p-5 sm:p-6", rule.softClass, className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="grid size-14 shrink-0 place-items-center rounded-2xl"
            style={{ backgroundColor: rule.color }}
          >
            <Icon
              className={cn("size-7", risk <= 2 ? "text-secondary-foreground" : "text-white")}
              aria-hidden
            />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">
              Classificação de risco APS
            </p>
            <p className="text-xl font-extrabold sm:text-2xl">
              Risco {risk} · {rule.label}
            </p>
          </div>
        </div>
        <RiskBadge risk={risk} size="lg" />
      </div>

      <p className="mt-4 text-base font-semibold">{rule.description}</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-2xl bg-card/70 p-3">
          <p className="text-xs font-bold uppercase tracking-wider opacity-70">Quando voltar</p>
          <p className="font-extrabold">{rule.returnWindow}</p>
          <p className="text-sm opacity-90">{rule.returnDetail}</p>
        </div>
        {nextReturn && (
          <div className="rounded-2xl bg-card/70 p-3">
            <p className="text-xs font-bold uppercase tracking-wider opacity-70">
              Seu próximo cuidado
            </p>
            <p className="font-extrabold">{nextReturn}</p>
            <p className="text-sm opacity-90">A equipe da UBS acompanha você nesse retorno.</p>
          </div>
        )}
      </div>
    </section>
  );
}
