import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, Info, Lock, LogOut, ShieldAlert, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/viva/Logo";
import {
  COLLECTIVE_NEEDS,
  COMPANY,
  INSIGHTS,
  PGR_CROSS,
  SECTOR_HEATMAP,
  SIGNALS,
} from "@/lib/viva/company-demo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/empresa")({
  head: () => ({
    meta: [
      { title: "Painel da empresa — Cuidaê+" },
      {
        name: "description",
        content:
          "Indicadores coletivos e anônimos de queixas de saúde relatadas por funcionários e riscos do trabalho.",
      },
      { property: "og:title", content: "Painel da empresa — Cuidaê+" },
      {
        property: "og:description",
        content: "Dados agregados e anônimos para ambientes de trabalho mais saudáveis.",
      },
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

const REPORTED_ISSUES = [
  {
    name: "Dor nas costas / lombar",
    value: 42,
    note: "42% dos check-ins · Maior incidência em Produção e Logística",
  },
  {
    name: "Dor de cabeça / cefaleia",
    value: 34,
    note: "34% dos check-ins · Frequente em Administrativo e Desenvolvimento",
  },
  {
    name: "Dor no joelho / pernas",
    value: 29,
    note: "29% dos check-ins · Turnos com longos períodos em pé",
  },
  {
    name: "Tensão ombros / pescoço",
    value: 27,
    note: "27% dos check-ins · Postura estática e uso prolongado de computadores",
  },
  {
    name: "Fadiga visual / vista cansada",
    value: 22,
    note: "22% dos check-ins · Turnos com iluminação artificial contínua",
  },
  {
    name: "Dor nos punhos / mãos",
    value: 18,
    note: "18% dos check-ins · Movimentos manuais e digitação repetitiva",
  },
];

function Company() {
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuthed = localStorage.getItem("cuidae_empresa_auth");
      if (!isAuthed) {
        navigate({ to: "/auth", search: { role: "empresa" }, replace: true });
      }
    }
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("cuidae_empresa_auth");
    navigate({ to: "/auth", search: { role: "empresa" }, replace: true });
  }

  return (
    <div className="min-h-screen">
      {/* Header específico corporativo sem botões públicos de entrar/criar conta/para empresas */}
      <header className="sticky top-0 z-30 border-b border-white/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden sm:inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
              Painel da Empresa
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-bold text-muted-foreground hover:text-destructive cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-1.5 size-4" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="rounded-full bg-sun px-3 py-1 text-xs font-bold text-sun-foreground">
              Demonstração · dados agregados
            </span>
            <h1 className="mt-2 text-3xl font-extrabold text-primary md:text-4xl">
              {COMPANY.name}
            </h1>
            <p className="text-muted-foreground">
              {COMPANY.enrolled} de {COMPANY.employees} colaboradores participando
            </p>
          </div>
          <p className="flex max-w-sm items-start gap-2 rounded-2xl bg-sky-soft p-3 text-sm text-primary">
            <Lock className="mt-0.5 size-4 shrink-0" />
            <span>
              <strong className="font-bold">Somente dados agregados e anônimos.</strong> Grupos
              com menos de {COMPANY.minGroupSize} pessoas ficam ocultos.
            </span>
          </p>
        </div>

        {/* Gráficos e dados sobre os principais problemas relatados pelos funcionários */}
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="card-surface p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary">
                Problemas mais relatados pelos funcionários (%)
              </h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Prevalência de dores e desconfortos reportados nos check-ins semanais
            </p>
            <div className="mt-4 h-72">
              <ResponsiveContainer>
                <BarChart data={REPORTED_ISSUES} layout="vertical" margin={{ left: 10, right: 30 }}>
                  <XAxis
                    type="number"
                    domain={[0, 50]}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    unit="%"
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={160}
                    tick={{ fontSize: 11, fill: "var(--foreground)" }}
                  />
                  <Tooltip formatter={(value: number) => [`${value}% dos colaboradores`, "Prevalência"]} />
                  <Bar dataKey="value" fill="var(--chart-1)" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="card-surface p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary">Detalhamento e ações preventivas</h2>
              <span className="rounded-full bg-mint-soft px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
                Prevenção ativa
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Sintomas com maior recorrência e recomendações ergonômicas
            </p>
            <div className="mt-4 space-y-3">
              {REPORTED_ISSUES.slice(0, 4).map((issue) => (
                <div key={issue.name} className="rounded-2xl bg-muted p-3.5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-primary">{issue.name}</p>
                    <span className="font-display text-sm font-extrabold text-primary">
                      {issue.value}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-secondary">
                    <div
                      className="h-1.5 rounded-full bg-primary"
                      style={{ width: `${(issue.value / 50) * 100}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{issue.note}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Mapa de sinais coletivos por setor */}
        <section className="card-surface overflow-x-auto p-5">
          <h2 className="text-xl font-bold text-primary">
            Mapa de sinais coletivos por setor (% dos check-ins da semana)
          </h2>
          <table className="mt-4 w-full min-w-[640px] text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">Setor</th>
                {SIGNALS.map((s) => (
                  <th key={s} className="p-2 text-center">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SECTOR_HEATMAP.map((row) => (
                <tr key={row.sector}>
                  <td className="p-2 font-semibold">
                    {row.sector} <span className="text-xs text-muted-foreground">({row.people})</span>
                  </td>
                  {row.values.map((v, i) => (
                    <td key={i} className="p-1">
                      <span className={cn("block rounded-lg p-2 text-center font-bold", heat(v))}>
                        {v === null ? "oculto" : `${v}%`}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Card Riscos do ambiente × tendências (PGR) sem descrição inútil */}
        <section className="card-surface p-5">
          <h2 className="flex items-center gap-2 text-xl font-bold text-primary">
            <ShieldAlert className="size-5 text-care" /> Riscos do ambiente × tendências (PGR)
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {PGR_CROSS.map((p) => (
              <div key={p.sector} className="rounded-2xl bg-muted p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-sky">{p.sector}</p>
                <p className="mt-1 font-bold text-primary">
                  {p.risk} → {p.trend}
                </p>
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
                const Icon =
                  i.tone === "alert" ? AlertTriangle : i.tone === "good" ? ThumbsUp : Info;
                return (
                  <li key={i.title} className="flex gap-3 rounded-2xl bg-muted p-4">
                    <Icon
                      className={cn(
                        "size-5 shrink-0",
                        i.tone === "alert"
                          ? "text-care"
                          : i.tone === "good"
                            ? "text-success"
                            : "text-sky",
                      )}
                    />
                    <div>
                      <p className="font-bold text-primary">{i.title}</p>
                      <p className="text-sm text-muted-foreground">{i.action}</p>
                    </div>
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
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{n.label}</span>
                    <span>{n.share}%</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-sky"
                      style={{ width: `${n.share}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
