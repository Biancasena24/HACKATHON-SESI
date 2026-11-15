import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ApsConsultationsSection } from "@/components/viva/ApsConsultationsSection";

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
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold text-primary md:text-4xl">Minha saúde</h1>
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
