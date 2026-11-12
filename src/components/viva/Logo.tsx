import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className, to = "/" }: { className?: string; to?: "/" | "/inicio" }) {
  return (
    <Link to={to} className={cn("inline-flex items-center gap-2 font-display text-xl font-extrabold text-primary", className)} aria-label="VIVA+ — início">
      <span aria-hidden className="relative grid size-8 place-items-center rounded-full bg-sun-orb shadow-soft">
        <span className="text-base font-extrabold leading-none text-primary">+</span>
      </span>
      VIVA<span className="text-sky">+</span>
    </Link>
  );
}
