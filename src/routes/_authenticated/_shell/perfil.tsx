import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, LogOut, ShieldCheck, Trash2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ensureJourney, useJourney } from "@/hooks/use-journey";
import { WORK_MODES, type WorkMode } from "@/lib/viva/challenges";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/_shell/perfil")({
  loader: ({ context }) => ensureJourney(context.queryClient, context.user.id),
  head: () => ({
    meta: [
      { title: "Meu perfil e privacidade — Cuidaê+" },
      {
        name: "description",
        content: "Ajuste seu perfil, sua rotina de trabalho e controle seus dados.",
      },
      { property: "og:title", content: "Meu perfil — Cuidaê+" },
      { property: "og:description", content: "Perfil e privacidade." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const j = useJourney();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [name, setName] = useState(j.profile?.display_name ?? "");
  const [mode, setMode] = useState<WorkMode>((j.profile?.work_mode as WorkMode) ?? "home_office");
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: name.trim().slice(0, 60), work_mode: mode })
      .eq("id", j.user.id);
    setBusy(false);
    if (error) {
      toast.error("Não foi possível salvar.");
      return;
    }
    await qc.invalidateQueries({ queryKey: ["profile", j.user.id] });
    toast.success("Perfil atualizado");
  }

  async function wipe() {
    const a = await supabase.from("checkins").delete().eq("user_id", j.user.id);
    const b = await supabase.from("challenge_logs").delete().eq("user_id", j.user.id);
    if (a.error || b.error) {
      toast.error("Não foi possível apagar agora.");
      return;
    }
    await qc.invalidateQueries();
    toast.success("Seus registros foram apagados.");
  }

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-primary">Meu perfil</h1>
        <p className="text-muted-foreground">{j.user.email}</p>
      </div>

      <section className="card-surface space-y-5 p-5">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            className="h-12 rounded-xl"
          />
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Minha rotina de trabalho</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {WORK_MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={mode === m.id}
                onClick={() => setMode(m.id)}
                className={cn(
                  "rounded-2xl border-2 p-3 text-left",
                  mode === m.id ? "border-sky bg-sky-soft" : "border-border hover:border-sky/50",
                )}
              >
                <span className="block font-bold text-primary">{m.label}</span>
                <span className="block text-xs text-muted-foreground">{m.hint}</span>
              </button>
            ))}
          </div>
        </div>
        <Button onClick={save} disabled={busy}>
          Salvar alterações
        </Button>
      </section>

      <section className="card-surface p-5">
        <h2 className="text-xl font-bold text-primary">O que a empresa vê</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-success-soft p-4">
            <p className="flex items-center gap-2 font-bold text-primary">
              <Eye className="size-4" /> Vê (no coletivo)
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• % de participação nas campanhas</li>
              <li>• Adesão geral aos desafios</li>
              <li>• Tendências por setor com 10+ pessoas</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-care-soft p-4">
            <p className="flex items-center gap-2 font-bold text-primary">
              <EyeOff className="size-4" /> Nunca vê
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Seu nome ligado a qualquer resposta</li>
              <li>• Seus check-ins, humor e anotações</li>
              <li>• Se você recebeu sugestão de acolhimento</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="card-surface p-5">
        <h2 className="text-xl font-bold text-primary">Seus espaços</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Link
            to="/minha-saude"
            className="flex min-h-16 items-center gap-3 rounded-2xl border-2 border-border p-3 transition-colors hover:border-primary/40 hover:bg-secondary"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-success-soft text-primary">
              <ShieldCheck className="size-5" aria-hidden />
            </span>
            <span>
              <span className="block font-bold text-primary">Minha saúde</span>
              <span className="block text-xs text-muted-foreground">Consultas e acompanhamento APS</span>
            </span>
          </Link>
          <Link
            to="/engajamento"
            search={{ tab: "comunidade" }}
            className="flex min-h-16 items-center gap-3 rounded-2xl border-2 border-border p-3 transition-colors hover:border-primary/40 hover:bg-secondary"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sun-soft text-accent-foreground">
              <Users className="size-5" aria-hidden />
            </span>
            <span>
              <span className="block font-bold text-primary">Minha comunidade</span>
              <span className="block text-xs text-muted-foreground">Ranking e medalhas</span>
            </span>
          </Link>
        </div>
      </section>

      <section className="card-surface flex flex-col gap-3 p-5 sm:flex-row">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="flex-1">
              <Trash2 /> Apagar meus registros
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Apagar todos os seus registros?</AlertDialogTitle>
              <AlertDialogDescription>
                Check-ins e desafios concluídos serão apagados para sempre. Seu perfil continua.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={wipe}>Apagar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button variant="ghost" className="flex-1" onClick={signOut}>
          <LogOut /> Sair da conta
        </Button>
      </section>
    </div>
  );
}
