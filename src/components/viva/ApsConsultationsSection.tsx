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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [activeItem, setActiveItem] = useState<ApsConsultation | null>(null);

  const filtered =
    selectedType === "all"
      ? apsConsultations
      : apsConsultations.filter((c) => c.type === selectedType);

  return (
    <section id="consultas" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-2xl font-extrabold text-primary">
          <Stethoscope className="size-6 shrink-0" aria-hidden /> Histórico de Consultas e Atendimentos APS
        </h2>
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

      {/* Consultations List (Compact cards — click to open pop-up) */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const cfg = TYPE_CONFIG[item.type];
          const Icon = cfg.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveItem(item)}
              className="card-interactive flex w-full cursor-pointer flex-wrap items-center justify-between gap-3 p-5 text-left md:p-6"
            >
              <div className="flex items-start gap-3">
                <span className={cn("grid size-11 shrink-0 place-items-center rounded-2xl", cfg.badgeClass)}>
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-primary">{item.title}</h3>
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
            </button>
          );
        })}
      </div>

      {/* Pop-up com os detalhes completos do atendimento */}
      <Dialog open={!!activeItem} onOpenChange={(open) => !open && setActiveItem(null)}>
        {activeItem && (() => {
          const cfg = TYPE_CONFIG[activeItem.type];
          const Icon = cfg.icon;
          return (
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
              <DialogHeader className="text-left">
                <div className="flex items-start gap-3">
                  <span className={cn("grid size-11 shrink-0 place-items-center rounded-2xl", cfg.badgeClass)}>
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <DialogTitle className="text-lg font-extrabold text-primary">
                        {activeItem.title}
                      </DialogTitle>
                      <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-bold", cfg.badgeClass)}>
                        {cfg.label}
                      </span>
                    </div>
                    <DialogDescription className="mt-0.5 text-xs font-semibold text-muted-foreground">
                      {activeItem.professional}
                    </DialogDescription>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="size-3.5" aria-hidden />
                    {activeItem.date}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-success px-2.5 py-0.5 font-bold text-success-foreground">
                    <CheckCircle2 className="size-3.5" aria-hidden />
                    {activeItem.status}
                  </span>
                </div>
              </DialogHeader>

              <div className="mt-2 space-y-3 text-sm text-foreground/90">
                <div className="rounded-2xl bg-muted/70 p-3.5">
                  <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary/70">
                    <FileText className="size-3.5" aria-hidden /> Resumo do atendimento
                  </p>
                  <p className="mt-1 leading-relaxed text-foreground/80">{activeItem.summary}</p>
                </div>

                <div className="rounded-2xl bg-sky-soft/60 p-3.5">
                  <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                    <CheckCircle2 className="size-3.5 text-secondary-foreground" aria-hidden /> Conduta e orientações
                  </p>
                  <p className="mt-1 leading-relaxed text-foreground/80">{activeItem.conduct}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5 shrink-0 text-primary" aria-hidden />
                    <span>
                      <strong>{activeItem.unit}</strong> — {activeItem.team}
                    </span>
                  </span>
                  <span className="text-[11px] opacity-75">
                    Registro eletrônico validado pelo SUS
                  </span>
                </div>
              </div>
            </DialogContent>
          );
        })()}
      </Dialog>

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
