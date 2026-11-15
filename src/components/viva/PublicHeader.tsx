import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { useSessionUser } from "@/hooks/use-session-user";
import { supabase } from "@/integrations/supabase/client";

export function PublicHeader() {
  const user = useSessionUser();
  const navigate = useNavigate();
  const [signingIn, setSigningIn] = useState(false);

  async function handleDemoLogin() {
    if (signingIn) return;
    setSigningIn(true);
    localStorage.removeItem("cuidae_jurado_colaborador");
    const { error } = await supabase.auth.signInWithPassword({
      email: "hackathonsesisaude@gmail.com",
      password: "Hackathonsesisaude@123456",
    });
    setSigningIn(false);
    if (error) {
      toast.error("Não foi possível entrar automaticamente.");
      navigate({ to: "/auth", search: { mode: "login" } });
      return;
    }
    navigate({ to: "/inicio" });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-3 px-4">
        <Logo />
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/empresa"
            className="hidden items-center gap-1 rounded-full px-4 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-indigo-soft hover:text-primary sm:inline-flex"
            activeProps={{ className: "bg-indigo-soft text-primary shadow-soft" }}
          >
            Para empresas <ArrowUpRight className="size-4" aria-hidden />
          </Link>
          {user ? (
            <Button asChild size="sm" variant="default" className="rounded-full">
              <Link to="/inicio">Minha jornada</Link>
            </Button>
          ) : (
            <>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="rounded-full cursor-pointer"
                disabled={signingIn}
                onClick={handleDemoLogin}
              >
                {signingIn ? "Entrando..." : "Entrar"}
              </Button>
              <Button asChild size="sm" variant="default" className="rounded-full shadow-blue">
                <Link to="/auth" search={{ mode: "signup" }}>
                  Criar conta
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
