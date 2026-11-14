import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Eye,
  Footprints,
  HeartHandshake,
  HeartPulse,
  Home,
  Lock,
  PiggyBank,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/viva/PublicHeader";
import { RiskBadge } from "@/components/viva/RiskBadge";
import { healthProfile } from "@/lib/viva/mockData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VIVA+ — pequenos cuidados, grandes conquistas" },
      {
        name: "description",
        content:
          "Plataforma de autocuidado que conecta trabalhadores, empresas e a Atenção Primária do SUS: check-in rápido, comunidades, relatórios de poupança em saúde e monitoramento preventivo.",
      },
      { property: "og:title", content: "VIVA+ — pequenos cuidados, grandes conquistas" },
      {
        property: "og:description",
        content: "Prevenção que vira rotina, conectada à Atenção Primária do SUS.",
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

const FEATURES = [
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
    text: "Relatórios mostram o que você está ganhando: menos idas ao pronto-socorro, menos filas e mais saúde.",
    tone: "bg-success-soft text-primary",
    tag: "Relatórios",
  },
  {
    icon: HeartHandshake,
    title: "Visão de dependentes",
    text: "Acompanhe filhos e cônjuges, receba lembretes de cuidado e use o amor como motivo para se cuidar.",
    tone: "bg-sun-soft text-accent-foreground",
    tag: "Família",
  },
  {
    icon: Eye,
    title: "Análise Stealth",
    text: "Um painel discreto cruza consultas, exames e riscos do trabalho para prever cuidados futuros.",
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
                O VIVA+ transforma prevenção em rotina leve: check-ins rápidos, metas em grupo,
                relatórios de poupança em saúde e uma ponte direta com a sua UBS.
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
                <div className="relative overflow-hidden rounded-[2rem] bg-card px-4 pb-3 pt-6">
                  <div
                    aria-hidden
                    className="absolute left-1/2 top-2 h-1.5 w-16 -translate-x-1/2 rounded-full bg-foreground/10"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-11 place-items-center rounded-2xl bg-gradient-blue font-display text-base font-extrabold text-white shadow-blue">
                        MO
                      </span>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-primary/60">
                          Bom dia, Maria
                        </p>
                        <p className="font-display text-base font-extrabold text-primary">
                          Sua saúde hoje
                        </p>
                      </div>
                    </div>
                    <RiskBadge risk={healthProfile.riskClassification} size="sm" />
                  </div>

                  <div className="mt-4 rounded-[1.5rem] bg-gradient-blue p-4 text-white shadow-blue">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                          Poupança em saúde
                        </p>
                        <p className="mt-1 font-display text-3xl font-extrabold">R$ 1.240</p>
                        <p className="text-xs opacity-85">3 idas ao pronto-socorro evitadas</p>
                      </div>
                      <span className="grid size-10 place-items-center rounded-xl bg-white/15">
                        <PiggyBank className="size-5" aria-hidden />
                      </span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
                      <div className="h-full w-[67%] rounded-full bg-mint" />
                    </div>
                    <p className="mt-2 text-[11px] font-semibold opacity-80">Meta anual · 67%</p>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2.5">
                    <div className="rounded-[1.25rem] bg-mint-soft p-3">
                      <Trophy className="size-4 text-primary" aria-hidden />
                      <p className="mt-1 truncate text-[11px] font-bold text-muted-foreground">
                        {healthProfile.gamification.teamName}
                      </p>
                      <p className="font-display text-base font-extrabold text-primary">
                        {healthProfile.gamification.rank}º lugar
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] bg-peach p-3">
                      <HeartHandshake className="size-4 text-brick" aria-hidden />
                      <p className="mt-1 text-[11px] font-bold text-muted-foreground">Família</p>
                      <p className="font-display text-base font-extrabold text-foreground">
                        {healthProfile.dependents.length} em cuidado
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 rounded-[1.25rem] bg-muted p-2.5 text-xs">
                    <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-card text-primary">
                      <Eye className="size-3.5" aria-hidden />
                    </span>
                    <p className="font-semibold text-foreground">
                      Análise stealth: 1 cuidado suave para suas costas.
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-around rounded-full bg-muted px-4 py-2">
                    <Home className="size-5 text-muted-foreground" aria-hidden />
                    <span className="grid size-10 place-items-center rounded-full bg-primary text-white shadow-blue">
                      <Smile className="size-5" aria-hidden />
                    </span>
                    <UserRound className="size-5 text-muted-foreground" aria-hidden />
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
                Diferenciais VIVA+
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-primary md:text-4xl">
                Tecnologia que parece cuidado, não cobrança
              </h2>
            </div>
            <Button asChild variant="outline" size="lg">
              <Link to="/auth" search={{ mode: "signup" }}>
                Explorar o VIVA+ <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <article key={feature.title} className="card-interactive group flex gap-4 p-5">
                <span
                  className={`grid size-14 shrink-0 place-items-center rounded-2xl ${feature.tone}`}
                >
                  <feature.icon className="size-7" aria-hidden />
                </span>
                <div>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {feature.tag}
                  </span>
                  <h3 className="mt-2 text-lg font-extrabold text-primary">{feature.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{feature.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-primary p-8 text-primary-foreground shadow-lift md:p-12">
            <div
              aria-hidden
              className="animate-float absolute -right-10 -top-10 size-56 rounded-full bg-sun-orb opacity-80"
            />
            <div
              aria-hidden
              className="absolute -bottom-20 left-1/3 size-64 rounded-full bg-white/10 blur-2xl"
            />
            <div className="relative grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-bold text-white">
                  <HeartPulse className="size-4" aria-hidden /> Cuidado sem culpa, sem diagnóstico
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
                    "O VIVA+ não substitui profissionais de saúde",
                    "Você pode apagar seus registros quando quiser",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <Button asChild variant="sun" size="xl">
                  <Link to="/auth" search={{ mode: "signup" }}>
                    Criar minha conta <ArrowRight />
                  </Link>
                </Button>
                <Button asChild variant="glass" size="lg">
                  <Link to="/empresa">
                    Ver demonstração para empresas <ArrowUpRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-border/60 bg-white/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <span>VIVA+ · protótipo de demonstração</span>
          <span>Em emergência, ligue 192 (SAMU). Precisa conversar? CVV 188.</span>
        </div>
      </footer>
    </div>
  );
}
