# Reachly

An English-language website for Reachly’s Indonesian SME services: website design and development, digital presence, digital strategy, business automation, and foundational SEO. Approved lime, ink, cream, and deep green; Arena-inspired editorial layouts; local concept photography; distinct service diagrams; and purposeful GSAP motion.

`COMPANY_PROFILE.md` is the owner-supplied source of truth. `DESIGN_NOTES.md` records the design, exact Drive components adapted, motion behavior, and verification limits.

## Development and deployment

The deployable static website is in `dist/`. HTML, CSS, native ES modules, and locally vendored GSAP require **no build step**. All photos, fonts, and runtime scripts are local. Node dependencies are development-only: testing and SkillUI reference extraction. They are not served or installed in production.

For local checks, use Node 24.15+ (on the Node 24 line) and Python 3.12:

```sh
npm ci
npm test
python tests/check_site.py
node --check dist/app.js
node --check dist/model.js
node --check dist/motion.js
node --check dist/orb.js
node --check dist/world.js
npx --no-install playwright install chromium
npm run test:browser
```

Preview locally: `python -m http.server 4174 --bind 127.0.0.1 --directory dist`, then open http://127.0.0.1:4174/.

The `reachlyid` branch uses project-local SkillUI 1.3.4 with real Ultra extraction:

```sh
npx --no-install skillui --url https://www.adidasarena.com/ --mode ultra --name adidas-arena --out design/reference --format design-md --no-skill
```

Raw reference captures are ignored and never deployed. Read `docs/design/arena-adaptation.md` for observed evidence and extraction pitfalls. The approved kit backup is in `brand/Reachly-Brand-Kit/`; the eight served identity assets are in `dist/assets/brand/`. Ponytail coding/review guidance is pinned in `docs/agent/` and activated through `AGENTS.md`.

For Vercel, import this repository with **Root Directory left at the repository root**. The committed `vercel.json` selects **Other**, skips installation and building, and serves **dist**. This prevents a root 404 when the HTML entry point is under `dist/`. After a configuration change, deploy the latest `main` commit; redeploying an older commit will not include the fix. Connect `reachly.id` through the host’s domain settings using the records it provides. Domain DNS and a public launch are separate from this owner-private preview:

https://reachly-studio.craftymaple16.chatgpt.site

## Interactions

- Explore the immersive green pavilion: original WebGL, drag/arrow-key rotation, orbiting concepts, and click/Enter concept changes. A CSS pavilion remains visible when WebGL is unavailable.
- Browse four confirmed client sites in the tilted horizontal rail. Desktop scrolling traverses a pinned gallery; touch, keyboard focus and previous/next controls retain priority.
- Open the full-screen menu at any width; background interaction is isolated, focus is contained, and Escape returns to the close control.
- The short brand statement uses the supplied Drive gooey text reveal and expanding image-spot components, adapted to vanilla HTML/JS. Each spot is a button with an accessible name that selects its concept on click, tap, or keyboard activation.
- The before/after range is assisted by scroll until the visitor takes control; manual input remains authoritative for the page visit.
- Five service tabs update the narrative, diagram, tags, and project-planner goal. Service and concept tabs support roving focus, arrows, Home, and End.
- Concept photography opens through a staggered blinds reveal. The five-stage process travels horizontally on desktop; pause, reduced motion and small screens expose every stage in ordinary flow.
- Pause motion saves a local preference and removes GSAP triggers and styles. System reduced motion takes precedence. Meaningful content is readable without JavaScript or GSAP.
- The project planner validates fields, recovers a local draft, exports plain text, supports clipboard copying, and offers draft erasure. **It does not send an inquiry.**

## Company claims and contact

No verified official contact address, WhatsApp number, submission endpoint, pricing, company founding date, or measured customer results have been provided. The owner has confirmed Crypto Radius, Crypto Galaxy, Sellaku, and Mac One Indonesia as client website projects; they are shown with live links and project imagery. Unknown facts are omitted from public copy. The attached profile’s internal TBD fields remain in the source document.

Reusable software, AI-assisted tools, productized automation, Meta Ads, and deeper analytics are explicitly future directions or options. The separate café, florist, and interior concept showcase remains illustrative. Hosting, maintenance, subscriptions, and support require agreed scope. No analytics or advertising trackers are included.

## Validation

Node tests check actual simulated-DOM interactions, structural rebuilding, local privacy, company facts, motion cleanup and exact asset copies. Real Chromium checks the rebuilt menu, native project rail, planner and responsive layout at 320, 375, 768, 1024 and 1440px; dedicated normal/reduced-motion tests extend hero scaling through 3840px. Parsed HTML/CSS and module syntax are checked separately. `docs/design/qa.md` records exact current results. GitHub Actions is configured to run the suites and retain evidence, but no hosted run is claimed.

Local Chromium verification now covers real layout, keyboard controls, clipboard/download, privacy erasure, no-JavaScript and blocked-GSAP fallbacks, and motion lifecycle. Screenshots are saved under `.artifacts/arena/` and `.artifacts/rebuild/`; matching-width original/rebuilt captures include 320, 1440 and 2560px. See `docs/design/qa.md` for exact results and visual-review limits. Physical devices, screen readers, production hosting, and measured Web Vitals are not verified by this suite.

## References and licenses

- The verified Adidas Arena Ultra extraction supplies the composition and motion blueprint. Real Awwwards Pack source archives supplement it; see `docs/design/animation-sources.md`. No Adidas branding, licensed fonts or assets are used.
- UI/UX Pro Max informed design review and interaction/accessibility decisions; it is not installed as a runtime dependency.
- The Drive **Text Animations / 18** and **Hover Effects / 21** components are actually adapted in the statement section; source links and differences are documented in `DESIGN_NOTES.md`.
- GSAP and ScrollTrigger **3.15.0** are vendored unmodified with their copyright and standard-license notices retained.
- Jakub Antalik’s `thinking-orbs` geometry is adapted under MIT, with its notice in `dist/THIRD_PARTY_LICENSES.txt`.
- Concept photography is from Unsplash photo IDs `photo-1442512595331-e89e73853f31`, `photo-1494438639946-1ebd1d20bf85`, and `photo-1490750967868-88aa4486c946`.
- Locally hosted Barlow Condensed and Manrope font license notices accompany the assets.

The current UI replaces the old page composition and legacy stylesheet, retaining contained concept artwork and existing motion fallbacks. Design sources and verification limits are recorded in `DESIGN_NOTES.md`.

Browser and mobile concept previews are retained by owner preference. Services text is contrast checked; scroll transitions reveal actual portfolio content.
