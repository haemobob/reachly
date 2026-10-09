# Reachly × Arena — adaptation contract

## Surface and composition
A Decide/Learn marketing surface: one idea per section, a split editorial hero with outlined/solid condensed headline hierarchy and contained browser/phone previews. Real client work is an asymmetric two-column gallery, not an equal-weight feature grid. Keep the static site and all existing interactions.

## Provenance and executed extraction
- Reference: https://www.adidasarena.com/
- SkillUI 1.3.4; upstream bc913a8d3503d6b2a683e4a3ac04ffe7304ac510.
- Executed successfully (exit 0): `npx --no-install skillui --url https://www.adidasarena.com/ --mode ultra --name adidas-arena --out design/reference --format design-md --no-skill`.
- Output: `design/reference/adidas-arena-design/` (ignored, not served).
- Read DESIGN.md, references/ANIMATIONS.md and references/LAYOUT.md; visually inspected `screens/scroll/scroll-000.png` and `scroll-050.png`.
- Verified seven nonempty `scroll-*.png` captures: 000, 017, 033, 050, 067, 083, 100. The directory also has `video-1-frame.png`, so counting every PNG as a scroll frame is incorrect.
- Ponytail v5.1.0 upstream 9cc65d03aa2da1db7121b912d03596409ee340b8; official coding/review skills installed in active Hermes profile and pinned instruction adapter in `docs/agent/`.
- Identity: `brand/Reachly-Brand-Kit/BRAND_GUIDE.md`; full kit backed up byte-for-byte, eight exact runtime assets copied to `dist/assets/brand/`.

## Observed evidence → Reachly proposal
1. Hero screenshot: light background, huge condensed lettering, outlined opening line and solid lower lines → existing locally licensed Barlow Condensed, first line outlined, retained Reachly copy.
2. Hero: editorial text and bordered interactive model share the viewport → original split composition with existing draggable device collage, no stadium model.
3. Header/artwork use thin dark rules → ink rules, square outer frames, intact approved logo.
4. Mid-page capture: oversized horizontal typography and contrasting section surfaces → cream services, ink client work, deep green process, lime invitation, offset gallery. No looping marquee added merely for decoration.
5. Extracted CSS has short `.35s` opacity and `.5s`/`.7s` transform transitions, marquee keyframes and sticky patterns → retain existing GSAP reveals and pause/reduced-motion cleanup rather than new libraries or scroll hijacking.

## Extraction limits
Generated advice is not an authoritative specification. DESIGN.md labels the site dark although the hero capture is light, reverses heading/body font recommendations, and ANIMATIONS.md misparses decimal seconds (`.35s` → `35s`) and uses locale-separated heights. Cookie consent overlays obscure part of captures. Sixteen detected canvases do not establish a need for sixteen canvases in Reachly. Do not copy generated durations, role assignments, proprietary fonts, reference imagery, event copy, logos or scripts.

## Locked design values
Cream #FAF7F0, ink #05100E, lime #D4E751, green #17463A; white approved lettering. Preserve logo aspect ratios and geometry. Desktop header 88px, mobile 76px; gutters clamp(20px,4vw,64px). Desktop hero content is now bounded to 1600px after owner feedback exposed ultra-wide scaling defects; its type uses container-relative sizing, and the phone preserves a 9:20 ratio. Desktop hero frame remains 520px, smaller frames 440/380/310px. Client gallery even cards offset 88px above mobile breakpoint. Close/menu targets at least 44px.

Preserve five services, four confirmed client links, concept labeling, both device previews, local-only brief privacy and export, native scroll, accessible tabs/dialogs, no-JS content, blocked-GSAP readability and motion preference. Client artwork retains its own identity colours.

## Verification boundary
Test at widths 320, 375, 768, 1024, 1440 with real Chromium and inspect captures. Record actual results in `docs/design/qa.md`. Automated checks are not a full screen-reader or performance audit. No push, PR, merge or deployment without owner authorization.
