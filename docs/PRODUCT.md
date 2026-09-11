# TRADEFROG product map

## Product loop

1. A trader flow event lands in the live stream.
2. The market is scored by buy pressure, signal strength and trend.
3. Smart-money traders rotate through the leaderboard and selected profile.
4. Consensus shows whether the tracked traders agree.
5. GMGN / FOMO Intel adds a FOMO score, smart-wallet inflow, liquidity, holders and five visible flow walls.
6. `SPACE` opens a paper copy for the selected trader and market.
7. The position is marked on every tick.
8. TP / SL / trailing / max-hold close the paper position automatically.

## TypeScript contracts

The data layer is intentionally small. A real Robinhood Chain adapter should return the types from `src/types.ts`:

```ts
Trader
TradeEvent
Market
PaperPosition
```

The renderer does not know where the data came from. This keeps provider integration separate from terminal UX.

## Safety boundary

The repository ships in demo/paper mode. Do not place private keys in this project or add client-side order signing. A future live executor should run server-side, validate risk limits, and require an explicit user opt-in.

