# Reachly — UI and motion decisions

The current branch uses the approved Reachly brand kit: cream, lime, ink, and deep green. Earlier sections below describe prior revisions; the current Ultra adaptation and verification supersede their palette and browser-unavailable statements. Editorial typography, an asymmetric statement, a tactile concept collage, diagrams tailored to each service, and a readable five-stage process give different information different presentations.

## Current Reachlyid adaptation

SkillUI 1.3.4 was actually run in Ultra mode against Adidas Arena, producing seven scroll frames and interaction captures. Screenshots and extracted CSS informed an original editorial split hero, outlined/solid type hierarchy, thin frame rules, and offset client gallery. Reachly retains its approved SVG logos, existing local fonts, device previews, copy and interactions. The small override stylesheet is `dist/arena.css`; no framework or runtime dependency was added.

See `docs/design/arena-adaptation.md` for exact provenance and corrections to generated recommendations, and `docs/design/qa.md` for Chromium results. New browser contracts verify all five widths and catch both inactive-service text specificity and the 320px miniature-browser overlap that simulated DOM checks missed. Artwork hashes are preserved through Git with scoped `-text` attributes.

## Company content

`COMPANY_PROFILE.md` is the owner-supplied source of truth, imported without adding unverified business facts. The website reflects its Indonesian SME focus and five approved initial services. Software, AI tools, productized automation, Meta Ads, and deeper analytics remain explicitly future directions. Illustrative work is labelled as concepts. Founding claims, customer results, pricing, and unknown contact details are omitted.

## Resources actually used

- [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill): read its skill, ran the local design-system query `creative agency SME editorial` and the GSAP query `scroll pinned storytelling`, and reviewed its web accessibility and performance rules. Applied its storytelling, responsive simplification, motion cleanup, reading order, contrast, and interaction guidance. Kept Reachly’s existing palette and fonts rather than using the generated pink/cyan palette. The skill is an authoring resource, not a runtime dependency or global installation.
- Supplied Google Drive **Text Animations / 18 / gooey-text-reveal**: adapted the `GooeyFilter` alpha matrix and `AnimatedCopy` line blur reveal to static, explicitly marked lines. The statement uses its real filter and GSAP reveal mechanism; it does not need React, SplitText, the bundled typeface, or its photos. [Source archive](https://drive.google.com/file/d/12edXZagRQeAoE0abGegdA7IrGJx-qXhC/view).
- Supplied Google Drive **Hover Effects / 21 / zentry-hover-animation**: adapted its expanding inline image spot, bounded pointer drift, 3D tilt, and counter-moving photograph. Fixed card geometry plus transform scaling replaces per-frame dimension animation. Each spot is a real button that opens its concept on click or keyboard activation; touch users retain the action. [Source archive](https://drive.google.com/file/d/10gXsDOCgyxqPAVaVH2Vnt4MiFmD5n3oZ/view).
- The previously reviewed **Scroll Animation / RGB split** reference remains documented as first-edition inspiration. The old ink-shadow effect was removed in this revision to keep the motion purposeful.
- [GSAP](https://github.com/greensock/GSAP): local, unmodified GSAP and ScrollTrigger 3.15.0 builds, preserving their copyright/license banners. No runtime CDN calls. The library uses the [standard license](https://gsap.com/standard-license/).
- [thinking-orbs](https://github.com/Jakubantalik/thinking-orbs): retained MIT-attributed orbit geometry for the future-directions strip.

The Drive adaptations use Reachly’s own imagery and existing licensed fonts. The supplied archives do not include a separate license notice; no license is invented for them and their full packs are not redistributed.

## Motion map

| Place | Behavior | Purpose |
| --- | --- | --- |
| Hero | Short, staggered type entrance; manual 3D collage rotation | Introduce the brand and let visitors explore a concept |
| Brand statement | One-time gooey line reveal; image spots on hover/focus | Make the business proposition tangible |
| Transformation | Scroll-assisted range until the visitor takes over | Show the difference between website presentations |
| Services | Short panel response; five distinct diagrams | Explain the actual approved service scope |
| Concepts | Scroll aperture reveal; click-based concept change | Show different visual directions without implying client work |
| Process | Desktop sticky summary and scroll-progress rail | Follow the profile’s Discover, Plan, Create, Launch, Improve stages |
| Contact | A short scroll-linked asterisk turn | Give the final invitation a small visual finish |

Native scrolling remains intact. No scroll hijacking or nested horizontal scroll is used. Mobile presents all process steps in normal flow. Reduced motion and the site’s Pause motion setting disable decorative motion; the system preference takes precedence. GSAP contexts remove triggers, listeners, and inline styles when the preference or breakpoint changes. Content defaults to readable if the enhancement is unavailable.

## Verification

Tests exercise the actual application in a simulated DOM: five service selections and brief goals, tab keyboard navigation, image-spot click actions, menu Escape, form export/recovery/privacy erasure, visitor text safety, and real GSAP trigger teardown/resume. Pure tests verify orbital geometry, bounded hover poses, source facts, and local assets. HTML/CSS structure and ES-module syntax are checked separately.

The simulated DOM is not a rendering engine. Browser visual QA, real scroll geometry, and device performance could not be verified because the supported managed browser capability is unavailable. Manual acceptance should cover 375px, 768px, 1024px, and 1440px widths, mouse and touch, keyboard focus, and reduced motion.

## Vercel output fix

The homepage lives at `dist/index.html`. `vercel.json` explicitly sets `outputDirectory` to `dist`, `framework` to null (Other), and blank install/build commands for this prebuilt static site. Keep the Vercel Root Directory at the repository root so the configuration is read. A regression test checks that this output contains the homepage and excludes internal company documents.

## Owner-confirmed client work

Added Crypto Radius, Crypto Galaxy, Sellaku, and Mac One Indonesia after the owner identified them as client projects. The primary navigation now points to client work. All four external links retain the supplied URLs and open in a new tab with noopener/noreferrer. Project previews are editorial brand compositions using imagery from the linked websites, explicitly labelled as previews rather than screenshots. No delivery dates, performance results, or testimonials were supplied or invented.

Local optimized WebP assets come from Crypto Radius `/logo.png`, Crypto Galaxy `/logo-bg.jpg`, Mac One `/assets/img/hero.jpg` and `/assets/img/brand/logo-white.png`. Sellaku's storefront source references Unsplash `photo-1555041469-a586c61ea9bc`, used here as its furniture preview. These assets serve locally and do not add runtime image requests to third-party sites.

## Editorial refinement and overlap correction

The hero instructions now occupy a wrapping caption beneath the interactive stage, outside the transformed artwork. The comparison uses three normal-flow rows (navigation, headline/photo, footer); its headline has dedicated space and readable line spacing rather than absolute positioning over the image. Small screens keep the same separation. The hero caption tracks the selected concept.

Removed the orbit outline, floating slogan stickers, oversized hero asterisk, and repeating slogan marquee. Replaced the marquee with a quiet service/context strip and simplified services/contact copy. Retained purposeful drag, concept switching, image hover, and scroll interaction. Typography and preview edges now use a more restrained editorial treatment. Browser rendering remains unverified because the supported managed browser is unavailable.

## Hallmark studio revision

Reviewed [Hallmark SKILL.md](https://github.com/nutlope/hallmark/blob/main/skills/hallmark/SKILL.md), its redesign, editorial, Split Studio and output contract references. Preserved Reachly’s existing palette and local font assets. The visual layer now uses upright typography, bounded flat concept compositions without browser/phone chrome, an in-flow header, a quieter split introduction, and an ink portfolio section. Existing application routes, facts, forms and project links remain.

The supplied screenshot revealed that transformed, absolutely sized artwork escaped the hero stage even though its caption was a sibling. The stage now clips painting and establishes paint containment; both concept cards occupy constrained grid tracks with flexible inner rows. The caption is outside that paint boundary. This addresses the actual overflowing artwork rather than increasing a fixed gap.

Read the community [transitions.dev recipe skill](https://github.com/Jakubantalik/transitions.dev/blob/main/assets/community/skills/transitions-dev.md) and panel-reveal recipe for element-specific motion, timing and reduced-motion guidance. Did not run its paid automatic fixer.

Adapted the actual [Drive Scroll Animation / 53 code](https://drive.google.com/file/d/15wEVo6BDHXgXj6T8-Tenq19xfoIflpIR/view): its nine masks and diagonal 1 / 2+4 / 3+5+7 / 6+8 / 9 order form the services-to-portfolio boundary. Nine lightweight grid cells replace repeated full-size images. No Lenis or remote image assets are introduced. The work-to-process boundary uses a separate horizontal rule drawing, rather than repeating the mask. Both are scrubbed with native GSAP ScrollTrigger, are decorative, and leave the next section fully readable. Pause/reduced-motion reverts the effects to the complete static layout.

Automated checks cover paint containment, captions outside the stage, constrained hero cards, both transition registrations and teardown, reduced-motion fallbacks, tabs, all five services, client links and brief export. Browser rendering at 320/375/414/768px remains unverified because the supported managed browser capability is unavailable. The screenshot is the visual evidence used to diagnose the overflow; simulated DOM checks do not measure painted rectangles.

## Owner correction: tactile previews and readable content

Restored the browser chrome on all four client cards and the desktop-browser plus phone hero, as explicitly requested by the owner. This preference overrides Hallmark's generic ban on illustrated device chrome. The hero retains paint containment, proportional device sizing, and reserved lower space so transformed art cannot cross into its caption.

The supplied services screenshot exposed a real palette regression: cream replaced the dark background but legacy pale foreground rules remained. Explicit semantic foreground tokens now cover the heading copy, service tabs/numbers, descriptions, captions, brief action and planned-services text. A computed-style regression resolves these tokens and requires at least 4.5:1 contrast on the cream surface.

Removed both empty section handoffs, including the short orange band. Motion now expands the actual client-work section and opens the real project previews. The existing process rail indicates the active Discover/Plan/Create/Launch/Improve stage. There are no blank mask blocks between sections. Both content reveals revert cleanly on pause and have complete reduced-motion fallbacks.

Re-read Adidas Arena's live homepage and its linked CSS. Its condensed uppercase typography, cream/ink/orange palette, draggable hero and media-heavy programming informed the direction; its licensed fonts and arena assets are not copied. Reachly keeps its local fonts and owner-approved imagery. Browser rendering remains unavailable; screenshot diagnosis, simulated DOM, source checks and live deployment readback are the available verification.
