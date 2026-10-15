# Moto Cardz — Master Project Checklist
Updated: 2026-10-15
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
- [~] Consistent AI-generated motorcycle artwork and 10-card pilot preparation (completion not verified)
- [ ] Add and test 10 pilot images in live game
- [ ] Review consistency of image size, composition, colours and model identification
- [ ] Roll out artwork to 178-bike deck

## 4. Gameplay and quality
- [ ] Validate complete scoring balance with head-to-head simulations and document findings
- [ ] Regression test Quick Match, Duel and all AI difficulties after UI changes
- [ ] Test performance, responsive layout and accessibility
- [ ] Test installable PWA / icons and caching

## 5. Future roadmap
- [ ] Explore online multiplayer
- [ ] Explore additional card packs (cars, animals, countries etc.)
- [ ] Consider user-created decks

## Live URL
https://moggs12.github.io/Moto-Cardz/ (repository path is case-sensitive)

## Next proposed release
V2.1.5 / Build 006 — Hero 1 photorealistic upgrade (Build 005.1 refinement), matching the user-approved mockup. Cropped and optimised exact approved Hero 1 artwork, no stylistic alterations. Logo remains centred; headline beneath the photograph; compact information strip and controls. GitHub Pages deployment successful, user likes the visual result; gameplay regression and desktop tests pending. Gameplay/data unchanged.
1. Prepare individual assets from approved Option 1 logo and Option 4 icon; preview header before deployment
2. UI theme and card backs
3. App icon and favicon
4. Mobile/desktop testing
5. Deploy and verify build/version
6. Incorporate the 10-image pilot when ready

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
