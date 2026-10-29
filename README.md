[English](README.md) | [简体中文](README.zh-CN.md) | [Español](README.es.md) | [Português (Brasil)](README.pt-BR.md) | [日本語](README.ja.md)

# 🎃 Witch’s Potion Match — Halloween Match-3 Puzzle Game

**A little moonlight, a handful of sweets, and one more lovely cascade.** Brew twelve Halloween potions by swapping illustrated ingredients, collecting recipe targets, and lighting candles. This cozy browser match-3 game belongs to Midnight Candy Club and was created for [BlockBlasty](https://blockblasty.top/).

**[Play online](https://halloween-potion-match.crazy3d.org/)** · [All Halloween games](https://github.com/AshinTop/halloween-games) · [Embedding guide](EMBEDDING.md) · [Design notes](DESIGN.md)

**Document languages:** English, 简体中文, Español, Português (Brasil), 日本語. **Game interface:** English and Simplified Chinese only; the other README languages do not add in-game translations.

![Witch’s Potion Match Halloween match-3 board with five ingredients, recipe counters and candle goals](docs/images/gameplay.jpg)

## What is in the cauldron? 👻

- **12 reproducible recipes** on a 6×6 board, with five original ingredients: pumpkin candy, moonlight, bat berries, mint leaves, and stardust.
- Ordinary adjacent swaps, simultaneous matches, gravity, and cascading clears. Every campaign recipe has a verified completion using ordinary swaps.
- Candles that reward **where** you match, plus one Moon Spark for a tactical row-and-column clear.
- Sparkles, ingredient trails, accurate falling pieces, small landing bounces, and escalating combo messages make each cascade readable.
- Useful hints, recipe selection, unlimited restarts, local scores and stars, optional sound, and reduced-motion support.

## How to brew

Read the ingredient counts before making a move. Swap two neighboring tiles to form a horizontal or vertical line of at least three identical ingredients. Diagonal swaps and wrapping across a row are not allowed. An unsuccessful swap costs no move.

Each successful swap costs one move, even when it creates several cascades. Ingredients that match after falling also count toward the recipe. Their score increases with cascade depth, so a useful match can become a much bigger brew.

Some recipes add candles. Clear the ingredient on a candle, or directly above, below, left, or right of it, to light that candle. Finish **every ingredient target and every candle**. Collecting the ingredients alone is not enough.

Press **Moon Spark**, then choose a cell. Its row and column clear together: eleven unique cells on the first wave, with any further cascades resolved normally. The spark is available once per recipe and costs no move. At zero moves, an unused spark remains a final chance.

There is no countdown. A win with at least eight moves left earns three stars; at least three earns two; other wins earn one. A hint evaluates useful legal swaps against the current goals, but does not guarantee that every later decision will win.

## Controls

| Action | Mouse or touch | Keyboard |
|---|---|---|
| Select and swap | Tap two neighbors, or swipe | Arrows move focus; Enter or Space selects |
| Moon Spark | Button, then a tile | Tab to the button, activate, then select |
| Hint | Hint button | H |
| Cancel selection | Tap the selected tile again | Escape |
| Restart or choose a recipe | Restart / recipe selector | Tab to the control |

Wait for a cascade to settle before the next swap. Restart and recipe selection remain available during effects: they cancel the old sequence, so it cannot update the new board.

## Records and reproducible recipes

The same recipe and the same actions produce the same outcomes. Best scores, stars, language, and sound preference are stored locally. Reloading restarts the recipe; unfinished boards are not resumed. A link such as [recipe 8](https://halloween-potion-match.crazy3d.org/#recipe=8) shares its starting layout, not a replay.

## FAQ

**Is Moon Spark required to win?** No. All twelve recipes have ordinary-swap completion checks; the spark is an extra option.

**Why was the board rearranged?** When no legal swap remains, the game tries to reshuffle the existing ingredients. A very skewed set may need a refill. Scores, goals and remaining moves stay intact.

**What if an animation cannot finish?** The visual sequence has cancellation and timeout protection. The already calculated legal game result can finish without the effect, instead of leaving controls locked.

## See the game

![Compact Potion Match player showing the ingredient board, remaining moves and Moon Spark](docs/images/mobile.jpg)

Actual game interface in a compact browser iframe. This illustrates the layout; it is not a physical-phone performance test.

[Watch the 24-second introduction](https://halloween-potion-match.crazy3d.org/intro.html) · [Download the captioned MP4](docs/media/intro.mp4). This silent visual tour is assembled from actual game screenshots, not a continuous gameplay recording. The screenshots and video show captured interface states and may predate later visual refinements.

## Embed it on your site

```html
<iframe src="https://halloween-potion-match.crazy3d.org/"
  title="Witch’s Potion Match"
  style="display:block;width:100%;height:654px;border:0"
  allow="fullscreen" allowfullscreen></iframe>
```

The layout targets 1160×654 desktop, 390×650 / 390×794 portrait and 844×340 landscape windows. Controls use the actual iframe size; these browser checks are not a claim about every physical device.

The live site uses Cloudflare and is deployed from this GitHub repository. Give the iframe a real height and leave space for the host toolbar. Fullscreen may be provided by the host. See [EMBEDDING.md](EMBEDDING.md) for the integration contract.

## Run locally and check the rules

```sh
python3 -m http.server 4173
```

Serve the repository root, then open [http://localhost:4173/](http://localhost:4173/). The game is static: no build or dependency installation is needed. Use HTTP(S), because direct `file://` access can block ES modules. Node.js is required for the tests.

```sh
npm test
```

The **24 tests** cover rules, all twelve campaign completions, pointer-input races, real falling routes, wave-by-wave counters, cancellation at each phase, and recovery from failed or stalled animation timelines.

The game source does not require an account, remote API, advertising SDK, or external asset CDN. Records stay in browser storage; there is no cloud sync. Cloudflare may add its own hosting scripts and request logs. Optional synthesized audio follows browser sound permissions.

## More moonlit adventures 🍬

- [Witch’s Candy Blocks](https://halloween-block-blast.crazy3d.org/) · [Source](https://github.com/AshinTop/halloween-block-blast) — 8×8 candy-block placement.
- [Pumpkin Shift](https://halloween-pumpkin-shift.crazy3d.org/) · [Source](https://github.com/AshinTop/halloween-pumpkin-shift) — Number-sliding rooms with Moon Glides.
- [Trick-or-Treat TriPeaks](https://halloween-tripeaks.crazy3d.org/) · [Source](https://github.com/AshinTop/halloween-tripeaks) — Higher-or-lower solitaire and Moon Bridges.
- [Moonlit Mirrors](https://halloween-mirror-hearts.crazy3d.org/) · [Source](https://github.com/AshinTop/halloween-mirror-hearts) — Bring two mirrored ghosts home together.

## Credits and a little support

Created for **AshinTop’s Midnight Candy Club** through human-directed AI collaboration in design, programming, writing, testing, and review. The original artwork and synthesized sounds were made for this project. [Design notes](DESIGN.md) explain its intent.

Enjoyed this little adventure? **[Star Witch’s Potion Match on GitHub](https://github.com/AshinTop/halloween-potion-match)** to save it for later and follow updates. Useful issue reports include the game mode or level, browser, window size, and steps that reproduce the problem. Explore the [complete Halloween collection](https://github.com/AshinTop/halloween-games).
