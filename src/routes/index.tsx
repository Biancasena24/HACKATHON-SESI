import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, HeartHandshake, Lock, Footprints, Smile, Stethoscope, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/viva/PublicHeader";
import hero from "@/assets/hero-viva.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VIVA+ — pequenos cuidados, todo dia. Do trabalho ao SUS." },
      {
        name: "description",
        content:
          "Plataforma de autocuidado para trabalhadores: check-in de 10 segundos, desafios semanais, bem-estar emocional e conexão com a sua UBS.",
      },
      { property: "og:title", content: "VIVA+ — pequenos cuidados, todo dia" },
      { property: "og:description", content: "Autocuidado no trabalho, conectado à Atenção Primária do SUS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const AGENTS = [
  {
    icon: HeartHandshake,
    title: "Trabalhadores",
    text: "No centro do próprio cuidado, com metas pequenas e possíveis para a sua rotina.",
    tone: "bg-sun-soft text-accent-foreground",
  },
  {
    icon: Building2,
    title: "Empresas",
    text: "Enxergam tendências coletivas e anônimas para melhorar o ambiente de trabalho.",
    tone: "bg-sky-soft text-primary",
  },
  {
    icon: Stethoscope,
    title: "Atenção Primária",
    text: "A UBS como referência para prevenção, vacinas, acompanhamento e acolhimento.",
    tone: "bg-success-soft text-primary",
  },
];

const STEPS = [
  { icon: Smile, title: "Check-in de 10 segundos", text: "Como estão seu humor, energia, sono e corpo hoje." },
  { icon: Footprints, title: "Pequenos desafios", text: "Caminhar 15 minutos, pausas, água, respiração." },
  { icon: Sparkles, title: "Dicas para a sua rotina", text: "Home office, fábrica, turno da noite ou retorno." },
  { icon: Stethoscope, title: "Ponte com o SUS", text: "Encontre sua UBS e mantenha a prevenção em dia." },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main>
        <section className="bg-hero">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-[1.05fr_1fr] md:py-20">
            <div className="animate-rise">
              <span className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 text-sm font-semibold text-primary shadow-soft">
                <span className="size-2 rounded-full bg-sun" /> Saúde no trabalho + SUS
              </span>
              <h1 className="mt-5 text-4xl font-extrabold text-primary sm:text-5xl md:text-6xl">
                Pequenos cuidados, todo dia. <span className="text-sky">Do trabalho ao SUS.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                O VIVA+ ajuda você a transformar autocuidado em hábito com ações curtas, acompanhamento gentil e
                um caminho fácil até a sua Unidade Básica de Saúde.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="hero" size="xl">
                  <Link to="/auth" search={{ mode: "signup" }}>
                    Começar minha jornada <ArrowRight />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="xl">
                  <Link to="/empresa">Ver painel da empresa</Link>
                </Button>
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="size-4" /> Seus dados são seus. A empresa só vê números coletivos e anônimos.
              </p>
            </div>
            <div className="relative">
              <div aria-hidden className="absolute -right-6 -top-6 size-28 rounded-full bg-sun-orb opacity-70 blur-sm" />
              <img
                src={hero}
                alt="Três trabalhadores fazendo uma pausa de autocuidado: alongando, bebendo água e respirando"
                width={1280}
                height={1024}
                className="relative w-full rounded-4xl border-4 border-card object-cover shadow-lift"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="max-w-2xl text-3xl font-bold text-primary md:text-4xl">Um ecossistema de cuidado com três pontas</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Saúde não depende só de escolhas individuais. Ela também é feita das condições de trabalho, do ambiente e
            do acesso aos serviços.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {AGENTS.map((a) => (
              <div key={a.title} className="card-surface p-6">
                <span className={`grid size-12 place-items-center rounded-2xl ${a.tone}`}>
                  <a.icon className="size-6" />
                </span>
                <h3 className="mt-4 text-xl font-bold text-primary">{a.title}</h3>
                <p className="mt-2 text-muted-foreground">{a.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-3xl font-bold md:text-4xl">Como funciona</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <div key={s.title} className="rounded-3xl bg-primary-foreground/8 p-6 ring-1 ring-primary-foreground/15">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full bg-sun text-sun-foreground">
                      <s.icon className="size-5" />
                    </span>
                    <span className="font-display text-sm font-bold opacity-70">0{i + 1}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                  <p className="mt-1 opacity-80">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="card-surface grid gap-6 p-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-primary md:text-3xl">Cuidado sem cobrança, sem diagnóstico, sem culpa</h2>
              <ul className="mt-4 grid gap-2 text-muted-foreground sm:grid-cols-2">
                <li>• Dados individuais nunca chegam ao empregador</li>
                <li>• Grupos com menos de 10 pessoas ficam ocultos</li>
                <li>• O VIVA+ não substitui profissionais de saúde</li>
                <li>• Você pode apagar seus registros quando quiser</li>
              </ul>
            </div>
            <Button asChild variant="sun" size="xl">
              <Link to="/auth" search={{ mode: "signup" }}>Criar minha conta</Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <span>VIVA+ · protótipo de demonstração</span>
          <span>Em emergência, ligue 192 (SAMU). Precisa conversar? CVV 188.</span>
        </div>
      </footer>
    </div>
  );
}
