# Deployment and maintenance

## Account/project

- GitHub: `tielidev/frosthaven-wiki`
- Cloudflare Pages: `frosthaven-wiki`
- Production branch: `main`
- Build: `pnpm build`; output: `dist`; Node: 22
- Canonical domain: `https://frosthaven.wiki`
- Both apex and `www.frosthaven.wiki` are bound with active SSL.
- Cloudflare Bulk Redirect list `frosthaven_www_redirect`, enabled by rule `Frosthaven canonical www redirect`, sends `www.frosthaven.wiki` to `https://frosthaven.wiki` with HTTP 301, subpath matching, path suffix and query preservation. It does not include other subdomains. Host matching is not supported in Pages `_redirects`; keep this rule at account level.

Cloudflare's GitHub application must have access to this repository. A project can show a repository name while warning that its Git account is disconnected; that warning is not a successful integration. Complete GitHub reauthentication and add the specific repository, rather than expanding unrelated repository access.

## Launch verification (2026-10-16)

The first release is live on the canonical domain; desktop/mobile navigation, search, map controls, consent withdrawal, sitemap and favicon were checked. The www redirect was independently verified as 301 with path/query preservation. Local DNS still cached a negative answer during QA, so browser verification used the public DNS-resolved Cloudflare address with normal HTTPS certificate verification.

The owner completed GitHub reauthentication and the Cloudflare app was granted access to `frosthaven-wiki` on 2026-10-16, retaining the existing selected-repository scope. Cloudflare no longer shows the disconnected-account warning. Verify a fresh pull request preview and its merged production commit before treating the automatic release requirement as passed. Manual retries of deployment `9b0dcdc` rebuilt that original commit rather than current main, so they are not evidence of working Git integration.

Adsterra approved both banner units and the site; the real snippets are installed behind consent. An outer ad frame was verified, but no filled creative or paid impression was confirmed. `ads.txt` still awaits any provider-issued seller records. Complete digital item/scenario statistics, walkthroughs and map positions also remain partial; see the content coverage report.

## Configuration

`astro.config.ts` reads the tracked public keys from the `[vars]` section of `wrangler.toml` before building. Explicit build-environment values take precedence. This makes local and hosted static builds consistent without assuming Pages Functions runtime bindings automatically become static build variables.

`CF_PAGES_BRANCH` is supplied by Cloudflare. Any branch other than `main` disables the ad provider, AdSense and analytics; preview pages declare noindex and preview robots disallow crawling. The GitHub build check uses a preview branch value.

Advertising defaults to Adsterra. `PUBLIC_AD_PROVIDER="none"` stops site ad mounts on the next deployment. Missing unit keys also disable those units. Changing to AdSense requires a real approved client and slot IDs, updated privacy disclosure and the applicable Google consent requirements; it is not an automatic approval path.

### Analytics and consent

`PUBLIC_GA_ID="G-MLBDWVKPQ2"` selects the independent **Frosthaven Wiki** GA4 property `559248880` in account `326743915`. Keep this public measurement ID in `wrangler.toml`; no GTM container or second analytics loader is needed. A non-main build removes the ID before rendering.

Advertising and analytics share explicit consent stored under `aw-cookie-consent-v2`. Earlier advertising-only choices are intentionally ignored. Until acceptance, the site does not request Google Analytics or advertising scripts. The loader runs once per document; normal navigation records the next page through GA4's standard page-view configuration. Withdrawal sets Google's measurement-disable flag, clears controllable first-party `_ga*` / `_gid` cookies and reloads with the declined choice. Cookie preferences remain accessible at `/cookies/`.

The Google tag grants analytics storage only after acceptance and always denies Google advertising storage, user data and personalization permissions. Property settings should retain Singapore reporting time, USD currency, 14-month event retention, Google Signals/personalized advertising off, and enhanced measurement for scrolling, outbound clicks, downloads and supported videos only (automatic site-search/form collection off). The local consent check should stub external scripts; production verification requires a real collect request with this ID and a matching Realtime visit.

`ads.txt` remains comments-only unless the ad provider supplies applicable authorized seller records. Never invent publisher IDs or copy another site's seller entries.

## Pull request and release

1. Create a feature branch and edit source or MDX.
2. Run the checks listed in README.
3. Push and open a pull request. Inspect the Cloudflare preview, which must have no real advertising enabled.
4. Merge after Site checks succeeds; Cloudflare publishes `main`.
5. Inspect the canonical domain on desktop and phone, exercise navigation/search/maps and changed behavior, check images, favicon, robots and sitemap.

The inherited template's self-promotion, auto-content and ops-release workflows are removed from the site pipeline. Do not re-enable them as part of routine content edits.

## Rollback

For an urgent production issue, select the last successful production deployment in Cloudflare Pages and use its rollback action. Then revert the offending commit through GitHub and let `main` rebuild so source and production converge. Branch previews are not a substitute for checking the production custom domain.

## Content and media

Read `content-coverage.md` before describing completeness. Add verified facts to structured data and the relevant MDX together. Keep sources and version dates accurate. `scripts/build-frontier-content.mjs` was an initial integration helper: it regenerates researched pages and can overwrite manual refinements. Routine maintenance edits MDX directly rather than rerunning initializers.

The game icon comes from the official website favicon; logos, screenshots and looping clips retain their owners' copyrights. The software MIT license does not license the game assets. Public source records identify where each visual came from.
