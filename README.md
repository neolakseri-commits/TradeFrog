# TRADEFROG

> A real TypeScript command-line trader terminal for Robinhood Chain.

![TRADEFROG terminal banner](assets/tradefrog-banner.png)

TRADEFROG is a paper-first market-flow terminal designed for traders who want one dense, beautiful screen:

- Live Trader Flow — BUY/SELL events with trader, token, amount and PnL.
- Smart Money Radar — buy pressure, signal score, trend and top flow.
- Top Traders Leaderboard — 7D PnL, win rate, trade count and sparklines.
- Trader Profile — performance, streak, average hold and top memes.
- Trader Consensus — BUY/SELL pressure, flow and signal strength.
- GMGN / FOMO Intel — FOMO score, smart-wallet inflow, liquidity, holders and `EDGE / DEPTH / TURN / MOMO / PRICE` flow walls.
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
M         cycle selected market
G         refresh GMGN / FOMO snapshot
P         pause / resume stream
R         refresh provider heartbeat
Q / ESC   quit
```

## Terminal panels

| Panel | What it shows |
| --- | --- |
| `TOP ROBINHOOD TRADERS` | 7D PnL, win rate, trades, streak flow and selected trader |
| `LIVE TRADER FLOW` | BUY/SELL tape with trader, ticker, amount and PnL |
| `TRADER PROFILE` | performance sparkline, average hold, followers and top memes |
| `SMART MONEY RADAR` | buy pressure, signal score, trend and top flow |
| `TRADER CONSENSUS` | BUY/SELL split, flow value and consensus signal |
| `GMGN / FOMO INTEL` | FOMO score, smart wallets, liquidity, holders and five flow walls |
| `PAPER COPY / AUTO EXITS` | active paper positions and TP/SL/trailing/max-hold state |

## Commands

| Command | Purpose |
| --- | --- |
| `npm install` | install the TypeScript toolchain |
| `npm run dev` | launch the live demo terminal in TypeScript mode |
| `npm run showcase` | launch the same screen for recording or screenshots |
| `npm run check` | run strict TypeScript validation |
| `npm run build` | compile `src/` into `dist/` |
| `npm start` | run the compiled terminal |
| `npm link` | expose the compiled `tradefrog` command locally |

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

## Publish

```powershell
git init
git add .
git commit -m "build: launch TRADEFROG TypeScript terminal"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tradefrog.git
git push -u origin main
```

The included GitHub Action runs `npm install`, `npm run check` and `npm run build` on every push.

## Disclaimer

TRADEFROG is an educational paper-trading terminal, not financial advice. The demo does not promise profit and does not execute real trades.
