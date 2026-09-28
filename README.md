# Muse Desktop + fedpromptly Portfolio

This is the single merged project. It contains:

- `src/` — the Electron desktop wrapper for Muse.
- `landing/` — the Muse marketing and download site.
- `landing/portfolio/` — the fedpromptly portfolio pages, now part of the same project and deployment.

## Web routes

- `/` — Muse landing page
- `/download` — Muse download page
- `/security` — Muse security page
- `/portfolio` — fedpromptly portfolio homepage
- `/portfolio/support` — portfolio support page
- `/portfolio/404` — portfolio route error page

## Development

```bash
npm ci
npm run typecheck
npm run lint
npm run test
npm run dev
```

To preview the complete static site locally:

```bash
npm run preview:site
```

The desktop app remains an honest Electron wrapper around the Muse web app. The portfolio is a static site inside the same repository and deployment; it is no longer a separate project.
