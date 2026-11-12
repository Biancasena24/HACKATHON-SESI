import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback } from "react";
import { Phone, ExternalLink, AlertCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Breathing } from "@/components/viva/Breathing";
import { ensureJourney, useJourney, useToggleChallengeLog } from "@/hooks/use-journey";
import { MENTAL_CONTENT, SUPPORT_CHANNELS } from "@/lib/viva/content";
import { isHardDay } from "@/lib/viva/wellbeing";
import { daysAgoStr } from "@/lib/viva/dates";

export const Route = createFileRoute("/_authenticated/_shell/bem-estar")({
  loader: ({ context }) => ensureJourney(context.queryClient, context.user.id),
  head: () => ({
    meta: [
      { title: "Saúde mental e bem-estar — VIVA+" },
      { name: "description", content: "Respiração guiada, conteúdos rápidos sobre saúde mental e onde buscar acolhimento." },
      { property: "og:title", content: "Saúde mental e bem-estar — VIVA+" },
      { property: "og:description", content: "Respiração guiada e acolhimento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Wellbeing,
});

function Wellbeing() {
  const j = useJourney();
  const log = useToggleChallengeLog();
  const since = daysAgoStr(6);
  const week = j.checkins.filter((c) => c.day >= since);
  const hardDays = week.filter(isHardDay).length;
  const highStress = week.filter((c) => c.stress >= 4).length;

  const onComplete = useCallback(() => {
    if (!j.doneToday.has("respirar")) log.mutate({ challengeId: "respirar", done: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [j.doneToday]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-primary">Bem-estar</h1>
        <p className="text-muted-foreground">Um respiro no meio do dia. Cuidar da mente também é saúde.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
        <section className="card-surface p-6">
          <h2 className="text-xl font-bold text-primary">Respiração guiada</h2>
          <p className="mb-6 text-sm text-muted-foreground">Ao terminar, o desafio de respiração do dia é marcado para você.</p>
          <Breathing onComplete={onComplete} />
        </section>

        <div className="space-y-6">
          <section className="card-surface p-5">
            <h2 className="text-xl font-bold text-primary">Sua semana, com carinho</h2>
            {week.length === 0 ? (
              <p className="mt-2 text-muted-foreground">Faça check-ins para ver aqui seus sinais de cansaço e pressão.</p>
            ) : (
              <>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-muted p-4">
                    <p className="font-display text-3xl font-extrabold text-primary">{highStress}</p>
                    <p className="text-sm text-muted-foreground">dias com muita pressão</p>
                  </div>
                  <div className="rounded-2xl bg-muted p-4">
                    <p className="font-display text-3xl font-extrabold text-primary">{hardDays}</p>
                    <p className="text-sm text-muted-foreground">dias mais pesados</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {hardDays >= 3
                    ? "Vários dias difíceis seguidos merecem atenção. Pode ser o momento de conversar com alguém — e de olhar também para a carga de trabalho."
                    : "Observar como você se sente ajuda a perceber o que precisa de ajuste."}
                </p>
              </>
            )}
          </section>

          <section className="card-surface p-5">
            <h2 className="text-xl font-bold text-primary">Leituras de 2 minutos</h2>
            <Accordion type="single" collapsible className="mt-2">
              {MENTAL_CONTENT.map((c) => (
                <AccordionItem key={c.title} value={c.title}>
                  <AccordionTrigger className="text-left font-bold text-primary">
                    <span>{c.title} <span className="ml-1 text-xs font-semibold text-muted-foreground">· {c.read}</span></span>
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-foreground/80">{c.text}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>
      </div>

      <section className="rounded-3xl bg-ink p-6 text-ink-foreground">
        <h2 className="text-xl font-bold">Onde buscar acolhimento</h2>
        <p className="mt-1 opacity-80">Você não precisa passar por isso sozinho(a). Estes canais são gratuitos.</p>
        <ul className="mt-4 grid gap-3 md:grid-cols-3">
          {SUPPORT_CHANNELS.map((s) => (
            <li key={s.name} className="rounded-2xl bg-ink-foreground/8 p-4 ring-1 ring-ink-foreground/15">
              <p className="font-bold">{s.name}</p>
              <p className="mt-1 text-sm opacity-80">{s.detail}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold">
                {s.phone && (
                  <a href={`tel:${s.phone}`} className="inline-flex items-center gap-1 rounded-full bg-sun px-3 py-1.5 text-sun-foreground">
                    <Phone className="size-4" /> Ligar {s.phone}
                  </a>
                )}
                {s.href?.startsWith("http") && (
                  <a href={s.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 ring-1 ring-ink-foreground/30">
                    Abrir site <ExternalLink className="size-4" />
                  </a>
                )}
                {s.href === "/cuidado" && (
                  <Link to="/cuidado" className="inline-flex items-center gap-1 rounded-full bg-sun px-3 py-1.5 text-sun-foreground">
                    Encontrar minha UBS
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex items-start gap-2 text-sm opacity-80">
          <AlertCircle className="mt-0.5 size-4 shrink-0" /> O VIVA+ não faz diagnósticos e não substitui atendimento profissional.
        </p>
      </section>
    </div>
  );
}
