import { Check } from "lucide-react";
import type { Challenge } from "@/lib/viva/challenges";
import { AREA_LABEL } from "@/lib/viva/challenges";
import { cn } from "@/lib/utils";

export function ChallengeRow({ challenge, done, onToggle, disabled }: { challenge: Challenge; done: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={done}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all",
        done ? "border-success/40 bg-success-soft" : "border-border bg-card hover:border-sky/50",
      )}
    >
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-full border-2 transition-all",
          done ? "border-success bg-success text-success-foreground scale-105" : "border-input",
        )}
      >
        {done && <Check className="size-5" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block font-bold", done ? "text-primary" : "text-foreground")}>{challenge.title}</span>
        <span className="block text-sm text-muted-foreground">{challenge.short}</span>
      </span>
      <span className="hidden rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground sm:inline">
        {AREA_LABEL[challenge.area]}
      </span>
    </button>
  );
}
