import "server-only";

import { loadNavigation } from "@/lib/navigation/load-navigation";
import { resolveNavigation } from "@/lib/navigation/resolve-navigation";
import type { ResolvedNavigationItem } from "@/types/navigation";

export async function loadResolvedNavigation(): Promise<
  ResolvedNavigationItem[]
> {
  const items = await loadNavigation();

  return resolveNavigation(items);
}
