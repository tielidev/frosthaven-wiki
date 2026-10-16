# Deployment and maintenance

## Account/project

- GitHub: `tielidev/frosthaven-wiki`
- Cloudflare Pages: `frosthaven-wiki`
- Production branch: `main`
- Build: `pnpm build`; output: `dist`; Node: 22
- Canonical domain: `https://frosthaven.wiki`
- `www.frosthaven.wiki` must also be bound before its redirect can work.

Cloudflare's GitHub application must have access to this repository. A project can show a repository name while warning that its Git account is disconnected; that warning is not a successful integration. Complete GitHub reauthentication and add the specific repository, rather than expanding unrelated repository access.

## Configuration

`astro.config.ts` reads the tracked public keys from the `[vars]` section of `wrangler.toml` before building. Explicit build-environment values take precedence. This makes local and hosted static builds consistent without assuming Pages Functions runtime bindings automatically become static build variables.

`CF_PAGES_BRANCH` is supplied by Cloudflare. Any branch other than `main` disables the ad provider, AdSense and analytics; preview pages declare noindex and preview robots disallow crawling. The GitHub build check uses a preview branch value.

Advertising defaults to Adsterra. `PUBLIC_AD_PROVIDER="none"` stops site ad mounts on the next deployment. Missing unit keys also disable those units. Changing to AdSense requires a real approved client and slot IDs, updated privacy disclosure and the applicable Google consent requirements; it is not an automatic approval path.

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
