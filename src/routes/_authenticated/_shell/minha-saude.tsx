import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, PiggyBank } from "lucide-react";
import { ApsConsultationsSection } from "@/components/viva/ApsConsultationsSection";
import { healthProfile } from "@/lib/viva/mockData";

export const Route = createFileRoute("/_authenticated/_shell/minha-saude")({
  head: () => ({
    meta: [
      { title: "Minha saúde — Cuidaê+" },
      {
        name: "description",
        content: "Histórico de consultas com APS e cuidados preventivos.",
      },
      { property: "og:title", content: "Minha saúde — Cuidaê+" },
      { property: "og:description", content: "Histórico APS e cuidados preventivos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MyHealth,
});

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
            Acompanhe seus atendimentos na Atenção Primária (APS) e seus cuidados preventivos.
          </p>
        </div>

        {/* Linha de aviso de poupança preventiva e impacto em exames */}
        <div className="flex items-center gap-3.5 rounded-2xl border border-mint/50 bg-mint-soft/80 p-4 text-secondary-foreground shadow-xs">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-card text-primary shadow-soft">
            <PiggyBank className="size-5" aria-hidden />
          </span>
          <p className="text-sm font-semibold leading-relaxed">
            Você economiza por se cuidar — sabia que um exame como colonoscopia pode custar até{" "}
            <strong className="font-extrabold text-primary">R$ 2.800,00</strong> se a prevenção for
            deixada de lado?
          </p>
        </div>
      </header>

      <div id="consultas" className="scroll-mt-24">
        <ApsConsultationsSection />
      </div>

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
          Ir para a APS <ArrowRight className="size-5" aria-hidden />
        </Link>
      </section>
    </div>
  );
}
