export type TradeSide = "BUY" | "SELL";
export type Decision = "TONGUE" | "SKIP";

export interface Trader {
  handle: string;
  pnl7d: number;
  winRate: number;
  trades: number;
  avgHold: string;
  followers: number;
  streak: number;
  spark: number[];
  topTokens: Array<{ symbol: string; pnl: number }>;
}

export interface TradeEvent {
  time: string;
  trader: string;
  side: TradeSide;
  symbol: string;
  amount: number;
  price: string;
  pnl?: number;
}

export interface Market {
  symbol: string;
  price: string;
  change1h: number;
  change24h: number;
  volume: string;
  buyPressure: number;
  signal: number;
  trend: "UP" | "DOWN" | "FLAT";
}

export interface PaperPosition {
  symbol: string;
  trader: string;
  entry: number;
  mark: number;
  pnl: number;
  bestPnl: number;
  ticks: number;
  state: "MARKING" | "ARMED" | "CLOSED";
}

export interface AppState {
  paused: boolean;
  selectedTrader: number;
  selectedMarket: number;
  tick: number;
  events: TradeEvent[];
  traders: Trader[];
  markets: Market[];
  positions: PaperPosition[];
}
