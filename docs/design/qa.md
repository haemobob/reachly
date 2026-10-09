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

## Scaling repair verification
After owner feedback, the full suite passed 89 checks (the original 87 plus two wide-layout tests), zero failures/flaky results. Eleven intentional skips comprise the prior three desktop mobile-menu skips and eight duplicate wide-test skips: the wide tests run once on the desktop project, then explicitly resize through five desktop widths. Report: `.artifacts/arena/owner-feedback-browser.json`. Node: 33 passed; Python site validation and whitespace check passed. An initial rerun against preview port 4174 failed origin-guard tests because those tests allow only 4173; rerunning against the verified current 4173 server passed without weakening the guard. An earlier managed-server command timed out; the final run used an ignored local config with the existing verified server, not a claimed successful CI run.

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

All five width contact sheets were visually reviewed, with detailed desktop and 320px hero/service/process inspection. That review did not catch the device-ratio and right-edge clipping defects exposed by the owner's wider screenshot; enclosing-frame clipping was wrongly accepted as sufficient containment. Small-preview copy is illustrative, not interactive form/UI content. The owner rejected the visual design.

Visual review found and fixed two defects that the initial contract suite missed:
1. The old `.service-tab:not(.active)` specificity overrode the new ink rule. Unselected service labels were pale on cream. Explicit state styling now makes every service label readable; browser checks cover all four unselected states. Process numerals also now use paper/lime rather than old muted green.
2. At 320px/375px, the miniature café action overlapped its footer. Reduced narrow-preview headline size and spacing restore separation without growing the hero frame; geometric browser tests cover all five widths.

Chromium's tall element capture painted the offscreen skip link into some images although a live DOM probe confirmed it was not focused and had top -70px. The capture-only style hides an unfocused skip link; production CSS and focused keyboard affordance are unchanged. Final screenshot files are regenerated with that correction.

## Owner feedback — visual acceptance failed
The owner rejected the claimed redesign: the existing structure/artwork remained too similar, and a 2560px screenshot exposed distorted/clipped hero devices. The prior automated passes and code-review verdict did not establish successful visual transformation. The earlier “0/10 slop” diagnostic and 4.0/5 self-rating were not adequate measures of the requested outcome and are withdrawn.

Reproduced: independent percentage width/height changed the phone's untransformed width/height ratio from approximately 0.44 at 1440px to 0.85 at 2560px and 1.31 at 3840px. The fixed-height, unbounded-width hero also clipped its right edge. Headline wrapping was missed at 1024/1440px. Added real-browser RED tests before fixing: bound desktop hero content to 1600px, size type from the content container, preserve the phone's 9:20 aspect and inset its rotated edges. Dedicated checks exercise 1024/1440/1920/2560/3840 with both reduced and normal motion. This is a scaling repair, not a completed design rethink.

Broader composition/visual transformation remains unresolved. Future design acceptance needs original/reference/revised screenshots at matching widths and owner approval; passing CSS-value assertions or a code review is not a substitute.

## Independent Ponytail review
Read-only review through `9e3a8e7` and the subsequent unused-selector cleanup found no must-fix or should-fix issues. It examined connected markup/CSS, application motion/dialog code, development-only lockfile, deployment output, asset hashes, CI and tests. Reviewer independently ran all 33 Node tests, Python validation, runtime syntax checks and npm audit. Browser suite was not duplicated by the reviewer; the parent executed and aggregated its final report.

Confirmed: no runtime JavaScript or Vercel configuration changes; `npm ls --omit=dev` is empty. The jsdom dependency requires Node 24.15+ on the Node 24 line (`^22.22.2 || ^24.15.0 || >=26.0.0`); README now states the supported minimum and CI's `24` selector installs the latest release on that line. Actual Ubuntu/Node24/Python3.12 CI execution remains unverified until the branch is pushed.

## Limits
No measured production Web Vitals, physical-device touch/performance testing, full axe/screen-reader audit, Firefox/Safari verification or hosted deployment validation. No prior approved visual baselines exist, so pixel-diff visual regression is INCONCLUSIVE; these captures are review evidence, not a claimed baseline pass. CI configuration is written/tested locally, not remotely exercised.

No push, PR, merge, DNS change or deployment was performed. Local preview: http://127.0.0.1:4174/.
