
import type { ReactNode } from "react";

import { Sidebar } from "@/components/navigation/sidebar";
import type { ResolvedNavigationItem } from "@/types/navigation";

interface DocsLayoutProps {
  navigation: ResolvedNavigationItem[];
  children: ReactNode;
}

export function DocsLayout({
  navigation,
  children,
}: DocsLayoutProps) {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] gap-0 px-4 sm:px-6 lg:px-8">
      <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-64 shrink-0 overflow-y-auto border-r border-[var(--border)] py-8 pr-6 md:block lg:w-72 lg:pr-8">
        <Sidebar items={navigation} />
      </aside>

      <main className="min-w-0 flex-1 py-8 md:px-8 lg:px-12 lg:py-10">
        <div className="mx-auto w-full max-w-3xl">
          {children}
        </div>
      </main>
    </div>
  );
}
