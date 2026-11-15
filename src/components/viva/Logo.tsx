import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className, to = "/" }: { className?: string; to?: "/" | "/inicio" }) {
  return (
    <Link
      to={to}
      className={cn(
        "group inline-flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight text-primary",
        className,
      )}
      aria-label="Cuidaê+ — início"
    >
      <img
        src="/logo.jpg?v=3"
        alt="Logo Cuidaê+"
        className="size-10 rounded-[1.1rem] object-cover shadow-soft transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"
      />
      <span>
        Cuidaê<span className="text-secondary-foreground">+</span>
      </span>
    </Link>
  );
}
