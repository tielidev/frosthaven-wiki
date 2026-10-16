# Frosthaven Wiki: working instructions

This is the independent English Frosthaven PC digital wiki at `frosthaven.wiki`, derived from AnvilWiki. The user-approved product requirements take precedence over inherited template guidance.

## Architecture

- Astro static output, MDX, Tailwind and Pagefind; no React/Vue/Svelte runtime or business backend.
- Code in `src/components`, `src/lib` and `src/pages` is reusable. Game identity and navigation belong in `src/config`, visible UI copy in `src/locales/en.json`, game content in MDX and `src/data`.
- English root URLs end with `/`. Do not create `/en/` duplicates. Additional languages require routing, UI and real translated content together.
- Main sections: guides, classes, builds, maps, scenarios, items, enemies, outpost, mechanics, news.
- Shared colors are CSS tokens in `globals.css`; layout and game-specific styling is in `frontier.css`.

## Content and images

- Read `docs/content-coverage.md` and the relevant record in `src/data/research.json` before claiming a fact. Never infer exact digital values or unlocks from tabletop data.
- Every public article has sources, game version and a truthful researched date. Editorial strategy is not represented as hands-on testing.
- Add only substantive, supported details. An identity-only source belongs in the clearly labeled partial index, not a fake complete walkthrough.
- Content frontmatter is validated in `src/content.config.ts`. Title <=80 characters, description 40–165 characters; body starts at H2, never H1. Internal links end with `/`; add natural related links.
- Use real official/promotional game images and motion when relevant, record provenance, give accurate alt text and dimensions, lazy-load supporting media and respect reduced motion. Do not replace missing factual material with invented pictures.
- Each published wiki article needs its own relevant cover, `coverAlt`, `coverCaption` and source record in `src/data/article-covers.json`. Do not reuse a generic cover across different articles. Cards, article heroes and sharing metadata read the same frontmatter image; `pnpm check-data` validates coverage and duplicates. Thematic gameplay scenes must not be described as portraits of a class they do not identify.
- Game media remains under its owners' rights. The retained MIT license covers software, not the game art. Do not imply official endorsement.
- Map positions must have visual or other primary evidence. Keep unlocated scenarios in the searchable list; never turn scenario unlock order into geography.
- Initial content/media scripts are one-time integration helpers; rerunning them may overwrite manual page refinements. Routine work edits MDX and corresponding data directly.

## Advertising and privacy

- Adsterra Banner only at launch. Public placement IDs are in tracked public config/snippets; account API credentials never enter Git.
- Preview branches never load real advertising or analytics. `CF_PAGES_BRANCH !== main` also enables noindex and robots exclusion.
- No ad frame src before consent. Decline keeps ads off; withdrawal removes mounts and reloads the page. Keep settings reachable through `/cookies/`.
- No popunders, Social Bar, automatic top-level redirects, ads inside the map controls or ads on legal/search pages.
- AdSense remains dormant until an approved account/slot configuration and applicable consent requirements are ready. Do not claim approval is guaranteed.

## Validation and release

Run checks appropriate to the edit. For substantive changes:

```text
pnpm typecheck
pnpm test
pnpm check-config
pnpm check-data
pnpm check-content
pnpm build
pnpm check-links
pnpm check-i18n --strict-ui
```

`pnpm test` runs the site's map/publication checks; inherited demo tests remain reference material and are excluded from application typechecking because their demo locale/landing fixtures were intentionally removed.

- GitHub `tielidev/frosthaven-wiki` is the source of truth; use a PR and the required `Site checks` before merging to protected `main`.
- Cloudflare Pages `frosthaven-wiki` uses native Git integration, `pnpm build` and `dist`. Do not add a second deployment path or switch hosting providers.
- Read `docs/frosthaven-deployment.md` for tracked public build variables, preview behavior and rollback.
- After every production deployment, verify **the custom domain** on desktop and phone, exercise changed interactions and an unaffected core flow, and check for layout/asset/console errors. A pages.dev preview alone is not production verification.
- Default browser is Aside via `aside-browser`; read its guide before use. If a capability is unavailable, report that limit and use a suitable fallback for the affected check.
- Do not create schedules, auto-publishing tasks or external messages without the user's request.
