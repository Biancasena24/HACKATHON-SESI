import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, Info, Lock, ShieldAlert, ThumbsUp } from "lucide-react";
import { PublicHeader } from "@/components/viva/PublicHeader";
import { CHALLENGE_ADHESION, COLLECTIVE_NEEDS, COMPANY, INSIGHTS, KPIS, PARTICIPATION_WEEKS, PGR_CROSS, SECTOR_HEATMAP, SIGNALS } from "@/lib/viva/company-demo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/empresa")({
  head: () => ({
    meta: [
      { title: "Painel da empresa (demonstração) — VIVA+" },
      { name: "description", content: "Indicadores coletivos e anônimos de participação, adesão a desafios e bem-estar, cruzados com riscos do ambiente de trabalho." },
      { property: "og:title", content: "Painel da empresa — VIVA+" },
      { property: "og:description", content: "Dados agregados e anônimos para ambientes de trabalho mais saudáveis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Company,
});

function heat(v: number | null) {
  if (v === null) return "bg-muted text-muted-foreground";
  if (v >= 40) return "bg-care text-primary-foreground";
  if (v >= 25) return "bg-sun text-sun-foreground";
  return "bg-sky-soft text-primary";
}

function Company() {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="rounded-full bg-sun px-3 py-1 text-xs font-bold text-sun-foreground">Demonstração · dados fictícios</span>
            <h1 className="mt-2 text-3xl font-extrabold text-primary md:text-4xl">{COMPANY.name}</h1>
            <p className="text-muted-foreground">{COMPANY.enrolled} de {COMPANY.employees} colaboradores participando</p>
          </div>
          <p className="flex max-w-sm items-start gap-2 rounded-2xl bg-sky-soft p-3 text-sm text-primary">
            <Lock className="mt-0.5 size-4 shrink-0" /> Somente dados agregados e anônimos. Grupos com menos de {COMPANY.minGroupSize} pessoas ficam ocultos.
          </p>
        </div>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {KPIS.map((k) => (
            <div key={k.label} className="card-surface p-4">
              <p className="text-sm font-semibold text-muted-foreground">{k.label}</p>
              <p className="mt-1 font-display text-3xl font-extrabold text-primary">{k.value}</p>
              <p className="text-xs text-success">{k.delta}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="card-surface p-5">
            <h2 className="text-xl font-bold text-primary">Participação ao longo do tempo (%)</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer>
                <LineChart data={PARTICIPATION_WEEKS} margin={{ left: -20, right: 8 }}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="participacao" name="Participação" stroke="var(--chart-2)" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className="card-surface p-5">
            <h2 className="text-xl font-bold text-primary">Adesão por desafio (%)</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer>
                <BarChart data={CHALLENGE_ADHESION} layout="vertical" margin={{ left: 30 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12, fill: "var(--foreground)" }} />
                  <Tooltip />
                  <Bar dataKey="value" name="Adesão" fill="var(--chart-1)" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <section className="card-surface overflow-x-auto p-5">
          <h2 className="text-xl font-bold text-primary">Mapa de sinais coletivos por setor (% dos check-ins da semana)</h2>
          <table className="mt-4 w-full min-w-[640px] text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">Setor</th>
                {SIGNALS.map((s) => <th key={s} className="p-2 text-center">{s}</th>)}
              </tr>
            </thead>
            <tbody>
              {SECTOR_HEATMAP.map((row) => (
                <tr key={row.sector}>
                  <td className="p-2 font-semibold">{row.sector} <span className="text-xs text-muted-foreground">({row.people})</span></td>
                  {row.values.map((v, i) => (
                    <td key={i} className="p-1">
                      <span className={cn("block rounded-lg p-2 text-center font-bold", heat(v))}>{v === null ? "oculto" : `${v}%`}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card-surface p-5">
          <h2 className="flex items-center gap-2 text-xl font-bold text-primary"><ShieldAlert className="size-5 text-care" /> Riscos do ambiente × tendências (PGR)</h2>
          <p className="text-sm text-muted-foreground">O foco é melhorar as condições de trabalho — nunca cobrar ou punir pessoas.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {PGR_CROSS.map((p) => (
              <div key={p.sector} className="rounded-2xl bg-muted p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-sky">{p.sector}</p>
                <p className="mt-1 font-bold text-primary">{p.risk} → {p.trend}</p>
                <p className="text-sm text-muted-foreground">{p.action}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section className="card-surface p-5">
            <h2 className="text-xl font-bold text-primary">Alertas e sugestões</h2>
            <ul className="mt-3 space-y-3">
              {INSIGHTS.map((i) => {
                const Icon = i.tone === "alert" ? AlertTriangle : i.tone === "good" ? ThumbsUp : Info;
                return (
                  <li key={i.title} className="flex gap-3 rounded-2xl bg-muted p-4">
                    <Icon className={cn("size-5 shrink-0", i.tone === "alert" ? "text-care" : i.tone === "good" ? "text-success" : "text-sky")} />
                    <div><p className="font-bold text-primary">{i.title}</p><p className="text-sm text-muted-foreground">{i.action}</p></div>
                  </li>
                );
              })}
            </ul>
          </section>
          <section className="card-surface p-5">
            <h2 className="text-xl font-bold text-primary">Principais necessidades coletivas</h2>
            <ul className="mt-3 space-y-3">
              {COLLECTIVE_NEEDS.map((n) => (
                <li key={n.label}>
                  <div className="flex justify-between text-sm font-semibold"><span>{n.label}</span><span>{n.share}%</span></div>
                  <div className="mt-1 h-2 rounded-full bg-secondary"><div className="h-2 rounded-full bg-sky" style={{ width: `${n.share}%` }} /></div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
