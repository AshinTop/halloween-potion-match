# Witch’s Potion Match — Halloween Match-3 Puzzle Game

**Swap enchanted ingredients, light the candles, and brew twelve little bottles of Halloween magic.** Witch’s Potion Match is a free browser puzzle from Midnight Candy Club, created as a seasonal companion for [BlockBlasty](https://blockblasty.top/). It combines familiar match-three swaps with ingredient recipes, spatial candle objectives, and a carefully timed Moon Spark.

**[GitHub Pages deployment target](https://ashintop.github.io/halloween-potion-match/)** · [Embedding guide](EMBEDDING.md) · [Game design](DESIGN.md)

**Deployment status:** GitHub Pages is not live yet. The `ashintop.github.io` links in this document are intended deployment addresses. Use the local-run instructions until the hosted game has been published and verified.

[Video player and transcript (deployment target)](https://ashintop.github.io/halloween-potion-match/intro.html) · [Captioned MP4 file](docs/media/intro.mp4). The 24-second silent introduction uses actual game screenshots; it is not a live gameplay recording.

![Witch’s Potion Match: a Halloween match-three board with illustrated ingredients, recipe goals, and candle objectives](docs/images/gameplay.jpg)

Enjoy brewing a little magic? **[Star this repository](https://github.com/AshinTop/halloween-potion-match)** to keep it in your collection and follow future improvements.

## A cozy puzzle with a little strategy

The board holds five original illustrated ingredients: pumpkin candy, moonlight, bat berries, mint leaves, and stardust. Match at least three identical ingredients in a horizontal or vertical line. New ingredients fall from above, and cascades count toward the recipe while increasing the score multiplier.

Every recipe asks for particular quantities, so a large clear is not always the most useful clear. Later recipes add candle positions: clearing an ingredient on a candle, or directly above, below, left, or right of it, lights that candle. You must collect all requested ingredients **and** light every candle before the run ends.

Each recipe includes one **Moon Spark**. Activate it, then choose a cell to clear its entire row and column without spending a move. It can open a crowded part of the board, reach a difficult candle, or finish a recipe. If your move counter reaches zero while the spark remains unused, you still get that last chance.

## Features

- **12 fixed, reproducible recipes**, from a first bottle of moonlight to the grand brew. All twelve have a verified legal completion within their move budgets.
- A complete **6×6 match-three engine** with legal adjacent swaps, simultaneous matches, gravity, cascades, ingredient collection, and win/loss states.
- Candle objectives that reward where you clear, plus a one-use cross-clearing Moon Spark.
- Invalid swaps cost no moves. Dead boards are automatically refreshed without resetting recipe progress or remaining moves.
- Useful swap hints, unlimited restarts, recipe selection, and one-to-three-star results.
- Tap, swipe, and keyboard controls; English and Simplified Chinese; optional synthesized sound and reduced-motion support.
- Local best scores and recipe stars, plus shareable recipe links.
- Static HTML, CSS, JavaScript modules, and original SVG art. No package installation, backend, account, or CDN is needed to play.

## How to play

1. Choose a recipe and read the ingredient targets beside or above the board.
2. Select two neighboring ingredients, or swipe one toward its neighbor.
3. Match three or more identical ingredients in a row or column. Watch the cascades finish before choosing again.
4. In candle recipes, clear on or directly beside each candle to light it.
5. Use your Moon Spark when its row-and-column clear will help most.
6. Finish every goal. Eight or more moves left earns three stars; three or more earns two; any other successful finish earns one.

There is no countdown timer. Hints and recipe retries have no penalty. A useful swap hint evaluates legal moves against your current goals; it is not a promise that every subsequent choice will win.

## Controls

| Action | Touch / mouse | Keyboard |
|---|---|---|
| Select an ingredient | Tap a tile | Arrow keys move the focus, then Enter or Space |
| Swap | Tap an adjacent tile, or swipe | Move focus to an adjacent tile, then Enter or Space |
| Moon Spark | Press **Moon Spark**, then tap a tile | Focus the button with Tab, activate it, then select a tile |
| Show a useful swap | Press **Hint** | H |
| Cancel selection | Tap the selected tile again | Escape |
| Restart or change recipe | Use the restart button or recipe menu | Tab to the relevant control |

## Recipes, saving, and sharing

Recipes use deterministic seeds, so restarting a recipe gives the same initial board and the same outcomes for the same actions. The goal counts and candle arrangements become more demanding across the twelve recipes. Best stars and scores are stored locally for each recipe.

A link such as [`#recipe=8`](https://ashintop.github.io/halloween-potion-match/#recipe=8) opens the eighth recipe. Shared links start the recipe from its beginning; they do not transmit a player’s unfinished board. Reloading also starts that recipe again. Best results, language, and sound preference remain on the same browser when storage is available.

## Compact-player walkthrough

![Witch’s Potion Match in a compact host iframe, showing recipe goals, the ingredient grid and Moon Spark](docs/images/mobile.jpg)

Check the remaining recipe goals, then tap or swipe two neighboring ingredients. Let the cascade finish before choosing the next swap. Moon Spark clears the chosen row and column while keeping the move counter unchanged.

*Actual interface captured in a browser iframe sized for the host player. This is a compact-window illustration, not a physical-phone test.*

## Play on your site

```html
<iframe
  src="https://ashintop.github.io/halloween-potion-match/"
  title="Witch’s Potion Match — Halloween match-three puzzle"
  style="display:block;width:100%;height:654px;border:0"
  allow="fullscreen"
  allowfullscreen
></iframe>
```

The game uses the actual iframe viewport and does not need a parent-page script. Its layout targets the existing **1160×654** desktop game window, **390×650 / 390×794** phone windows, and **844×340** short landscape window. The board resizes to the space left after the controls. The host may provide fullscreen. Very short phone windows make board details smaller; a taller frame is more comfortable. See [EMBEDDING.md](EMBEDDING.md) for permissions and integration details. These dimensions are browser layout targets, not claims of physical-device testing.

## Run and test locally

Serve the folder over HTTP(S); JavaScript modules do not run correctly from a plain `file://` opening.

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`. No build or dependency installation is required.

```bash
npm test
# For individual built-in test results:
node tests/engine.test.js
node tests/input.test.js
```

The **17 rule and input tests** cover initial board stability, row-boundary checks, crossing matches, invalid swaps, cascade accounting, Moon Spark, gravity, candle goals, the zero-move last chance, dead-board recovery, all twelve campaign completions, strict recipe links, malformed saved preferences, and stale-pointer/concurrent-input regressions. Browser input, audio output, and the final host’s permission policy still need their own acceptance checks.

## FAQ

### Is this a match-three game or a block-placement game?

It is a match-three game: swap neighboring ingredients to form lines of three or more. For placing differently shaped pieces into an empty grid, try [Witch’s Candy Blocks](https://github.com/AshinTop/halloween-block-blast).

### Can I finish a recipe without using Moon Spark?

Yes. The campaign test completes every recipe using ordinary legal swaps. The spark is an extra tactical option and a useful last chance, rather than a mandatory scripted move.

### Why did the board change without using a move?

When no legal swaps remain, the game tries to shuffle the existing ingredients into a stable playable arrangement. An unusually skewed ingredient set may require a refill. Recipe progress, score, and remaining moves stay intact.

### Does the game collect personal data?

The game code has no analytics, login, remote API, advertising SDK, or external asset requests. Results and preferences stay in browser storage. Sharing copies a recipe link; it does not contact a social network. If storage or clipboard access is blocked, gameplay continues and a share link can be copied manually. Your hosting provider may have its own standard request logs.

### Does progress sync between devices?

No. Progress is local to the browser and origin. Embedded and direct visits can have different storage partitions, and clearing site data removes saved results.

## More Halloween games

| Game | A different little adventure |
|---|---|
| [Witch’s Candy Blocks](https://github.com/AshinTop/halloween-block-blast) | Place candy shapes on an 8×8 board and clear rows and columns. |
| [Pumpkin Shift](https://github.com/AshinTop/halloween-pumpkin-shift) | Slide numbered tiles through a moonlit puzzle. |
| [Trick-or-Treat TriPeaks](https://github.com/AshinTop/halloween-tripeaks) | Clear layered Halloween cards by rank. |
| [Moonlit Mirrors](https://github.com/AshinTop/halloween-mirror-hearts) | Guide two reflected ghosts home together. |

**简体中文：**《魔药连消》包含 12 份固定配方、原料收集、邻接点亮烛火和每关一次月光火花。支持触屏、键盘与中英文切换；进度只保存在当前浏览器中。

## Creation credits

Designed, implemented, and reviewed through human-directed AI collaboration. The gameplay implementation, interface, and original SVG artwork were created for this project; optional sound is synthesized in the browser. Screenshots show the actual interface, and the short video is a captioned visual introduction assembled from those captures.
