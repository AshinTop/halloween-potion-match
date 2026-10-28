# Witch’s Potion Match — design notes

## Intent

A cozy Halloween match-three game with readable goals and a forgiving pace. The player chooses where to match, rather than chasing a timer. Original SVG pumpkin candy, a crescent, a bat, mint and a star carry the ingredient identity independently of tile color.

## Rules and progression

The 6×6 board contains five ingredients. Only orthogonally adjacent swaps creating a horizontal or vertical match of at least three are accepted. A rejected swap leaves score, moves, RNG, and board unchanged. Simultaneous match cells are a union; intersections count once. Every cascade clears its union, updates ingredient totals, lights any candle on or immediately orthogonally adjacent to the union, collapses surviving ingredients downward in order, and refills from a deterministic LCG stream. The entire chain spends one move.

Twelve fixed seeds, ingredient quotas, candle layouts, and move budgets form the campaign. All twelve are verified completable by replaying legal moves in the test suite. This is existence evidence, not a guarantee that every choice succeeds. The in-game hint scores actual legal swap outcomes against missing ingredients and candles. It does not claim a full campaign solver.

One Moon Spark clears a row-column union (11 cells on this board), costs no move, and can trigger normal cascades. At zero moves an unused Spark becomes the final chance. Once the Spark is spent, a zero-move state without complete goals loses. Goal completion always wins first.

No-move boards try up to 200 seeded permutations preserving ingredient counts. A highly skewed set that admits no stable playable permutation is refilled safely. Progress and remaining moves stay intact. Stars depend on moves remaining: 8+ gives three, 3+ gives two, otherwise one.

## Presentation and accessibility

Muted violet, mint, parchment and candle gold; original vector art and a quiet illustrated cauldron. The board is the primary visual focus. Cell shapes identify ingredients as well as color; candles use a different silhouette. Tap-to-swap, swiping, keyboard selection, optional synthesized audio and reduced-motion CSS are supported. Help holds longer instructions while goals remain visible during play. Results explain completion or failure and offer the next recipe or retry.

## Data boundaries

Only validated best score/star records and language/sound preferences are saved locally. A room hash chooses the initial recipe; no remote account or unfinished-board upload exists. Storage access is guarded. No runtime external assets or remote API requests. The build is plain HTML/CSS/ES modules.

## Verification

17 built-in Node tests cover rule risks and full campaign completions. Browser acceptance is performed separately by the collection owner against final iframe sizes; unit results do not claim physical-device audio, touch, or hosting verification.
