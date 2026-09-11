#!/usr/bin/env node
import { createInitialState } from "./data";
import { TerminalApp } from "./terminal";

const state = createInitialState();
const app = new TerminalApp(state);

process.on("SIGINT", () => app.stop());
process.on("exit", () => app.stop());
app.start();
