import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  HeartHandshake,
  Megaphone,
  PiggyBank,
  Smile,
  Sparkles,
  Stethoscope,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChallengeRow } from "@/components/viva/ChallengeRow";
import { CommunityMiniCard } from "@/components/viva/Communities";
import { RiskBadge } from "@/components/viva/RiskBadge";
import { WellbeingChart } from "@/components/viva/WellbeingChart";
import { CareSupportCard } from "@/components/viva/CareSupportCard";
import { ensureJourney, useJourney, useToggleChallengeLog } from "@/hooks/use-journey";
import { getChallenge, type WorkMode } from "@/lib/viva/challenges";
import { BODY_AREAS, CAMPAIGN, MODE_TIPS } from "@/lib/viva/content";
import { healthProfile } from "@/lib/viva/mockData";
import { recommendationsFor, type HealthAnswers } from "@/lib/viva/questionnaire";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/_shell/inicio")({
  loader: ({ context }) => ensureJourney(context.queryClient, context.user.id),
  head: () => ({
    meta: [
      { title: "Minha jornada — VIVA+" },
      {
        name: "description",
        content: "Seu painel de autocuidado: check-in, desafios do dia e evolução.",
      },
      { property: "og:title", content: "Minha jornada — VIVA+" },
      { property: "og:description", content: "Painel individual de autocuidado." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const SLEEP_LABEL = ["", "Péssimo", "Ruim", "Regular", "Bom", "Ótimo"];
const STRESS_LABEL = [
  "",
  "Tranquilo",
  "Pouca pressão",
  "Alguma pressão",
  "Muita pressão",
  "Pressão demais",
];

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

function Dashboard() {
  const j = useJourney();
  const toggle = useToggleChallengeLog();
  const [challengesOpen, setChallengesOpen] = useState(false);

  const mode = (j.profile?.work_mode ?? "home_office") as WorkMode;
  const tips = MODE_TIPS[mode] ?? MODE_TIPS.home_office;
  const tip = tips[new Date().getDate() % tips.length] ?? { title: "", text: "" };
  const recs = recommendationsFor((j.profile?.health_answers ?? {}) as HealthAnswers);
  const myChallenges = j.myChallengeIds
    .map(getChallenge)
    .filter((c): c is NonNullable<typeof c> => !!c);
  const doneCount = myChallenges.filter((c) => j.doneToday.has(c.id)).length;
  const nudges = BODY_AREAS.filter((b) => j.todayCheckin?.body_areas.includes(b.id));
  const goalPct = Math.round(
    (CAMPAIGN.collectiveGoal.current / CAMPAIGN.collectiveGoal.target) * 100,
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">{greeting()},</p>
          <h1 className="text-3xl font-extrabold text-primary md:text-4xl">
            {j.profile?.display_name || "você"}
          </h1>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Que bom ter você por aqui cuidando de si.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <RiskBadge risk={healthProfile.riskClassification} size="sm" />
        </div>
      </section>

      {j.todayCheckin ? (
        <section className="flex items-center gap-4 rounded-[2rem] bg-mint-soft p-5">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-card text-success shadow-soft">
            <CheckCircle2 className="size-7" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-muted-foreground">Check-in de hoje feito</p>
            <p className="text-lg font-extrabold text-primary">
              Sono: {SLEEP_LABEL[j.todayCheckin.sleep] ?? "Ok"} · Pressão:{" "}
              {STRESS_LABEL[j.todayCheckin.stress] ?? "Ok"}
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="bg-card">
            <Link to="/checkin">Editar</Link>
          </Button>
        </section>
      ) : (
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-blue p-6 text-white shadow-lift">
          <div
            aria-hidden
            className="absolute -right-10 -top-12 size-44 rounded-full border-[18px] border-white/10"
          />
          <div
            aria-hidden
            className="absolute -bottom-14 right-12 size-40 rounded-full bg-mint/25 blur-2xl"
          />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                <Smile className="size-4" aria-hidden /> Check-in de hoje
              </span>
              <h2 className="mt-3 text-2xl font-extrabold">Como você está hoje?</h2>
              <p className="mt-1 text-white/80">Sono, estresse e corpo. Rápido, leve e só seu.</p>
            </div>
            <Button asChild variant="sun" size="lg" className="shrink-0">
              <Link to="/checkin">
                Fazer check-in <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Linha de aviso de poupança preventiva */}
      <div className="flex items-center gap-3 rounded-2xl border border-mint/40 bg-mint-soft/80 px-4 py-3 text-secondary-foreground shadow-xs">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-card text-primary shadow-soft">
          <PiggyBank className="size-5" aria-hidden />
        </span>
        <p className="text-sm font-semibold">
          Você já economizou{" "}
          <strong className="font-extrabold text-primary">
            R${" "}
            {healthProfile.insights.savingsValue?.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) ?? "1.240,00"}
          </strong>{" "}
          por se cuidar preventivamente.
        </p>
      </div>

      {j.careSupport && <CareSupportCard />}

      <section className="grid gap-3 md:grid-cols-3" aria-label="Resumo da sua saúde">
        <Link
          to="/minha-saude"
          hash="consultas"
          className="group flex flex-col rounded-[2rem] bg-sky-soft p-5 transition-transform hover:-translate-y-1"
        >
          <div className="flex items-start justify-between">
            <span className="grid size-12 place-items-center rounded-2xl bg-card text-primary shadow-soft">
              <Stethoscope className="size-6" aria-hidden />
            </span>
            <span className="grid size-8 place-items-center rounded-full bg-primary text-white">
              <ArrowRight className="size-4" aria-hidden />
            </span>
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-primary/70">
            Consultas APS
          </p>
          <p className="font-display text-2xl font-extrabold text-primary">4 atendimentos</p>
          <p className="text-sm font-semibold text-muted-foreground">
            Último: Consulta médica na UBS
          </p>
        </Link>

        <CommunityMiniCard gamification={healthProfile.gamification} />

        <Link
          to="/minha-saude"
          hash="familia"
          className="group flex flex-col rounded-[2rem] bg-peach p-5 transition-transform hover:-translate-y-1"
        >
          <div className="flex items-start justify-between">
            <span className="grid size-12 place-items-center rounded-2xl bg-card text-brick shadow-soft">
              <HeartHandshake className="size-6" aria-hidden />
            </span>
            <span className="grid size-8 place-items-center rounded-full bg-brick text-white">
              <ArrowRight className="size-4" aria-hidden />
            </span>
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-brick/80">
            Sua família
          </p>
          <p className="font-display text-2xl font-extrabold text-foreground">
            {healthProfile.dependents.length} pessoas
          </p>
          <p className="text-sm font-semibold text-muted-foreground">
            {healthProfile.dependents.filter((d) => d.healthStatus === "Atenção").length} ponto(s)
            de atenção
          </p>
        </Link>
      </section>

      <Link
        to="/minha-saude"
        hash="monitoramento"
        className="flex items-center gap-3 rounded-[1.5rem] bg-mint-soft px-4 py-3 transition-colors hover:bg-mint/25"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-card text-primary shadow-soft">
          <Eye className="size-5" aria-hidden />
        </span>
        <span className="text-sm font-semibold text-secondary-foreground">
          <strong className="block text-primary">A gente está de olho por você</strong>A análise
          stealth encontrou um cuidado suave para suas costas. Toque para ver.
        </span>
        <ArrowRight className="ml-auto size-5 shrink-0 text-primary" aria-hidden />
      </Link>

      {/* Botão de desafios do dia (abre popup sem poluir a tela inicial, com botão embaixo) */}
      <Dialog open={challengesOpen} onOpenChange={setChallengesOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="card-surface group flex w-full cursor-pointer flex-col gap-4 p-5 text-left transition-all hover:scale-[1.01] hover:border-primary/40 hover:shadow-lift md:p-6"
          >
            <div className="flex items-center gap-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-sky-soft text-primary shadow-soft transition-transform group-hover:scale-105">
                <Trophy className="size-7" aria-hidden />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-extrabold text-primary">Desafios de hoje</h2>
                  <span className="rounded-full bg-mint-soft px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
                    {doneCount} de {myChallenges.length} concluídos
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Toque para abrir e registrar seus cuidados do dia
                </p>
              </div>
            </div>
            <div className="w-full pt-1">
              <span className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-bold text-white shadow-soft transition-all group-hover:bg-primary/90">
                Ver desafios <ArrowRight className="size-4" />
              </span>
            </div>
          </button>
        </DialogTrigger>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold text-primary">
              Desafios de hoje
            </DialogTitle>
            <DialogDescription>
              {doneCount} de {myChallenges.length} concluídos hoje. Marque os que já realizou.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 space-y-3">
            {myChallenges.length === 0 ? (
              <p className="rounded-2xl bg-muted p-4 text-center text-muted-foreground">
                Você ainda não escolheu desafios para acompanhar.
              </p>
            ) : (
              myChallenges.map((c) => (
                <ChallengeRow
                  key={c.id}
                  challenge={c}
                  done={j.doneToday.has(c.id)}
                  disabled={toggle.isPending}
                  onToggle={() =>
                    toggle.mutate({ challengeId: c.id, done: j.doneToday.has(c.id) })
                  }
                />
              ))
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-4">
            <Button asChild variant="ghost" size="sm" onClick={() => setChallengesOpen(false)}>
              <Link to="/desafios">
                Ver catálogo completo <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setChallengesOpen(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 md:grid-cols-2">
        {nudges.length > 0 && (
          <section className="rounded-[2rem] bg-mint-soft p-5">
            <h2 className="flex items-center gap-2 font-extrabold text-primary">
              <Sparkles className="size-5" aria-hidden /> Um cuidado para hoje
            </h2>
            <ul className="mt-2 space-y-2 text-sm text-foreground/85">
              {nudges.slice(0, 2).map((n) => (
                <li key={n.id}>
                  <strong>{n.label}:</strong> {n.nudge}
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="rounded-[2rem] bg-sky-soft p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-primary/70">
            Dica para a sua rotina
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-primary">{tip.title}</h2>
          <p className="mt-1 text-sm text-foreground/80">{tip.text}</p>
        </section>
        <section className={cn("rounded-[2rem] bg-peach p-5", !nudges.length && "md:col-span-2")}>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brick/80">
            <Megaphone className="size-4" aria-hidden /> Campanha da empresa
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-foreground">{CAMPAIGN.name}</h2>
          <p className="mt-1 text-sm text-foreground/80">{CAMPAIGN.text}</p>
          <div className="mt-3">
            <div className="flex justify-between text-sm font-semibold text-foreground">
              <span>{CAMPAIGN.collectiveGoal.label}</span>
              <span>{goalPct}%</span>
            </div>
            <Progress value={goalPct} className="mt-1 h-2 bg-card [&>div]:bg-primary" />
          </div>
        </section>
      </div>

      <section className="card-surface p-5 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-primary">Sua evolução</h2>
            <p className="text-sm text-muted-foreground">Últimos 14 dias de check-in</p>
          </div>
          <div className="flex gap-3 text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="size-2.5 rounded-full bg-chart-2" />
              Humor
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2.5 rounded-full bg-chart-3" />
              Energia
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2.5 rounded-full bg-chart-1" />
              Sono
            </span>
          </div>
        </div>
        {j.checkins.length === 0 ? (
          <p className="mt-6 rounded-2xl bg-muted p-6 text-center text-muted-foreground">
            Seu gráfico aparece aqui depois dos primeiros check-ins.
          </p>
        ) : (
          <div className="mt-4">
            <WellbeingChart checkins={j.checkins} />
          </div>
        )}
      </section>

      {/* Recomendações (conquistas removidas da tela inicial conforme solicitado) */}
      <section className="card-surface p-5 md:p-6">
        <h2 className="text-xl font-extrabold text-primary">Recomendações para você</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {recs.map((r) => (
            <li key={r.title} className="rounded-2xl bg-muted p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-primary/70">
                {r.area}
              </p>
              <p className="font-bold text-primary">{r.title}</p>
              <p className="text-sm text-muted-foreground">{r.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
