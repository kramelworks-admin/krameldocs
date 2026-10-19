import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { ResolvedNavigationPage } from "@/types/navigation";

interface PageNavigationProps {
  previous?: ResolvedNavigationPage;
  next?: ResolvedNavigationPage;
}

export function PageNavigation({
  previous,
  next,
}: PageNavigationProps) {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav
      aria-label="Navegação entre páginas"
      className="mt-12 grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-2"
    >
      {previous ? (
        <Link
          href={previous.url}
          className="group rounded-lg border border-border p-4 transition-colors hover:bg-accent"
        >
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <ChevronLeft aria-hidden="true" size={16} />
            Anterior
          </span>
          <span className="mt-1 block font-medium text-foreground group-hover:text-accent-foreground">
            {previous.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={next.url}
          className="group rounded-lg border border-border p-4 text-right transition-colors hover:bg-accent"
        >
          <span className="flex items-center justify-end gap-2 text-sm text-muted-foreground">
            Próxima
            <ChevronRight aria-hidden="true" size={16} />
          </span>
          <span className="mt-1 block font-medium text-foreground group-hover:text-accent-foreground">
            {next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
