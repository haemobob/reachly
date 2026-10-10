# Reachlyid — rebuilt landing QA

## Current pavilion iteration
Browser report: `.artifacts/world/final-browser.json`, start **2026-10-10T03:56:24.574Z**: **151 passed, 14 intentional skips, 0 failures, 0 flaky results**. Command: `node.exe node_modules/@playwright/test/cli.js test --config .artifacts/arena/local-review.config.mjs --reporter=json`.

Five viewport projects: 320/375/768/1024/1440px. Dedicated normal/reduced-motion loops cover 1024–3840px. Fourteen skips: eight duplicate wide loops, three historical mobile-only menu checks, three desktop-only pinned-gallery checks on smaller screens.

Node: **34 passed**. Python: **579 elements / 70 unique IDs**, now checks every linked stylesheet, including `world.css`. Module syntax and whitespace pass. Brand hash contracts and four exact project URLs remain unchanged.

New checks cover pavilion/fallback, device containment, horizontal scroll assistance and manual priority, pause removing pins/blinds, final-stage readability and contrasting focus on the lime invitation. Existing modal/planner/privacy/no-JS/blocked-GSAP/lifecycle tests remain intact. Obsolete poster/three-line/frame/surface assertions now describe the new composition; projected miniature bounding boxes were replaced with local-layout separation checks, not relaxed overlap limits.

Actual captures: `.artifacts/world/hero-*.png`, `page-*.png`, wide normal/reduced-motion captures, `motion-client-gallery.png` and `motion-process.png`. Pinned gallery inspected at 80% travel; process shows later stages. Desktop/mobile miniatures visually inspected. Initial failures exposed paused-process clipping, mobile preview overflow, focus not revealing an entire tilted card, same-color invitation focus and ultra-wide perspective clipping; these were corrected.

No physical-device, screen-reader, measured Web Vitals, Firefox/WebKit or hosted CI/deployment claim. Owner aesthetic acceptance remains separate from technical verification. `reachlyid` push is authorized; `main` is not changed.

## Previous poster result (historical)
This report covers the complete markup/stylesheet rebuild, not the earlier rejected CSS-led version. Local Windows 11, Node v26.7.0, Python 3.14.7. CI is configured for Node 24/Python 3.12 but has not run remotely.

Final Chromium command: `node node_modules/@playwright/test/cli.js test --config .artifacts/arena/local-review.config.mjs --reporter=json > .artifacts/rebuild/final-browser.json`.

Report start: 2026-10-09T22:14:46.979Z. **129 passed, 11 intentional skips, 0 failures, 0 flaky results.**

| Width | Passed | Intentional skip |
|---|---:|---:|
| 320 | 26 | 2 |
| 375 | 26 | 2 |
| 768 | 25 | 3 |
| 1024 | 25 | 3 |
| 1440 | 27 | 1 |

Eight skips avoid duplicating wide-layout loops on every project; those loops run at 1024/1440/1920/2560/3840 in normal and reduced motion. Three skips belong to the old mobile-only menu characterization; new all-screen menu tests run at every width, including desktop.

`npm test`: **34 passed**, no failures/skips. Python validator: **563 elements, 68 unique IDs**, CSS/fallback/JS target and deployment checks pass. All four runtime modules pass `node --check`; `git diff --check` passes. `npm audit`: zero known vulnerabilities. Brand tests preserve source-kit and runtime-copy hashes.

The final browser run used the ignored existing-server config at **4173**, avoiding an earlier managed-server timeout. Port 4174 is the owner preview; origin-guard tests remain restricted to 4173 and were not weakened.

## Verified behavior
- All-screen menu: background inerting, first-link focus, Tab/Shift+Tab containment strictly within the declared modal, Escape/restoration, link close, native-planner handoff, and on-screen close control after opening further down the page.
- Native project rail: internal overflow, button browsing, keyboard focus revealing the fourth card, no document overflow. Four approved client URLs and safe link attributes preserved.
- Five services, roving focus/arrows/Home/End, model-driven content and planner goal propagation; three concepts and image-spot activation.
- Native form validation, literal visitor text, local draft recovery, clipboard, plain-text download, editing and erasure. No planner data submission; network guards remain intact.
- Reduced motion, saved pause, normal GSAP setup/cleanup cycles, no-JavaScript readable primary content and blocked-GSAP fallback.
- Exact brand palette/logo ratios; poster hierarchy, native rail geometry, readable inactive states, 44px image-spot targets and bright dark-surface focus.
- All three miniature hero concepts retain action/footer separation. Wide checks measure phone ratio, transformed right/bottom edges, three visual title lines and frame containment.

## Visual evidence
`.artifacts/rebuild/geometry.json` records 320/375/768/1024/1440/2560/3840: zero document overflow and no page exceptions in every capture. Phone ratio remains approximately 0.45. Parent clipping is not treated as proof that transformed devices fit.

Seven full-page captures plus section captures were generated. Actual screenshots inspected include desktop/mobile/ultra-wide heroes, client rail, 320px manifesto/comparison, 768px services, 1024px process, desktop concept/menu/invitation. Browser suite also captures every section and both native dialogs at five widths.

Original pre-rebuild commit `8e759f8db016f0cff7c979d6618ea832a0222338` static output was archived locally and served only on loopback 4175. Matching before/after viewport and hero captures at **320, 1440 and 2560px** show the original versus rebuilt layouts. 1440px client-work captures show offset gallery versus native horizontal rail. `.artifacts/rebuild/rebuild-comparison.png` is the owner-facing comparison. Reference scroll 000/017/033 was revisited; extraction screenshots have cookie-overlay limitations.

## Acceptance and review
The original CSS-led iteration was rejected by the owner. Prior passing tests/review did not establish visual acceptance and do not certify this rebuild. The current page replaces markup and the legacy stylesheet, reorders the journey and adds new rail/menu interaction models. Original/reference/revised screenshots substantiate those changes, not an exact clone or automatic aesthetic approval.

A read-only dependency audit identified required runtime selectors and obsolete visual contracts. Only old equal-top hero/offset-gallery/surface/bounded-frame assumptions were adapted. Behavior, privacy and safety tests were retained; new menu/rail and three-concept separation checks expand coverage.

Independent read-only Ponytail review found two concrete issues, both fixed after focused RED reproduction:
1. Close control outside the declared modal: moved inside the menu, inerted the entire external header and confined both forward/reverse keyboard focus to the dialog. Native-planner handoff and opener restoration pass at all five widths.
2. Horizontal process still used vertical stage selection/scaleY: removed obsolete per-stage active selection and hidden dial, and changed the horizontal rail to scaleX section-reading progress. New normal-motion checks verify no stage triggers/false active stage, increasing horizontal fill and unchanged vertical thickness at desktop widths. Smaller layouts keep all five steps visible.

The Node lifecycle assertion now checks each retained effect's actual trigger rather than demanding the old count inflated by five obsolete stage triggers. Cleanup/manual-input guarantees remain intact. The parent verified fixes in the full suite; the independent reviewer did not rerun the amended diff. A separate five-width menu rerun also passed after adding reverse-Tab assertions.

## Limits and delivery boundary
No owner-approved pixel-diff baseline exists: automated visual regression is **INCONCLUSIVE**. Physical-device touch/performance, full axe/screen-reader review, Firefox/WebKit, measured production Web Vitals and hosted CI/deployment are not verified. Final aesthetic acceptance remains with the owner.

No push, PR, merge, DNS change or deployment. Local rebuilt preview: http://127.0.0.1:4174/.
