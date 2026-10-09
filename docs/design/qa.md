# Reachlyid local QA

## Verified result
Local static application on `reachlyid`, Windows 11, Node v26.7.0 and Python 3.14.7. CI is configured for Node 24/Python 3.12; the hosted workflow has not run because this work is not pushed.

Final real Chromium run: `npx --no-install playwright test --reporter=json > .artifacts/arena/final-browser.json`. Report start 2026-10-09T21:16:32.392Z. 87 expected passes, three intentional desktop mobile-menu skips, zero failures and zero flaky results.

| Width | Pass | Expected skip | Section/dialog captures |
|---|---:|---:|---:|
| 320 | 18 | 0 | 13 |
| 375 | 18 | 0 | 13 |
| 768 | 17 | 1 | 13 |
| 1024 | 17 | 1 | 13 |
| 1440 | 17 | 1 | 13 |

`npm test`: 33 passing tests, no skips/failures. `python tests/check_site.py`: 539 HTML elements, 67 unique IDs, both stylesheets and JS targets validated. All four production modules pass `node --check`. `npm audit`: zero known vulnerabilities. `git diff --check`: no whitespace errors. All 26 committed source-kit files were SHA-256 compared against Downloads originals; all match byte-for-byte. Runtime brand-copy hashes also pass.

## Browser coverage
- No application exceptions, bad responses or third-party runtime requests in the page-load smoke journey.
- Five service selections, arrows/Home/End, roving focus, panel semantics and planner goal propagation.
- Concept buttons/tabs, actual local images, hero concept cycling, before/after manual priority.
- Native required/email validation, local draft recovery, literal visitor-text safety, real clipboard and plain-text download, edit focus and privacy erasure. Test network interception blocks unexpected data submissions.
- Mobile menu inert state, Escape and focus restoration. Reduced motion, no-JavaScript readable primary content and blocked-GSAP fallbacks.
- Two real GSAP pause/resume cycles without duplicate settled triggers.
- Brand colours, logo proportions/widths, outline type, framed devices, caption separation, desktop hero geometry, section surfaces, offset portfolio, dialog sizing, inactive-service/process-number contrast and miniature-browser footer separation.
- Every page section checked for horizontal overflow at five widths; 65 captures generated.

## Screenshot inventory and review
Exact filenames follow `.artifacts/arena/chromium-{width}-{surface}.png`, where widths are 320, 375, 768, 1024, 1440 and surfaces are header, hero, manifesto, approach, services, portfolio, work, process, faq, contact, footer, planner, privacy.

All five width contact sheets were visually reviewed, with detailed desktop and 320px hero/service/process inspection. Palette and section rhythm read consistently; the retained device collage is clipped intentionally to its outer frame and captions stay outside. Small-preview copy is illustrative, not interactive form/UI content. The owner has not yet approved the visual design.

Visual review found and fixed two defects that the initial contract suite missed:
1. The old `.service-tab:not(.active)` specificity overrode the new ink rule. Unselected service labels were pale on cream. Explicit state styling now makes every service label readable; browser checks cover all four unselected states. Process numerals also now use paper/lime rather than old muted green.
2. At 320px/375px, the miniature café action overlapped its footer. Reduced narrow-preview headline size and spacing restore separation without growing the hero frame; geometric browser tests cover all five widths.

Chromium's tall element capture painted the offscreen skip link into some images although a live DOM probe confirmed it was not focused and had top -70px. The capture-only style hides an unfocused skip link; production CSS and focused keyboard affordance are unchanged. Final screenshot files are regenerated with that correction.

## Design self-audit
Decide/Learn surface. No tech gradient, generic indigo, feature-tile filler, accent rails, glass blur, invented metrics, icon toppers, all-centered stack, default Inter typography or wrong-surface composition. Slop diagnostic: 0/10 for those named tells; this is not a guarantee of design quality or owner approval.

Self-evaluation: accuracy 4 (local evidence strong; hosted CI not run), completeness 4 (tooling/extraction/brand/layout/behavior delivered; owner visual acceptance pending), clarity 4 (reproducible docs; historical design notes retain old context), actionability 4 (live local preview and commands; no remote publication), conciseness 4 (small production override, extensive tests/tooling lockfile). Average 4.0/5.

## Independent Ponytail review
Read-only review through `9e3a8e7` and the subsequent unused-selector cleanup found no must-fix or should-fix issues. It examined connected markup/CSS, application motion/dialog code, development-only lockfile, deployment output, asset hashes, CI and tests. Reviewer independently ran all 33 Node tests, Python validation, runtime syntax checks and npm audit. Browser suite was not duplicated by the reviewer; the parent executed and aggregated its final report.

Confirmed: no runtime JavaScript or Vercel configuration changes; `npm ls --omit=dev` is empty. The jsdom dependency requires Node 24.15+ on the Node 24 line (`^22.22.2 || ^24.15.0 || >=26.0.0`); README now states the supported minimum and CI's `24` selector installs the latest release on that line. Actual Ubuntu/Node24/Python3.12 CI execution remains unverified until the branch is pushed.

## Limits
No measured production Web Vitals, physical-device touch/performance testing, full axe/screen-reader audit, Firefox/Safari verification or hosted deployment validation. No prior approved visual baselines exist, so pixel-diff visual regression is INCONCLUSIVE; these captures are review evidence, not a claimed baseline pass. CI configuration is written/tested locally, not remotely exercised.

No push, PR, merge, DNS change or deployment was performed. Local preview: http://127.0.0.1:4174/.
