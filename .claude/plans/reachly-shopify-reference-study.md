# Reachly — Shopify reference study

**Purpose:** Evidence and interpretation for the dual-experience plan. Research only; not a clone specification or a complete audit of Shopify.

## Sources and method

- Main experience: https://www.shopify.com/id
- Showcase: https://www.shopify.com/editions/winter2026
- Inspected actual rendered pages at desktop **1440 × 900** and mobile/touch emulation **390 × 844**. Mobile observations are browser emulation, not physical-device measurements.
- Inspected hero, intermediate content, navigation, product demonstrations, and chapter structure. Used screenshots alongside computed typography, DOM headings/positions, links, and accessibility snapshots.
- Exercised desktop navigation hover, Editions chapter navigation, Editions search with `automation`, both mobile menus, and mobile chapter navigation to Sidekick. Did not submit signup forms or perform account actions.
- Current main-site content is not frozen to Winter '26. Its navigation now contains Spring '26 references; search on the Winter '26 page also returns material from other editions. Do not assume both URLs represent one synchronized release.
- Saved 13 selected captures in `.artifacts/strategy-shopify/`, plus desktop accessibility snapshots. Earlier research additionally inspected the company profile, complete brand identity preview, the 300-pack Awwwards inventory/category survey, selected source archives and temporal previews, and supplied Adidas Arena SkillUI captures. This revision revisited the identity and physics/WebGL mechanisms specifically for the independent showcase.

## Main website: what is actually visible

### Opening

The desktop opening is a full-bleed moving human scene with white, left-aligned copy. A large two-line aspirational headline occupies the lower-left area, with a short business explanation and a white action below. The next dark chapter overlaps the bottom through a rounded upper edge. The navigation stays compact and conventional; its primary action is visible immediately.

Computed headline type was Shopify-Inter at 96px in the inspected desktop state. Several large section headings were 56px. The important observation is the relationship between headline, supporting text, and action—not the particular font or exact sizes.

On mobile, the opening is recomposed rather than uniformly scaled: larger proportional headline near the upper-middle, explanation below, and full-width stacked actions. Logo, start action, and menu remain at the top.

### Content rhythm

A desktop feature composition shows three visual demonstrations with unequal widths: a narrow storefront preview, a much wider central operational illustration, and a narrow channel illustration. Captions underneath pair a concrete benefit with short explanatory links. Product imagery occupies substantially more area than copy. The next large section title follows with generous separation.

This is not just a plain conversion page. Motion, imagery, scale, dark surfaces, and changing compositions do commercial work. The information remains concrete enough to understand without enjoying the visuals.

On mobile, the inspected agentic feature becomes a tall single composition with heading, short explanation, and a visual demonstration underneath. The navigation remains compact above it.

### Navigation and connection to Editions

The main navigation uses standard business categories; desktop hover was exercised, and the mobile menu exposes a short list of top-level categories with a persistent conversion action. Editions is discoverable within the product/navigation ecosystem and in the footer. It is not an obligatory split-screen destination choice before the user reaches the business.

**Interpretation for Reachly:** make the main site commercially legible and artistically strong. Real work should be evidence; service visuals should explain. Do not turn the main page into a dull compromise just because a showcase exists.

## Winter '26 Editions: what is actually visible

### Opening world

The opening is a full-viewport painterly scene: two figures reaching across the composition, contemporary bright-pink objects, and a translucent framed contents block. The block contains a compact title, a short release statement, and a chapter list. A small utility header retains identity, archive/search navigation, the main-site link, and a start action.

The opening's impact comes primarily from a coherent art-directed image world and its scale. It is not proof that the site requires a freely navigable 3D environment.

### Hierarchy and transitions

The Sidekick chapter uses an expansive painted portrait with a modern mask and laptop, a large typographic chapter identity, a serif explanatory sentence with a decorative initial, and a smaller playable video inset. A ragged painted edge connects this world to the lighter information below.

Another inspected feature places its concrete heading and short explanation above a large staged visual on a pale canvas. A substantial storefront image, secondary image, and analytics overlay occupy the lower composition. A thin-line field supplies atmosphere around the demonstrative imagery. The useful product explanation is still present; the page is not merely a sequence of visual effects.

Computed chapter display type in the inspected desktop state was NeueMontreal at approximately 194px; the small utility identity and introductory title had very different scales. The useful principle is an extreme hierarchy between utility navigation, chapter identity, and feature copy.

### Wayfinding and utility

Desktop chapter navigation was exercised to Online; mobile chapter navigation to Sidekick updated the fragment URL and moved to the relevant chapter. The left-side desktop index and the mobile menu offer direct access to content rather than requiring a full cinematic traversal.

Search is a substantial overlay. Entering `automation` and submitting returned an actual results state with a count and grouped edition results; its URL retained the query. This is functional navigation embedded in an expressive presentation. Reachly has too little content to justify copying this search/archive machinery at launch.

### Mobile composition

The opening crops the painted world around the reaching gesture and expands the framed contents block across most of the viewport. The mobile menu is a full-height chapter list with strong labels and fine structural rules. Sidekick becomes a vertical scene: cropped portrait, large chapter label, readable serif explanation, then video. The following feature becomes a linear heading → description → action → product-image sequence.

**Interpretation for Reachly:** give the showcase its own authored world, large changes of scale, and a distinct rhythm, but keep chapter access, useful explanations, and a route back to the business. Author touch behavior separately from pointer behavior.

## The strategy worth transferring

| Observed principle | Reachly adaptation |
|---|---|
| The business site is expressive but easy to act on | A designed agency front door with clear services, real projects, and inquiry access |
| The showcase has a stronger thematic world | An original Reachly interactive exhibition rather than a duplicate service homepage |
| Functional navigation survives the spectacle | Chapters, direct links, motion control, and visible return/contact actions |
| Both experiences reconnect to the same commercial destination | One project-conversation route, with only non-personal context carried from an exhibit |
| The showcase contains real subject matter | Real project material plus explicitly labeled in-house interaction studies |
| Mobile changes composition | Deliberate vertical scenes and touch controls, not desktop cursor effects shrunk down |

## What not to transfer

No Shopify assets, paintings, characters, typography system, pink props, product UI, merchandising scale, copy, or software-platform claims. No artificial release cadence or update count. No imitation Renaissance theme. No massive search/archive for a small launch collection. No assumption that Reachly's SME audience wants a software-product trial funnel.

## Additional mechanism findings

Actual archive members were read for this revision:

- `Physics Effects/2/code.zip` → `svg-bezier-curve-master/typescript-tailwind-version/components/line.tsx`: a pointer-deformed quadratic Bézier line with damped return. Useful as a tactile connection principle, not as a mandatory pointer-only control; the reference needs lifecycle/touch adaptation before reuse.
- `Grid Animations/7/code.zip` → `OnScrollLayoutFormations-main/js/index.js`: scroll-driven grid formations, perspective, staggered convergence, long pinned passages, and global image preloading. Useful for a work-field composition; do not transfer the lengthy pinning or whole-site preload behavior mechanically.
- `Webgl & ThreeJS Effects/10/code.zip` → `sdf-lensblur-master/shaders/fragment.glsl`: signed-distance shapes and pointer-local edge softness. Useful evidence that a single visual field can respond coherently; not a finished image-aperture implementation and not a reason to blur every section.

These supplement the original ledger for masks, reversible navigation, text reveals, and image hierarchy. They are mechanism research, not an authorization to import included artwork or copy reference compositions.

## Verification limits

This is design research, not a Shopify accessibility/performance certification. Not every product link, chapter, video, search result, or responsive breakpoint was tested. The proposed Reachly visuals, transitions, performance, and inquiry integration remain unimplemented and unverified. The revised plan distinguishes those proposals from observed reference behavior.
