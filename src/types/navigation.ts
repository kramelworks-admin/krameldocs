export interface NavigationPage {
  title: string;
  file: string;
  icon?: string;
}

export interface NavigationGroup {
  title: string;
  icon?: string;
  items: NavigationItem[];
}

export type NavigationItem = NavigationPage | NavigationGroup;

export interface ResolvedNavigationPage extends NavigationPage {
  url: string;
}

export interface ResolvedNavigationGroup {
  title: string;
  icon?: string;
  items: ResolvedNavigationItem[];
}

export type ResolvedNavigationItem =
  | ResolvedNavigationPage
  | ResolvedNavigationGroup;
