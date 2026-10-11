# Client project imagery

Captured from the four owner-confirmed project URLs in `COMPANY_PROFILE.md`, Section 4a, on **11 October 2026 (UTC)**. These new main assets are **actual browser screenshots**, not reconstructed mockups or the older source-image previews described in that profile. No site code or company-profile content was changed.

## Actual browser captures

All four URLs returned HTTP 200 and remained on their supplied URLs. Each was opened in an isolated, unauthenticated Playwright Chromium browser context at **1440 × 960 CSS pixels**, device pixel ratio 1. Images were allowed to load before capture; the final WebP output was decoded and visually inspected. No source content, branding, text, or UI was replaced or fabricated. No login, purchase, form submission, or other production write was performed.

| Project | Asset path | Output dimensions | Bytes | Capture time (UTC) | Composition |
| --- | --- | --- | ---: | --- | --- |
| Sellaku | `public/images/sellaku.webp` | 1440 × 845 | 79,682 | 2026-10-11 14:12:02 | Actual dining collection section, reached with a mouse-wheel scroll to y=960. Browser screenshot cropped to x=0, y=0, width=1440, height=845 to exclude the following section. White sticky navigation retained.[1] |
| Mac One Indonesia | `public/images/mac-one-indonesia.webp` | 1440 × 960 | 60,614 | 2026-10-11 14:11:05 | Homepage hero at y=0, loaded welding photograph with navigation, headline, calls to action, and lower information strip.[2] |
| Crypto Radius | `public/images/crypto-radius.webp` | 1440 × 960 | 84,324 | 2026-10-11 14:10:10 | Homepage hero at y=0, split editorial typography and loaded Bitcoin photograph.[3] |
| Crypto Galaxy | `public/images/crypto-galaxy.webp` | 1440 × 960 | 39,320 | 2026-10-11 14:10:14 | Homepage hero at y=0, actual rendered dark chart/particle background, headline, navigation and calls to action.[4] |

Main screenshots use Pillow WebP encoding, quality 86, method 6, without resizing or upscaling. Mac One's final capture used Playwright's `animations: 'disabled'` screenshot setting after the first hero image loaded, avoiding an earlier capture taken during the carousel crossfade. This freezes CSS animations for the screenshot; it does not inject alternative imagery or alter the page's content.

## Optional editorial source previews — not screenshots

The `-detail.webp` assets are downloaded images actually referenced by the corresponding live pages, with only documented cropping/downsampling and WebP encoding. They are **source-image previews**, not browser captures, client-result evidence, or proof that a photograph depicts that client's own products/team. Do not present them as literal website screenshots.

| Project | Asset path | Output dimensions | Bytes | Exact source | Processing |
| --- | --- | --- | ---: | --- | --- |
| Sellaku | `public/images/sellaku-detail.webp` | 1200 × 800 | 158,088 | Loaded dining-section Unsplash photograph.[1][5] | Original 1200 × 1383; center-fit 3:2 crop. |
| Mac One Indonesia | `public/images/mac-one-indonesia-detail.webp` | 1440 × 960 | 113,094 | Loaded homepage `assets/img/hero.jpg` welding photograph.[2][6] | Original 2048 × 1365; center-fit 3:2 crop and downsample. |
| Crypto Radius | `public/images/crypto-radius-detail.webp` | 1440 × 960 | 160,148 | Loaded homepage Unsplash Bitcoin photograph, before the website's grayscale styling.[3][7] | Original 1800 × 1202; center-fit 3:2 crop and downsample. |
| Crypto Galaxy | `public/images/crypto-galaxy-detail.webp` | 1000 × 1000 | 76,682 | Page-referenced Bitcoin artwork `uploads/1bitcoin/1.png`.[4][8] | Original 1563 × 1563; full square artwork downsampled without cropping; source transparency retained. |

All four image-source downloads returned HTTP 200 between 14:12:54 and 14:12:58 UTC. Detail assets use WebP quality 88, method 6. No AI imagery, synthetic screenshot, browser frame, or added branding was used.

## Source limitations and publishing boundaries

- **Sellaku currently displays “TEKAD JAYA” / “Tekad Jaya Mebel” branding at the supplied Sellaku URL.** This was preserved, not relabelled. During retrieval, the page's `tahifhdkcbqtxfkgybwg.supabase.co` requests for `site_content` and `products` failed with `net::ERR_NAME_NOT_RESOLVED`. The homepage therefore displayed the fallback “PRODUCT NAME” headline. The capture deliberately uses the intact, loaded dining-collection section instead; it is not a repaired homepage or evidence that the product backend works.[1]
- **Mac One:** selected hero photographs loaded. Some far-below-fold lazy images had not yet loaded when the initial page inspection occurred; those are outside the delivered screenshot. The final screenshot is not a claim that every offscreen gallery item or site function was verified.[2]
- **Crypto Radius:** the captured hero photograph and logo loaded; no failed requests were observed during this capture. This is visual evidence of the website, not verification of its trading signals, claims, or outcomes.[3]
- **Crypto Galaxy:** an optional MP4 video request and a `/_next/712.css` request were aborted during initial loading. The delivered screenshot shows the actual rendered chart/particle hero, not a fabricated video frame. Video playback was not verified; the source coin artwork downloaded successfully and appears separately as a source-image preview.[4][8]
- No consent dialogs or modal obstructions needed dismissal. Native small Telegram/Discord utility buttons remain where present; Sellaku's below-section utility button falls outside the documented crop.
- Client attribution and portfolio permission come from the owner-confirmed company profile. Screenshots do not establish project dates, precise Reachly deliverables, payment history, testimonials, conversions, revenue, or trading outcomes. Text/numbers visible inside a client screenshot remain that client's page content, not independently verified Reachly case-study claims.
- Source availability does not independently establish copyright or reuse rights. Furniture and Bitcoin photographs are delivered from Unsplash URLs used by the client sites. Confirm applicable source licensing/attribution and any third-party rights before repurposing standalone detail images. Their inclusion is not a claim that the client owns the photograph.
- Suggested public labels: **“Website screenshot”** for main assets; **“Project imagery — sourced from the client website”** for detail assets. Avoid calling the source-detail previews screenshots.

## Integrity and verification

Verified **4 real website captures + 4 real-source detail previews**, each readable as WebP, with the dimensions and byte counts above. All eight assets together are **771,952 bytes**. Both final screenshot and detail contact sheets were visually inspected: furniture, welding, Bitcoin photograph, and coin artwork are loaded; no skeleton screen or synthetic replacement is present.

| Asset | SHA-256 |
| --- | --- |
| `sellaku.webp` | `32e14f5f1e710dce871c6fe02385f709bdfcc76f13bc167319132c724266535c` |
| `mac-one-indonesia.webp` | `977d0b54eb428c5b9c6a2e64c15716884654b1583e876bd669e5c403ce3d96a2` |
| `crypto-radius.webp` | `3783d899260066c89125d6fd59576bdaed87bc8cc46207a87d4463cb1f3e8261` |
| `crypto-galaxy.webp` | `3e67724fbf0f3d30915656e29afcf1205e6a6907c9316b03ff08f3d632e60bf6` |
| `sellaku-detail.webp` | `aa87aeccc52b5607db392967a5cdd36c1eda163f242870cdf4727838602bdc46` |
| `mac-one-indonesia-detail.webp` | `ccf7cb85ca64f39e4bd7d6c5bb130412c41b7c73b37ea5c5a10c6418bbb3569a` |
| `crypto-radius-detail.webp` | `9bad6232134c16195389520ff124d6f084e792f49c017a604cf06e2b2acab11f` |
| `crypto-galaxy-detail.webp` | `794f9f9039856bf408b6d6113ba8e5df405d27c5bb27404306f0e0744b8964b9` |

Capture scripts, raw PNGs, source-image downloads, request observations, and the manifest are temporary scratch artifacts under `C:/Users/USER/AppData/Local/hermes/profiles/reachlyid/cache/scratch/client-imagery` and may be pruned. This document and the eight optimized images are the durable repository deliverables.

## Sources

[1] https://sellaku.vercel.app/toko
[2] https://www.mac1ndonesia.com
[3] https://www.cryptoradius.id
[4] https://www.cgcryptogalaxy.id
[5] https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=1200
[6] https://www.mac1ndonesia.com/assets/img/hero.jpg
[7] https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=1800&q=85
[8] https://www.cgcryptogalaxy.id/uploads/1bitcoin/1.png
