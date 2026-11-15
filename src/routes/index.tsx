import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Footprints,
  HeartHandshake,
  HeartPulse,
  Home,
  LayoutGrid,
  Lock,
  PiggyBank,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/viva/PublicHeader";
import { healthProfile } from "@/lib/viva/mockData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cuidaê+ — pequenos cuidados, grandes conquistas" },
      {
        name: "description",
        content:
          "Plataforma de autocuidado que conecta trabalhadores, empresas e a Atenção Primária à Saúde: check-in rápido, comunidades, relatórios de economia preventiva e monitoramento.",
      },
      { property: "og:title", content: "Cuidaê+ — pequenos cuidados, grandes conquistas" },
      {
        property: "og:description",
        content: "Prevenção que vira rotina, conectada à Atenção Primária à Saúde.",
      },
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
    text: "No centro do próprio cuidado, com metas pequenas e possíveis para a rotina real.",
    tone: "bg-success-soft text-primary",
  },
  {
    icon: Building2,
    title: "Empresas",
    text: "Enxergam tendências coletivas e anônimas para melhorar o ambiente de trabalho.",
    tone: "bg-blue-soft text-blue",
  },
  {
    icon: Stethoscope,
    title: "Atenção Primária",
    text: "A UBS como referência para prevenção, vacinas, acompanhamento e acolhimento.",
    tone: "bg-sun-soft text-accent-foreground",
  },
];

const FEATURES: {
  icon: typeof Users;
  title: string;
  text: string;
  tone: string;
  tag?: string;
}[] = [
  {
    icon: Users,
    title: "Comunidades que cuidam juntas",
    text: "Times competem de forma amigável, somam pontos e criam uma rede de apoio que sustenta o hábito.",
    tone: "bg-blue-soft text-blue",
    tag: "Gamificação",
  },
  {
    icon: PiggyBank,
    title: "Sua poupança em saúde",
    text: "Quando você se cuida, você economiza tempo, dinheiro e evita o estresse de pegar longas filas.",
    tone: "bg-success-soft text-primary",
    tag: "Economia",
  },
  {
    icon: Stethoscope,
    title: "Conexão com a APS",
    text: "Encontre sua Unidade Básica de Saúde e mantenha vacinas e consultas preventivas em dia.",
    tone: "bg-gradient-blue text-white",
    tag: "Prevenção",
  },
];

const STEPS = [
  {
    icon: Smile,
    title: "Check-in de 10 segundos",
    text: "Como estão seu humor, energia, sono e corpo hoje.",
  },
  {
    icon: Footprints,
    title: "Pequenos desafios",
    text: "Caminhar 15 minutos, pausas, água, respiração.",
  },
  {
    icon: Sparkles,
    title: "Cuidado personalizado",
    text: "Dicas e relatórios que falam a sua língua.",
  },
  {
    icon: Stethoscope,
    title: "Ponte com o SUS",
    text: "Encontre sua UBS e mantenha a prevenção em dia.",
  },
];

const TRUST = [
  { icon: Lock, text: "Dados só seus" },
  { icon: ShieldCheck, text: "Sem diagnóstico" },
  { icon: Users, text: "Grupos anônimos" },
];

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <PublicHeader />
      <main>
        <section className="relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 bg-hero" />
          <div
            aria-hidden
            className="animate-float-slow absolute -right-24 top-10 size-[30rem] rounded-full bg-secondary/60 blur-3xl"
          />
          <div
            aria-hidden
            className="animate-float absolute -left-28 top-40 size-[24rem] rounded-full bg-blue-soft/80 blur-3xl"
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-12 md:grid-cols-[1.05fr_0.95fr] md:pb-28 md:pt-20">
            <div className="animate-rise">
              <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-primary shadow-soft">
                <span className="animate-pulse-soft size-2 rounded-full bg-primary" />
                Saúde que conecta trabalho, família e SUS
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.04] text-primary sm:text-5xl md:text-6xl">
                Pequenos cuidados,
                <br />
                <span className="text-gradient">grandes conquistas.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                O Cuidaê+ transforma prevenção em rotina leve: check-ins rápidos, metas em grupo,
                economia com prevenção e uma ponte direta com a sua UBS.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="hero" size="xl">
                  <Link to="/auth" search={{ mode: "signup" }}>
                    Começar minha jornada <ArrowRight />
                  </Link>
                </Button>
                <Button asChild variant="glass" size="xl">
                  <Link to="/empresa">
                    <Building2 /> Ver painel da empresa
                  </Link>
                </Button>
              </div>
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-muted-foreground">
                {TRUST.map((item) => (
                  <li key={item.text} className="inline-flex items-center gap-2">
                    <item.icon className="size-4 text-blue" aria-hidden />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative mx-auto w-full max-w-[23.5rem] animate-rise">
              <div
                aria-hidden
                className="absolute -inset-8 rounded-[3rem] bg-gradient-blue opacity-10 blur-3xl"
              />
              <div className="relative rounded-[2.6rem] border-[10px] border-white bg-white/85 p-1 shadow-lift backdrop-blur">
                <div className="relative overflow-hidden rounded-[2rem] bg-hero px-4 pb-3 pt-6">
                  <div
                    aria-hidden
                    className="absolute left-1/2 top-2 h-1.5 w-16 -translate-x-1/2 rounded-full bg-foreground/10"
                  />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Olá,</p>
                    <p className="font-display text-2xl font-extrabold text-primary">Fernanda</p>
                  </div>

                  {/* Aviso de economia preventiva */}
                  <div className="mt-3 flex items-center gap-3 rounded-2xl border border-mint/50 bg-mint-soft/80 p-3 text-secondary-foreground shadow-xs">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-card text-primary shadow-soft">
                      <PiggyBank className="size-4" aria-hidden />
                    </span>
                    <p className="text-[11px] font-semibold leading-snug">
                      Você economiza por se cuidar — sabia que um exame como colonoscopia pode custar
                      até <strong className="font-extrabold text-primary">R$ 2.800,00</strong> se a
                      prevenção for deixada de lado?
                    </p>
                  </div>

                  {/* Card Consultas APS */}
                  <div className="mt-3 rounded-[1.5rem] bg-sky-soft p-4">
                    <div className="flex items-start justify-between">
                      <span className="grid size-10 place-items-center rounded-xl bg-card text-primary shadow-soft">
                        <Stethoscope className="size-5" aria-hidden />
                      </span>
                      <span className="grid size-7 place-items-center rounded-full bg-primary text-white">
                        <ArrowRight className="size-3.5" aria-hidden />
                      </span>
                    </div>
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-primary/70">
                      Consultas APS
                    </p>
                    <p className="font-display text-xl font-extrabold text-primary">
                      4 atendimentos
                    </p>
                    <p className="text-xs font-semibold text-muted-foreground">
                      Último: Consulta médica na UBS
                    </p>
                  </div>

                  {/* Card Comunidade */}
                  <div className="mt-3 rounded-[1.5rem] bg-mint-soft p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="grid size-9 place-items-center rounded-xl bg-card text-primary shadow-soft">
                        <Trophy className="size-4" aria-hidden />
                      </span>
                      <span className="rounded-full bg-sun px-2.5 py-0.5 text-[10px] font-extrabold text-sun-foreground">
                        {healthProfile.gamification.rank}º lugar
                      </span>
                    </div>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-primary/70">
                      Comunidade
                    </p>
                    <p className="font-display text-base font-extrabold text-primary">
                      {healthProfile.gamification.teamName}
                    </p>
                  </div>

                  {/* Barra de navegação inferior fiel ao app */}
                  <div className="mt-3 grid grid-cols-5 items-end gap-0.5 rounded-[1.75rem] border border-white/80 bg-card/95 px-2 pb-1.5 pt-2 shadow-soft">
                    <div className="flex flex-col items-center gap-0.5 text-[9px] font-bold text-primary">
                      <span className="grid size-7 place-items-center rounded-lg bg-indigo-soft">
                        <Home className="size-4" aria-hidden />
                      </span>
                      Início
                    </div>
                    <div className="flex flex-col items-center gap-0.5 whitespace-nowrap text-[9px] font-bold text-muted-foreground">
                      <span className="grid size-7 place-items-center rounded-lg">
                        <ShieldCheck className="size-4" aria-hidden />
                      </span>
                      Minha saúde
                    </div>
                    <div className="flex flex-col items-center gap-0.5 text-[9px] font-bold text-muted-foreground">
                      <span className="-mt-5 grid size-10 place-items-center rounded-full bg-primary text-white shadow-blue ring-2 ring-background">
                        <Sparkles className="size-4" aria-hidden />
                      </span>
                      Engajamento
                    </div>
                    <div className="flex flex-col items-center gap-0.5 text-[9px] font-bold text-muted-foreground">
                      <span className="grid size-7 place-items-center rounded-lg">
                        <Stethoscope className="size-4" aria-hidden />
                      </span>
                      APS
                    </div>
                    <div className="flex flex-col items-center gap-0.5 text-[9px] font-bold text-muted-foreground">
                      <span className="grid size-7 place-items-center rounded-lg">
                        <LayoutGrid className="size-4" aria-hidden />
                      </span>
                      Mais
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass absolute -left-4 top-24 hidden items-center gap-2 rounded-2xl px-3 py-2 shadow-lift sm:flex">
                <TrendingUp className="size-5 text-primary" aria-hidden />
                <div>
                  <p className="font-display text-lg font-extrabold text-primary">+24%</p>
                  <p className="text-[11px] font-bold text-muted-foreground">saúde no ano</p>
                </div>
              </div>
              <div className="glass absolute -right-3 bottom-24 hidden items-center gap-2 rounded-2xl px-3 py-2 shadow-lift sm:flex">
                <Trophy className="size-5 text-primary" aria-hidden />
                <div>
                  <p className="font-display text-lg font-extrabold text-primary">2º</p>
                  <p className="text-[11px] font-bold text-muted-foreground">no ranking</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative border-y border-white/60 bg-white/55 backdrop-blur-xl">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4">
            {[
              { value: "3", label: "idas ao pronto-socorro evitadas", color: "text-primary" },
              { value: "+24%", label: "de melhora percebida", color: "text-blue" },
              { value: "1.450", label: "pontos no time", color: "text-primary" },
              { value: "2", label: "pessoas da família cuidadas", color: "text-accent-foreground" },
            ].map((item) => (
              <div key={item.label} className="text-center md:text-left">
                <p className={`font-display text-2xl font-extrabold ${item.color}`}>{item.value}</p>
                <p className="text-xs font-semibold text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-blue">
              Um ecossistema de cuidado
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-primary md:text-4xl">
              Três pontas, um só cuidado
            </h2>
            <p className="mt-3 text-muted-foreground">
              Saúde não depende só de escolhas individuais. Ela também é feita das condições de
              trabalho, do ambiente e do acesso aos serviços.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {AGENTS.map((agent) => (
              <div key={agent.title} className="card-interactive p-6">
                <span className={`grid size-14 place-items-center rounded-2xl ${agent.tone}`}>
                  <agent.icon className="size-7" aria-hidden />
                </span>
                <h3 className="mt-5 text-xl font-extrabold text-primary">{agent.title}</h3>
                <p className="mt-2 text-muted-foreground">{agent.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden py-20">
          <div aria-hidden className="absolute inset-0 bg-gradient-blue" />
          <div
            aria-hidden
            className="animate-float absolute -right-20 top-0 size-80 rounded-full bg-white/10 blur-2xl"
          />
          <div
            aria-hidden
            className="animate-float-slow absolute -left-16 bottom-0 size-72 rounded-full bg-secondary/20 blur-2xl"
          />
          <div className="relative mx-auto max-w-6xl px-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Como funciona
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-white md:text-4xl">
                  Quatro passos para uma rotina mais leve
                </h2>
              </div>
              <p className="max-w-sm text-sm font-semibold text-white/75">
                Nada de planilhas ou jargões. Só cuidado simples, com lembretes gentis e conexão com
                quem pode ajudar.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, index) => (
                <div
                  key={step.title}
                  className="glass-dark rounded-3xl p-5 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-2xl bg-white/15 text-secondary">
                      <step.icon className="size-5" aria-hidden />
                    </span>
                    <span className="font-display text-sm font-bold text-white/50">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-extrabold text-white">{step.title}</h3>
                  <p className="mt-1 text-sm text-white/75">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-blue">
                Diferenciais Cuidaê+
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-primary md:text-4xl">
                Tecnologia que parece cuidado, não cobrança
              </h2>
            </div>
            <Button asChild variant="outline" size="lg">
              <Link to="/auth" search={{ mode: "signup" }}>
                Explorar o Cuidaê+ <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <article key={feature.title} className="card-interactive group flex gap-4 p-5">
                <span
                  className={`grid size-14 shrink-0 place-items-center rounded-2xl ${feature.tone}`}
                >
                  <feature.icon className="size-7" aria-hidden />
                </span>
                <div>
                  {feature.tag && (
                    <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      {feature.tag}
                    </span>
                  )}
                  <h3 className={feature.tag ? "mt-2 text-lg font-extrabold text-primary" : "text-lg font-extrabold text-primary"}>
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{feature.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-primary p-6 text-primary-foreground shadow-lift sm:p-8 md:p-12">
            <div
              aria-hidden
              className="animate-float absolute -right-10 -top-10 size-56 rounded-full bg-sun-orb opacity-80"
            />
            <div
              aria-hidden
              className="absolute -bottom-20 left-1/3 size-64 rounded-full bg-white/10 blur-2xl"
            />
            <div className="relative grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-center">
              <div className="min-w-0">
                <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white sm:text-sm">
                  <HeartPulse className="size-4 shrink-0" aria-hidden />
                  <span className="truncate">Cuidado sem culpa, sem diagnóstico</span>
                </span>
                <h2 className="mt-4 text-3xl font-extrabold text-white md:text-4xl">
                  Comece com 10 segundos por dia.
                </h2>
                <p className="mt-3 max-w-xl text-white/85">
                  Sua empresa vê apenas números coletivos e anônimos. Você vê sua evolução, sua
                  poupança em saúde e o cuidado da sua família.
                </p>
                <ul className="mt-4 grid gap-2 text-sm font-semibold text-white/90 sm:grid-cols-2">
                  {[
                    "Dados individuais nunca chegam ao empregador",
                    "Grupos com menos de 10 pessoas ficam ocultos",
                    "O Cuidaê+ não substitui profissionais de saúde",
                    "Você pode apagar seus registros quando quiser",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden />
                      <span className="min-w-0 break-words">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex min-w-0 flex-col gap-3">
                <Button
                  asChild
                  variant="sun"
                  size="xl"
                  className="h-auto min-h-13 w-full whitespace-normal px-5 py-3 text-center"
                >
                  <Link to="/auth" search={{ mode: "signup" }}>
                    Criar minha conta <ArrowRight className="shrink-0" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="glass"
                  size="lg"
                  className="h-auto min-h-12 w-full whitespace-normal px-4 py-3 text-center text-xs sm:text-sm"
                >
                  <Link to="/empresa">
                    Ver demonstração para empresas <ArrowUpRight className="shrink-0" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-border/60 bg-white/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <span>Cuidaê+ · protótipo de demonstração</span>
          <span>Em emergência, ligue 192 (SAMU). Precisa conversar? CVV 188.</span>
        </div>
      </footer>
    </div>
  );
}
