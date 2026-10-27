# Moto Cardz V2.3.0 / Build 012

178-bike playable prototype. The four electric bikes are excluded. Every card shows the real spec (mph, bhp, cc, mpg, £) under each 1–99 game score, and since Build 012 every score is calculated from that spec, so a result can never contradict what the card says.

Build 012 is a balance update: spec-based scores, retuned Quick Match AI hands, and a fairer Duel turn order. See [Build 012 release notes](RELEASE_BUILD012.md).

Build 010 adds the exact approved white motorcycle / purple-card app icon, with versioned install assets and a protected Quick Match next-round transition. It retains Build 009's 178-card pack with 176 distinct, consistent studio illustrations, side-by-side phone/desktop comparisons, searchable gallery and offline artwork cache. All original game scores, motorcycle illustrations and the approved hero remain unchanged.

Run `npm test` for gameplay, assets, icon provenance and release-checkpoint safeguards. GitHub Actions runs the full browser suite in Chromium and WebKit on phone and desktop viewports. See [Build 010 release notes](RELEASE_BUILD010.md) for scope and rollback, and [Build 009 release notes](RELEASE_BUILD009.md) for full-deck artwork provenance.

## Modes

**Quick match** — one card each. You see your card, name a stat, and the AI reveals its card. First to 3, 5 or 7 round wins takes the match.

**Duel** — each side is dealt five cards and every card is played once.
- The attacker picks a card and a stat. The defender sees the stat (not the card) and answers with one of their own cards.
- A coin toss decides who attacks first, then attacking alternates. A fresh coin toss picks the attacker for round 5 and for every sudden-death round, so neither side gets an extra attack.
- Win three rounds to win the duel. If all five rounds finish level, sudden death gives each side one fresh card, repeating until someone wins.
- With one card left you still choose the stat when attacking, and your last card defends automatically.

## AI levels

| Level | Quick match | Duel |
|---|---|---|
| Easy | Holds 2 cards, plays the better one for your stat | Attacks and defends at random |
| Medium | Holds 4 cards, plays the best one for your stat | Attacks with its strongest stats, defends with its best card 65% of the time |
| Hard | Holds 5 cards, plays the best one for your stat | Weighs win chance against the value of each card, so it spends specialists and sacrifices cards on stats it can't win |

Measured over thousands of simulated games:

Measured over 20,000 simulated matches per setting (Build 012):

- **Quick match** (first to 5), player always picks their best stat: wins 92% (Easy), 60% (Medium), 45% (Hard). Picking stats at random rarely wins.
- **Duel**, a good player vs the AI: wins 94% (Easy), 66% (Medium), 53% (Hard). Sudden death happens in under 5% of duels.
- **Duel** first-attacker edge: whoever wins the opening coin toss wins 48–50% at every level (was 66% on Hard before Build 012).
- **Duel**, AI vs AI: Hard beats Easy 93% of the time and Medium 64%; Medium beats Easy 86%.

## Data notes

- 178 bikes, 176 distinct make/model pairs. The Ducati Diavel V4 and Triumph Tiger Sport 800 each appear twice with different price and MPG (and top speed for the Tiger), so they look like separate model years. Both are kept and are told apart by the price on the Value row. Adding a `year` field to those entries would make this explicit.
- Card scores are calculated from the real specs by `tools/rescore.cjs`: each score is the bike's percentile rank for that spec across the deck (1–99). A better spec never scores lower and equal specs always score the same. Value rewards a lower price.
- If two cards have the same score, the printed spec decides the round; only identical specs draw.
- Rerun `node tools/rescore.cjs` after adding or editing bikes, then update the dataset checksum in `tests/game.test.cjs`.
- Illustrations are model-inspired, not verified exact-year photography. Per-image prompts, references and review notes are in `assets/deck-v009/manifest.json`.
- BK-099 displays '1390 Super Adventure S Evo' as a documented correction to the source's '1390 Super Duke S Evo'. Original data and scores remain unchanged; see the release notes.

## Files

- `index.html` — the whole game (data, logic and styles in one file)
- `manifest.webmanifest` — install metadata
- `sw.js` — service worker, makes the game work offline
- root-level PNGs — app icons (192, 512, maskable 512, Apple touch)

## Running and installing

Open `index.html` directly to play. To install it as an app, serve the folder over HTTPS (or `localhost`); browsers only enable install and offline support on secure origins. Any static host works, for example `python3 -m http.server` for local testing.

When you change any shipped file, bump `CACHE` in `sw.js` so players receive the update.

## Not built yet

- Winning the opponent's card, or a full-deck Top Trumps mode
- Model-year field for the duplicated bikes

## Release history

`main` is live. `release/build008` and `release/build009` preserve preceding deployed states. Versioned release tags are created only after the complete main-branch quality checks AND Pages deployment succeed for the same commit. Conflicting existing tags fail the workflow; they are never moved. Restore a checkpoint through a new tested commit and a new service-worker cache version; never rewrite release history.
