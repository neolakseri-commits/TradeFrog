import { AppState, Market, TradeEvent, Trader } from "./types";

export const traders: Trader[] = [
  { handle: "@frogwhale", pnl7d: 487.3, winRate: 72, trades: 184, avgHold: "4h 32m", followers: 2841, streak: 12, spark: [18, 24, 22, 31, 40, 44, 52, 64, 73], topTokens: [{ symbol: "$FROG", pnl: 312.4 }, { symbol: "$PEPE", pnl: 198.7 }, { symbol: "$WIF", pnl: 143.9 }] },
  { handle: "@memeprophet", pnl7d: 412.1, winRate: 68, trades: 132, avgHold: "2h 18m", followers: 1994, streak: 8, spark: [12, 20, 27, 25, 38, 49, 46, 57, 69], topTokens: [{ symbol: "$DOGE", pnl: 244.6 }, { symbol: "$GME", pnl: 166.2 }, { symbol: "$PEPE", pnl: 131.5 }] },
  { handle: "@robinhoodgod", pnl7d: 398.4, winRate: 71, trades: 96, avgHold: "6h 05m", followers: 1680, streak: 11, spark: [20, 16, 28, 35, 34, 42, 53, 58, 66], topTokens: [{ symbol: "$AMC", pnl: 219.8 }, { symbol: "$GME", pnl: 176.5 }, { symbol: "$BONK", pnl: 103.1 }] },
  { handle: "@diamondhands", pnl7d: 321.7, winRate: 65, trades: 228, avgHold: "8h 41m", followers: 1042, streak: 6, spark: [24, 23, 19, 29, 35, 33, 42, 45, 58], topTokens: [{ symbol: "$PEPE", pnl: 181.2 }, { symbol: "$SHIB", pnl: 143.1 }, { symbol: "$FLOKI", pnl: 121.4 }] },
  { handle: "@stonktrader", pnl7d: 298.6, winRate: 69, trades: 156, avgHold: "3h 12m", followers: 920, streak: 5, spark: [10, 18, 21, 19, 32, 38, 40, 49, 55], topTokens: [{ symbol: "$FROG", pnl: 198.2 }, { symbol: "$MOG", pnl: 112.8 }, { symbol: "$POPCAT", pnl: 94.8 }] },
  { handle: "@tendiemaster", pnl7d: 276.4, winRate: 64, trades: 189, avgHold: "1h 48m", followers: 744, streak: 4, spark: [14, 21, 18, 25, 30, 27, 36, 44, 51], topTokens: [{ symbol: "$DOGE", pnl: 161.7 }, { symbol: "$WIF", pnl: 104.3 }, { symbol: "$PEPE", pnl: 86.5 }] }
];

export const markets: Market[] = [
  { symbol: "$FROG", price: "0.0042", change1h: 12.4, change24h: 86.7, volume: "12.4M", liquidity: "$1.24M", holders: "12.4k", smartWallets: 17, fomoScore: 91, gmgnTrend: "ACCUMULATION", buyPressure: 78, signal: 91, trend: "UP" },
  { symbol: "$PEPE", price: "0.0018", change1h: 8.1, change24h: 32.6, volume: "8.7M", liquidity: "$890k", holders: "31.8k", smartWallets: 12, fomoScore: 83, gmgnTrend: "ACCUMULATION", buyPressure: 71, signal: 83, trend: "UP" },
  { symbol: "$WIF", price: "0.415", change1h: 3.9, change24h: 24.1, volume: "14.2M", liquidity: "$2.10M", holders: "48.2k", smartWallets: 9, fomoScore: 76, gmgnTrend: "NEUTRAL", buyPressure: 66, signal: 76, trend: "UP" },
  { symbol: "$MOG", price: "0.0061", change1h: -2.4, change24h: 19.3, volume: "6.1M", liquidity: "$640k", holders: "8.7k", smartWallets: 6, fomoScore: 54, gmgnTrend: "DISTRIBUTION", buyPressure: 44, signal: 54, trend: "DOWN" },
  { symbol: "$POPCAT", price: "0.312", change1h: 4.9, change24h: 24.1, volume: "7.8M", liquidity: "$1.01M", holders: "18.4k", smartWallets: 11, fomoScore: 74, gmgnTrend: "ACCUMULATION", buyPressure: 69, signal: 74, trend: "UP" },
  { symbol: "$NEIRO", price: "0.0281", change1h: 9.2, change24h: 41.7, volume: "5.4M", liquidity: "$470k", holders: "6.2k", smartWallets: 21, fomoScore: 88, gmgnTrend: "ACCUMULATION", buyPressure: 82, signal: 88, trend: "UP" },
  { symbol: "$BONK", price: "0.0021", change1h: 3.1, change24h: 18.2, volume: "4.9M", liquidity: "$780k", holders: "22.1k", smartWallets: 8, fomoScore: 67, gmgnTrend: "NEUTRAL", buyPressure: 61, signal: 67, trend: "UP" },
  { symbol: "$DOGE", price: "0.182", change1h: 1.7, change24h: 12.8, volume: "28.1M", liquidity: "$4.90M", holders: "102k", smartWallets: 5, fomoScore: 62, gmgnTrend: "NEUTRAL", buyPressure: 58, signal: 62, trend: "FLAT" }
];

export const eventSeed: TradeEvent[] = [
  { time: "10:24:01", trader: "@frogwhale", side: "BUY", symbol: "$FROG", amount: 12450, price: "0.0042" },
  { time: "10:23:58", trader: "@memeprophet", side: "SELL", symbol: "$PEPE", amount: 8220, price: "0.0018", pnl: 18.4 },
  { time: "10:23:55", trader: "@robinhoodgod", side: "BUY", symbol: "$MOG", amount: 15330, price: "0.0061" },
  { time: "10:23:54", trader: "@tendiemaster", side: "BUY", symbol: "$WIF", amount: 7820, price: "0.415" },
  { time: "10:23:52", trader: "@chartchimp", side: "SELL", symbol: "$BONK", amount: 9440, price: "0.0021", pnl: 12.6 },
  { time: "10:23:49", trader: "@retailwhale", side: "BUY", symbol: "$FROG", amount: 22110, price: "0.0040" },
  { time: "10:23:47", trader: "@diamondhands", side: "BUY", symbol: "$PEPE", amount: 18900, price: "0.0018" },
  { time: "10:23:44", trader: "@memeprophet", side: "SELL", symbol: "$DOGE", amount: 31220, price: "0.182", pnl: 24.1 },
  { time: "10:23:41", trader: "@notyourfa", side: "BUY", symbol: "$POPCAT", amount: 6210, price: "0.312" },
  { time: "10:23:38", trader: "@greenportfolio", side: "SELL", symbol: "$FROG", amount: 13200, price: "0.0044", pnl: 8.1 },
  { time: "10:23:35", trader: "@moonmonkey", side: "BUY", symbol: "$KAMA", amount: 5880, price: "0.092" },
  { time: "10:23:31", trader: "@wifhunter", side: "SELL", symbol: "$WIF", amount: 7150, price: "0.422", pnl: 11.4 }
];

export function createInitialState(): AppState {
  return {
    paused: false,
    selectedTrader: 0,
    selectedMarket: 0,
    tick: 0,
    events: [...eventSeed],
    traders: traders.map((trader) => ({ ...trader, spark: [...trader.spark], topTokens: [...trader.topTokens] })),
    markets: markets.map((market) => ({ ...market })),
    positions: [
      { symbol: "$FROG", trader: "@frogwhale", entry: 0.0039, mark: 0.0042, pnl: 7.7, bestPnl: 7.7, ticks: 8, state: "MARKING" },
      { symbol: "$NEIRO", trader: "@robinhoodgod", entry: 0.0264, mark: 0.0281, pnl: 6.4, bestPnl: 6.4, ticks: 4, state: "MARKING" }
    ]
  };
}
