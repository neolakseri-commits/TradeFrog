# TRADEFROG

> Catch the move. Skip the noise.

TRADEFROG is a stylish, paper-first trader radar for Robinhood Chain. Fresh launches float onto the radar, hunter wallets rotate underneath them, and every candidate passes through five visible walls before it can become a `TONGUE`.

![TRADEFROG banner](assets/tradefrog-banner.png)

## What is inside

- Fresh launch radar with `ALL / TONGUE / SKIP` filters.
- Rotating hunter-wallet desk with PnL and mini-flow graphs.
- Decision inspector: `EDGE / DEPTH / TURN / MOMO / PRICE`.
- Exact refusal reason for every `SKIP`.
- `SPACE` shortcut for opening a paper sniper.
- Live-style paper positions, mark updates and event stream.
- GitHub Pages deployment workflow.
- Zero dependencies: open `index.html` or serve the folder with any static server.

This is a front-end demo and paper-trading shell. It does not connect a wallet or place live orders.

## Run locally

PowerShell:

```powershell
cd TRADEFROG
py -m http.server 4173
```

Then open <http://localhost:4173>.

If Python is not installed, use any static server. For example:

```powershell
npx serve .
```

## Keyboard controls

| Key | Action |
| --- | --- |
| `SPACE` | Arm a paper sniper for the selected `TONGUE` |
| `F` | Cycle `ALL → TONGUE → SKIP` |
| `P` | Pause / resume the scanner |
| `R` | Refresh the radar |
| `↑ / ↓` | Use browser focus to move through the radar |

## Publish to GitHub

Create an empty repository named `tradefrog` on GitHub, then run:

```powershell
cd TRADEFROG
git init
git add index.html styles.css app.js README.md docs assets .github .gitignore LICENSE
git commit -m "build: launch TRADEFROG paper radar"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tradefrog.git
git push -u origin main
```

Then in GitHub open `Settings → Pages`, set **Source** to **GitHub Actions**. Every push to `main` will publish the static site.

## What to upload

Upload these files and folders:

```text
index.html
styles.css
app.js
README.md
LICENSE
.gitignore
.github/workflows/pages.yml
docs/PRODUCT.md
assets/tradefrog-banner.png
assets/favicon.svg
```

Do not upload:

```text
node_modules/
.env
*.log
dist/
build/
```

## Next integration seam

The demo data lives at the top of `app.js`. Replace that local state with a Robinhood Chain provider adapter later, keeping the same token object shape described in [`docs/PRODUCT.md`](docs/PRODUCT.md). Keep order execution behind a server-side boundary and leave paper mode as the default.

## License

MIT. See [`LICENSE`](LICENSE).
