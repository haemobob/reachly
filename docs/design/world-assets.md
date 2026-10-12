# Continuous-world assets and provenance

All new visual material below is original Reachly conceptual brand artwork, not photography or screenshots of client work. The official identity assets remain byte-for-byte intact. Real client captures continue to use the provenance in `project-imagery.md`.

## Generated world plates

| Runtime asset | Source URL | Dimensions | Optimized bytes |
| --- | --- | --- | --- |
| `public/images/world/ribbon-atelier.webp` | https://v3b.fal.media/files/b/0aae15a7/ZefykWbKdopTlriI80JIq_ZnfbiKny.png | 1024×576 | 24,220 |
| `public/images/world/ribbon-passage.webp` | https://v3b.fal.media/files/b/0aae15e6/wYY4MknP6WNK5dUj5XwsS_TDefqUL3.png | 1024×576 | 49,620 |

Source PNG SHA-256:
- Atelier: `15a5f52c89e805a3f5e41f94ad819378b5a24b84295f0cdfca112ec0dbcdbfc1`
- Passage: `ee9ce4bf0a3a45338cf922475dc3293595fe3d9e5074010e77858c4cc31e1751`

Source images archived locally in `.artifacts/continuity/`, not served or committed. Runtime WebPs were encoded with Pillow, quality 88/method 6, decoded and inspected. No upscale was requested.

### Atelier prompt / material brief

One continuous broad flat satin-chartreuse ribbon in a warm ivory architectural infinity studio. Small point and long diagonal strip leading into an asymmetric loop on the right; deep-green narrow edges, subtle brushed material, soft directional shadows and ample upper-left negative space. Three-quarter architectural/editorial render; no text, logo, cards, dashboards, unrelated objects or glowing waves. Brand targets: lime #D4E751, cream #FAF7F0, ink #05100E, green #17463A. Original concept imagery only.

### Passage prompt / companion material brief

A cinematic closer interior view of a broad lime ribbon loop; large cropped ribbon wall through upper-left/top, a connected off-frame portion returning from lower-right, clear ivory centre. Same satin material, narrow deep-green bevel, directional shadows and tactile grain. No text, logos, UI, project screenshots or unrelated colors.

An image-edit attempt using the first source was rejected by the generation gateway for its edit model. The companion is a separately generated image using the same material brief, **not** a verified alternate camera render of an identical source mesh. Do not make that fidelity claim. The authored procedural world is the controllable continuous object; the plates provide atmospheric material, not chapter-by-chapter poster swaps.

## Authored graphic system

`World.astro` and `world-state.ts` provide a stable SVG topology across six poses, an extending point, paired ribbon boundaries, route contours and registration circles. `journey.css` supplies the consistent matte material/layer treatment. Capability diagrams, process route, exhibition window, sample flow and resolution gesture share the same line/point vocabulary. They are conceptual drawings, not claimed client interfaces or integrations.

The Three.js ribbon world uses original geometry and locally authored lighting; no external 3D model or reference texture is included. The primary scene's normal semantic links/imagery remain independent of the decorative renderer.

## Reference source boundaries

Actual Awwwards ZIP/source-member inspection is recorded in `.artifacts/continuity/reference-ledger.md`; 21st.dev source inspection in `.artifacts/continuity/21st-inspection.md`. Only general mechanisms inform the implementation. No reference code, stock demo image, extracted proprietary graphic, copied brand identity or component package is redistributed. Existing pinned runtime/font licenses continue to apply.
