import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake, PiggyBank, ShieldCheck, Sparkles } from "lucide-react";
import { DependentsSection } from "@/components/viva/DependentsSection";
import { RiskStatusCard } from "@/components/viva/RiskBadge";
import { SavingsReport } from "@/components/viva/SavingsReport";
import { StealthPanel } from "@/components/viva/StealthPanel";
import { healthProfile } from "@/lib/viva/mockData";

export const Route = createFileRoute("/_authenticated/_shell/minha-saude")({
  head: () => ({
    meta: [
      { title: "Minha saúde — VIVA+" },
      {
        name: "description",
        content:
          "Sua classificação de risco, relatório de poupança em saúde, cuidados da família e monitoramento preventivo.",
      },
      { property: "og:title", content: "Minha saúde — VIVA+" },
      { property: "og:description", content: "Risco, poupança em saúde e cuidados da família." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MyHealth,
});

const SECTIONS = [
  { href: "#risco", label: "Meu risco", icon: ShieldCheck },
  { href: "#poupanca", label: "Minha poupança", icon: PiggyBank },
  { href: "#familia", label: "Minha família", icon: HeartHandshake },
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
            Um retrato simples do seu cuidado: o que já está funcionando, o que merece atenção e
            quanto você está poupando ao se prevenir.
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
      </header>

      <div id="risco" className="scroll-mt-24">
        <RiskStatusCard
          risk={healthProfile.riskClassification}
          nextReturn={healthProfile.nextReturn}
        />
      </div>

      <SavingsReport insights={healthProfile.insights} />

      <DependentsSection dependents={healthProfile.dependents} />

      <StealthPanel />

      <section className="flex flex-col gap-4 rounded-3xl bg-gradient-blue p-6 text-white shadow-lift sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold">Quer manter tudo em dia?</h2>
          <p className="mt-1 text-sm opacity-90">
            Encontre sua UBS, veja vacinas e leve seus dependentes com você.
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
