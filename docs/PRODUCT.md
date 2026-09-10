# TRADEFROG product map

TRADEFROG is a paper-first terminal for traders watching Robinhood Chain market flow. The first version is deliberately browser-only and dependency-free so the visual system can be shipped quickly and the data layer can be replaced later.

## Core loop

1. Fresh launches appear on the radar.
2. A rotating set of hunter wallets is placed underneath the new launches.
3. Every candidate is scored through `EDGE / DEPTH / TURN / MOMO / PRICE`.
4. A weak setup becomes `SKIP` with a precise reason.
5. A clean setup becomes `TONGUE`.
6. Press `SPACE` to arm a paper sniper for the selected `TONGUE`.
7. Positions keep marking on the same screen.
8. TP, SL, trailing and max-hold are the planned automatic exit layer.
9. PnL, token moves and new swipes stay visible in one stream.

## Data seam

`app.js` currently uses local demo state. To connect a provider later, keep the UI contract and replace the mock stream with an adapter that returns:

```js
{
  id, symbol, name, source, age, price, liq, change,
  score, decision, reasonTitle, reason, walls, wallState
}
```

The UI intentionally has no private keys, wallet connection, or live order executor.
