import * as readline from "node:readline";
import { AppState, Market, PaperPosition, Trader, TradeEvent } from "./types";

const ESC = "\u001b[";
const RESET = `${ESC}0m`;
const colors = {
  green: `${ESC}38;5;82m`, lime: `${ESC}38;5;190m`, yellow: `${ESC}38;5;220m`, red: `${ESC}38;5;203m`, cyan: `${ESC}38;5;121m`, white: `${ESC}38;5;255m`, gray: `${ESC}38;5;245m`, dim: `${ESC}38;5;239m`, dark: `${ESC}38;5;234m`, bg: `${ESC}48;5;232m`
};

const paint = (text: string, color: string): string => `${color}${text}${RESET}`;
const green = (text: string): string => paint(text, colors.green);
const lime = (text: string): string => paint(text, colors.lime);
const yellow = (text: string): string => paint(text, colors.yellow);
const red = (text: string): string => paint(text, colors.red);
const gray = (text: string): string => paint(text, colors.gray);
const dim = (text: string): string => paint(text, colors.dim);
const white = (text: string): string => paint(text, colors.white);

function stripAnsi(text: string): string { return text.replace(/\u001b\[[0-9;]*m/g, ""); }
function visibleLength(text: string): number { return stripAnsi(text).length; }
function fit(text: string, width: number): string { const raw = stripAnsi(text); return raw.length > width ? `${raw.slice(0, Math.max(0, width - 1))}…` : `${text}${" ".repeat(width - raw.length)}`; }
function line(text: string, width: number): string { return fit(text, width); }
function spark(values: number[], width = 10): string {
  const blocks = "▁▂▃▄▅▆▇█";
  return values.slice(-width).map((value) => blocks[Math.max(0, Math.min(blocks.length - 1, Math.round((value / 100) * (blocks.length - 1))))]).join("");
}
function bar(value: number, width: number, color = colors.green): string {
  const filled = Math.round((Math.max(0, Math.min(100, value)) / 100) * width);
  return paint("█".repeat(filled), color) + dim("░".repeat(Math.max(0, width - filled)));
}
function number(value: number, digits = 1): string { return value.toFixed(digits); }
function money(value: number): string { return `$${Math.round(value).toLocaleString("en-US")}`; }

function box(title: string, width: number, rows: string[], accent = colors.green): string[] {
  const inner = Math.max(8, width - 2);
  const top = `${accent}┌─ ${title} ${"─".repeat(Math.max(0, inner - stripAnsi(title).length - 3))}┐${RESET}`;
  const body = rows.slice(0, 100).map((row) => `│${line(row, inner)}│`);
  const bottom = `${accent}└${"─".repeat(inner)}┘${RESET}`;
  return [top, ...body, bottom];
}

function joinColumns(columns: string[][], widths: number[], gap = 1): string[] {
  const height = Math.max(...columns.map((column) => column.length));
  const output: string[] = [];
  for (let index = 0; index < height; index += 1) {
    output.push(columns.map((column, columnIndex) => line(column[index] ?? "", widths[columnIndex])).join(" ".repeat(gap)));
  }
  return output;
}

function header(width: number, state: AppState): string[] {
  const logo = [
    `${lime("████╗ ██████╗  █████╗ ██████╗ ███████╗")}`,
    `${lime("██╔██╗██╔═══██╗██╔══██╗██╔══██╗██╔════╝")}`,
    `${lime("██║╚████║   ██║███████║██║  ██║█████╗  ")}`,
    `${lime("██║ ╚███║   ██║██╔══██║██║  ██║██╔══╝  ")}`,
    `${lime("██║  ╚██║   ██║██║  ██║██████╔╝███████╗")}`,
    `${lime("╚═╝   ╚═╝   ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝")}`
  ];
  const side = [
    `${gray("ROBINHOOD CHAIN")}  ·  ${gray("MEME MODE")}  ·  ${green("● LIVE")}`,
    `${gray("traders")} ${white("12,480")}   ${gray("positions")} ${white("54,231")}   ${gray("pnl today")} ${green("+18.4%")}`,
    `${gray("new flows")} ${white("632")}     ${gray("top signal")} ${lime("91/100")}   ${gray("win rate")} ${green("68.2%")}`,
    `${green("ENGINE RUNNING")}  ${bar(state.paused ? 22 : 90, 9)}  ${gray("refresh 1.6s · p pause · q quit")}`,
    "",
    `${gray("paper-first trader terminal")}`
  ];
  const logoWidth = Math.min(60, Math.floor(width * 0.56));
  const sideWidth = Math.max(40, width - logoWidth - 3);
  return joinColumns([logo.map((row) => line(row, logoWidth)), side.map((row) => line(row, sideWidth))], [logoWidth, sideWidth], 3);
}

function traderRows(state: AppState, width: number): string[] {
  const rows = [gray("#  TRADER             PNL       WIN  TRADES  FLOW")];
  state.traders.forEach((trader, index) => {
    const selected = index === state.selectedTrader;
    const prefix = selected ? lime("›") : gray(" ");
    const rank = `${index + 1}`.padStart(2, " ");
    const name = trader.handle.padEnd(18, " ");
    const pnl = green(`+${number(trader.pnl7d)}%`.padStart(9, " "));
    const win = `${trader.winRate}%`.padStart(5, " ");
    const trades = `${trader.trades}`.padStart(6, " ");
    rows.push(`${prefix} ${yellow(rank)} ${selected ? white(name) : gray(name)} ${pnl} ${win} ${trades}  ${green(spark(trader.spark, Math.min(8, Math.max(4, Math.floor(width / 18)))))}`);
  });
  return rows;
}

function flowRows(state: AppState): string[] {
  const rows = [gray("TIME     TRADER             ACTION  TICKER     AMOUNT     PNL")];
  state.events.slice(0, 12).forEach((event) => {
    const side = event.side === "BUY" ? green("BUY ") : red("SELL");
    const pnl = event.pnl === undefined ? gray("—") : event.pnl >= 0 ? green(`+${number(event.pnl)}%`) : red(`${number(event.pnl)}%`);
    rows.push(`${gray(event.time)}  ${white(event.trader.padEnd(18, " "))} ${side}  ${lime(event.symbol.padEnd(8, " "))} ${gray(money(event.amount).padStart(9, " "))}  ${pnl}`);
  });
  return rows;
}

function profileRows(state: AppState, width: number): string[] {
  const trader = state.traders[state.selectedTrader];
  const rows = [
    `${lime(trader.handle)} ${green("● FOLLOWING")}`,
    "",
    `${gray("7D PNL")}      ${green(`+${number(trader.pnl7d)}%`)}     ${gray("WIN RATE")}   ${green(`${trader.winRate}%`)}`,
    `${gray("TRADES")}      ${white(`${trader.trades}`)}       ${gray("AVG HOLD")}   ${white(trader.avgHold)}`,
    `${gray("FOLLOWERS")}   ${white(trader.followers.toLocaleString())}   ${gray("STREAK")}     ${yellow(`${trader.streak} wins`)}`,
    "",
    `${gray("PERFORMANCE")} ${green(spark(trader.spark, Math.min(17, Math.max(8, width - 19))))}`,
    "",
    `${yellow("TOP MEMES")}`,
    ...trader.topTokens.map((token) => `  ${lime(token.symbol.padEnd(9, " "))} ${green(`+${number(token.pnl)}%`)}`),
    "",
    `${gray("PROFILE SIGNAL")} ${lime(`${Math.round(trader.winRate + trader.pnl7d / 10)}/100`)}`,
    `${gray("copyability")}  ${bar(Math.min(99, trader.winRate + 18), Math.min(16, Math.max(8, width - 22)))}`
  ];
  return rows;
}

function radarRows(state: AppState): string[] {
  const rows = [gray("TICKER     BUY PRESSURE       SIGNAL   TREND")];
  state.markets.slice(0, 7).forEach((market) => {
    const trend = market.trend === "DOWN" ? red("▼") : market.trend === "UP" ? green("▲") : yellow("•");
    rows.push(`${lime(market.symbol.padEnd(9, " "))} ${bar(market.buyPressure, 14)}  ${yellow(`${market.buyPressure}%`.padStart(4, " "))}   ${green(`${market.signal}`.padStart(3, " "))}/100   ${trend}`);
  });
  rows.push("", `${yellow("TOP FLOW")}  ${green("+$184K")}`, `${gray("smart money pressure")}`);
  return rows;
}

function consensusRows(state: AppState): string[] {
  const market = state.markets[state.selectedMarket];
  const buy = market.buyPressure;
  const sell = 100 - buy;
  return [
    `${lime(market.symbol)}  ${gray("TRADER CONSENSUS")}`,
    "",
    `${green("BUY ")} ${bar(buy, 17)} ${green(`${buy}%`)}`,
    `${red("SELL")} ${bar(sell, 17, colors.red)} ${red(`${sell}%`)}`,
    "",
    `${yellow("17 / 21")} ${gray("TOP TRADERS BULLISH")}`,
    `${gray("FLOW")}       ${green("+$184K")}`,
    `${gray("SIGNAL")}     ${lime(`${market.signal}/100`)}`,
    "",
    `${green("▲ STRONG CONSENSUS")}`
  ];
}

function fomoRows(state: AppState): string[] {
  const market = state.markets[state.selectedMarket];
  const walls = [
    ["EDGE", market.signal],
    ["DEPTH", Math.round((market.buyPressure + market.signal) / 2)],
    ["TURN", Math.max(35, Math.round(market.change1h * 4 + 28))],
    ["MOMO", Math.min(98, Math.round(market.change24h + 36))],
    ["PRICE", Math.max(32, Math.round(market.signal - 4))]
  ];
  const trend = market.gmgnTrend === "ACCUMULATION" ? green("ACCUMULATION") : market.gmgnTrend === "DISTRIBUTION" ? red("DISTRIBUTION") : yellow("NEUTRAL");
  return [
    `${lime("GMGN / FOMO INTEL")}  ${green("● STREAMING")}`,
    `${yellow(market.symbol)} ${gray("selected market")}  ${trend}`,
    `${gray("FOMO SCORE")}   ${lime(`${market.fomoScore}/100")} ${bar(market.fomoScore, 10, colors.lime)}`,
    `${gray("smart wallets")} ${green(`${market.smartWallets} active`)}  ${gray("inflow")} ${green("+$184K")}`,
    `${gray("liquidity")}    ${white(market.liquidity)}  ${gray("holders")} ${white(market.holders)}`,
    "",
      `${yellow("COPY FLOW WALLS")}`,
    ...walls.map((wall) => {
      const name = String(wall[0]);
      const score = Number(wall[1]);

      return `${gray(name.padEnd(7, " "))} ${bar(score, 12)} ${green(String(score).padStart(3, " "))}/100`;
    }),
    "",
    `${gray("GMGN")}${green(" connected")}  ${gray("FOMO")}${green(" live")}`,
  ];
}

function narrativeRows(): string[] {
  return [
    yellow("1  FROG MEMES       ") + green("+312%"),
    yellow("2  AI MEMES         ") + green("+184%"),
    yellow("3  POLITICAL        ") + green("+98%"),
    yellow("4  SOLANA MEMES     ") + green("+76%"),
    yellow("5  ANIMAL MEMES     ") + green("+64%"),
    yellow("6  GAMBLING         ") + green("+52%"),
    yellow("7  CELEBRITY        ") + green("+41%"),
    yellow("8  RWA MEMES        ") + green("+38%")
  ];
}

function paperRows(state: AppState): string[] {
  const rows = [
    `${lime("PAPER COPY")}  ${gray("SPACE TO ARM")}`,
    `${gray("allocation")}   ${white("100 USDT")}   ${gray("risk")}${green(" 10%")}`,
    `${gray("auto entries")} ${green("ON")}         ${gray("auto exits")} ${green("ON")}`,
    `${gray("max slots")}    ${white(`${state.positions.length}/5`)}         ${gray("trail")} ${white("5%")}`,
    "",
    ...state.positions.map((position) => `${lime(position.symbol.padEnd(9, " "))} ${green(`${position.pnl >= 0 ? "+" : ""}${number(position.pnl)}%`)} ${gray(position.state)}`),
    "",
    `${gray("exit stack")} ${yellow("TP 25% · SL 10% · TRAIL")}`
  ];
  return rows;
}

function footer(state: AppState): string[] {
  return [
    `${gray("TRADEFROG v0.2.0")} ${dim("| PAPER TERMINAL | NOT FINANCIAL ADVICE")}`,
    `${gray("↑/↓ trader  ·  m market  ·  space copy  ·  c follow  ·  g GMGN  ·  p pause  ·  q quit")} ${state.paused ? yellow("PAUSED") : green("LIVE")}`
  ];
}

export class TerminalApp {
  private readonly state: AppState;
  private timer: NodeJS.Timeout | undefined;
  private readonly stdout: NodeJS.WriteStream;
  private readonly stdin: NodeJS.ReadStream;

  public constructor(state: AppState, stdout = process.stdout, stdin = process.stdin) {
    this.state = state;
    this.stdout = stdout;
    this.stdin = stdin;
  }

  public start(): void {
    readline.emitKeypressEvents(this.stdin);
    if (this.stdin.isTTY) this.stdin.setRawMode(true);
    this.stdin.on("keypress", (_input, key) => this.handleKey(key));
    this.stdout.on("resize", () => this.render());
    this.stdout.write(`${ESC}?1049h${ESC}?25l`);
    this.render();
    this.timer = setInterval(() => this.tick(), 1600);
  }

  public stop(): void {
    if (this.timer) clearInterval(this.timer);
    if (this.stdin.isTTY) this.stdin.setRawMode(false);
    this.stdout.write(`${ESC}?25h${ESC}?1049l${RESET}`);
    this.stdout.cursorTo?.(0, 0);
  }

  private handleKey(key: readline.Key | undefined): void {
    if (!key) return;
    if (key.ctrl && key.name === "c" || key.name === "q" || key.name === "escape") {
      this.stop();
      process.exit(0);
    }
    if (key.name === "up") this.state.selectedTrader = Math.max(0, this.state.selectedTrader - 1);
    if (key.name === "down") this.state.selectedTrader = Math.min(this.state.traders.length - 1, this.state.selectedTrader + 1);
    if (key.name === "space") this.armPaperCopy();
    if (key.name === "p") this.state.paused = !this.state.paused;
    if (key.name === "r") this.injectEvent("SYNC", "scanner refreshed · provider heartbeat ok");
    if (key.name === "m") {
      this.state.selectedMarket = (this.state.selectedMarket + 1) % this.state.markets.length;
      this.injectEvent("GMGN", `market focus → ${this.state.markets[this.state.selectedMarket].symbol}`);
    }
    if (key.name === "g") this.injectEvent("FOMO", `GMGN snapshot refreshed · ${this.state.markets[this.state.selectedMarket].symbol}`);
    if (key.name === "c") this.injectEvent("COPY", `${this.state.traders[this.state.selectedTrader].handle} added to watchlist`);
    this.render();
  }

  private injectEvent(kind: string, message: string): void {
    const event: TradeEvent = { time: new Date().toISOString().slice(11, 19), trader: kind, side: kind === "SKIP" ? "SELL" : "BUY", symbol: message.slice(0, 10), amount: 0, price: "—" };
    this.state.events.unshift(event);
  }

  private armPaperCopy(): void {
    const trader = this.state.traders[this.state.selectedTrader];
    const market = this.state.markets[this.state.selectedMarket];
    const entry = Number(market.price);
    const alreadyOpen = this.state.positions.some((position) => position.symbol === market.symbol);
    if (alreadyOpen || this.state.positions.length >= 5) return;
    this.state.positions.unshift({ symbol: market.symbol, trader: trader.handle, entry, mark: entry, pnl: 0, bestPnl: 0, ticks: 0, state: "ARMED" });
    this.injectEvent("COPY", `${trader.handle} paper copy → ${market.symbol}`);
  }

  private tick(): void {
    if (this.state.paused) return;
    this.state.tick += 1;
    this.state.markets.forEach((market, index) => {
      const delta = Math.sin((this.state.tick + index) * 0.71) * 0.6;
      market.change1h = Number((market.change1h + delta).toFixed(1));
      market.buyPressure = Math.max(18, Math.min(92, Math.round(market.buyPressure + Math.sin((this.state.tick + index) * 0.4))));
      market.signal = Math.max(28, Math.min(98, Math.round(market.signal + Math.sin((this.state.tick + index) * 0.32))));
    });
    this.state.traders.forEach((trader, index) => {
      trader.pnl7d = Number((trader.pnl7d + Math.sin((this.state.tick + index) * 0.23) * 0.35).toFixed(1));
      trader.spark.push(Math.max(10, Math.min(99, trader.spark.at(-1)! + Math.round(Math.sin(this.state.tick * 0.7 + index) * 4))));
      if (trader.spark.length > 12) trader.spark.shift();
    });
    this.updatePositions();
    this.render();
  }

  private updatePositions(): void {
    const closed: PaperPosition[] = [];
    this.state.positions.forEach((position, index) => {
      position.ticks += 1;
      const move = Math.sin((this.state.tick + index) * 0.73) * 0.9 + 0.4;
      position.pnl = Number((position.pnl + move).toFixed(1));
      position.bestPnl = Math.max(position.bestPnl, position.pnl);
      position.mark = Number((position.entry * (1 + position.pnl / 100)).toFixed(6));
      position.state = "MARKING";
      const trailing = position.bestPnl - position.pnl >= 5 && position.bestPnl > 8;
      const takeProfit = position.pnl >= 25;
      const stopLoss = position.pnl <= -10;
      const maxHold = position.ticks >= 45;
      if (trailing || takeProfit || stopLoss || maxHold) closed.push(position);
    });
    closed.forEach((position) => {
      const reason = position.pnl >= 25 ? "TP" : position.pnl <= -10 ? "SL" : position.ticks >= 45 ? "MAX-HOLD" : "TRAIL";
      position.state = "CLOSED";
      this.injectEvent("EXIT", `${position.symbol} ${reason} auto-close ${position.pnl >= 0 ? "+" : ""}${number(position.pnl)}%`);
    });
    if (closed.length > 0) this.state.positions = this.state.positions.filter((position) => !closed.includes(position));
  }

  private render(): void {
    const width = Math.max(92, this.stdout.columns || 140);
    const height = Math.max(28, this.stdout.rows || 42);
    const mainWidth = Math.min(width, 180);
    const left = Math.floor((mainWidth - 2) * 0.34);
    const center = Math.floor((mainWidth - 2) * 0.36);
    const right = mainWidth - 2 - left - center - 2;
    const top = header(mainWidth, this.state);
    const topPanels = joinColumns([
      box("TOP ROBINHOOD TRADERS  /  7D PNL", left, traderRows(this.state, left), colors.lime),
      box("LIVE TRADER FLOW  /  ALL", center, flowRows(this.state), colors.green),
      box("TRADER PROFILE  /  SELECTED", right, profileRows(this.state, right), colors.cyan)
    ], [left, center, right], 2);
    const lowerHeight = Math.max(12, Math.floor((height - top.length - 4) / 2));
    const bottomPanels = joinColumns([
      box("SMART MONEY RADAR", left, radarRows(this.state), colors.lime),
      box("TRADER CONSENSUS", center, consensusRows(this.state), colors.green),
      box("GMGN / FOMO INTEL", Math.floor(right * 0.48), fomoRows(this.state), colors.yellow),
      box("PAPER COPY / AUTO EXITS", right - Math.floor(right * 0.48) - 2, paperRows(this.state), colors.cyan)
    ], [left, center, Math.floor(right * 0.48), right - Math.floor(right * 0.48) - 2], 2);
    const content = [...top, "", ...topPanels, "", ...bottomPanels, "", ...footer(this.state)];
    const visible = content.slice(0, height);
    this.stdout.write(`${ESC}2J${ESC}H`);
    this.stdout.write(visible.join("\n"));
    this.stdout.write("\n");
  }
}
