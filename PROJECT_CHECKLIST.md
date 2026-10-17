# Moto Cardz — Master Project Checklist
Updated: 2026-10-17
Legend: [x] complete, [~] in progress, [ ] planned, [!] blocked

## 1. Foundations
- [x] Moto Cardz concept and motorcycle card-game direction agreed
- [x] GitHub repository and GitHub Pages playable prototype
- [x] Remove four electric bikes from original 182-bike list; 178-bike target deck
- [x] Normalised stat/scoring approach chosen
- [x] Quick match and duel gameplay implemented in published V2
- [x] Easy / Medium / Hard AI controls implemented
- [x] Added visible V2.1.0 / Build 001 identifier to main game
- [x] Verify 178 unique bike IDs and full-deck artwork mappings in the released game

## 2. Brand and visual design
- [x] Retro trading-card direction with modern neon/category colours agreed
- [x] Modern Apple-inspired premium UI direction agreed
- [x] Graphite, Almond White, Electric Indigo and supporting palette selected
- [x] MotoCardz logo concept sheet generated and preferred direction chosen
- [x] Production header logo retained; Build 010 app icon follows the exact attached-image approval from 2026-10-16, superseding earlier icon options
- [x] V2.1.3 / Build 004 scalable sportbike header logo retained; approved Build 010 install icons exported at standard, Apple touch and maskable sizes
- [x] Dark Premium Option A palette deployed and visually approved by user (2026-10-14); typography/panels still to review
- [x] Build 006 Hero 1 homepage visual direction approved by user (2026-10-15); desktop and gameplay checks remain outstanding

## 3. Motorcycle cards and images
- [x] Sample card design direction approved
- [x] Build 007: ten consistent AI motorcycle illustrations integrated and deployed
- [x] Deploy 10 pilot images; all ten live image URLs return HTTP 200 and match the release assets (device gameplay review pending)
- [x] Whole-bike contain fitting and aspect-ratio handling verified in phone/desktop Chromium and WebKit views
- [x] Build 009: all 178 cards illustrated with 176 distinct images; 166 new images independently reviewed and ten approved pilot images retained

## 4. Gameplay and quality
- [ ] Validate complete scoring balance with head-to-head simulations and document findings
- [x] 28 gameplay, asset, provenance and release-safety checks passed: 360 matches, all AI levels, repeated sudden-death ties, settings migration, unchanged scores, rapid-next guard and immutable deployment tags
- [x] 48 browser checks passed at 320px/390px phone and 1280px/1440px desktop sizes in Chromium and WebKit; both modes, all levels, artwork/name fit, menu/rematch, gallery/search, offline icon caching and rapid-next protection
- [x] Full pack cached and service-worker reload/gameplay verified with the actual origin disconnected, including a failed no-cache network control
- [ ] Physical phone/desktop performance and full accessibility audit
- [x] User reported Build 009 played perfectly offline on iPhone 15 Pro (2026-10-16); iOS version not supplied
- [ ] Build 010 installed-icon and offline update confirmation on that device

## 5. Future roadmap
- [ ] Explore online multiplayer
- [ ] Explore additional card packs (cars, animals, countries etc.)
- [ ] Consider user-created decks

## Live URL
https://moggs12.github.io/Moto-Cardz/ (repository path is case-sensitive)

## Current release

V2.1.9 / Build 010 — exact approved app icon, rapid-next safeguard, expanded release checks and deployment-verified checkpoint tags. All 28 automated checks and all 48 browser checks passed on `build/010-approved-icon`. Browser review artifacts and the successful run are at https://github.com/Moggs12/Moto-Cardz/actions/runs/39009229802 . The main workflow reruns the complete checks and requires successful Pages deployment for the same commit before creating `v2.1.9-build010`. `release/build009` and the prior immutable tags preserve rollback checkpoints. Deployment status and the release-tag SHA in GitHub Actions are authoritative.

### Previous release checkpoint
V2.1.8 / Build 009 — complete 178-bike illustrated pack, one responsive app, side-by-side comparisons on phone and desktop, desktop five-card Duel hand, searchable full gallery and complete artwork cache. The approved hero and original game scores are unchanged.

Developed on `build/009-full-deck`, merged to live `main` through PR #4. GitHub Pages deployment and the full main-branch quality workflow succeeded on 2026-10-16. All 20 gameplay/asset checks and all 40 browser checks passed before and after merging. See `RELEASE_BUILD009.md` for verification limits, provenance and rollback.

Previous deployed checkpoint: `release/build008`. Immutable version tags are managed by the successful main quality workflow. Manual physical-device installation/airplane-mode checks remain open; no claim of manufacturer-certified exact-year artwork is made.

Notes:
- Keep every meaningful release labelled Vx.y.z / Build NNN.
- Do not mark mockups or planned changes as deployed.
- This file is the project source of truth; update it as decisions and work change.
- Historical notes below reflect each earlier release's state; current verification is recorded above.

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
- [x] GitHub Pages deployment succeeded; live HTML and service worker match Build 008.
- [ ] User confirmation of whole-bike fit on the affected device.

## Build 009 / V2.1.8 — complete illustrated pack (2026-10-16)
- [x] 176 distinct 600 × 400 illustrations cover every one of the 178 cards; duplicate model entries retain separate scores/specifications.
- [x] Independent visual review and SHA-256 provenance for all 166 new images.
- [x] Full deck is the default, including migrated ten-bike-pilot settings.
- [x] One responsive app: compact side-by-side phone cards, roomier desktop home/comparisons and five-column Duel hand.
- [x] 20 automated checks and 40 browser checks passed; screenshots visually reviewed.
- [x] PR #4 merged, Pages deployed, main quality workflow succeeded.
- [x] Prior release preserved; rollback instructions documented without rewriting history.
- [x] User confirmed perfect offline gameplay on iPhone 15 Pro (2026-10-16).

## Build 010 / V2.1.9 — approved icon and release hardening (2026-10-17)
- [x] Exact attached-image icon approval recorded; crop/resize only.
- [x] Versioned standard, Apple touch and maskable icons, with provenance hashes.
- [x] Rapid-next guard and regression checks; no score/data/hero/artwork changes.
- [x] Asset/manifest changes trigger CI; checkpoint tags require successful quality and deployment for the same commit; conflicting tags cannot be moved.
- [x] Build 009 release branch and tag preserved.
- [x] 28 automated checks and all 48 browser checks passed; install icon sizes/caching and rapid-next regression covered on every browser/viewport
- [x] Dependency audit reported zero known vulnerabilities (2026-10-17); no runtime dependencies added
- [x] Publication and tag creation are coupled to complete main QA plus same-commit successful Pages deployment; live/tag verification is part of the release handoff
- [ ] User confirmation of the installed Build 010 icon and offline update.

## Player Progression & Rewards System (Build 011 foundations — planning)

Treat the following as THREE CONNECTED PARTS of one progression and rewards system, not unrelated features. A single match may contribute to all three at once.

1. **XP & Levels** — Steady progress through playing. Example: earn XP for completing matches, with a bonus for winning.
2. **Daily & Weekly Challenges** — Short goals that encourage variety. Example: win using three different stats during the week.
3. **Lifetime Trophies** — Permanent achievements to collect. Example: win your first Duel, then reach 10, 50 and 100 wins.

Status: XP foundation selected for Build 011 planning; challenges and trophies remain future linked components. No gameplay code deployed by this checklist change.

## Build 011 / V2.2.0 — XP and Rider Hub development (2026-10-17; unmerged development branch)
- [x] User chose XP for finishing a match, with an additional XP bonus for winning.
- [x] Completion XP +20; approved difficulty win bonuses: Easy +20, Medium +30, Hard +50 (wins 40/50/70 XP; losses 20 XP).
- [x] Award baseline match-completion XP for all finished Quick Match/Duel matches, win or lose.
- [x] User approved difficulty-based XP values as Build 011 starting balance.
- [x] Match-start difficulty and first-to target locked for match; persistent recent-match award ledger blocks duplicate grants.
- [x] One-time awards wired to Quick Match/Duel terminal resolution (not modal opening); no reward for quitting an incomplete match.
- [x] 50 player levels agreed as the initial progression cap, designed to expand later.
- [x] Dedicated player progression/rewards page proposed and accepted in principle, opened by small trophy icon (keep main gameplay uncluttered).
- [x] Initial 50-level XP threshold curve and motorcycle rank bands implemented for testing; milestone pacing is provisional until user review.
- [x] Home trophy icon opens separate responsive Rider Hub page with level, progress meter, total XP, matches, wins/losses and future rewards placeholders.
- [x] Uses versioned localStorage record (device-only, no cross-device sync); safe fallback if localStorage blocked; no account/reset feature in Build 011.
- [x] XP award appears on results modal; 178-bike source data, imagery, card scoring and gameplay modes unchanged.
- [~] New unit and browser matrix covers rewards, persistence, level thresholds, duplicates, quit/reload, Rider Hub and both game modes; GitHub CI browser run still pending.
- [ ] Review development-branch QA; obtain user acceptance before any merge/deployment. Live main remains Build 010.
- [ ] Design Daily/Weekly Challenges as connected second component in a subsequent iteration.
- [ ] Design Lifetime Trophies as connected third component in a subsequent iteration.

**Build 011 implementation branch:** `build/011-xp-rider-hub` — do not merge or deploy until final CI review and explicit user approval. Last confirmed unit tests on the development branch passed; browser suite in progress.
