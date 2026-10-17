# Moto Cardz V2.1.9 / Build 010

## Scope

- Replace the old lime checklist-style install icon with the exact user-approved white motorcycle over two purple cards, graphite tile and purple rim. The attached-image approval overrides earlier option numbering. Crop and resize only; no redraw, regeneration, recolouring or stretching.
- New versioned 192px/512px icons, 180px Apple touch icon and safely padded maskable icon in `assets/icons/build010/`. Canonical approved crop, transformation details, dimensions and SHA-256 hashes are preserved in `provenance.json`.
- Legacy root-level icon URLs also serve identical new icon bytes for compatibility; they are not duplicated in the offline precache.
- Keep all 178 bikes, 176 illustrations, the approved hero, original data/scores, AI levels and side-by-side responsive layouts unchanged.
- Guard Quick Match's next-round transition against early, stale and duplicate activations. Previously a rapid double activation could consume a second round without a stat choice; regression coverage verifies a single transition.
- Ensure manifest/icon/asset-only changes trigger quality checks. Release tags require both complete quality checks and a successful Pages deployment for that exact commit. A conflicting tag fails visibly and is never moved.

No new dependencies, external services, monetisation or scoring changes were introduced. The game remains a lightweight buildless web app; install icons add approximately 570KB to the first offline shell download. The larger canonical source crop is not precached.

## Verification and limits

`npm test` covers 28 checks, including 360 complete matches across both modes/all AI levels, sudden-death ties, menu cancellation, settings migration, source-data checksum, every artwork hash, exact approved icon provenance/dimensions, build consistency, rapid-next regression, immutable tags and deployment gates.

The browser suite contains 48 checks: Chromium and WebKit at 320px/390px phone and 1280px/1440px desktop sizes; complete matches at every level, side-by-side image fitting, all 178 image decodes and model names, gallery/search, menu/rematch, real-origin-outage offline reload/play, install-icon decoding/caching and duplicate-next protection. GitHub Actions logs/artifacts are authoritative; counts describe the required suite, not an assumption that a pending run has passed.

The user confirmed Build 009 played perfectly offline on an iPhone 15 Pro on 2026-10-16. No iOS version was supplied. Build 010's installed-icon appearance and offline update on that physical device remain user verification items, not claims made from browser emulation.

## Installation update

New HTML and manifest references use versioned icon paths to avoid the old icon URL cache. Existing Home Screen installations may retain their OS-managed icon. If the old icon remains, first open the updated game online and confirm V2.1.9 / Build 010; then re-add the game from Safari's Share → Add to Home Screen flow if needed. Reopen the installed app online and allow the initial offline cache download before testing offline. Do not clear all Safari data merely to refresh the icon.

## Release and rollback

- Live branch: `main`; development branch: `build/010-approved-icon`.
- Build 009's latest deployed source/docs state is preserved on `release/build009` at `a8c8fb8f9cec9a388ba729a00a6dafef6791f17d`.
- Existing immutable release tags: `v2.1.7-build008` → `c4041b7345040e0d0c1c48463317ca9e1852d96b`; `v2.1.8-build009` → `f975cd7fc789a7a0aece11b99bf95f52f457d096`.
- Build 010's checkpoint is `v2.1.9-build010`, created by the main workflow only after its quality checks and Pages deployment both succeed. The tag must resolve to that tested/deployed release commit.

To roll back, restore the selected checkpoint's application files through a new branch/commit, retain history, choose a new sequential build/version and service-worker cache name, run the complete quality suite, and merge to `main`. This avoids retaining stale caches or rewriting deployed tags. Nothing in Build 010 changes the agreed score normalization; the Power-score/specification question remains a separate product decision.
