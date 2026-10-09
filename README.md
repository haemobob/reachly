# Reachly

An English-language digital studio website for small and medium businesses. The design combines ivory, orange, and ink with condensed typography, editorial layouts, and original illustrative business concepts.

## Development

The production website lives in `dist/`. It uses browser-native ES modules, HTML, and CSS; no build step or runtime dependencies are needed. Serve `dist/` with any static web host that supports ES modules. Vercel can deploy this repository with Framework Preset **Other**, no build command, and Output Directory **dist**. Attach `reachly.id` in the host's domain settings and configure the records it provides at the domain registrar.

## Interactions

- Hero: drag the website collage, use arrow keys to rotate, or click / press Enter to switch its design concept.
- Transformation: scroll-assisted before/after reveal; touching the range control gives the visitor permanent manual control for that page visit.
- Services and concepts: real tab panels with roving focus, arrow keys, Home, and End. All visual concepts are identified as illustrative, not customer work.
- Process: a sticky desktop timeline tracks scroll progress. Mobile and reduced-motion visitors receive the entire process in ordinary document flow.
- Project planner: native modal, validated fields, local draft recovery, text download, clipboard action, and clear-draft privacy control. It does not send inquiries.
- Motion: reduced-motion support, passive scroll listener, animation frame batching, and an orb that pauses outside the viewport or when the tab is hidden.

## Contact and publication

No contact address, WhatsApp number, form endpoint, or business address was provided. The project planner exports an honest brief and explicitly says it is not submitted. Connect an approved contact channel before using the site to collect live inquiries. No analytics or advertising trackers are included. Meta advertising is described as a planned optional offering.

The Site preview is owner-private by default. A public launch and domain connection require the appropriate hosting audience and domain verification. The display name `reachly.id` does not mean DNS has been connected.

## Validation

Run `npm test` for asset integrity, navigation and accessibility relationships, client data handling, and animated orb geometry. Run `python tests/check_site.py` for parsed HTML/CSS checks, JavaScript selector integrity, and responsive guardrails. All JavaScript modules are syntax-checked before deployment. The managed browser QA capability was unavailable in this session, so visual browser rendering has not been verified.

## References and assets

- Adidas Arena informed the editorial scale, tactile interaction, and variation between sections. No Adidas assets or branding are used.
- The supplied Drive library's Scroll Animation / 1 RGB split reference informed the transient ink separation in the concept showcase. It is independently implemented without the reference's scroll hijacking, WebGL dependencies, bundled fonts, or imagery.
- `thinking-orbs` by Jakub Antalik supplied the working-orbit geometry, adapted to dependency-free JavaScript. Its MIT notice is retained in `dist/THIRD_PARTY_LICENSES.txt`.
- Photography: Unsplash photo IDs `photo-1442512595331-e89e73853f31`, `photo-1494438639946-1ebd1d20bf85`, and `photo-1490750967868-88aa4486c946`. Used as concept imagery, without implying endorsement.
- Barlow Condensed and Manrope are locally hosted Google Fonts. Their license notices are included with the font assets.

This repository is the portable source for GitHub and Vercel. The private preview is https://reachly-studio.craftymaple16.chatgpt.site. Site hosting identifiers and credentials are excluded from this export.
