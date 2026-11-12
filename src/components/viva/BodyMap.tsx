import { BODY_AREAS } from "@/lib/viva/content";
import { cn } from "@/lib/utils";

export function BodyMap({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const on = (id: string) => value.includes(id);
  const toggle = (id: string) => onChange(on(id) ? value.filter((x) => x !== id) : [...value, id]);
  const zone = (id: string) =>
    cn("cursor-pointer transition-colors", on(id) ? "fill-care stroke-care" : "fill-sky-soft stroke-sky/40 hover:fill-sun-soft");

  return (
    <div className="grid items-center gap-4 sm:grid-cols-[180px_1fr]">
      <svg viewBox="0 0 200 400" className="mx-auto h-72 w-auto" aria-hidden="true">
        {/* arms */}
        <path d="M66 100 L40 205" className="stroke-border" strokeWidth="16" strokeLinecap="round" fill="none" />
        <path d="M134 100 L160 205" className="stroke-border" strokeWidth="16" strokeLinecap="round" fill="none" />
        {/* torso */}
        <rect x="68" y="86" width="64" height="128" rx="26" className="fill-secondary" />
        <circle cx="100" cy="40" r="28" className={zone("cabeca")} strokeWidth="2" onClick={() => toggle("cabeca")} />
        <g onClick={() => toggle("olhos")}>
          <ellipse cx="89" cy="40" rx="8" ry="5" className={zone("olhos")} strokeWidth="2" />
          <ellipse cx="111" cy="40" rx="8" ry="5" className={zone("olhos")} strokeWidth="2" />
        </g>
        <rect x="88" y="66" width="24" height="20" rx="6" className={zone("pescoco")} strokeWidth="2" onClick={() => toggle("pescoco")} />
        <g onClick={() => toggle("ombros")}>
          <ellipse cx="68" cy="98" rx="20" ry="13" className={zone("ombros")} strokeWidth="2" />
          <ellipse cx="132" cy="98" rx="20" ry="13" className={zone("ombros")} strokeWidth="2" />
        </g>
        <rect x="76" y="166" width="48" height="36" rx="12" className={zone("costas")} strokeWidth="2" onClick={() => toggle("costas")} />
        <g onClick={() => toggle("maos")}>
          <circle cx="38" cy="214" r="13" className={zone("maos")} strokeWidth="2" />
          <circle cx="162" cy="214" r="13" className={zone("maos")} strokeWidth="2" />
        </g>
        <g onClick={() => toggle("pernas")}>
          <rect x="72" y="212" width="25" height="160" rx="12" className={zone("pernas")} strokeWidth="2" />
          <rect x="103" y="212" width="25" height="160" rx="12" className={zone("pernas")} strokeWidth="2" />
        </g>
      </svg>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">Toque onde sente dor, tensão ou cansaço (opcional):</p>
        <div className="flex flex-wrap gap-2">
          {BODY_AREAS.map((b) => (
            <button
              key={b.id}
              type="button"
              aria-pressed={on(b.id)}
              onClick={() => toggle(b.id)}
              className={cn(
                "rounded-full border-2 px-3.5 py-2 text-sm font-semibold transition-colors",
                on(b.id) ? "border-care bg-care-soft text-primary" : "border-border bg-card hover:border-sky/50",
              )}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
