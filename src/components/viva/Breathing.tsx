import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const PHASES = [
  { label: "Inspire", seconds: 4, scale: 1 },
  { label: "Segure", seconds: 4, scale: 1 },
  { label: "Solte devagar", seconds: 6, scale: 0.55 },
] as const;
const TOTAL_SECONDS = 120;

export function Breathing({ onComplete }: { onComplete?: () => void }) {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setPhase((p) => (p + 1) % PHASES.length), (PHASES[phase]?.seconds ?? 4) * 1000);
    return () => clearTimeout(t);
  }, [running, phase]);

  useEffect(() => {
    if (!running) return;
    const i = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(i);
  }, [running]);

  useEffect(() => {
    if (elapsed >= TOTAL_SECONDS && !done.current) {
      done.current = true;
      setRunning(false);
      onComplete?.();
    }
  }, [elapsed, onComplete]);

  const current = PHASES[phase] ?? PHASES[0];
  const remaining = Math.max(0, TOTAL_SECONDS - elapsed);

  return (
    <div className="flex flex-col items-center">
      <div className="relative grid size-64 place-items-center">
        <div className="absolute inset-0 rounded-full bg-sky-soft" />
        <div
          className="absolute inset-4 rounded-full bg-gradient-primary shadow-lift"
          style={{
            transform: `scale(${running ? current.scale : 0.55})`,
            transition: `transform ${running ? current.seconds : 0.6}s ease-in-out`,
          }}
        />
        <div aria-hidden className="absolute right-6 top-6 size-10 rounded-full bg-sun-orb" />
        <div className="relative text-center text-primary-foreground" aria-live="polite">
          <p className="font-display text-2xl font-bold">{running ? current.label : elapsed >= TOTAL_SECONDS ? "Muito bem" : "Pronto?"}</p>
          <p className="text-sm opacity-80">
            {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
          </p>
        </div>
      </div>
      <Button
        variant={running ? "outline" : "sun"}
        size="lg"
        className="mt-6"
        onClick={() => {
          if (elapsed >= TOTAL_SECONDS) {
            setElapsed(0);
            done.current = false;
          }
          setPhase(0);
          setRunning((r) => !r);
        }}
      >
        {running ? <><Pause /> Pausar</> : <><Play /> {elapsed > 0 && elapsed < TOTAL_SECONDS ? "Continuar" : "Começar 2 minutos"}</>}
      </Button>
      <p className="mt-3 text-center text-sm text-muted-foreground">Inspire 4s · segure 4s · solte 6s</p>
    </div>
  );
}
