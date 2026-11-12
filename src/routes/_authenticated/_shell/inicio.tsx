import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Flame, Megaphone, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChallengeRow } from "@/components/viva/ChallengeRow";
import { WellbeingChart } from "@/components/viva/WellbeingChart";
import { CareSupportCard } from "@/components/viva/CareSupportCard";
import { ensureJourney, useJourney, useToggleChallengeLog } from "@/hooks/use-journey";
import { getChallenge, type WorkMode } from "@/lib/viva/challenges";
import { BODY_AREAS, CAMPAIGN, MODE_TIPS } from "@/lib/viva/content";
import { recommendationsFor, type HealthAnswers } from "@/lib/viva/questionnaire";
import { POINTS_PER_LEVEL } from "@/lib/viva/gamification";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/_shell/inicio")({
  loader: ({ context }) => ensureJourney(context.queryClient, context.user.id),
  head: () => ({
    meta: [
      { title: "Minha jornada — VIVA+" },
      { name: "description", content: "Seu painel de autocuidado: check-in, desafios do dia, pontos e evolução." },
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
  const tip = tips[new Date().getDate() % tips.length];
  const recs = recommendationsFor((j.profile?.health_answers ?? {}) as HealthAnswers);
  const myChallenges = j.myChallengeIds.map(getChallenge).filter((c): c is NonNullable<typeof c> => !!c);
  const doneCount = myChallenges.filter((c) => j.doneToday.has(c.id)).length;
  const nudges = BODY_AREAS.filter((b) => j.todayCheckin?.body_areas.includes(b.id));
  const unlocked = j.achievements.filter((a) => a.unlocked);
  const goalPct = Math.round((CAMPAIGN.collectiveGoal.current / CAMPAIGN.collectiveGoal.target) * 100);

  return (
    <div className="space-y-6">
      <section className="animate-rise">
        <p className="text-muted-foreground">{greeting()},</p>
        <h1 className="text-3xl font-extrabold text-primary md:text-4xl">{j.profile?.display_name || "você"} 👋</h1>
      </section>

      {/* Check-in card */}
      {j.todayCheckin ? (
        <section className="card-surface flex items-center gap-4 p-5">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-success-soft font-display text-2xl font-extrabold text-success">
            {j.todayCheckin.mood}
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-muted-foreground">Check-in de hoje feito</p>
            <p className="text-lg font-bold text-primary">Humor: {MOOD_LABEL[j.todayCheckin.mood]}</p>
          </div>
          <Button asChild variant="soft" size="sm">
            <Link to="/checkin">Editar</Link>
          </Button>
        </section>
      ) : (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-lift">
          <div aria-hidden className="absolute -right-10 -top-10 size-40 rounded-full bg-sun-orb opacity-90" />
          <div className="relative max-w-sm">
            <p className="text-sm font-semibold opacity-80">10 segundos</p>
            <h2 className="mt-1 text-2xl font-bold">Como você está hoje?</h2>
            <p className="mt-1 opacity-85">Humor, energia, sono e corpo. Rápido e só seu.</p>
            <Button asChild variant="sun" size="lg" className="mt-4">
              <Link to="/checkin">Fazer check-in <ArrowRight /></Link>
            </Button>
          </div>
        </section>
      )}

      {j.careSupport && <CareSupportCard />}

      {/* Stats */}
      <section className="grid grid-cols-3 gap-3">
        <div className="card-surface p-4">
          <Star className="size-5 text-sun" fill="currentColor" />
          <p className="mt-2 font-display text-2xl font-extrabold text-primary">{j.points}</p>
          <p className="text-xs font-semibold text-muted-foreground">pontos</p>
        </div>
        <div className="card-surface p-4">
          <Flame className="size-5 text-care" />
          <p className="mt-2 font-display text-2xl font-extrabold text-primary">{j.streak}</p>
          <p className="text-xs font-semibold text-muted-foreground">{j.streak === 1 ? "dia seguido" : "dias seguidos"}</p>
        </div>
        <div className="card-surface p-4">
          <Award className="size-5 text-sky" />
          <p className="mt-2 font-display text-2xl font-extrabold text-primary">Nv. {j.level.level}</p>
          <Progress value={(j.level.progress / POINTS_PER_LEVEL) * 100} className="mt-1 h-1.5 bg-secondary [&>div]:bg-sky" />
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
        {/* Today's challenges */}
        <section className="card-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary">Desafios de hoje</h2>
            <span className="rounded-full bg-secondary px-3 py-1 text-sm font-bold text-primary">
              {doneCount}/{myChallenges.length}
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {myChallenges.length === 0 && <p className="text-muted-foreground">Você ainda não escolheu desafios.</p>}
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
            <Link to="/desafios">Ver todos os desafios <ArrowRight /></Link>
          </Button>
        </section>

        <div className="space-y-6">
          {nudges.length > 0 && (
            <section className="rounded-3xl bg-sun-soft p-5">
              <h2 className="flex items-center gap-2 font-bold text-accent-foreground">
                <Sparkles className="size-5" /> Um cuidado para hoje
              </h2>
              <ul className="mt-2 space-y-2 text-foreground">
                {nudges.slice(0, 2).map((n) => (
                  <li key={n.id}><strong>{n.label}:</strong> {n.nudge}</li>
                ))}
              </ul>
            </section>
          )}
          <section className="card-surface p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-sky">Dica para a sua rotina</p>
            <h2 className="mt-1 text-lg font-bold text-primary">{tip.title}</h2>
            <p className="mt-1 text-muted-foreground">{tip.text}</p>
          </section>
          <section className="rounded-3xl border border-sky/30 bg-sky-soft p-5">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Megaphone className="size-4" /> Campanha da empresa
            </p>
            <h2 className="mt-1 text-lg font-bold text-primary">{CAMPAIGN.name}</h2>
            <p className="mt-1 text-sm text-foreground/80">{CAMPAIGN.text}</p>
            <div className="mt-3">
              <div className="flex justify-between text-sm font-semibold text-primary">
                <span>{CAMPAIGN.collectiveGoal.label}</span>
                <span>{goalPct}%</span>
              </div>
              <Progress value={goalPct} className="mt-1 h-2 bg-card [&>div]:bg-sky" />
            </div>
          </section>
        </div>
      </div>

      {/* Evolution */}
      <section className="card-surface p-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-primary">Sua evolução</h2>
            <p className="text-sm text-muted-foreground">Últimos 14 dias de check-in</p>
          </div>
          <div className="flex gap-3 text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-chart-2" />Humor</span>
            <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-chart-3" />Energia</span>
            <span className="flex items-center gap-1"><span className="size-2.5 rounded-full bg-chart-1" />Sono</span>
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
        <section className="card-surface p-5">
          <h2 className="text-xl font-bold text-primary">Recomendações para você</h2>
          <ul className="mt-3 space-y-3">
            {recs.map((r) => (
              <li key={r.title} className="rounded-2xl bg-muted p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-sky">{r.area}</p>
                <p className="font-bold text-primary">{r.title}</p>
                <p className="text-sm text-muted-foreground">{r.text}</p>
              </li>
            ))}
          </ul>
        </section>
        <section className="card-surface p-5">
          <h2 className="text-xl font-bold text-primary">Conquistas</h2>
          <p className="text-sm text-muted-foreground">{unlocked.length} de {j.achievements.length} desbloqueadas</p>
          <ul className="mt-3 grid grid-cols-2 gap-3">
            {j.achievements.map((a) => (
              <li key={a.id} className={cn("rounded-2xl border-2 p-3", a.unlocked ? "border-sun bg-sun-soft" : "border-dashed border-border opacity-60")}>
                <Award className={cn("size-6", a.unlocked ? "text-accent-foreground" : "text-muted-foreground")} />
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
