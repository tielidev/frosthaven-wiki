# Adsterra blank-banner investigation

Investigated 2026-10-16 (Asia/Singapore). This report does not establish paid impressions or recovered ad fill.

## Platform facts and reproduction

- Website: `frosthaven.wiki`, Adsterra website ID `6126447`, Approved.
- Banner IDs: `31755986` (728x90) and `31755985` (300x250), both Active when inspected.
- Both exact script URLs and placement keys match the codes displayed by the publisher dashboard. No replacement domain or new placement was introduced.
- After accepting advertising, production successfully requested `https://www.highrevenueformat.com/eca493b27fc6f421c1089ef57eafa12e/invoke.js`; the response was HTTP 200 with Content-Length 0 and no generated ad iframe.
- Direct top-level loading of each ad wrapper also produced HTTP 200 and a zero-byte vendor response, including `https://www.highrevenueformat.com/599a2422f1f76b9f02a62d2c90a1b892/invoke.js`. The script request Referer was `https://frosthaven.wiki/`.
- These network captures used a fresh headless Edge session with normal DNS and no ad blocker. The user's regular browser also showed an empty white banner. Automated responses alone cannot identify whether the vendor is withholding fill because of traffic classification, placement setup, geography or another platform-side condition.
- A Cloudflare analytics CORS error occurred in the opaque-origin sandbox. It is separate from the vendor's successful but empty script response.

## Site changes and verification

The sandbox restores the inherited template permissions: scripts, same-origin, forms and popups; top navigation and popup escape are not granted. Scripts plus same-origin are layout containment, not a hard security boundary against malicious same-origin code.

Wrappers have transparent backgrounds. A shared status script observes vendor iframe load and reports script errors or a 12-second no-frame timeout. Parent handling checks origin, source window, placement identity and allowed state. Unavailable banners hide the blank frame and display a muted message without changing reserved dimensions. A loaded child frame is only a rendering signal, not proof of a visible creative or billable impression. There is no refresh loop or ad clicking.

Controlled browser fixtures verified empty scripts, network failure and a loaded child iframe. Desktop and mobile dimensions stayed stable, no horizontal overflow occurred, and mobile requested only its rectangle placement. Wrong source, wrong origin and wrong placement messages were ignored. Declined consent issued zero vendor requests; withdrawing consent removed src and prevented requests on return. Fixtures do not constitute genuine ad fill.

## Publisher support draft (not sent)

Our approved site frosthaven.wiki (website ID 6126447) has Active Banner units 31755986 (728x90) and 31755985 (300x250). The installed keys and script URLs match Get Code. Requests reach highrevenueformat.com but both invoke.js endpoints return HTTP 200 with zero-length bodies; no creative iframe is generated. This also reproduces when opening the wrapper outside an iframe. The HTTP Referer is https://frosthaven.wiki/. We have not clicked ads, refreshed them repeatedly, or replaced the script domains. Could you check whether these units are enabled for delivery and whether the domain, traffic classification, geography or an account-level restriction is causing empty script responses? Please provide the expected delivery conditions and any required integration changes.

## Completion boundary

Verify the production revision, both real vendor responses and ordinary desktop/mobile rendering after deployment. If scripts remain empty, report the site handling as repaired and platform delivery as unresolved. Do not label HTTP 200, an outer iframe, or a controlled test creative as recovered revenue delivery. Never send the support draft without the user's authorization.
