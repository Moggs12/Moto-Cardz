# Moto Cardz — Master Project Checklist
Updated: 2026-10-16
Legend: [x] complete, [~] in progress, [ ] planned, [!] blocked

## 1. Foundations
- [x] Moto Cardz concept and motorcycle card-game direction agreed
- [x] GitHub repository and GitHub Pages playable prototype
- [x] Remove four electric bikes from original 182-bike list; 178-bike target deck
- [x] Normalised stat/scoring approach chosen
- [x] Quick match and duel gameplay implemented in published V2
- [x] Easy / Medium / Hard AI controls implemented
- [x] Added visible V2.1.0 / Build 001 identifier to main game
- [x] Verify 178 unique bike IDs are present in main game code (live Pages cache still to check)

## 2. Brand and visual design
- [x] Retro trading-card direction with modern neon/category colours agreed
- [x] Modern Apple-inspired premium UI direction agreed
- [x] Graphite, Almond White, Electric Indigo and supporting palette selected
- [x] MotoCardz logo concept sheet generated and preferred direction chosen
- [~] Option 1 motorcycle logo and Option 4 app icon approved; header, homepage and gameplay visual mockups approved; individual production assets still pending
- [~] V2.1.3 / Build 004: more detailed scalable sportbike logo asset added and referenced by the centred header; committed to main, awaiting live visual approval; app icon remains pending
- [x] Dark Premium Option A palette deployed and visually approved by user (2026-10-14); typography/panels still to review
- [x] Build 006 Hero 1 homepage visual direction approved by user (2026-10-15); desktop and gameplay checks remain outstanding

## 3. Motorcycle cards and images
- [x] Sample card design direction approved
- [x] Build 007: ten consistent AI motorcycle illustrations integrated and deployed
- [x] Deploy 10 pilot images; all ten live image URLs return HTTP 200 and match the release assets (device gameplay review pending)
- [~] Build 007: consistent image treatment and aspect-ratio handling implemented; user approved initial artwork samples; in-game device review pending
- [ ] Roll out artwork to 178-bike deck

## 4. Gameplay and quality
- [ ] Validate complete scoring balance with head-to-head simulations and document findings
- [x] Automated regression tests: Quick Match, Duel and all AI difficulties across pilot/full decks; 360 matches passed (device review pending)
- [ ] Test performance, responsive layout and accessibility
- [ ] Test installable PWA / icons and caching

## 5. Future roadmap
- [ ] Explore online multiplayer
- [ ] Explore additional card packs (cars, animals, countries etc.)
- [ ] Consider user-created decks

## Live URL
https://moggs12.github.io/Moto-Cardz/ (repository path is case-sensitive)

## Current release
V2.1.7 / Build 008 — fix artwork clipping by removing intrinsic grid sizing and constraining images to their panels. Cards and gallery share one image renderer. The ten pilot illustrations, full dataset and approved hero asset are unchanged. Deployment verification pending.

1. Run existing automated gameplay and asset checks.
2. Verify published HTML and cache version after deployment.
3. User to confirm whole-bike fit on the affected mobile screen; browser/device checks remain pending.

Notes:
- Keep every meaningful release labelled Vx.y.z / Build NNN.
- Do not mark mockups or planned changes as deployed.
- This file is the project source of truth; update it as decisions and work change.

## Build 005 release notes (2026-10-15)
- [x] User approved major homepage visual revamp and requested deployment.
- [x] Self-hosted illustrated purple-lit hero SVG added (not a photographic image or exact image-generation mockup).
- [x] Home-only layout updates: brand presence, hero headline, compact facts, setting spacing.
- [x] V2.1.4 / Build 005 labels and service-worker cache bump.
- [x] GitHub Pages deployment confirmed successful; user approved updated homepage appearance.
- [ ] Test Quick Match, Duel, AI levels and first-to controls following visual update.
- [ ] Compare against approved mockup; refine hero art if photographic realism is still desired.

## Build 006 / V2.1.5 — Approved Hero 1 photo (2026-10-15)
- [x] User approved Hero 1 realistic purple-smoke motorcycle and homepage mockup.
- [x] Cropped and compressed exact Hero 1 source photo into standalone AVIF (no recolouring or artwork changes).
- [x] Changed homepage only: photo frame, separate smaller headline, logo hierarchy and compact layout.
- [x] Updated displayed build identifier, offline PWA cache and checklist.
- [x] User positive visual review of Build 006 homepage (2026-10-15).
- [ ] Desktop and smaller-screen layout checks.
- [ ] Regression checks: Quick Match, Duel, Easy/Medium/Hard, first-to selector.
- [x] GitHub Pages workflow deployment succeeded for Build 006.
- [ ] Verify offline/PWA image caching on device.

## Build 007 / V2.1.6 — ten-bike visual pilot (2026-10-16)
- [x] User requested development and testing before another deployment.
- [x] Side-by-side Quick Match and Duel comparisons, compact game header and swipeable Duel hand.
- [x] Illustrated ten-bike pilot selector and full 178-bike deck option.
- [x] Pilot artwork gallery, consistent image panels and preserved aspect ratios.
- [x] Pilot sudden-death reserve replenishment, including repeated ties.
- [x] Corrected existing offline icon paths; precache all ten pilot images.
- [x] Automated gameplay coverage across both decks, both modes and all AI levels.
- [ ] Browser/mobile visual approval and device offline verification.
- [x] User approved Build 007 deployment after reviewing artwork and automated test results.
- [x] GitHub Pages deployment succeeded; Build 007 HTML, service worker, hero and all ten images verified live on 2026-10-16.

## Build 008 / V2.1.7 — artwork fit correction (2026-10-16)
- [x] Constrain card illustrations to the image panel independently of intrinsic image dimensions.
- [x] Use the same image panel in the pilot gallery; preserve full bike and aspect ratio.
- [x] Add a small inset around illustrations; retain compact side-by-side layouts.
- [x] Bump visible build/version and offline cache identifier.
- [ ] Verify live deployment and user confirmation on the affected device.
