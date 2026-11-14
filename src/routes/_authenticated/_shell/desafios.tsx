import { createFileRoute } from "@tanstack/react-router";
import { Minus, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChallengeRow } from "@/components/viva/ChallengeRow";
import { ensureJourney, useJourney, useToggleChallengeLog, useToggleJoin } from "@/hooks/use-journey";
import { AREA_LABEL, CHALLENGES, type WorkMode } from "@/lib/viva/challenges";
import { CAMPAIGN } from "@/lib/viva/content";
import { daysAgoStr } from "@/lib/viva/dates";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/_shell/desafios")({
  loader: ({ context }) => ensureJourney(context.queryClient, context.user.id),
  head: () => ({
    meta: [
      { title: "Desafios e metas — VIVA+" },
      { name: "description", content: "Desafios semanais de autocuidado: caminhar, pausas, sono, respiração, hidratação e prevenção." },
      { property: "og:title", content: "Desafios e metas — VIVA+" },
      { property: "og:description", content: "Pequenos desafios semanais de autocuidado." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Challenges,
});

const WEEK_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];

function Challenges() {
  const j = useJourney();
  const log = useToggleChallengeLog();
  const join = useToggleJoin();
  const mode = (j.profile?.work_mode ?? "home_office") as WorkMode;
  const last7 = Array.from({ length: 7 }, (_, i) => daysAgoStr(6 - i));
  const mine = CHALLENGES.filter((c) => j.myChallengeIds.includes(c.id));
  const others = CHALLENGES.filter((c) => !j.myChallengeIds.includes(c.id) && (!c.modes || c.modes.includes(mode)));
  const weekDone = j.logs.filter((l) => l.day >= (last7[0] ?? "")).length;
  const weekTarget = Math.max(mine.length * 5, 1);
  const goalPct = Math.round((CAMPAIGN.collectiveGoal.current / CAMPAIGN.collectiveGoal.target) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-primary">Desafios e metas</h1>
        <p className="text-muted-foreground">Comece pequeno. Fazer na maioria dos dias já é ótimo — ninguém precisa ser perfeito.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-lift">
          <p className="text-sm font-semibold opacity-80">Minha meta da semana</p>
          <p className="mt-1 font-display text-3xl font-extrabold">{weekDone} <span className="text-lg opacity-70">/ {weekTarget} cuidados</span></p>
          <Progress value={Math.min(100, (weekDone / weekTarget) * 100)} className="mt-3 h-2 bg-primary-foreground/20 [&>div]:bg-sun" />
          <p className="mt-2 text-sm opacity-80">Meta sugerida: seus desafios em 5 dos 7 dias.</p>
        </section>
        <section className="card-surface p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground"><Users className="size-4" /> Meta coletiva · {CAMPAIGN.name}</p>
          <p className="mt-1 font-display text-3xl font-extrabold text-primary">{CAMPAIGN.collectiveGoal.current.toLocaleString("pt-BR")}<span className="text-lg text-muted-foreground"> / {CAMPAIGN.collectiveGoal.target.toLocaleString("pt-BR")}</span></p>
          <Progress value={goalPct} className="mt-3 h-2 bg-secondary [&>div]:bg-sky" />
          <p className="mt-2 text-sm text-muted-foreground">{CAMPAIGN.collectiveGoal.label}. Cada caminhada sua soma — de forma anônima.</p>
        </section>
      </div>

      <section className="card-surface p-5">
        <h2 className="text-xl font-bold text-primary">Meus desafios</h2>
        <div className="mt-4 space-y-4">
          {mine.length === 0 && <p className="text-muted-foreground">Escolha um desafio abaixo para começar.</p>}
          {mine.map((c) => {
            const daysDone = new Set(j.logs.filter((l) => l.challenge_id === c.id).map((l) => l.day));
            return (
              <div key={c.id} className="space-y-2">
                <ChallengeRow challenge={c} done={j.doneToday.has(c.id)} disabled={log.isPending} onToggle={() => log.mutate({ challengeId: c.id, done: j.doneToday.has(c.id) })} />
                <div className="flex items-center justify-between gap-3 px-1">
                  <div className="flex gap-1.5" aria-label={`${daysDone.size} dias nos últimos 7`}>
                    {last7.map((d) => (
                      <span key={d} className="flex flex-col items-center gap-0.5">
                        <span className={cn("size-5 rounded-full", daysDone.has(d) ? "bg-success" : "bg-muted")} />
                        <span className="text-[10px] font-semibold text-muted-foreground">{WEEK_LABELS[new Date(d + "T12:00:00").getDay()]}</span>
                      </span>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => join.mutate({ challengeId: c.id, joined: true })} disabled={join.isPending}>
                    <Minus /> Sair
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-primary">Mais desafios para a sua rotina</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {others.map((c) => (
            <div key={c.id} className="card-surface flex flex-col p-5">
              <span className="w-fit rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-secondary-foreground">{AREA_LABEL[c.area]}</span>
              <h3 className="mt-2 text-lg font-bold text-primary">{c.title}</h3>
              <p className="text-sm text-muted-foreground">{c.why}</p>
              <Button variant="soft" className="mt-4 w-fit" onClick={() => join.mutate({ challengeId: c.id, joined: false })} disabled={join.isPending}>
                <Plus /> Quero participar
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
