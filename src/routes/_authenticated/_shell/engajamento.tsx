import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  Minus,
  Plus,
  Smile,
  Trophy,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BodyMap } from "@/components/viva/BodyMap";
import { ChallengeRow } from "@/components/viva/ChallengeRow";
import { CommunitiesPanel } from "@/components/viva/Communities";
import {
  ensureJourney,
  useJourney,
  useToggleChallengeLog,
  useToggleJoin,
} from "@/hooks/use-journey";
import { AREA_LABEL, CHALLENGES, type WorkMode } from "@/lib/viva/challenges";
import { BODY_AREAS, CAMPAIGN } from "@/lib/viva/content";
import { daysAgoStr } from "@/lib/viva/dates";
import { healthProfile } from "@/lib/viva/mockData";
import { cn } from "@/lib/utils";

type TabKey = "checkin" | "desafios" | "comunidade";

type EngajamentoSearch = {
  tab?: TabKey;
};

export const Route = createFileRoute("/_authenticated/_shell/engajamento")({
  validateSearch: (s: Record<string, unknown>): EngajamentoSearch => ({
    tab: s["tab"] === "desafios" || s["tab"] === "comunidade" ? (s["tab"] as TabKey) : "checkin",
  }),
  loader: ({ context }) => ensureJourney(context.queryClient, context.user.id),
  head: () => ({
    meta: [
      { title: "Engajamento — Cuidaê+" },
      {
        name: "description",
        content: "Check-in do dia, desafios de autocuidado e comunidades em um só lugar.",
      },
      { property: "og:title", content: "Engajamento — Cuidaê+" },
      { property: "og:description", content: "Autocuidado diário, desafios e comunidade saudável." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EngajamentoPage,
});

/* -------------------------------------------------------------------------- */
/*                                CHECK-IN TAB                                */
/* -------------------------------------------------------------------------- */

type Key = "sleep" | "stress";
const SCALES: { key: Key; q: string; options: { emoji: string; label: string }[] }[] = [
  {
    key: "sleep",
    q: "Como foi seu sono?",
    options: [
      { emoji: "😫", label: "Péssimo" },
      { emoji: "😴", label: "Ruim" },
      { emoji: "😐", label: "Regular" },
      { emoji: "😌", label: "Bom" },
      { emoji: "🌙", label: "Ótimo" },
    ],
  },
  {
    key: "stress",
    q: "Quanta pressão você sente hoje?",
    options: [
      { emoji: "🌿", label: "Tranquilo" },
      { emoji: "🙂", label: "Pouca" },
      { emoji: "😬", label: "Alguma" },
      { emoji: "😰", label: "Muita" },
      { emoji: "🌋", label: "Demais" },
    ],
  },
];

function CheckinTab() {
  const j = useJourney();
  const qc = useQueryClient();
  const existing = j.todayCheckin;
  const [vals, setVals] = useState<Partial<Record<Key, number>>>(
    existing ? { sleep: existing.sleep, stress: existing.stress } : {},
  );
  const [areas, setAreas] = useState<string[]>(existing?.body_areas ?? []);
  const [note, setNote] = useState(existing?.note ?? "");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const complete = SCALES.every((s) => vals[s.key]);

  async function save() {
    if (!complete) return;
    setBusy(true);
    const { error } = await supabase.from("checkins").upsert(
      {
        user_id: j.user.id,
        day: j.today,
        mood: existing?.mood ?? 3,
        energy: existing?.energy ?? 3,
        sleep: vals.sleep!,
        stress: vals.stress!,
        body_areas: areas,
        note: note.trim().slice(0, 500) || null,
      },
      { onConflict: "user_id,day" },
    );
    setBusy(false);
    if (error) {
      toast.error("Não conseguimos salvar. Tente de novo.");
      return;
    }
    await qc.invalidateQueries({ queryKey: ["checkins", j.user.id] });
    if (!existing) toast.success("Check-in registrado com sucesso!");
    setSaved(true);
  }

  if (saved) {
    const nudges = BODY_AREAS.filter((b) => areas.includes(b.id));
    return (
      <div className="mx-auto max-w-xl space-y-5 animate-rise">
        <div className="card-surface p-8 text-center">
          <CheckCircle2 className="mx-auto size-14 text-success" />
          <h2 className="mt-3 text-2xl font-bold text-primary">Obrigado por se ouvir hoje</h2>
          <p className="mt-1 text-muted-foreground">Registrar como você está já é um ato de cuidado.</p>
        </div>
        {nudges.length > 0 && (
          <div className="rounded-3xl bg-sun-soft p-5">
            <h3 className="font-bold text-accent-foreground">Para o seu corpo hoje</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {nudges.map((n) => (
                <li key={n.id}>
                  <strong>{n.label}:</strong> {n.nudge}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => setSaved(false)}>
            Revisar respostas
          </Button>
          <Button asChild variant="default">
            <Link to="/inicio">Voltar ao início</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="card-surface p-5 md:p-6">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-sky-soft text-primary">
            <Smile className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-primary">
              {existing ? "Editar check-in de hoje" : "Como você está hoje?"}
            </h2>
            <p className="text-xs text-muted-foreground">Leva menos de 10 segundos.</p>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {SCALES.map((scale) => (
            <div key={scale.key} className="space-y-2">
              <label className="text-sm font-bold text-primary">{scale.q}</label>
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {scale.options.map((opt, i) => {
                  const val = i + 1;
                  const active = vals[scale.key] === val;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setVals((v) => ({ ...v, [scale.key]: val }))}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-2xl border p-2.5 transition-all text-center",
                        active
                          ? "border-primary bg-primary text-white shadow-soft"
                          : "border-border bg-card hover:border-primary/40",
                      )}
                    >
                      <span className="text-xl sm:text-2xl">{opt.emoji}</span>
                      <span
                        className={cn(
                          "text-[10px] sm:text-xs font-semibold leading-tight",
                          active ? "text-white" : "text-muted-foreground",
                        )}
                      >
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="space-y-2">
            <label className="text-sm font-bold text-primary">
              Alguma dor ou incômodo no corpo hoje?
            </label>
            <BodyMap value={areas} onChange={setAreas} />
          </div>

          <div className="space-y-2">
            <label htmlFor="note" className="text-sm font-bold text-primary">
              Quer anotar algo sobre o dia? (opcional)
            </label>
            <Textarea
              id="note"
              placeholder="Ex.: Dormi tarde ontem, reunião difícil pela manhã..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="resize-none rounded-2xl"
              maxLength={500}
            />
          </div>

          <Button
            type="button"
            size="lg"
            variant="hero"
            className="w-full"
            disabled={!complete || busy}
            onClick={save}
          >
            {busy ? "Salvando..." : existing ? "Atualizar check-in" : "Salvar check-in"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                DESAFIOS TAB                                */
/* -------------------------------------------------------------------------- */

const WEEK_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];

function ChallengesTab() {
  const j = useJourney();
  const log = useToggleChallengeLog();
  const join = useToggleJoin();
  const mode = (j.profile?.work_mode ?? "home_office") as WorkMode;
  const last7 = Array.from({ length: 7 }, (_, i) => daysAgoStr(6 - i));
  const mine = CHALLENGES.filter((c) => j.myChallengeIds.includes(c.id));
  const others = CHALLENGES.filter(
    (c) => !j.myChallengeIds.includes(c.id) && (!c.modes || c.modes.includes(mode)),
  );
  const weekDone = j.logs.filter((l) => l.day >= (last7[0] ?? "")).length;
  const weekTarget = Math.max(mine.length * 5, 1);
  const goalPct = Math.round(
    (CAMPAIGN.collectiveGoal.current / CAMPAIGN.collectiveGoal.target) * 100,
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-lift">
          <p className="text-sm font-semibold opacity-80">Minha meta da semana</p>
          <p className="mt-1 font-display text-3xl font-extrabold">
            {weekDone} <span className="text-lg opacity-70">/ {weekTarget} cuidados</span>
          </p>
          <Progress
            value={Math.min(100, (weekDone / weekTarget) * 100)}
            className="mt-3 h-2 bg-primary-foreground/20 [&>div]:bg-sun"
          />
          <p className="mt-2 text-sm opacity-80">Meta sugerida: seus desafios em 5 dos 7 dias.</p>
        </section>
        <section className="card-surface p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Users className="size-4" /> Meta coletiva · {CAMPAIGN.name}
          </p>
          <p className="mt-1 font-display text-3xl font-extrabold text-primary">
            {CAMPAIGN.collectiveGoal.current.toLocaleString("pt-BR")}
            <span className="text-lg text-muted-foreground">
              {" "}
              / {CAMPAIGN.collectiveGoal.target.toLocaleString("pt-BR")}
            </span>
          </p>
          <Progress value={goalPct} className="mt-3 h-2 bg-secondary [&>div]:bg-sky" />
          <p className="mt-2 text-sm text-muted-foreground">
            {CAMPAIGN.collectiveGoal.label}. Cada atividade sua soma — de forma anônima.
          </p>
        </section>
      </div>

      <section className="card-surface p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary">Meus desafios ativos</h2>
          <span className="text-xs font-semibold text-muted-foreground">
            {mine.length} selecionado(s)
          </span>
        </div>
        <div className="mt-4 space-y-4">
          {mine.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Escolha desafios no catálogo abaixo para acompanhar na sua rotina.
            </p>
          )}
          {mine.map((c) => {
            const daysDone = new Set(
              j.logs.filter((l) => l.challenge_id === c.id).map((l) => l.day),
            );
            return (
              <div key={c.id} className="space-y-2 rounded-2xl border border-border/80 p-3 sm:p-4">
                <ChallengeRow
                  challenge={c}
                  done={j.doneToday.has(c.id)}
                  disabled={log.isPending}
                  onToggle={() =>
                    log.mutate({ challengeId: c.id, done: j.doneToday.has(c.id) })
                  }
                />
                <div className="flex items-center justify-between gap-3 pt-2">
                  <div
                    className="flex gap-1.5"
                    aria-label={`${daysDone.size} dias nos últimos 7`}
                  >
                    {last7.map((d) => (
                      <span key={d} className="flex flex-col items-center gap-0.5">
                        <span
                          className={cn(
                            "size-5 rounded-full transition-colors",
                            daysDone.has(d) ? "bg-success" : "bg-muted",
                          )}
                        />
                        <span className="text-[10px] font-semibold text-muted-foreground">
                          {WEEK_LABELS[new Date(d + "T12:00:00").getDay()]}
                        </span>
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => join.mutate({ challengeId: c.id, joined: true })}
                    disabled={join.isPending}
                  >
                    <Minus className="mr-1 size-3.5" /> Deixar de seguir
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-primary">Mais desafios para sua rotina</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {others.map((c) => (
            <div key={c.id} className="card-surface flex flex-col p-5">
              <span className="w-fit rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-secondary-foreground">
                {AREA_LABEL[c.area]}
              </span>
              <h3 className="mt-2 text-lg font-bold text-primary">{c.title}</h3>
              <p className="text-sm text-muted-foreground">{c.why}</p>
              <Button
                variant="soft"
                className="mt-4 w-fit"
                onClick={() => join.mutate({ challengeId: c.id, joined: false })}
                disabled={join.isPending}
              >
                <Plus className="mr-1 size-4" /> Quero participar
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN PAGE COMPONENT                          */
/* -------------------------------------------------------------------------- */

function EngajamentoPage() {
  const search = useSearch({ from: "/_authenticated/_shell/engajamento" });
  const navigate = useNavigate();
  const activeTab: TabKey = search.tab || "checkin";

  function handleTabChange(tab: string) {
    navigate({
      to: "/engajamento",
      search: { tab: tab as TabKey },
      replace: true,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-primary">Engajamento</h1>
        <p className="text-muted-foreground">
          Seu autocuidado diário, metas em grupo e comunidade saudável em um só lugar.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-secondary/80 p-1.5 h-auto">
          <TabsTrigger
            value="checkin"
            className="gap-1 sm:gap-1.5 rounded-xl px-1.5 sm:px-3 py-2.5 text-xs sm:text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-soft"
          >
            <Smile className="size-4 shrink-0" /> Check-in
          </TabsTrigger>
          <TabsTrigger
            value="desafios"
            className="gap-1 sm:gap-1.5 rounded-xl px-1.5 sm:px-3 py-2.5 text-xs sm:text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-soft"
          >
            <Trophy className="size-4 shrink-0" /> Desafios
          </TabsTrigger>
          <TabsTrigger
            value="comunidade"
            className="gap-1 sm:gap-1.5 rounded-xl px-1.5 sm:px-3 py-2.5 text-xs sm:text-sm font-bold data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-soft"
          >
            <Users className="size-4 shrink-0" /> Comunidade
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checkin" className="mt-0 focus-visible:outline-none">
          <CheckinTab />
        </TabsContent>

        <TabsContent value="desafios" className="mt-0 focus-visible:outline-none">
          <ChallengesTab />
        </TabsContent>

        <TabsContent value="comunidade" className="mt-0 focus-visible:outline-none">
          <CommunitiesPanel gamification={healthProfile.gamification} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
