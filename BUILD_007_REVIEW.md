# Moto Cardz V2.1.6 / Build 007

Review branch: `build/007-pilot-artwork`. Not deployed. Live GitHub Pages stays on Build 006.

## Changes

Quick Match now compares two cards side by side on mobile as well as desktop. Duel uses the same compact comparison treatment, with a separate swipeable hand. Compact game branding leaves more room for the cards. Card names, illustration panels, metadata and five stat rows align across each comparison.

A new deck selector defaults to the ten-bike illustrated pilot. The full 178-bike deck remains available, with illustrations on the matching ten models and a labelled artwork panel for the rest. The preview gallery shows every pilot bike without playing a match.

Artwork uses one model-inspired AI illustration per bike: a graphite studio, white key light, purple and blue rim lighting, a consistent front three-quarter angle, and a complete bike in the frame. Original 3:2 images are optimised to 600 × 400 WebP. The mobile card panel is approximately 2:1 and 70–90px high; `object-fit: contain` preserves the whole illustration without stretching or clipping. The surrounding panel uses the same graphite background. Gallery images also fit inside 2:1 panels.

The approved Build 006 hero asset and every bike's existing scores, specifications and category colours are retained. Manufacturer branding remains within the illustrations where generated; these are model-inspired artwork, not verified reference photographs or separately licensed production logo files.

Duel replenishes its reserve when needed for repeated sudden-death ties, including the ten-card pilot that has no opening reserve. Offline shell paths now match the existing root-level icons. Pilot images are precached. Cache cleanup is limited to Moto Cardz caches.

## Pilot bikes

| ID | Motorcycle |
| --- | --- |
| BK-014 | BMW R1300GS TE |
| BK-038 | Ducati Panigale V4 S |
| BK-054 | Honda GL1800 Gold Wing Tour |
| BK-092 | Kawasaki Ninja 650 |
| BK-122 | MV Agusta Dragster 800 RR SCS |
| BK-132 | Royal Enfield Classic 350 |
| BK-136 | Suzuki Hayabusa |
| BK-165 | Triumph Speed 400 |
| BK-181 | Yamaha MT-07 |
| BK-051 | Harley-Davidson Sportster S |

## Automated verification

Result: **19 tests passed**, including 360 complete matches. All ten production images total 359,388 bytes (about 351 KiB).

Run `node --test tests/build007.test.cjs` from this directory. The tests execute the shipped JavaScript using a minimal DOM harness; they do not substitute for a browser rendering test.

- 360 complete matches: both decks, both modes, all three AI levels, 30 matches per combination.
- Deal uniqueness, pilot-only draws, hidden opponent artwork until reveal, score locking, settings migration and gallery contents.
- Repeated sudden-death ties, menu exit with pending AI callbacks, original dataset checksum.
- Local existence of every precached resource and manifest icon; ten valid compact WebP assets.

## Before deployment

Browser rendering and device PWA checks remain pending. This environment does not expose the supported browser QA capability. Do not treat CSS inspection or DOM-harness tests as visual sign-off.

1. Review at 320, 375, 390, 430, 768 and 1280 CSS pixels: both comparison cards fit, long model names stay within their headers, and stat rows line up.
2. Play Quick Match with first-to 3, 5 and 7. Play Duel attacking and defending at every AI level, including keyboard selection and confirmation.
3. Browse the hand by touch; check that only the hand scrolls horizontally and the page remains within the viewport.
4. Confirm the gallery, full-deck placeholders, return to menu and rematches.
5. Verify an installed PWA gets the new build and all ten illustrations remain available offline.

To review locally, serve the directory with a static HTTP server and open `index.html`. Direct-file opening also supports gameplay and illustrations, but service workers require HTTP localhost or HTTPS.
