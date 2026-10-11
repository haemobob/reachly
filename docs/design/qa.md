# Reachly Studio & Possibilities — QA

## Result and scope

**Ready for branch delivery and preview review. Not a production launch.**

Local verification: Windows 11, Node v26.7.0, production Astro build at `http://127.0.0.1:4321/`. CI is configured for Node 24. This report does not imply hosted CI success, owner aesthetic acceptance or full WCAG conformance.

The previous site's implementation and QA are preserved at `6ee7d3f2a66f491dc7e06995de28ecf15b73516f`; this report replaces its historical pavilion/landing checks rather than pretending they test the new website.

## Final executed checks

| Check | Result |
| --- | --- |
| `npm run build` | 17 static pages and sitemap; successful |
| `npm test` | 25 model, content and simulated-DOM tests passed |
| `npx --no-install astro check` | 36 files, zero errors/warnings/hints |
| `npx --no-install playwright test -c playwright.dual.config.mjs --reporter=json` | 44 passed, 2 intentional skips, zero failures/flaky results |
| `npm audit` | Zero known vulnerabilities across production and development dependencies |
| `git diff --check` | Passed; Windows LF/CRLF conversion notices are not whitespace failures |
| Approved identity comparison | Black/white logo, point icon and favicon equal historical bytes |

Browser run began `2026-10-11T15:43:15.150Z`. Two desktop skips cover the mobile modal-menu and mobile touch-target checks; both execute and pass in the mobile project. Reports: `.artifacts/dual/final-browser.json`, `final-audit.json`.

## Real-browser behaviors

- Studio and Possibilities inspected at 1440×900 and touch-emulated 390×844, including intermediate scroll positions, not just their openings. Responsive tests also measure the journeys at 320, 375, 768, 1024, 1440, 1920, 2560 and 3840px.
- Supporting routes, slashless navigation, local links, heading structure, eager imagery and absence of page exceptions verified. Custom 404 source/content is covered by model checks.
- Native chapter entry, sticky-navigation alignment, browser Back and return from Contact verified. ScrollTrigger initialization waits for load/fonts to avoid stale initial scroll restoration.
- Perspective selection, both sample workflows, completion disclaimer, pause/resume and system reduced motion verified.
- Renderer import failure, context loss plus later perspective changes, back-forward-cache lifecycle, and preference changes while the renderer import is delayed verified. The last two delayed-import tests first reproduced unwanted mounting/duplicate canvases; one pending-load guard plus a post-import preference check fixed them.
- Mobile modal containment/Escape/focus recovery, exhibition 44px hit areas and ordinary content/links with JavaScript disabled verified.
- Brief validation focuses the first invalid field. Review uses literal visitor text, editing/clearing preserves intended state, copy recovers with manual selection, and TXT download matches the prepared brief. Personal input is neither submitted nor persisted.
- Studio request inspection confirms it does not download the exhibition renderer. Both journeys made zero third-party requests and had no page exceptions or HTTP error responses during the final capture pass.

## Accessibility and visual review

Axe WCAG A/AA checks pass on Studio, Possibilities, Contact and Services in desktop/mobile Chromium. Mobile Lighthouse navigation audits returned 100 in accessibility, best practices, SEO and agentic browsing for both experiences. These audits **exclude performance**. Reports are archived as `.artifacts/dual/lighthouse-studio.json` and `lighthouse-possibilities.json`.

Visual critique addressed true italic delivery, correct capture proportions, caption contrast, section rhythm, the Studio rotating orbit's responsive geometry, chapter landing alignment and mobile control size. Evidence: opening/full-page/section PNGs and `preview-evidence.json` under `.artifacts/dual/`. Reproduce with `node scripts/capture-preview.mjs` against the local built preview.

The original Reachly logo is intact; separate point graphics animate. Real screenshot provenance, visible Sellaku source branding and capture limitations are documented in `project-imagery.md`. No fabricated results/testimonials/personnel are used. The workflow is explicitly an in-house sample, not a delivery integration.

## Performance: measured conditions and limits

Local, unthrottled Chromium capture measurements before scrolling:

| Experience | Desktop LCP / CLS | Mobile LCP / CLS |
| --- | --- | --- |
| Studio | 152ms / 0.01358 | 140ms / 0 |
| Possibilities | 92ms / 0.00237 | 116ms / 0 |

These are loopback observations, **not production Core Web Vitals**, mobile-device benchmarks or a performance Lighthouse score. INP has not been established. Resource Timing recorded about 463KB of encoded response bodies for Studio and 595KB for Possibilities, not uncached end-to-end wire totals.

The build retains a chunk-size warning for the isolated Three.js renderer. Its observed encoded response body is about 130KB; it is deferred to the exhibition and not requested by Studio. The renderer caps pixel ratio at 1.5 and stops animation offscreen/when hidden. GPU fallback remains available. No warning threshold was raised to conceal this trade-off.

## Review and release boundaries

Reviewed connected motion, renderer, navigation, brief-model/contact, route/content and CI flows for correctness, privacy, lifecycle recovery and unnecessary work. Expected load: static public pages with per-visitor local interaction, no shared application mutations or database. Removed tracked build output and obsolete tests; the original remains in Git history.

**Commercial-launch dependency:** no verified inquiry receiver was supplied. Contact prepares/copies/downloads a brief locally. It does not send it. Confirm a receiver, its data handling and user consent before adding submission or announcing launch.

No owner-approved pixel-diff baseline exists: automated visual regression acceptance is **INCONCLUSIVE**. Physical-device performance, screen-reader testing, Firefox/WebKit, field INP and final owner aesthetic acceptance remain unverified. Automated accessibility scores cannot establish full conformance.

Work is scoped to `reachlyid`. Do not open a PR, merge, modify `main`, or manually deploy to production. Git publication and any existing Git-triggered preview are verified separately from these local checks.
