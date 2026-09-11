# TRADEFROG

> A real TypeScript command-line trader terminal for Robinhood Chain.

![TRADEFROG terminal banner](assets/tradefrog-banner.png)

TRADEFROG is a paper-first market-flow terminal designed for traders who want one dense, beautiful screen:

- Live Trader Flow — BUY/SELL events with trader, token, amount and PnL.
- Smart Money Radar — buy pressure, signal score, trend and top flow.
- Top Traders Leaderboard — 7D PnL, win rate, trade count and sparklines.
- Trader Profile — performance, streak, average hold and top memes.
- Trader Consensus — BUY/SELL pressure, flow and signal strength.
- Paper Copy — `SPACE` arms a paper position with automatic TP / SL / trailing / max-hold exits.
- Full-screen ANSI TUI, written in TypeScript. No HTML application is required to run it.

The current provider is a deterministic demo stream so the terminal works immediately. No wallet is connected and no live order is sent.

## Run

Node.js 20+ is required.

```powershell
npm install
npm run dev
```

For a social-media-friendly demo loop:

```powershell
npm run showcase
```

Build and run the compiled TypeScript:

```powershell
npm run check
npm run build
npm start
```

Install it as a local command:

```powershell
npm run build
npm link
tradefrog
```

## Controls

```text
↑ / ↓     select trader
SPACE     copy selected trader into paper mode
C         follow selected trader
P         pause / resume stream
R         refresh provider heartbeat
Q / ESC   quit
```

## Repository layout

```text
src/
├── data.ts       demo traders, markets and live-flow seed
├── types.ts      domain types for traders, markets and positions
├── terminal.ts   ANSI renderer, panels, keyboard controls and paper exits
└── index.ts      CLI entrypoint
package.json      scripts and TypeScript toolchain
tsconfig.json     strict TypeScript build configuration
.github/workflows/ci.yml
assets/tradefrog-banner.png
```

## Paper exit engine

The terminal keeps paper positions moving on every tick. It closes a position when one of these conditions is met:

- `TP` — PnL reaches +25%.
- `SL` — PnL reaches -10%.
- `TRAIL` — PnL pulls back 5 points from a profitable high-water mark.
- `MAX-HOLD` — the position reaches the max simulated hold window.

Every close is printed back into the live flow as an `EXIT` event.

## Real provider seam

Replace the demo arrays in `src/data.ts` with a provider adapter that returns the same `Trader`, `TradeEvent`, `Market` and `PaperPosition` shapes. Keep order execution behind a server-side boundary and keep paper mode as the default.

## GitHub upload

Upload:

```text
src/
package.json
tsconfig.json
README.md
LICENSE
.gitignore
.github/workflows/ci.yml
assets/tradefrog-banner.png
assets/favicon.svg
docs/PRODUCT.md
```

Do not upload:

```text
node_modules/
dist/
outputs/
work/
.env
*.log
```

## Disclaimer

TRADEFROG is an educational paper-trading terminal, not financial advice. The demo does not promise profit and does not execute real trades.
