# Moto Cardz V2.3.0 / Build 012 — balance update

## Scope

Gameplay and data only. No visual, layout, artwork, icon or progression (XP) changes.

1. **Scores rebuilt from the real specs.** Every 1–99 score is now the bike's percentile rank for that spec across the 178-card deck (`tools/rescore.cjs`). Before, about 5% of top speed, power, engine and economy match-ups, and 24% of value match-ups, went against the specs printed on the cards (e.g. the 186 mph RSV4 lost on top speed to the 166 mph Tuono V4). Now none do. Value rewards a lower price. `allRound` is recalculated as the mean of the five scores. All other card fields are byte-identical.
2. **Spec tie-break.** Equal scores are settled by the printed spec; only identical specs draw. The AI uses the same rule when choosing its card.
3. **Quick Match AI hands: 2 / 4 / 5 cards** (were 1 / 2 / 3). A player who always picks their best stat used to win 96–99% on Easy and 71–80% on Hard; now 85–95% / 58–62% / 44–46%.
4. **Duel turn order.** Rounds 1–4 still alternate after the opening coin toss, but a new coin toss picks the attacker for round 5 and every sudden-death round. The opening toss used to win 66% of Hard duels because the first attacker got three attacks to two; it now wins 48–50% at every level. Hand size, first-to-3 and sudden death are unchanged.

## Effect on weak cards

Spec-based Value fixed most of the dud cards: the Rieju Aventura Rally 307 (£4,599) went from Value 9 to 95, and the Voge R625 from 6 to 72. The Langen Two Stroke (249 cc, £32,580) stays the weakest card because its real specs are weak; boosting it would break the spec rule.

Top speed and power are still strongly linked (correlation ≈ 0.86), as they are on real bikes.

## Verification

- `npm test`: 39/39 pass, including new checks that no score contradicts its spec, the new AI hand sizes, and the coin-toss attacker for round 5 and sudden death.
- Browser suite: 34/34 pass in Chromium (1280px desktop and 320px phone). WebKit runs in CI.
- Dataset checksum updated deliberately for the new scores.
- Service worker cache bumped to `moto-cardz-v2.3.0-build012` so installed apps update.

## Rollback

Revert this branch's merge commit and bump the service worker cache again.
