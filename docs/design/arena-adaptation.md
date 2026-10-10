# Reachly × Arena — rebuilt UI contract

## Current pavilion iteration
The previous poster implementation (`c42456e`) was retained in Git history, not rebuilt again. `e0cb871` introduced the immersive green pavilion; the continuation finishes its scroll and navigation behavior.

Journey: **immersive hero → real client gallery → layered photographic manifesto → reverse marquees → service blueprint → concepts → comparison → horizontal process → FAQ → lime invitation → monumental footer**.

- Full-bleed green hero, two monumental outlined/solid lines, original interactive WebGL pavilion and orbiting website concepts.
- Desktop pinned hero orbit and native-scroll client gallery; keyboard/button input takes priority. Smaller screens use native horizontal browsing.
- Staggered fullscreen menu, tilted manifesto parallax, rotating service blueprint, center-opening image blinds and horizontal process travel.
- Sticky navigation; all-screen modal containment and local-only planner preserved.
- Reduced-motion/pause/missing-library paths leave all five process steps readable. Wide device plane bounded at 1760px without bounding the full-bleed hero.
- Real archives and exact adaptations: [animation sources](animation-sources.md). No new production dependency or Adidas asset.

## Previous poster composition (historical)
A Decide/Learn landing page with an Explore-style client rail. This version replaces `dist/style.css` and page compositions rather than layering cosmetic overrides. `dist/arena.css` now holds approved palette and font tokens only.

Journey: **hero → client projects → photographic manifesto → services → design concepts → comparison → process → FAQ → invitation**.

- Framed poster hero: outlined introduction, two large solid lines, photographic scraps, metadata/rules and a labelled interactive world.
- Four real projects in a native horizontal poster rail with previous/next controls, keyboard-accessible links and disabled end states. Replaces the offset two-column gallery.
- Photographic manifesto: condensed statement and tilted lime-bordered photograph.
- Five services as an editorial list and changing panel; illustrative concepts occupy their own lime section.
- Five-stage process as a responsive timeline, not the former sticky-dial composition.
- Ink invitation with outlined/solid display type and a clear local-brief action.
- All-screen lime menu: background inerting, keyboard containment, Escape, focus restoration and scroll locking. Close control remains on-screen when opened further down the page.

## Executed reference work
- Reference: https://www.adidasarena.com/
- SkillUI 1.3.4; upstream `bc913a8d3503d6b2a683e4a3ac04ffe7304ac510`.
- Successful Ultra: `npx --no-install skillui --url https://www.adidasarena.com/ --mode ultra --name adidas-arena --out design/reference --format design-md --no-skill`.
- Output `design/reference/adidas-arena-design/`, ignored and not served. Seven nonempty scroll frames: 000, 017, 033, 050, 067, 083, 100. Video frame PNGs are not scroll frames.
- Inspected DESIGN.md, ANIMATIONS.md, LAYOUT.md and real captures; revisited 000/017/033 for the teardown's hero, horizontal programming and photographic statement.
- Fresh successful extraction: `node node_modules/skillui/dist/cli.js --url https://www.adidasarena.com/ --name adidas-arena-rebuild --out design/reference --format design-md --no-skill`. Read `adidas-arena-rebuild-design/DESIGN.md`. This command did **not** explicitly request Ultra; the earlier verified Ultra captures remain composition/motion evidence.

## Observation → adaptation
| Arena observation | Reachly implementation |
|---|---|
| Condensed outlined/solid hierarchy | Local Barlow Condensed, three visual headline lines |
| Thin rules, metadata, bordered model | Framed poster and labelled device world, no stadium model |
| Rotated photographic scraps | Local concept photography, no Arena event imagery |
| Horizontally browsed programming | Four confirmed client websites in a native rail |
| Statement and tilted framed photograph | Original SME proposition and lime-framed flower photograph |
| Large navigation overlay | Original Reachly links and explicit keyboard behavior |

## Locked identity and behavior
Cream `#FAF7F0`, ink `#05100E`, lime `#D4E751`, green `#17463A`. Preserve approved SVG geometry, local fonts and source-kit/runtime bytes. Poster frame stops growing at 1760px, type scales from its container, phone retains 9:20. Transformed edges are measured, not merely concealed by clipping.

Preserve five services, four exact client URLs, browser/phone concepts, illustrative labels, local-only planner/export, native scrolling/dialogs, keyboard tabs, no-JavaScript readability, blocked-GSAP fallback and pause/reduced-motion cleanup. No reference branding, proprietary fonts, event copy, cookie banner, debug GUI or runtime scripts are copied.

## Limits and acceptance
Generated prose is observational: dark-theme inference, reversed font roles and decimal-duration parsing were inaccurate. Cookie overlays obscure parts of captures. Check actual screenshots/CSS, not canvas counts or generated recommendations.

The earlier CSS-led design was owner-rejected. Tests and code review did not prove visual transformation. Current original/reference/rebuilt captures show the changed structures; final aesthetic acceptance belongs to the owner. See `docs/design/qa.md` for real execution and limitations. The owner authorized pushing this iteration to `reachlyid`; no merge, DNS change or deployment is included.
