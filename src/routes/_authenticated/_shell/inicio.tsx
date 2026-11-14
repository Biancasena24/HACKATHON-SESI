import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  Eye,
  Flame,
  HeartHandshake,
  Megaphone,
  PiggyBank,
  Plus,
  Smile,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
import { POINTS_PER_LEVEL } from "@/lib/viva/gamification";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/_shell/inicio")({
  loader: ({ context }) => ensureJourney(context.queryClient, context.user.id),
  head: () => ({
    meta: [
      { title: "Minha jornada — VIVA+" },
      {
        name: "description",
        content: "Seu painel de autocuidado: check-in, desafios do dia, pontos e evolução.",
      },
      { property: "og:title", content: "Minha jornada — VIVA+" },
      { property: "og:description", content: "Painel individual de autocuidado." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const MOOD_LABEL = ["", "Muito difícil", "Difícil", "Ok", "Bem", "Muito bem"];

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

function Dashboard() {
  const j = useJourney();
  const toggle = useToggleChallengeLog();
  const mode = (j.profile?.work_mode ?? "home_office") as WorkMode;
  const tips = MODE_TIPS[mode] ?? MODE_TIPS.home_office;
  const tip = tips[new Date().getDate() % tips.length] ?? { title: "", text: "" };
  const recs = recommendationsFor((j.profile?.health_answers ?? {}) as HealthAnswers);
  const myChallenges = j.myChallengeIds
    .map(getChallenge)
    .filter((c): c is NonNullable<typeof c> => !!c);
  const doneCount = myChallenges.filter((c) => j.doneToday.has(c.id)).length;
  const nudges = BODY_AREAS.filter((b) => j.todayCheckin?.body_areas.includes(b.id));
  const unlocked = j.achievements.filter((a) => a.unlocked);
  const goalPct = Math.round(
    (CAMPAIGN.collectiveGoal.current / CAMPAIGN.collectiveGoal.target) * 100,
  );
  const levelPct = Math.round((j.level.progress / POINTS_PER_LEVEL) * 100);

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
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-soft px-3 py-1.5 text-sm font-bold text-secondary-foreground">
            <Flame className="size-4" aria-hidden />
            {j.streak} {j.streak === 1 ? "dia" : "dias"}
          </span>
          <RiskBadge risk={healthProfile.riskClassification} size="sm" />
        </div>
      </section>

      {j.todayCheckin ? (
        <section className="flex items-center gap-4 rounded-[2rem] bg-mint-soft p-5">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-card font-display text-2xl font-extrabold text-primary shadow-soft">
            {j.todayCheckin.mood}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-muted-foreground">Check-in de hoje feito</p>
            <p className="text-lg font-extrabold text-primary">
              Humor: {MOOD_LABEL[j.todayCheckin.mood]}
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
              <p className="mt-1 text-white/80">
                Humor, energia, sono e corpo. Rápido, leve e só seu.
              </p>
            </div>
            <Button asChild variant="sun" size="lg" className="shrink-0">
              <Link to="/checkin">
                Fazer check-in <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {j.careSupport && <CareSupportCard />}

      <section className="grid gap-3 md:grid-cols-3" aria-label="Resumo da sua saúde">
        <Link
          to="/minha-saude"
          className="group flex flex-col rounded-[2rem] bg-sky-soft p-5 transition-transform hover:-translate-y-1"
        >
          <div className="flex items-start justify-between">
            <span className="grid size-12 place-items-center rounded-2xl bg-card text-primary shadow-soft">
              <PiggyBank className="size-6" aria-hidden />
            </span>
            <span className="grid size-8 place-items-center rounded-full bg-primary text-white">
              <ArrowRight className="size-4" aria-hidden />
            </span>
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-primary/70">
            Sua poupança
          </p>
          <p className="font-display text-2xl font-extrabold text-primary">
            {healthProfile.insights.savings}
          </p>
          <p className="text-sm font-semibold text-muted-foreground">
            {healthProfile.insights.avoidedVisits} idas ao pronto-socorro evitadas
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

      <section className="grid grid-cols-3 gap-3">
        <div className="rounded-[1.5rem] bg-indigo-soft p-4">
          <Star className="size-5 text-primary" fill="currentColor" aria-hidden />
          <p className="mt-2 font-display text-2xl font-extrabold text-primary">{j.points}</p>
          <p className="text-xs font-semibold text-muted-foreground">pontos</p>
        </div>
        <div className="rounded-[1.5rem] bg-pink-soft p-4">
          <Flame className="size-5 text-care" aria-hidden />
          <p className="mt-2 font-display text-2xl font-extrabold text-foreground">{j.streak}</p>
          <p className="text-xs font-semibold text-muted-foreground">
            {j.streak === 1 ? "dia seguido" : "dias seguidos"}
          </p>
        </div>
        <div className="rounded-[1.5rem] bg-mint-soft p-4">
          <Award className="size-5 text-secondary-foreground" aria-hidden />
          <p className="mt-2 font-display text-2xl font-extrabold text-primary">
            Nv. {j.level.level}
          </p>
          <Progress
            value={levelPct}
            className="mt-1 h-1.5 bg-card [&>div]:bg-primary"
            aria-label="Progresso do nível"
          />
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
        <section className="card-surface p-5 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-primary">Desafios de hoje</h2>
              <p className="text-sm text-muted-foreground">
                {doneCount} de {myChallenges.length} concluídos
              </p>
            </div>
            <Link
              to="/desafios"
              aria-label="Ver todos os desafios"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-white shadow-blue transition-transform hover:scale-105"
            >
              <Plus className="size-5" aria-hidden />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {myChallenges.length === 0 && (
              <p className="rounded-2xl bg-muted p-4 text-muted-foreground">
                Você ainda não escolheu desafios.
              </p>
            )}
            {myChallenges.map((c) => (
              <ChallengeRow
                key={c.id}
                challenge={c}
                done={j.doneToday.has(c.id)}
                disabled={toggle.isPending}
                onToggle={() => toggle.mutate({ challengeId: c.id, done: j.doneToday.has(c.id) })}
              />
            ))}
          </div>
          <Button asChild variant="link" className="mt-2 px-0">
            <Link to="/desafios">
              Ver todos os desafios <ArrowRight />
            </Link>
          </Button>
        </section>

        <div className="space-y-4">
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
          <section className="rounded-[2rem] bg-peach p-5">
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

      <div className="grid gap-6 md:grid-cols-2">
        <section className="card-surface p-5 md:p-6">
          <h2 className="text-xl font-extrabold text-primary">Recomendações para você</h2>
          <ul className="mt-3 space-y-3">
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
        <section className="card-surface p-5 md:p-6">
          <h2 className="text-xl font-extrabold text-primary">Conquistas</h2>
          <p className="text-sm text-muted-foreground">
            {unlocked.length} de {j.achievements.length} desbloqueadas
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-3">
            {j.achievements.map((a) => (
              <li
                key={a.id}
                className={cn(
                  "rounded-2xl p-3",
                  a.unlocked
                    ? "bg-mint-soft"
                    : "border border-dashed border-border bg-muted/40 opacity-70",
                )}
              >
                <Award
                  className={cn(
                    "size-6",
                    a.unlocked ? "text-secondary-foreground" : "text-muted-foreground",
                  )}
                  aria-hidden
                />
                <p className="mt-1 text-sm font-bold text-primary">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
