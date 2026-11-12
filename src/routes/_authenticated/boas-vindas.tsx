import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Logo } from "@/components/viva/Logo";
import { profileQuery } from "@/lib/viva/queries";
import { AREA_LABEL, WORK_MODES, suggestChallenges, type FocusArea, type WorkMode } from "@/lib/viva/challenges";
import { HABIT_QUESTIONS, type HealthAnswers } from "@/lib/viva/questionnaire";
import { useVivaUser } from "@/hooks/use-viva-user";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/boas-vindas")({
  loader: ({ context }) => context.queryClient.ensureQueryData(profileQuery(context.user.id)),
  head: () => ({
    meta: [
      { title: "Boas-vindas — VIVA+" },
      { name: "description", content: "Conte um pouco sobre sua rotina para personalizar sua jornada de autocuidado." },
      { property: "og:title", content: "Boas-vindas ao VIVA+" },
      { property: "og:description", content: "Questionário inicial de hábitos e rotina." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Onboarding,
});

const FOCUS: FocusArea[] = ["movimento", "sono", "mente", "hidratacao", "alimentacao", "prevencao"];

function OptionCard({ selected, onClick, title, hint }: { selected: boolean; onClick: () => void; title: string; hint?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-2xl border-2 bg-card p-4 text-left transition-all",
        selected ? "border-sky bg-sky-soft shadow-soft" : "border-border hover:border-sky/50",
      )}
    >
      <span>
        <span className="block font-bold text-primary">{title}</span>
        {hint && <span className="block text-sm text-muted-foreground">{hint}</span>}
      </span>
      <span className={cn("grid size-7 shrink-0 place-items-center rounded-full border-2", selected ? "border-sky bg-sky text-sky-foreground" : "border-border")}>
        {selected && <Check className="size-4" />}
      </span>
    </button>
  );
}

function Onboarding() {
  const user = useVivaUser();
  const { data: profile } = useSuspenseQuery(profileQuery(user.id));
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [step, setStep] = useState(0);
  const [name, setName] = useState(profile?.display_name ?? "");
  const [mode, setMode] = useState<WorkMode | null>((profile?.work_mode as WorkMode) ?? null);
  const [answers, setAnswers] = useState<HealthAnswers>({});
  const [focus, setFocus] = useState<FocusArea[]>([]);
  const [busy, setBusy] = useState(false);

  const steps = ["Você", "Rotina", "Hábitos", "Prioridades", "Privacidade"];
  const habitsDone = HABIT_QUESTIONS.every((q) => answers[q.id]);
  const canNext = [name.trim().length > 0, !!mode, habitsDone, focus.length > 0, true][step];

  async function finish() {
    if (!mode) return;
    setBusy(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      display_name: name.trim().slice(0, 60),
      work_mode: mode,
      health_answers: answers,
      focus_areas: focus,
      onboarding_completed: true,
    });
    if (error) {
      setBusy(false);
      return toast.error("Não conseguimos salvar. Tente de novo.");
    }
    const picks = suggestChallenges(focus, mode, 3);
    await supabase.from("user_challenges").upsert(
      picks.map((challenge_id) => ({ user_id: user.id, challenge_id })),
      { onConflict: "user_id,challenge_id", ignoreDuplicates: true },
    );
    await qc.invalidateQueries();
    toast.success("Tudo pronto! Escolhemos 3 desafios para começar.");
    navigate({ to: "/inicio", replace: true });
  }

  return (
    <div className="min-h-screen bg-hero">
      <div className="mx-auto max-w-xl px-4 py-6">
        <Logo />
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm font-semibold text-muted-foreground">
            <span>Passo {step + 1} de {steps.length}</span>
            <span>{steps[step]}</span>
          </div>
          <Progress value={((step + 1) / steps.length) * 100} className="h-2 bg-secondary [&>div]:bg-sky" />
        </div>

        <div key={step} className="mt-8 animate-rise">
          {step === 0 && (
            <section>
              <h1 className="text-3xl font-bold text-primary">Olá! Vamos começar pelo seu nome.</h1>
              <p className="mt-2 text-muted-foreground">São só alguns passos para o VIVA+ entender sua rotina. Nada aqui é diagnóstico.</p>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Como prefere ser chamado(a)" className="mt-6 h-14 rounded-2xl bg-card text-lg" maxLength={60} autoFocus />
            </section>
          )}
          {step === 1 && (
            <section>
              <h1 className="text-3xl font-bold text-primary">Como é o seu trabalho hoje?</h1>
              <p className="mt-2 text-muted-foreground">As dicas mudam conforme sua realidade. Dá para trocar depois.</p>
              <div className="mt-6 space-y-3">
                {WORK_MODES.map((m) => (
                  <OptionCard key={m.id} selected={mode === m.id} onClick={() => setMode(m.id)} title={m.label} hint={m.hint} />
                ))}
              </div>
            </section>
          )}
          {step === 2 && (
            <section>
              <h1 className="text-3xl font-bold text-primary">Seus hábitos, sem julgamento</h1>
              <p className="mt-2 text-muted-foreground">Responda pensando nas últimas semanas.</p>
              <div className="mt-6 space-y-6">
                {HABIT_QUESTIONS.map((q) => (
                  <fieldset key={q.id}>
                    <legend className="mb-2 font-bold text-primary">{q.label}</legend>
                    <div className="flex flex-wrap gap-2">
                      {q.options.map((o) => (
                        <button
                          key={o.value}
                          type="button"
                          aria-pressed={answers[q.id] === o.value}
                          onClick={() => setAnswers((a) => ({ ...a, [q.id]: o.value }))}
                          className={cn(
                            "rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors",
                            answers[q.id] === o.value ? "border-sky bg-sky text-sky-foreground" : "border-border bg-card text-foreground hover:border-sky/50",
                          )}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>
            </section>
          )}
          {step === 3 && (
            <section>
              <h1 className="text-3xl font-bold text-primary">O que você quer cuidar primeiro?</h1>
              <p className="mt-2 text-muted-foreground">Escolha até 3. Começar pequeno é o segredo.</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {FOCUS.map((f) => (
                  <OptionCard
                    key={f}
                    selected={focus.includes(f)}
                    title={AREA_LABEL[f]}
                    onClick={() =>
                      setFocus((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : cur.length >= 3 ? cur : [...cur, f]))
                    }
                  />
                ))}
              </div>
            </section>
          )}
          {step === 4 && (
            <section>
              <span className="grid size-14 place-items-center rounded-2xl bg-sun text-sun-foreground">
                <Lock className="size-7" />
              </span>
              <h1 className="mt-4 text-3xl font-bold text-primary">Seus dados são seus</h1>
              <ul className="mt-4 space-y-3 text-foreground">
                <li className="card-surface p-4">Sua empresa <strong>nunca</strong> vê suas respostas, check-ins ou humor. Ela só recebe números coletivos e anônimos.</li>
                <li className="card-surface p-4">Grupos com menos de 10 pessoas não aparecem nos relatórios, para ninguém ser identificado.</li>
                <li className="card-surface p-4">O VIVA+ não faz diagnósticos e não substitui profissionais. Quando fizer sentido, indicamos a sua UBS.</li>
                <li className="card-surface p-4">Você pode apagar seus registros a qualquer momento no seu perfil (LGPD).</li>
              </ul>
            </section>
          )}
        </div>

        <div className="mt-10 flex gap-3">
          {step > 0 && (
            <Button variant="outline" size="lg" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft /> Voltar
            </Button>
          )}
          {step < steps.length - 1 ? (
            <Button variant="hero" size="lg" className="flex-1" disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
              Continuar <ArrowRight />
            </Button>
          ) : (
            <Button variant="sun" size="lg" className="flex-1" disabled={busy} onClick={finish}>
              {busy ? "Salvando..." : "Concordo e quero começar"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
