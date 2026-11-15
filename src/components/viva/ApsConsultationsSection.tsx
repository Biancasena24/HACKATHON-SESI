import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Calendar,
  CheckCircle2,
  FileText,
  MapPin,
  ShieldCheck,
  Smile,
  Stethoscope,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apsConsultations, type ApsConsultation } from "@/lib/viva/mockData";
import { cn } from "@/lib/utils";

const TYPE_CONFIG: Record<
  ApsConsultation["type"],
  { label: string; icon: typeof Stethoscope; badgeClass: string }
> = {
  medica: {
    label: "Médica",
    icon: Stethoscope,
    badgeClass: "bg-indigo-soft text-primary border-indigo-200",
  },
  enfermagem: {
    label: "Enfermagem",
    icon: Activity,
    badgeClass: "bg-mint-soft text-secondary-foreground border-mint-200",
  },
  odontologia: {
    label: "Odontologia",
    icon: Smile,
    badgeClass: "bg-pink-soft text-care border-pink-200",
  },
  multiprofissional: {
    label: "Multiprofissional",
    icon: UserCheck,
    badgeClass: "bg-sun-soft text-brick border-sun-200",
  },
};

export function ApsConsultationsSection() {
  const [selectedType, setSelectedType] = useState<string>("all");

  const filtered =
    selectedType === "all"
      ? apsConsultations
      : apsConsultations.filter((c) => c.type === selectedType);

  return (
    <section id="consultas" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue">
            Atenção Primária à Saúde (APS / SUS)
          </p>
          <h2 className="flex items-center gap-2 text-2xl font-extrabold text-primary">
            <Stethoscope className="size-6" aria-hidden /> Histórico de Consultas e Atendimentos APS
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Acompanhe aqui seus atendimentos na Unidade Básica de Saúde (UBS), orientações da Equipe
            de Saúde da Família e condutas preventivas.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground">
          <ShieldCheck className="size-4" aria-hidden /> Prontuário e-SUS protegido
        </span>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 pt-1" role="tablist" aria-label="Filtrar tipo de consulta">
        <button
          type="button"
          onClick={() => setSelectedType("all")}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-bold transition-all",
            selectedType === "all"
              ? "bg-primary text-white shadow-soft"
              : "border border-border bg-card text-muted-foreground hover:bg-muted",
          )}
        >
          Todos ({apsConsultations.length})
        </button>
        {(["medica", "enfermagem", "odontologia", "multiprofissional"] as const).map((type) => {
          const cfg = TYPE_CONFIG[type];
          const count = apsConsultations.filter((c) => c.type === type).length;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all",
                selectedType === type
                  ? "bg-primary text-white shadow-soft"
                  : "border border-border bg-card text-muted-foreground hover:bg-muted",
              )}
            >
              <cfg.icon className="size-3.5" aria-hidden />
              {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Consultations List */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const cfg = TYPE_CONFIG[item.type];
          const Icon = cfg.icon;
          return (
            <article
              key={item.id}
              className="card-surface flex flex-col gap-4 p-5 transition-shadow hover:shadow-soft md:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-3">
                <div className="flex items-start gap-3">
                  <span className={cn("grid size-11 place-items-center rounded-2xl", cfg.badgeClass)}>
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-primary">{item.title}</h3>
                      <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-bold", cfg.badgeClass)}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
                      {item.professional}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="size-3.5" aria-hidden />
                    {item.date}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-success px-2.5 py-0.5 font-bold text-success-foreground">
                    <CheckCircle2 className="size-3.5" aria-hidden />
                    {item.status}
                  </span>
                </div>
              </div>

              <div className="grid gap-3 text-sm text-foreground/90 md:grid-cols-2">
                <div className="rounded-2xl bg-muted/70 p-3.5">
                  <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary/70">
                    <FileText className="size-3.5" aria-hidden /> Resumo do atendimento
                  </p>
                  <p className="mt-1 leading-relaxed text-foreground/80">{item.summary}</p>
                </div>

                <div className="rounded-2xl bg-sky-soft/60 p-3.5">
                  <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                    <CheckCircle2 className="size-3.5 text-secondary-foreground" aria-hidden /> Conduta e orientações
                  </p>
                  <p className="mt-1 leading-relaxed text-foreground/80">{item.conduct}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5 text-primary" aria-hidden />
                  <strong>{item.unit}</strong> — {item.team}
                </span>
                <span className="text-[11px] opacity-75">
                  Registro eletrônico validado pelo SUS
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Action / Next steps box */}
      <div className="flex flex-col gap-3 rounded-2xl border border-sky/30 bg-sky-soft p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-primary">Precisa de um novo atendimento ou retorno?</p>
          <p className="text-xs text-muted-foreground">
            A sua UBS de referência acolhe você para consultas preventivas, exames e vacinas.
          </p>
        </div>
        <Button asChild size="sm" variant="default" className="shrink-0">
          <Link to="/cuidado">
            Buscar minha UBS <ArrowRight className="ml-1 size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
