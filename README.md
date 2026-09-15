# Faisad & Afshan Wedding Invitation

An original, responsive React/Vite wedding invitation for the blessed Nikah of Faisad Mohammed Ali and Sayeda Afshan Peerzade.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Configure before launch

Wedding-specific details live in `src/config/wedding.js`. Add the WhatsApp number, Google Maps URLs, and optional music URL there. The application intentionally shows a gentle fallback when those optional links are blank rather than inventing a destination.

## Production build and Vercel

```bash
npm run build
```

Deploy the project to Vercel with framework preset **Vite**. The build command is `npm run build` and the output directory is `dist`.

The current design is intentionally typographic and asset-light. A social sharing image, favicon, and optional audio track can be added later through the `socialImage` and `musicUrl` configuration values and the public assets directory.