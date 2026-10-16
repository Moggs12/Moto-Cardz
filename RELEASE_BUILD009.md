# Moto Cardz V2.1.8 / Build 009

Build 009 completes the artwork for the existing 178-bike pack and finishes its phone and desktop layouts. It retains Quick Match, Duel, all three AI levels, the five balanced scores and the approved purple-smoke hero.

## What players get

- All 178 cards illustrated in the same graphite-studio style. Every image preserves the whole bike inside its panel.
- The full pack is the default. Existing saved preferences migrate without restricting returning players to the ten-bike pilot.
- Side-by-side comparisons on phones and desktops. Phones have a swipeable Duel hand; desktops fit all five hand cards across the screen.
- A desktop home screen with the hero beside the controls.
- A searchable gallery for the complete deck.
- The complete pack cached for offline play after its initial download finishes.

## Artwork and source names

There are 178 cards and 176 distinct source make/model names. BK-034/BK-035 (Diavel V4) and BK-156/BK-157 (Tiger Sport 800) retain their different specifications and scores while sharing the appropriate model illustration. Model years were not recorded in the original dataset, so artwork is model-inspired rather than a verified photograph of a specific year or optional trim.

BK-099's original source label is '1390 Super Duke S Evo'. Its displayed model is corrected to '1390 Super Adventure S Evo': the S Evo designation, 1350cc engine and approximately 170bhp match KTM's published Super Adventure S Evo specifications. This is a documented inference about a transcription error. The original data row, scores and numeric specifications remain intact.

Official reference: https://www.ktm.com/en-gb/models/adventure/2026-ktm-1390-superadventuresevo/technical-specifications.html

All original categories and scoring remain unchanged. Artwork follows the actual model silhouette rather than using the source game category to infer a body style. Per-model generation prompts, reference links, review notes and file hashes are recorded in `assets/deck-v009/manifest.json`.

## Verification

- Automated gameplay: 360 complete matches spanning every AI level, Quick Match first-to 3/5/7, and Duel.
- Repeated sudden-death ties beyond the original reserve, hidden opponent cards, score locking, menu cancellation, search and saved-setting migration.
- Original dataset checksum and one artwork mapping for every card.
- Asset and offline shell checks: 178 mappings, 176 unique valid 600 × 400 WebP images, compact total size, and all files included in the service worker.
- Browser checks run in GitHub Actions using preinstalled Chromium and WebKit: 320px and 390px phone views, 1280px and 1440px desktops, complete-bike image fitting, card alignment, all model names, gallery/search, both game modes at every AI level, menu/rematch and offline play.

GitHub workflow logs and the downloadable `browser-review` artifact are the authority for results. Build 009 must pass the complete suite before merging; the early layout preflight checks alone do not constitute release approval.

## Release and rollback

`main` is the live branch. Build 009 is developed on `build/009-full-deck`. `release/build008` preserves the preceding deployed release, including its code and ten pilot illustrations. Release tags are created only after the full main-branch quality job succeeds.

To roll back, restore the chosen checkpoint's application files through a new branch/commit, keep the current release history, give the restoration a new sequential build number, and bump the service worker cache name. Run the checks and merge the restoration into `main` to redeploy. Do not force-push or move an existing release tag.

Trophy cabinets, XP, weekly challenges, monetisation and sales links remain future ideas. They are not part of this release.
