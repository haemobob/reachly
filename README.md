# Reachly

An English-language website for Reachly’s Indonesian SME services: website design and development, digital presence, digital strategy, business automation, and foundational SEO. Cream, vermilion, and ink; editorial layouts; local concept photography; distinct service diagrams; and purposeful GSAP motion.

`COMPANY_PROFILE.md` is the owner-supplied source of truth. `DESIGN_NOTES.md` records the design, exact Drive components adapted, motion behavior, and verification limits.

## Development and deployment

The deployable static website is in `dist/`. HTML, CSS, native ES modules, and locally vendored GSAP require **no build step**. All photos, fonts, and runtime scripts are local. Node dependencies are used only for testing.

For local checks, use Node 24 and Python 3.12:

```sh
npm ci
npm test
python tests/check_site.py
node --check dist/app.js
node --check dist/model.js
node --check dist/motion.js
node --check dist/orb.js
```

For Vercel, import this repository with **Root Directory left at the repository root**. The committed `vercel.json` selects **Other**, skips installation and building, and serves **dist**. This prevents a root 404 when the HTML entry point is under `dist/`. After a configuration change, deploy the latest `main` commit; redeploying an older commit will not include the fix. Connect `reachly.id` through the host’s domain settings using the records it provides. Domain DNS and a public launch are separate from this owner-private preview:

https://reachly-studio.craftymaple16.chatgpt.site

## Interactions

- Drag the hero collage, rotate it with arrow keys, or click / press Enter to change its illustrative concept.
- The short brand statement uses the supplied Drive gooey text reveal and expanding image-spot components, adapted to vanilla HTML/JS. Each spot is a button with an accessible name that selects its concept on click, tap, or keyboard activation.
- The before/after range is assisted by scroll until the visitor takes control; manual input remains authoritative for the page visit.
- Five service tabs update the narrative, diagram, tags, and project-planner goal. Service and concept tabs support roving focus, arrows, Home, and End.
- Concept photography opens through a scroll aperture. The five-stage process follows Discover, Plan, Create, Launch, Improve, with a sticky desktop summary and progress rail. Mobile shows every step in ordinary flow.
- Pause motion saves a local preference and removes GSAP triggers and styles. System reduced motion takes precedence. Meaningful content is readable without JavaScript or GSAP.
- The project planner validates fields, recovers a local draft, exports plain text, supports clipboard copying, and offers draft erasure. **It does not send an inquiry.**

## Company claims and contact

No verified official contact address, WhatsApp number, submission endpoint, pricing, company founding date, or measured customer results have been provided. The owner has confirmed Crypto Radius, Crypto Galaxy, Sellaku, and Mac One Indonesia as client website projects; they are shown with live links and project imagery. Unknown facts are omitted from public copy. The attached profile’s internal TBD fields remain in the source document.

Reusable software, AI-assisted tools, productized automation, Meta Ads, and deeper analytics are explicitly future directions or options. The separate café, florist, and interior concept showcase remains illustrative. Hosting, maintenance, subscriptions, and support require agreed scope. No analytics or advertising trackers are included.

## Validation

Twenty-one tests check actual simulated-DOM interactions, service selection, keyboard tabs, concept buttons, local brief handling, privacy erasure, visitor text safety, real GSAP initialization and cleanup, asset integrity, navigation, company scope, bounded mouse poses, and deterministic orb geometry. Parsed HTML/CSS and ES-module syntax checks run separately. GitHub Actions runs the same suite on pushes and pull requests.

The supported managed browser capability was unavailable. Simulated-DOM tests verify state and runtime behavior; they do not verify visual rendering, actual scroll geometry, or device performance. See the manual viewport and input acceptance notes in `DESIGN_NOTES.md`.

## References and licenses

- Adidas Arena informed visual scale and section variety. No Adidas branding or assets are used.
- UI/UX Pro Max informed design review and interaction/accessibility decisions; it is not installed as a runtime dependency.
- The Drive **Text Animations / 18** and **Hover Effects / 21** components are actually adapted in the statement section; source links and differences are documented in `DESIGN_NOTES.md`.
- GSAP and ScrollTrigger **3.15.0** are vendored unmodified with their copyright and standard-license notices retained.
- Jakub Antalik’s `thinking-orbs` geometry is adapted under MIT, with its notice in `dist/THIRD_PARTY_LICENSES.txt`.
- Concept photography is from Unsplash photo IDs `photo-1442512595331-e89e73853f31`, `photo-1494438639946-1ebd1d20bf85`, and `photo-1490750967868-88aa4486c946`.
- Locally hosted Barlow Condensed and Manrope font license notices accompany the assets.
