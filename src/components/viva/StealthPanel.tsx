import { useState } from "react";
import {
  CheckCircle2,
  Eye,
  FlaskConical,
  HardHat,
  Lock,
  ShieldCheck,
  Smile,
  Stethoscope,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { lastStealthCheck, stealthInsights, stealthSources } from "@/lib/viva/mockData";
import type { StealthSource } from "@/lib/viva/mockData";
import { cn } from "@/lib/utils";

const SOURCE_ICON: Record<StealthSource["icon"], LucideIcon> = {
  stethoscope: Stethoscope,
  tooth: Smile,
  flask: FlaskConical,
  hardhat: HardHat,
};

const TONE = {
  attention: {
    box: "border-brick/30 bg-brick-soft",
    icon: "text-brick",
    Icon: TriangleAlert,
  },
  info: {
    box: "border-blue/25 bg-blue-soft",
    icon: "text-blue",
    Icon: Eye,
  },
  good: {
    box: "border-success/30 bg-success-soft",
    icon: "text-success",
    Icon: CheckCircle2,
  },
} as const;

export function StealthPanel({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(true);

  return (
    <section id="monitoramento" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue">
            Monitoramento contínuo
          </p>
          <h2 className="flex items-center gap-2 text-2xl font-extrabold text-primary">
            <Eye className="size-6" aria-hidden /> Análise Stealth
          </h2>
          <p className="text-muted-foreground">
            Um painel discreto que cruza seus registros de cuidado para avisar você com carinho,
            antes que algo vire um problema maior.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm font-bold text-secondary-foreground">
          <ShieldCheck className="size-4" aria-hidden /> Só você vê
        </span>
      </div>

      <div className="card-surface overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-white/15 bg-gradient-blue p-5 text-white sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sun text-sun-foreground">
              <Eye className="size-6" aria-hidden />
            </span>
            <div>
              <p className="font-extrabold">Monitoramento suave</p>
              <p className="text-sm opacity-85">
                {active
                  ? "Ativo. Verificamos seus registros de tempos em tempos e só mostramos o que ajuda."
                  : "Pausado. Você continua vendo seus registros, mas não recebe novos alertas."}
              </p>
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-ink-foreground/10 px-4 py-3">
            <span className="text-sm font-bold">{active ? "Ativo" : "Pausado"}</span>
            <Switch
              checked={active}
              onCheckedChange={setActive}
              aria-label="Ativar ou pausar o monitoramento contínuo"
              className="h-7 w-12 data-[state=checked]:bg-sun data-[state=unchecked]:bg-ink-foreground/30 [&>span]:size-6 [&>span]:data-[state=checked]:translate-x-5"
            />
          </label>
        </div>

        <div className="p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stealthSources.map((source) => {
              const Icon = SOURCE_ICON[source.icon];
              const attention = source.status === "Atenção";
              return (
                <div key={source.id} className="rounded-2xl bg-muted p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="grid size-10 place-items-center rounded-xl bg-card text-primary">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-bold",
                        attention ? "bg-brick text-white" : "bg-success text-success-foreground",
                      )}
                    >
                      {source.status}
                    </span>
                  </div>
                  <p className="mt-2 font-bold text-primary">{source.label}</p>
                  <p className="text-xs text-muted-foreground">Último: {source.lastCheck}</p>
                </div>
              );
            })}
          </div>

          <ul className={cn("mt-5 grid gap-3", compact ? "" : "lg:grid-cols-3")}>
            {stealthInsights.map((insight) => {
              const tone = TONE[insight.tone];
              const ToneIcon = tone.Icon;
              return (
                <li key={insight.id} className={cn("rounded-2xl border-2 p-4", tone.box)}>
                  <p className="flex items-center gap-2 font-extrabold text-primary">
                    <ToneIcon className={cn("size-5 shrink-0", tone.icon)} aria-hidden />
                    {insight.title}
                  </p>
                  <p className="mt-2 text-sm text-foreground/85">{insight.detail}</p>
                  <p className="mt-2 text-sm font-bold text-primary">{insight.recommendation}</p>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 flex flex-col gap-2 rounded-2xl bg-blue-soft p-4 text-sm text-blue-deep sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 font-semibold">
              <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
              Seus dados individuais nunca são enviados para a empresa. O monitoramento é só seu.
            </p>
            <p className="shrink-0 text-xs font-bold">Última verificação: {lastStealthCheck}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
