import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/viva/Logo";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nova senha — Cuidaê+" },
      { name: "description", content: "Defina uma nova senha para sua conta Cuidaê+." },
      { property: "og:title", content: "Nova senha — Cuidaê+" },
      { property: "og:description", content: "Defina uma nova senha para sua conta." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) { toast.error("A senha precisa ter pelo menos 8 caracteres"); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { toast.error("O link expirou. Peça um novo na tela de entrar."); return; }
    toast.success("Senha atualizada!");
    navigate({ to: "/inicio" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero px-4">
      <form onSubmit={onSubmit} className="card-surface w-full max-w-md space-y-4 p-8">
        <Logo />
        <h1 className="text-2xl font-bold text-primary">Crie uma nova senha</h1>
        <div className="space-y-1.5">
          <Label htmlFor="pw">Nova senha</Label>
          <Input id="pw" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-xl" />
        </div>
        <Button type="submit" variant="hero" size="lg" className="w-full" disabled={busy}>
          Salvar nova senha
        </Button>
      </form>
    </div>
  );
}
