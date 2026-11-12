import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { useSessionUser } from "@/hooks/use-session-user";

export function PublicHeader() {
  const user = useSessionUser();
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Logo />
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/empresa"
            className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-primary sm:inline-flex"
            activeProps={{ className: "text-primary" }}
          >
            Para empresas
          </Link>
          {user ? (
            <Button asChild size="sm">
              <Link to="/inicio">Minha jornada</Link>
            </Button>
          ) : (
            <>
              <Button asChild size="sm" variant="ghost">
                <Link to="/auth" search={{ mode: "login" }}>Entrar</Link>
              </Button>
              <Button asChild size="sm" variant="sun">
                <Link to="/auth" search={{ mode: "signup" }}>Criar conta</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
