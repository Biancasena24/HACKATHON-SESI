import { Link } from "@tanstack/react-router";
import { HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CareSupportCard() {
  return (
    <section className="rounded-3xl border-2 border-care/30 bg-care-soft p-5" aria-live="polite">
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-card text-care">
          <HeartHandshake className="size-6" />
        </span>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-primary">Os últimos dias parecem ter sido pesados</h2>
          <p className="mt-1 text-foreground/80">
            Não é um diagnóstico — só um convite. Conversar com alguém pode ajudar. Esta mensagem é só sua; a empresa não vê.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild variant="default">
              <Link to="/cuidado">Buscar acolhimento na UBS</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/bem-estar">Respirar agora</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
