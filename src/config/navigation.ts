/**
 * Navigation configuration — the single source of truth for content categories.
 *
 * 👉 APPLY TEMPLATE: Change this array when a new game has different content categories.
 *
 * The `key` MUST be identical in THREE places (rule enforced across the codebase):
 *   1. Here — NAVIGATION_CONFIG[].key
 *   2. src/locales/en.json — nav.<key> (display label) + overview.<key> (list page meta)
 *   3. src/content/wiki/<locale>/<key>/ — MDX directory name
 *
 * Changing this one file automatically affects: nav menu, URL routes, sitemap,
 * content loading, and the sidebar.
 */

// Icons are referenced by string name; astro-icon resolves them from src/icons/.
// We avoid importing the icon component here so this file stays framework-agnostic
// and can be read by non-Astro tooling (scripts, tests).
export interface NavigationItem {
  /** Category slug. Must match `src/content/wiki/<locale>/<key>/` directory name. */
  key: string;
  /** URL path segment. Must be `/${key}`. */
  path: string;
  /** Icon name from src/icons/ (without extension). */
  icon: string;
  /** Whether this category has MDX content (always true for content types). */
  isContentType: true;
}

/** Menu order = array order — every consumer renders by physical position. */
export const NAVIGATION_CONFIG: NavigationItem[] = [
  { key: 'guides', path: '/guides', icon: 'lucide:book-open', isContentType: true },
  { key: 'classes', path: '/classes', icon: 'lucide:users', isContentType: true },
  { key: 'builds', path: '/builds', icon: 'lucide:swords', isContentType: true },
  { key: 'maps', path: '/maps', icon: 'lucide:map', isContentType: true },
  { key: 'scenarios', path: '/scenarios', icon: 'lucide:flag', isContentType: true },
  { key: 'items', path: '/items', icon: 'lucide:backpack', isContentType: true },
  { key: 'enemies', path: '/enemies', icon: 'lucide:skull', isContentType: true },
  { key: 'outpost', path: '/outpost', icon: 'lucide:castle', isContentType: true },
  { key: 'mechanics', path: '/mechanics', icon: 'lucide:layers', isContentType: true },
  { key: 'news', path: '/news', icon: 'lucide:newspaper', isContentType: true },
];

/** Derived list of content type slugs (e.g. ['bosses', 'guides', 'items', 'codes']). */
export const CONTENT_TYPES: string[] = NAVIGATION_CONFIG.map((n) => n.key);
