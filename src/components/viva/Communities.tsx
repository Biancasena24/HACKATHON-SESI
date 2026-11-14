import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  Crown,
  Medal,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { communityGroups, communityPrizes, communityRules } from "@/lib/viva/mockData";
import type { Gamification } from "@/lib/viva/types";
import { ProgressRing } from "@/components/viva/ProgressRing";
import { cn } from "@/lib/utils";

function rankTone(rank: number) {
  if (rank === 1) return "bg-sun text-sun-foreground";
  if (rank === 2) return "bg-secondary text-primary";
  if (rank === 3) return "bg-care-soft text-destructive";
  return "bg-muted text-muted-foreground";
}

function rankedGroups() {
  return [...communityGroups].sort((a, b) => b.points - a.points);
}

export function CommunityMiniCard({ gamification }: { gamification: Gamification }) {
  const goal = gamification.weeklyGoal ?? 0;
  const pct = goal > 0 ? Math.min(100, Math.round((gamification.currentPoints / goal) * 100)) : 0;

  return (
    <Link
      to="/comunidades"
      className="group flex flex-col rounded-[2rem] bg-mint-soft p-5 transition-transform hover:-translate-y-1"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-12 place-items-center rounded-2xl bg-card text-primary shadow-soft">
          <Trophy className="size-6" aria-hidden />
        </span>
        <span
          className={cn(
            "rounded-full bg-card px-3 py-1 text-sm font-extrabold shadow-soft",
            rankTone(gamification.rank),
          )}
        >
          {gamification.rank}º lugar
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-primary/70">
            Sua comunidade
          </p>
          <p className="truncate font-display text-xl font-extrabold text-primary">
            {gamification.teamName}
          </p>
          <p className="text-sm font-semibold text-muted-foreground">
            {gamification.currentPoints.toLocaleString("pt-BR")} pontos juntos
          </p>
        </div>
        <ProgressRing value={pct} size={64} stroke={7}>
          <span className="text-xs font-extrabold text-primary">{pct}%</span>
        </ProgressRing>
      </div>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary group-hover:underline">
        Ver ranking <ArrowRight className="size-4" aria-hidden />
      </span>
    </Link>
  );
}

export function CommunitiesPanel({ gamification }: { gamification: Gamification }) {
  const ranked = rankedGroups();
  const topPoints = ranked[0]?.points ?? 1;
  const myGroup = ranked.find((group) => group.name === gamification.teamName) ?? ranked[1];
  const weeklyGoal = gamification.weeklyGoal ?? 0;
  const weeklyPct =
    weeklyGoal > 0 ? Math.min(100, Math.round((gamification.currentPoints / weeklyGoal) * 100)) : 0;

  return (
    <div className="space-y-6">
      <section className="relative grid items-center gap-6 overflow-hidden rounded-3xl bg-gradient-blue-soft p-6 shadow-soft md:grid-cols-[1.15fr_1fr] md:p-8">
        <div
          aria-hidden
          className="animate-float absolute -right-16 -top-20 size-64 rounded-full bg-secondary/50 blur-2xl"
        />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-wider text-blue">
            Gamificação e rede de apoio
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-primary md:text-4xl">
            Cuidar junto rende mais
          </h1>
          <p className="mt-2 text-base text-foreground/85">
            Times da empresa competem de forma amigável pelo melhor engajamento em saúde. Cada
            check-in e cada desafio concluído soma pontos para o seu grupo.
          </p>
          <Link
            to="/checkin"
            className="mt-5 inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-blue px-6 text-base font-bold text-white shadow-blue transition-transform hover:-translate-y-0.5"
          >
            Somar pontos hoje <ArrowRight className="size-5" aria-hidden />
          </Link>
        </div>
        <div className="relative grid grid-cols-2 gap-3">
          <div className="rounded-3xl bg-card p-4 text-center shadow-soft">
            <Trophy className="mx-auto size-8 text-sun" aria-hidden />
            <p className="mt-2 font-display text-3xl font-extrabold text-primary">
              {gamification.rank}º
            </p>
            <p className="text-sm font-bold text-muted-foreground">lugar do time</p>
          </div>
          <div className="rounded-3xl bg-card p-4 text-center shadow-soft">
            <Users className="mx-auto size-8 text-blue" aria-hidden />
            <p className="mt-2 font-display text-3xl font-extrabold text-primary">
              {myGroup?.members ?? 0}
            </p>
            <p className="text-sm font-bold text-muted-foreground">pessoas juntas</p>
          </div>
          <div className="col-span-2 flex items-center gap-4 rounded-[1.5rem] bg-card p-4 shadow-soft">
            <ProgressRing value={weeklyPct} size={80} stroke={9}>
              <span className="text-sm font-extrabold text-primary">{weeklyPct}%</span>
            </ProgressRing>
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                <Target className="size-4 text-primary" aria-hidden /> Meta do time nesta semana
              </p>
              <p className="mt-1 font-display text-2xl font-extrabold text-primary">
                {gamification.currentPoints.toLocaleString("pt-BR")}{" "}
                <span className="text-base text-muted-foreground">
                  / {weeklyGoal.toLocaleString("pt-BR")} pontos
                </span>
              </p>
              <p className="text-xs font-semibold text-muted-foreground">
                Cada check-in soma para todo o grupo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="card-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-extrabold text-primary">Ranking dos times</h2>
            <p className="text-sm text-muted-foreground">
              Atualizado hoje. Todos veem apenas a pontuação coletiva dos grupos.
            </p>
          </div>
          <span className="rounded-full bg-success-soft px-3 py-1.5 text-sm font-bold text-primary">
            Competição amigável
          </span>
        </div>

        <ol className="mt-4 space-y-3">
          {ranked.map((group, index) => {
            const rank = index + 1;
            const isMine = group.name === gamification.teamName;
            const pct = Math.max(8, Math.round((group.points / topPoints) * 100));
            return (
              <li
                key={group.id}
                className={cn(
                  "rounded-2xl border-2 p-4",
                  isMine ? "border-primary bg-success-soft/60" : "border-border bg-card",
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid size-11 shrink-0 place-items-center rounded-full font-display text-lg font-extrabold",
                      rankTone(rank),
                    )}
                  >
                    {rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-extrabold text-primary">{group.name}</p>
                      {isMine && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">
                          Seu time
                        </span>
                      )}
                      {rank === 1 && <Crown className="size-5 text-sun" aria-hidden />}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {group.sector} · {group.members} pessoas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl font-extrabold text-primary">
                      {group.points.toLocaleString("pt-BR")}
                    </p>
                    <p className="text-xs font-bold text-muted-foreground">pontos</p>
                  </div>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full", isMine ? "bg-primary" : "bg-chart-2")}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-muted-foreground">
                  <span className="inline-flex items-center gap-1 text-primary">
                    <TrendingUp className="size-3.5" aria-hidden /> +{group.weeklyGrowth}% na semana
                  </span>
                  <span>{group.highlight}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="card-surface p-5">
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-primary">
            <Sparkles className="size-5 text-primary" aria-hidden /> Como ganhar pontos
          </h2>
          <ul className="mt-3 space-y-3">
            {communityRules.map((rule) => (
              <li key={rule.title} className="rounded-2xl bg-muted p-3">
                <p className="font-bold text-primary">{rule.title}</p>
                <p className="text-sm text-muted-foreground">{rule.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <div className="card-surface p-5">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-primary">
              <Award className="size-5 text-sun" aria-hidden /> Medalhas do seu time
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {gamification.badges.map((badge) => (
                <li
                  key={badge}
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-sun bg-sun-soft px-3 py-1.5 text-sm font-bold text-accent-foreground"
                >
                  <Medal className="size-4" aria-hidden /> {badge}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">
              Medalhas são lembretes visuais do cuidado do grupo. Ninguém é cobrado por elas.
            </p>
          </div>

          <div className="rounded-3xl bg-ink p-5 text-ink-foreground">
            <h2 className="flex items-center gap-2 text-xl font-extrabold">
              <Trophy className="size-5 text-sun" aria-hidden /> Premiações do mês
            </h2>
            <ul className="mt-3 space-y-2">
              {communityPrizes.map((prize, index) => (
                <li key={prize} className="flex items-start gap-2 text-sm">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-sun text-xs font-extrabold text-sun-foreground">
                    {index + 1}
                  </span>
                  {prize}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs opacity-75">
              Premiações simbólicas e coletivas. O foco é criar uma rede de apoio, não uma
              competição de perfeição.
            </p>
          </div>
        </section>
      </div>

      <p className="rounded-2xl bg-blue-soft p-4 text-sm font-semibold text-blue-deep">
        <Users className="mr-2 inline size-4" aria-hidden />
        Grupos com menos de 10 pessoas não aparecem no ranking para proteger a privacidade de todos.
      </p>
    </div>
  );
}
