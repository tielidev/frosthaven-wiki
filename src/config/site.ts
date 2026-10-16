/**
 * Site configuration — the single source of truth for game-specific metadata.
 *
 * 👉 APPLY TEMPLATE: Change every field here when building a new game wiki.
 * This is part of the CONFIG LAYER — framework code reads from here, never the reverse.
 */

export interface SiteConfig {
  /** Full site name, used in <title> suffix and Organization JSON-LD. e.g. "Anvil Quest Wiki" */
  name: string;
  /** Short name for PWA manifest, mobile logo, and the long-title <title> suffix (>50 chars). e.g. "AQ Wiki" */
  shortName: string;
  /** Site description for Organization JSON-LD and og:site_name. */
  description: string;
  /** Domain without protocol or trailing slash. e.g. "anvilquestwiki.wiki" */
  domain: string;
  /** Hero tagline shown under the site title. */
  tagline: string;
  /** Copyright / legal disclaimer line shown in footer. */
  legalNotice: string;
  /**
   * Optional public contact email — rendered as a mailto link on the contact
   * page when set. AdSense reviewers look for a reachable contact channel;
   * if you run no social channels, set this.
   */
  contactEmail?: string;
  social: {
    /** Official game website URL (the game itself, not the wiki). */
    official: string;
    discord?: string;
    youtube?: string;
    twitter?: string;
    reddit?: string;
  };
  /**
   * Canonical URLs about the GAME (Steam page, official site, Wikipedia entry…).
   * Emitted as Organization JSON-LD `sameAs` — helps Google / AI engines link
   * this wiki to the game's knowledge-graph entity.
   */
  sameAs?: string[];
  game: {
    /** Full game name. */
    name: string;
    /** Platform: "Roblox" | "Steam" | "Epic Games" | "Mobile" | ... */
    platform: string;
    /** Developer / studio name. */
    developer: string;
    /** Genre description. */
    genre: string;
    /** ISO release date (optional). */
    releaseDate?: string;
  };
  /**
   * Dimensions of the default OG/Twitter share image (public/images/hero.webp).
   * Emitted as og:image:width / og:image:height so social crawlers can render
   * the share card without downloading the image first.
   */
  ogImageWidth: number;
  ogImageHeight: number;
  /** Default author name for articles without an explicit `author` in frontmatter (E-E-A-T signal). */
  defaultAuthor?: string;
}

export const site: SiteConfig = {
  name: 'Frosthaven Wiki',
  shortName: 'Frosthaven Wiki',
  description: 'Explore Frosthaven digital with class builds, scenario guides, maps, equipment and outpost strategy, with sources and version notes.',
  domain: 'frosthaven.wiki',
  tagline: 'Your field guide to the frozen frontier',
  legalNotice: 'An independent fan wiki. Not affiliated with Snapshot Games, Arc Games or Cephalofair Games. Game artwork belongs to its respective owners.',
  // Set a real address if you run no social channels — the contact page
  // renders it as a mailto link.
  contactEmail: 'contact@frosthaven.wiki',
  social: {
    official: 'https://www.playfrosthaven.com/en',
  },
  game: {
    name: 'Frosthaven',
    platform: 'Steam',
    developer: 'Snapshot Games',
    genre: 'Tactical RPG',
    releaseDate: '2026-10-15',
  },
  // og:image dims of the SHIPPED hero.webp — if you replace public/images/hero.webp,
  // update these in src/config/site.ts to match (wrong dims mis-crop share cards).
  ogImageWidth: 1920,
  ogImageHeight: 1080,
};

/** Directory verification links; listing approval is tracked separately. */
export const directoryProfiles: Array<{
  name: string;
  href: string;
  image?: string;
  alt?: string;
  width?: number;
  height?: number;
}> = [
  { name: 'ShowMySites', href: 'https://www.showmysites.com' },
  { name: 'Uno Directory', href: 'https://uno.directory', image: 'https://uno.directory/uno-directory.svg', alt: 'Listed on Uno Directory', width: 120, height: 30 },
  { name: 'Lovable App', href: 'https://lovableapp.org', image: 'https://lovableapp.org/lovable-app-badge.svg', alt: 'Lovable App Badge', width: 160 },
  { name: 'ufind.best', href: 'https://ufind.best/products/frosthaven-wiki', image: 'https://ufind.best/badges/ufind-best-badge-light.svg', alt: 'Featured on ufind.best', width: 150 },
];

/** Absolute site URL (no trailing slash). Falls back to the Astro `site` config. */
export const siteUrl: string = (process.env.SITE_URL || `https://${site.domain}`).replace(
  /\/$/,
  '',
);
