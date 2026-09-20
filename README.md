# Moto Cardz V2

178-bike playable prototype using the agreed game scores. The four electric bikes are excluded. Every card now shows the real spec (mph, bhp, cc, mpg, £) under each 0–99 game score.

## Modes

**Quick match** — one card each. You see your card, name a stat, and the AI reveals its card. First to 3, 5 or 7 round wins takes the match.

**Duel** — each side is dealt five cards and every card is played once.
- The attacker picks a card and a stat. The defender sees the stat (not the card) and answers with one of their own cards.
- Attacking alternates each round, decided by a coin toss at the start.
- Win three rounds to win the duel. If all five rounds finish level, sudden death gives each side one fresh card, repeating until someone wins.
- With one card left you still choose the stat when attacking, and your last card defends automatically.

## AI levels

| Level | Quick match | Duel |
|---|---|---|
| Easy | Holds 1 card | Attacks and defends at random |
| Medium | Holds 2 cards, plays the better one for your stat | Attacks with its strongest stats, defends with its best card 65% of the time |
| Hard | Holds 3 cards, plays the best one for your stat | Weighs win chance against the value of each card, so it spends specialists and sacrifices cards on stats it can't win |

Measured over thousands of simulated games:

- **Quick match**, player always picks their best stat: wins 81% (Easy), 69% (Medium), 60% (Hard).
- **Quick match**, player picks a random stat: wins 49% / 33% / 24%.
- **Duel**, AI vs AI: Hard beats Easy 92% of the time and Medium 67%; Medium beats Easy 84%.

## Data notes

- 178 bikes, 176 distinct make/model pairs. The Ducati Diavel V4 and Triumph Tiger Sport 800 each appear twice with different price and MPG (and top speed for the Tiger), so they look like separate model years. Both are kept and are told apart by the price on the Value row. Adding a `year` field to those entries would make this explicit.
- Card scores are the agreed game scores. Real specs are display-only and never affect who wins a round.

## Files

- `index.html` — the whole game (data, logic and styles in one file)
- `manifest.webmanifest` — install metadata
- `sw.js` — service worker, makes the game work offline
- `icons/` — app icons (192, 512, maskable 512, Apple touch)

## Running and installing

Open `index.html` directly to play. To install it as an app, serve the folder over HTTPS (or `localhost`); browsers only enable install and offline support on secure origins. Any static host works, for example `python3 -m http.server` for local testing.

When you change any shipped file, bump `CACHE` in `sw.js` so players receive the update.

## Not built yet

- Winning the opponent's card, or a full-deck Top Trumps mode
- Stat tie-breaks using the raw spec (equal scores are draws)
- Model-year field for the duplicated bikes
