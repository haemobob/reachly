# Reachly — current UI and motion decisions

## Full reference-led rebuild
The current `reachlyid` implementation replaces the legacy stylesheet and page compositions. `dist/arena.css` supplies tokens, not an override stack. A framed poster hero, native project rail, image-led manifesto, editorial service list, lime concept surface, responsive process timeline and ink invitation give distinct content distinct treatments.

Section order: hero, projects, manifesto, services, work, approach, process, FAQ, contact. The full-screen menu is available at every width and isolates background interaction, traps/restores focus, locks scrolling and hands off to the native planner. The native project rail has previous/next buttons and keyboard-accessible links; no wheel or vertical-scroll hijacking is added.

## Identity and content
The approved Reachly kit remains byte-preserved in `brand/Reachly-Brand-Kit/`, with eight intact runtime assets. Cream, lime, ink and deep green are authoritative; local Barlow Condensed approximates the reference's condensed display character without copying its proprietary font.

`COMPANY_PROFILE.md` remains authoritative: five initial services for Indonesian SMEs; AI tools, productized software, Meta Ads and deeper analytics remain future directions. Unknown contacts, prices, dates and results are not invented. Four owner-confirmed client links remain exact and safely open new tabs. Other work is explicitly illustrative. The planner creates a local brief; it sends no inquiry.

## Actual references and licenses
- SkillUI 1.3.4 was run in explicit Ultra mode against https://www.adidasarena.com/. Seven scroll frames were verified and inspected. A fresh extraction was also read during the teardown; that second command did not explicitly request Ultra. Exact commands and observation/adaptation mapping: `docs/design/arena-adaptation.md`.
- Adidas Arena's condensed outline/solid hierarchy, outer rules, photographic scraps, horizontally browsed programming, tilted photograph and large menu informed original Reachly compositions. No reference logos, event photographs, fonts, cookie UI, debug GUI or scripts are served.
- UI/UX Pro Max informed prior storytelling, responsive, motion and accessibility decisions; it is not a runtime dependency.
- [Drive Text Animations / 18 / gooey-text-reveal](https://drive.google.com/file/d/12edXZagRQeAoE0abGegdA7IrGJx-qXhC/view): alpha-matrix and blur reveal adapted to static lines.
- [Drive Hover Effects / 21 / zentry-hover-animation](https://drive.google.com/file/d/10gXsDOCgyxqPAVaVH2Vnt4MiFmD5n3oZ/view): bounded image-spot motion; real buttons retain tap/keyboard actions and at least 44px targets.
- [GSAP](https://github.com/greensock/GSAP) and ScrollTrigger 3.15.0 remain local, unmodified and retain their copyright/[standard license](https://gsap.com/standard-license/) banners.
- [thinking-orbs](https://github.com/Jakubantalik/thinking-orbs) retains MIT attribution in `dist/THIRD_PARTY_LICENSES.txt`.
- Local concept photography and font notices are listed in README and served locally. The supplied Drive packs had no separate license notice; no license is invented and full packs are not redistributed.

## Motion and interaction
| Surface | Current behavior |
|---|---|
| Poster hero | Short type entrance; manual bounded 3D rotation; concept cycling |
| Statement | One-time gooey reveal; image spots open the matching concept |
| Client work | Native horizontal rail; existing scroll reveals revert on pause |
| Services | Keyboard tabs change narrative, illustration, tags and planner goal |
| Concepts | Photograph reveal and three selectable directions |
| Comparison | Native range; manual input takes permanent precedence over assistance |
| Process | Five visible steps with a scroll-progress rail |
| Invitation | Small arrow turn; local-brief action |

System reduced motion wins over saved pause preference. GSAP cleanup removes settled triggers and restores readable content. No-JavaScript and blocked-GSAP fallbacks remain tested. Both hero caption and instructions are outside its painting boundary.

## Geometry and verification
The poster is bounded to 1760px and scales typography from its content container. Phone width follows its 9:20 aspect rather than an independent percentage. Real browser tests measure transformed right/bottom containment, three visual headline lines, native rail overflow versus document overflow, and miniature action/footer separation in all three concepts.

Current tests and matched original/rebuilt screenshots are documented in `docs/design/qa.md`. Earlier CSS-led work was rejected by the owner; its passing tests and code review were not aesthetic acceptance. Pixel-diff regression has no owner-approved baseline, and physical-device/screen-reader/performance checks remain outstanding.

## Static delivery boundary
`vercel.json` continues to serve `dist/` from the repository root with no install/build step. There are no production npm dependencies. Internal company docs and raw extraction assets are not deployed. No push, PR, merge or deployment was performed for this rebuild.
