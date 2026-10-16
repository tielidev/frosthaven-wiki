# Frosthaven Wiki

Independent English reference for the **Frosthaven PC digital edition**. Built from [PNGTRID/AnvilWiki](https://github.com/PNGTRID/AnvilWiki), retaining the upstream MIT license. Game artwork and trademarks are **not** covered by that software license.

Production: https://frosthaven.wiki

## Development

Use Node 22.13+ and the pnpm version declared in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm typecheck
pnpm test
pnpm check-config
pnpm check-data
pnpm check-content
pnpm build
pnpm check-links
pnpm check-i18n --strict-ui
```

The production build is `dist/`, including the Pagefind search index. Search needs a production build; it is not backed by a remote search service.

## Editing and data

- Articles: `src/content/wiki/en/<category>/<slug>.mdx`. English uses root URLs with trailing slashes.
- Covers: each article has a distinct `image`, descriptive `coverAlt` and honest `coverCaption`; record its official source in `src/data/article-covers.json`. Optimized originals live in `src/assets/article-covers/`. `pnpm check-data` rejects shared, missing or uncredited covers.
- Reusable research and evidence: `src/data/research.json`; see `docs/content-coverage.md` for limitations.
- Map image, markers and provenance: `src/data/maps.json`. Never invent coordinates; unknown locations belong in the searchable list.
- Site identity/navigation: `src/config/`; user-facing labels: `src/locales/en.json`.
- Official promotional screenshot and motion provenance: `src/data/media.json`, `extra-media.json` and `portraits.json`.
- Site theme: shared tokens in `src/styles/globals.css`, with layout skin in `src/styles/frontier.css`.

The site includes all seventeen class introductions and editorial build frameworks. The remaining databases are **partial references**, not a complete digital Codex. Do not describe the builds as tested level-by-level card lists. Tabletop evidence is labeled separately from digital evidence. Current coverage is also visible at `/editorial/`.

`pnpm test` runs this site's map and publication integrity tests. The inherited template tests remain available as upstream references; several assume the demo landing site and Japanese demo content that are deliberately removed here. Application typechecking excludes those test fixtures.

## Publishing

GitHub is the source of truth. Cloudflare Pages connects to `tielidev/frosthaven-wiki`; `main` is production, pull requests get previews. CI must pass before merging. Do not add a second deployment workflow in GitHub Actions.

See [deployment and rollback](docs/frosthaven-deployment.md). No scheduled content generation or automatic external messaging is enabled.

## Advertising

Adsterra Banner units are configured in `wrangler.toml` and `public/ads/`. Keys embedded in the ad snippets are public placement identifiers, not account credentials. They are different from API tokens and must not be replaced with a different site's units.

Optional ads are consent-gated. Desktop leaderboard and mobile rectangle placements are mutually exclusive by viewport. No popunder, Social Bar or automatic top-page navigation is enabled. AdSense is dormant until `PUBLIC_AD_PROVIDER="adsense"` and its approved account/slot fields are populated. Never place account credentials in the repository.
