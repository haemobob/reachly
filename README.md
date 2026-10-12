# Reachly — Studio & Possibilities

One identity, two ways in. An original website for Reachly's Indonesian SME audience, grounded in the company profile and intact brand kit.

- **Studio `/`**: a continuous ivory ribbon-world carrying real portfolio work, five service paths, the intended process and a project invitation.
- **Possibilities `/possibilities/`**: the same sculptural world in a darker exhibition, opening into real imagery, a macro passage, an illustrative workflow and a further-reaching gesture.

## Run and verify

Use an Astro-supported Node version; CI uses Node 24.

```sh
npm ci
npm run dev
# Production-build preview:
npm run build
npm run preview
# Checks:
npm test
npx --no-install astro check
npx --no-install playwright install chromium
npm run test:browser
```

Open `http://127.0.0.1:4321/` and `http://127.0.0.1:4321/possibilities/`.
On Windows/Git Bash use `npm.cmd` if `npm` does not resolve. Astro 7 tracks preview instances: stop a tracked preview with `npx astro preview stop`, or run a deliberately separate foreground preview with `npm run preview -- --ignore-lock`.

## Architecture

Astro static pages, TypeScript, authored CSS and locally hosted Fraunces/Manrope. Both primary journeys share one persistent, dynamically imported Three.js ribbon renderer and one native-scroll state model; supporting routes do not request the renderer. There is no GSAP/ScrollTrigger runtime or nested/virtual scroll. Meaningful content remains HTML; original generated plates and an authored morphing SVG provide artwork when WebGL fails or is disabled. System reduced motion overrides saved preferences. GPU drawing is input/resize/visibility-driven, not an endless idle loop.

- `src/data/content.ts`: confirmed projects, approved services and intended process.
- `src/layouts/`, `src/components/`: shared identity/navigation/document shell.
- `src/pages/`: both experiences and supporting routes.
- `src/scripts/`: route-specific progressive enhancements.
- `src/lib/`: pure brief, motion, workflow, continuous world-state and ribbon-geometry models.
- `public/brand/`: intact identity assets.
- `public/images/`: actual client captures; provenance in `docs/design/project-imagery.md`. Original concept artwork lives under `images/world/`, with provenance in `docs/design/world-assets.md`.
- `scripts/render-social.mjs`: regenerates the checked-in raster share image using the official logo.

`dist/` is generated and ignored, not source. The previous site and tests remain recoverable at Git commit `6ee7d3f2a66f491dc7e06995de28ecf15b73516f`.

## Inquiry and release boundary

The company profile supplies no verified email, phone, WhatsApp or submission receiver. `/contact/` therefore prepares a brief locally with review, edit, copy, TXT download and clear. It does **not** send an inquiry or persist personal entries. Connect an owner-confirmed delivery channel and update the privacy explanation before commercial launch. No client outcomes, biographies, testimonials or contact details are invented.

No trackers or third-party runtime requests are introduced. Only the non-personal motion preference is stored locally.

`vercel.json` describes a later-approved Astro build (`npm ci`, `npm run build`, `dist` output). It does not deploy the website. Work and delivery belong to `reachlyid`; do not merge, change `main`, or deploy to production without separate authorization. Canonical metadata and sitemap use the approved `https://reachly.id` domain and exclude query strings.

## Design and evidence

`COMPANY_PROFILE.md` is factual authority; `brand/Reachly-Brand-Kit/` contains the established identity source. `.claude/plans/reachly-dual-experience.plan.md` is the approved creative foundation; the adjacent Shopify reference study records actual inspection. `DESIGN_NOTES.md` explains the implementation. `docs/design/qa.md` records results and limits. Local evidence goes in `.artifacts/dual/` and is not published. Runtime/font notices are in `public/THIRD_PARTY_NOTICES.txt`.

The current art direction is `docs/design/continuous-world.md`; its verification is `docs/design/continuity-qa.md`. The earlier dual-experience plan is historical creative context. Evidence and matching-width captures live under `.artifacts/continuity/`. The private Tailscale preview uses a built server at port 4322 and HTTPS Serve at 8443; ordinary commands above retain the default port 4321.

Shopify informed the division of visitor jobs, not copied branding/assets. Actual Awwwards archive source and SkillUI captures informed persistent-object travel, shape interpolation and media handoffs. Two 21st.dev motion components were inspected for principles rather than imported wholesale. Compositions, geometry and graphics are original. GitHub Actions is configured for the current tests; configuration alone is not hosted verification.
