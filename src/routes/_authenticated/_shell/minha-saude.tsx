import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, PiggyBank, Sparkles, Stethoscope } from "lucide-react";
import { ApsConsultationsSection } from "@/components/viva/ApsConsultationsSection";
import { StealthPanel } from "@/components/viva/StealthPanel";
import { healthProfile } from "@/lib/viva/mockData";

export const Route = createFileRoute("/_authenticated/_shell/minha-saude")({
  head: () => ({
    meta: [
      { title: "Minha saúde — Cuidaê+" },
      {
        name: "description",
        content: "Histórico de consultas com APS e monitoramento preventivo.",
      },
      { property: "og:title", content: "Minha saúde — Cuidaê+" },
      { property: "og:description", content: "Histórico APS e cuidados preventivos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MyHealth,
});

const SECTIONS = [
  { href: "#consultas", label: "Histórico APS", icon: Stethoscope },
  { href: "#monitoramento", label: "Monitoramento", icon: Sparkles },
];

function MyHealth() {
  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-blue">
            Seus dados, suas escolhas
          </p>
          <h1 className="text-3xl font-extrabold text-primary md:text-4xl">Minha saúde</h1>
          <p className="mt-1 max-w-2xl text-muted-foreground">
            Acompanhe seus atendimentos na Atenção Primária (APS) e o monitoramento preventivo.
          </p>
        </div>
        <nav aria-label="Atalhos desta página" className="flex flex-wrap gap-2">
          {SECTIONS.map((section) => (
            <a
              key={section.href}
              href={section.href}
              className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-border bg-card px-4 text-sm font-bold text-blue-deep transition-colors hover:border-blue/40 hover:bg-blue-soft"
            >
              <section.icon className="size-4" aria-hidden />
              {section.label}
            </a>
          ))}
        </nav>

        {/* Linha de aviso de poupança preventiva */}
        <div className="flex items-center gap-3 rounded-2xl border border-mint/40 bg-mint-soft/80 px-4 py-3 text-secondary-foreground shadow-xs">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-card text-primary shadow-soft">
            <PiggyBank className="size-5" aria-hidden />
          </span>
          <p className="text-sm font-semibold">
            Você economiza até{" "}
            <strong className="font-extrabold text-primary">
              R${" "}
              {healthProfile.insights.savingsValue?.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) ?? "1.240,00"}
            </strong>{" "}
            por se cuidar.
          </p>
        </div>
      </header>

      <div id="consultas" className="scroll-mt-24">
        <ApsConsultationsSection />
      </div>

      <StealthPanel />

      <section className="flex flex-col gap-4 rounded-3xl bg-gradient-blue p-6 text-white shadow-lift sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold">Quer manter tudo em dia?</h2>
          <p className="mt-1 text-sm opacity-90">
            Encontre sua UBS, veja vacinas e acompanhe seus cuidados preventivos.
          </p>
        </div>
        <Link
          to="/cuidado"
          className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-2xl bg-sun px-6 font-bold text-sun-foreground shadow-soft transition-colors hover:brightness-105"
        >
          Ir para o SUS <ArrowRight className="size-5" aria-hidden />
        </Link>
      </section>
    </div>
  );
}
