"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { ResolvedNavigationItem } from "@/types/navigation";

interface SidebarProps {
  items: ResolvedNavigationItem[];
  level?: number;
}

export function Sidebar({ items, level = 0 }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegação da documentação" className="space-y-6">
      {items.map((item) => {
        if ("items" in item) {
          return (
            <section key={item.title} className="space-y-2">
              <h2
                className={`px-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] ${
                  level > 0 ? "pt-1" : ""
                }`}
              >
                {item.title}
              </h2>

              <Sidebar items={item.items} level={level + 1} />
            </section>
          );
        }

        const isActive = pathname === item.url;

        return (
          <Link
            key={item.url}
            href={item.url}
            aria-current={isActive ? "page" : undefined}
            className={`relative flex min-h-9 items-center rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${
              isActive
                ? "bg-indigo-500/10 font-medium text-indigo-700 dark:text-indigo-300"
                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-foreground"
            }`}
          >
            {isActive && (
              <span
                aria-hidden="true"
                className="absolute bottom-2 left-0 top-2 w-[3px] rounded-full bg-indigo-600 dark:bg-indigo-400"
              />
            )}

            <span className="truncate">{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
