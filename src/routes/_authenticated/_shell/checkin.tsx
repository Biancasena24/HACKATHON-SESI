import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Wind } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BodyMap } from "@/components/viva/BodyMap";
import { ensureJourney, useJourney } from "@/hooks/use-journey";
import { POINTS } from "@/lib/viva/gamification";
import { BODY_AREAS } from "@/lib/viva/content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/_shell/checkin")({
  loader: ({ context }) => ensureJourney(context.queryClient, context.user.id),
  head: () => ({
    meta: [
      { title: "Check-in do dia — VIVA+" },
      { name: "description", content: "Registre em 10 segundos como estão seu humor, energia, sono, estresse e corpo." },
      { property: "og:title", content: "Check-in do dia — VIVA+" },
      { property: "og:description", content: "Check-in emocional de 10 segundos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CheckinPage,
});

type Key = "mood" | "energy" | "sleep" | "stress";
const SCALES: { key: Key; q: string; options: { emoji: string; label: string }[] }[] = [
  { key: "mood", q: "Como está seu humor?", options: [
    { emoji: "😣", label: "Muito difícil" }, { emoji: "😕", label: "Difícil" }, { emoji: "😐", label: "Ok" }, { emoji: "🙂", label: "Bem" }, { emoji: "😄", label: "Muito bem" },
  ] },
  { key: "energy", q: "E sua energia?", options: [
    { emoji: "🪫", label: "Sem energia" }, { emoji: "🥱", label: "Baixa" }, { emoji: "🙂", label: "Média" }, { emoji: "💪", label: "Boa" }, { emoji: "⚡", label: "Muita" },
  ] },
  { key: "sleep", q: "Como foi seu sono?", options: [
    { emoji: "😫", label: "Péssimo" }, { emoji: "😴", label: "Ruim" }, { emoji: "😐", label: "Regular" }, { emoji: "😌", label: "Bom" }, { emoji: "🌙", label: "Ótimo" },
  ] },
  { key: "stress", q: "Quanta pressão você sente hoje?", options: [
    { emoji: "🌿", label: "Tranquilo" }, { emoji: "🙂", label: "Pouca" }, { emoji: "😬", label: "Alguma" }, { emoji: "😰", label: "Muita" }, { emoji: "🌋", label: "Demais" },
  ] },
];

function CheckinPage() {
  const j = useJourney();
  const qc = useQueryClient();
  const existing = j.todayCheckin;
  const [vals, setVals] = useState<Partial<Record<Key, number>>>(
    existing ? { mood: existing.mood, energy: existing.energy, sleep: existing.sleep, stress: existing.stress } : {},
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
        mood: vals.mood!,
        energy: vals.energy!,
        sleep: vals.sleep!,
        stress: vals.stress!,
        body_areas: areas,
        note: note.trim().slice(0, 500) || null,
      },
      { onConflict: "user_id,day" },
    );
    setBusy(false);
    if (error) return toast.error("Não conseguimos salvar. Tente de novo.");
    await qc.invalidateQueries({ queryKey: ["checkins", j.user.id] });
    if (!existing) toast.success(`+${POINTS.checkin} pontos de cuidado`);
    setSaved(true);
  }

  if (saved) {
    const tough = (vals.stress ?? 0) >= 4 || (vals.mood ?? 5) <= 2;
    const nudges = BODY_AREAS.filter((b) => areas.includes(b.id));
    return (
      <div className="mx-auto max-w-xl space-y-5 animate-rise">
        <div className="card-surface p-8 text-center">
          <CheckCircle2 className="mx-auto size-14 text-success" />
          <h1 className="mt-3 text-2xl font-bold text-primary">Obrigado por se ouvir hoje</h1>
          <p className="mt-1 text-muted-foreground">Registrar como você está já é um ato de cuidado.</p>
        </div>
        {tough && (
          <div className="rounded-3xl bg-sky-soft p-5">
            <h2 className="font-bold text-primary">Dia puxado? Que tal 2 minutos de respiração?</h2>
            <p className="text-sm text-foreground/80">Também é válido conversar com alguém. A UBS pode acolher você.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild variant="default"><Link to="/bem-estar"><Wind /> Respirar agora</Link></Button>
              <Button asChild variant="outline"><Link to="/cuidado">Onde buscar apoio</Link></Button>
            </div>
          </div>
        )}
        {nudges.length > 0 && (
          <div className="rounded-3xl bg-sun-soft p-5">
            <h2 className="font-bold text-accent-foreground">Para o seu corpo hoje</h2>
            <ul className="mt-2 space-y-2">
              {nudges.map((n) => <li key={n.id}><strong>{n.label}:</strong> {n.nudge}</li>)}
            </ul>
          </div>
        )}
        <Button asChild variant="hero" size="lg" className="w-full"><Link to="/inicio">Voltar ao início</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-3xl font-extrabold text-primary">Check-in do dia</h1>
        <p className="text-muted-foreground">Leva 10 segundos. Só você vê suas respostas.</p>
      </div>
      {SCALES.map((s) => (
        <fieldset key={s.key} className="card-surface p-5">
          <legend className="sr-only">{s.q}</legend>
          <p className="font-bold text-primary">{s.q}</p>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {s.options.map((o, i) => {
              const v = i + 1;
              const active = vals[s.key] === v;
              return (
                <button
                  key={o.label}
                  type="button"
                  aria-pressed={active}
                  aria-label={o.label}
                  onClick={() => setVals((cur) => ({ ...cur, [s.key]: v }))}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-2xl border-2 px-1 py-3 transition-all",
                    active ? "border-sky bg-sky-soft scale-[1.03] shadow-soft" : "border-transparent bg-muted hover:border-sky/40",
                  )}
                >
                  <span className="text-2xl sm:text-3xl" aria-hidden>{o.emoji}</span>
                  <span className="text-[11px] font-semibold leading-tight text-muted-foreground sm:text-xs">{o.label}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
      <section className="card-surface p-5">
        <p className="font-bold text-primary">Mapa do corpo</p>
        <div className="mt-3"><BodyMap value={areas} onChange={setAreas} /></div>
      </section>
      <section className="card-surface p-5">
        <label htmlFor="note" className="font-bold text-primary">Quer anotar algo? (opcional)</label>
        <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} className="mt-2 rounded-xl" placeholder="Só para você lembrar depois" />
      </section>
      <div className="sticky bottom-24 z-10 md:bottom-4">
        <Button variant="hero" size="xl" className="w-full" disabled={!complete || busy} onClick={save}>
          {busy ? "Salvando..." : existing ? "Atualizar check-in" : "Salvar check-in"}
        </Button>
      </div>
    </div>
  );
}
