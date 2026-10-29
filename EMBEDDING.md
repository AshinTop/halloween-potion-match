# Embedding Witch’s Potion Match

## Static deployment

Deploy `index.html`, `style.css`, `app.js`, `engine.js`, `effects.js`, `art.js`, and `icon.svg` together over HTTP(S). The game uses relative ES-module imports and requires no build, server API, package installation, external font, or image CDN. Keep the release query parameters on the stylesheet and module references so cached deployments receive the corresponding visual assets.

```html
<iframe
  src="https://halloween-potion-match.crazy3d.org/#recipe=1"
  title="Witch’s Potion Match"
  width="100%"
  height="654"
  style="display:block;width:100%;height:100%;border:0"
  allow="fullscreen"
  allowfullscreen
  sandbox="allow-scripts allow-same-origin"
></iframe>
```

Place that iframe inside a container with an explicit height. The example uses the live Cloudflare game URL.

## Viewport behavior

The game always uses a viewport-first layout. It does not require `?embed=1`; that compatibility parameter may be present without changing behavior. It reads only its own viewport and never the parent DOM. The document is fixed to the iframe height, and a `ResizeObserver` sizes the square board from the remaining area. Long help and result dialogs may scroll internally.

Targets are the host’s desktop 1160×654 game area, phone 390×650 and 390×794 windows, and 844×340 short landscape. On desktop the recipe and potion shelf flank the board. Portrait phones show a compact ingredient row above it. Short landscape shows goals on the left and tools on the right. Very short portrait frames retain core controls but reduce board-cell size; a taller frame is recommended for comfort. Final browser screenshots and exact production-host acceptance are maintained by the collection owner; these are CSS viewport targets, not physical-phone claims.

When the main site reserves a toolbar within the same mobile viewport, allocate the iframe the remaining height. Do not add a full `100dvh` iframe below an already-visible toolbar or subtract that toolbar twice.

## Controls and permissions

- Tap two adjacent ingredients, or swipe one toward a neighbor. Keyboard arrows focus cells; Enter/Space selects; H hints; Escape clears selection. The iframe needs focus for keyboard input.
- Cascades temporarily pause board input. Restart and recipe selection remain available and cancel the previous animation before opening the new board. Effects use a bounded number of local SVG/CSS elements; reduced-motion preference skips the travelling particles, falling motion, and celebration animation.
- `#recipe=1` through `#recipe=12` selects a starting recipe. Values must be in-range integers. Invalid values safely select recipe one.
- Web Audio is optional, muted initially, and created after user interaction. No autoplay permission is needed.
- The game itself has no fullscreen control. The host can use its own fullscreen button and grant fullscreen permission if appropriate.
- Sharing uses Clipboard when available. If policy denies it, a visible link is provided for manual copying.
- Local storage contains validated best result records and preferences only. Blocked or partitioned storage never prevents play; it may prevent persistence or separate embedded records from direct visits.
- Reloading restarts the selected recipe. An in-progress board is not persisted.
- The game code has no initialization message, `postMessage` protocol, login, analytics, remote game API, or parent-page mutation.

## Logic acceptance

`npm test` executes 24 tests, including deterministic completion of every recipe, stable/no-move board handling, exact Moon Spark and cascade accounting, invalid inputs, saved-profile validation, real gravity trajectories, and cancellation at every animated cascade phase, and recovery from stalled animation timelines. This does not substitute for final browser testing of gestures, dialogs, audio, and the surrounding host CSS.
