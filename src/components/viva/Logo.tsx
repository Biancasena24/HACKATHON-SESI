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
      aria-label="VIVA+ — início"
    >
      <span
        aria-hidden
        className="relative grid size-10 place-items-center rounded-[1.1rem] bg-primary shadow-blue transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"
      >
        <span className="relative text-xl font-extrabold leading-none text-mint">+</span>
        <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background bg-mint" />
      </span>
      <span>
        VIVA<span className="text-secondary-foreground">+</span>
      </span>
    </Link>
  );
}
