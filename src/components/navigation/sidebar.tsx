"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import type { ResolvedNavigationItem } from "@/types/navigation";

interface SidebarProps {
  items: ResolvedNavigationItem[];
  level?: number;
}

function containsActivePage(
  items: ResolvedNavigationItem[],
  pathname: string,
): boolean {
  return items.some((item) => {
    if ("items" in item) {
      return containsActivePage(item.items, pathname);
    }

    return item.url === pathname;
  });
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className={`size-4 shrink-0 transition-transform duration-200 ${
        open ? "rotate-90" : ""
      }`}
    >
      <path
        d="m7.5 4.5 5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Sidebar({ items, level = 0 }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={level === 0 ? "Navegação da documentação" : undefined}
      className={
        level === 0
          ? "space-y-1"
          : "ml-[11px] border-l border-[var(--border)] pl-3"
      }
    >
      {items.map((item) => {
        if ("items" in item) {
          return (
            <SidebarGroup
              key={item.title}
              item={item}
              pathname={pathname}
              level={level}
            />
          );
        }

        const isActive = pathname === item.url;

        return (
          <Link
            key={item.url}
            href={item.url}
            aria-current={isActive ? "page" : undefined}
            title={item.title}
            className={[
              "group relative flex min-h-9 items-center gap-2",
              "rounded-md px-3 py-2 text-[13px] leading-5",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-indigo-500",
              level === 0 ? "" : "-ml-1",
              isActive
                ? [
                    "bg-indigo-500/10 font-medium",
                    "text-indigo-700 dark:text-indigo-300",
                    "before:absolute before:bottom-1.5 before:left-0",
                    "before:top-1.5 before:w-[3px]",
                    "before:rounded-full before:bg-indigo-600",
                    "dark:before:bg-indigo-400",
                  ].join(" ")
                : [
                    "text-[var(--muted-foreground)]",
                    "hover:bg-[var(--muted)]",
                    "hover:text-foreground",
                  ].join(" "),
            ].join(" ")}
          >
            <span className="min-w-0 flex-1 truncate">{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarGroup({
  item,
  pathname,
  level,
}: {
  item: Extract<ResolvedNavigationItem, { items: unknown }>;
  pathname: string;
  level: number;
}) {
  const containsActive = containsActivePage(item.items, pathname);

  const [manuallyOpen, setManuallyOpen] = useState<boolean | null>(null);

  // Grupos com a página atual abrem por padrão.
  // A escolha manual do usuário tem prioridade.
  const open = manuallyOpen ?? containsActive;

  const headingId = `sidebar-group-${level}-${slugify(item.title)}`;
  const contentId = `${headingId}-content`;

  return (
    <section className="min-w-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        id={headingId}
        onClick={() => setManuallyOpen(!open)}
        className={[
          "flex min-h-9 w-full items-center gap-2",
          "rounded-md px-2.5 py-2 text-left",
          "text-[13px] font-medium leading-5",
          "transition-colors duration-150",
          "hover:bg-[var(--muted)] hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-indigo-500",
          containsActive ? "text-foreground" : "text-[var(--muted-foreground)]",
        ].join(" ")}
      >
        <Chevron open={open} />

        <span className="min-w-0 flex-1 truncate">{item.title}</span>
      </button>

      <div
        id={contentId}
        role="group"
        aria-labelledby={headingId}
        hidden={!open}
        className="pt-1"
      >
        <Sidebar items={item.items} level={level + 1} />
      </div>
    </section>
  );
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
