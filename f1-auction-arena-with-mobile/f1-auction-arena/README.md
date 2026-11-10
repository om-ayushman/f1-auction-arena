# F1 Auction Arena

This Vite + React project contains two separate editions:

- PC / desktop: `index.html` → `src/App.tsx`
- Mobile: `mobile/index.html` → `src/MobileApp.tsx`

## Run locally

```bash
npm install
npm run dev
```

Vite will print the local development address. Open `/` for the PC edition and `/mobile/` for the mobile edition.

## Build and deploy to GitHub Pages

The repository is configured for the GitHub Pages project URL `/f1-auction-arena/`.

```bash
npm run deploy
```

After deployment:

- PC: `https://ayushman.github.io/f1-auction-arena/`
- Mobile: `https://ayushman.github.io/f1-auction-arena/mobile/`

If the GitHub repository name changes, update the `base` value in `vite.config.ts` to match it.
