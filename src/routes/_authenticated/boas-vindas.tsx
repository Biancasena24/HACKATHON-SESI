import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Logo } from "@/components/viva/Logo";
import { profileQuery } from "@/lib/viva/queries";
import { suggestChallenges, type WorkMode } from "@/lib/viva/challenges";
import { useVivaUser } from "@/hooks/use-viva-user";

export const Route = createFileRoute("/_authenticated/boas-vindas")({
  loader: ({ context }) => context.queryClient.ensureQueryData(profileQuery(context.user.id)),
  head: () => ({
    meta: [
      { title: "Boas-vindas — Cuidaê+" },
      { name: "description", content: "Comece sua jornada de autocuidado no Cuidaê+." },
      { property: "og:title", content: "Boas-vindas ao Cuidaê+" },
      { property: "og:description", content: "Início rápido da sua jornada." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  const user = useVivaUser();
  const { data: profile } = useSuspenseQuery(profileQuery(user.id));
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [step, setStep] = useState(0);
  const [name, setName] = useState(profile?.display_name ?? "");
  const [busy, setBusy] = useState(false);

  const steps = ["Você", "Privacidade"];
  const canNext = step === 0 ? name.trim().length > 0 : true;

  async function finish() {
    setBusy(true);
    const mode: WorkMode = (profile?.work_mode as WorkMode) || "home_office";
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      display_name: name.trim().slice(0, 60),
      work_mode: mode,
      health_answers: {},
      focus_areas: [],
      onboarding_completed: true,
    });
    if (error) {
      setBusy(false);
      toast.error("Não conseguimos salvar. Tente de novo.");
      return;
    }
    const picks = suggestChallenges([], mode, 3);
    await supabase.from("user_challenges").upsert(
      picks.map((challenge_id) => ({ user_id: user.id, challenge_id })),
      { onConflict: "user_id,challenge_id", ignoreDuplicates: true },
    );
    await qc.invalidateQueries();
    toast.success("Tudo pronto! Bem-vindo ao Cuidaê+.");
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
              <p className="mt-2 text-muted-foreground">
                Informe como prefere ser chamado(a) no Cuidaê+.
              </p>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como prefere ser chamado(a)"
                className="mt-6 h-14 rounded-2xl bg-card text-lg"
                maxLength={60}
                autoFocus
              />
            </section>
          )}
          {step === 1 && (
            <section>
              <span className="grid size-14 place-items-center rounded-2xl bg-sun text-sun-foreground">
                <Lock className="size-7" />
              </span>
              <h1 className="mt-4 text-3xl font-bold text-primary">Seus dados são seus</h1>
              <ul className="mt-4 space-y-3 text-foreground">
                <li className="card-surface p-4">
                  Sua empresa <strong>nunca</strong> vê suas respostas, check-ins ou registros de saúde. Ela só recebe números coletivos e anônimos.
                </li>
                <li className="card-surface p-4">
                  Grupos com menos de 10 pessoas não aparecem nos relatórios, para ninguém ser identificado.
                </li>
                <li className="card-surface p-4">
                  O Cuidaê+ não faz diagnósticos e não substitui profissionais. Quando fizer sentido, indicamos a sua UBS.
                </li>
                <li className="card-surface p-4">
                  Você pode apagar seus registros a qualquer momento no seu perfil (LGPD).
                </li>
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
