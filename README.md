# Gojjo Cinema — Movie Recommender (Frontend)

A lightweight Next.js frontend that uses local mock data for all API responses. This repo was adapted to run without any backend server: network calls were replaced with a mock API shim so the application is deterministic and deployment-ready on Vercel.

## Highlights

- Next.js (app/ directory)
- Mock-data-first: fully client-side movie data via `lib/mock-data.ts` and the mock `lib/api.ts` shim
- Local-only user state (favorites, watchlist, ratings) persisted to `localStorage`
- Playwright E2E tests updated to use local mocks/localStorage
- Service Worker is present under `public/sw.js` (used for offline fallback). See troubleshooting below.

## Quick start (Windows / PowerShell)

1. Install dependencies

```powershell
# from project root
pnpm install
```

2. Run dev server on default port (3000)

```powershell
pnpm dev
```

3. Run dev server on a custom port (example: 3001)

```powershell
$env:PORT = '3001'
pnpm dev
```

4. Open the app in your browser at http://localhost:3000 (or the port you set).

Notes:

- The app intentionally does not require a backend. No `NEXT_PUBLIC_API_URL` or auth backend is needed for core UI flows.
- If you previously used this project with a running backend, there might be a registered Service Worker in your browser that serves cached pages — see troubleshooting.

## How mock mode works

- `lib/mock-data.ts` contains movie datasets (sourced from the repository JSON files) and simple lookup helpers.
- `lib/api.ts` preserves the original API function names (e.g., `fetchTrendingMovies`, `fetchMovieDetails`, `loginApi`, `postCommentApi`) but returns mock data or localStorage-backed results.
- Components and pages import `lib/api.ts` as before — the surface is the same, but no network calls are performed.
- User data (favorites, ratings, watchlist) is stored in `localStorage` via `lib/storage.ts` and managed in `hooks/use-user-data.ts`.

## Tests

Playwright tests are configured in `playwright.config.ts`. They currently run against the frontend in mock mode and use localStorage to simulate an authenticated user.

To run tests:

```powershell
pnpm playwright test
```

(Install Playwright browsers first if needed: `pnpm playwright install`)

## Vercel Deployment

This project is ready for deployment to Vercel:

- Uses Next.js app router.
- `next.config.mjs` is configured with image domains used by the UI.
- No backend environment variables are required for the app to render and function in mock mode.

To deploy:

1. Push your `main` branch to a GitHub repository.
2. Create a new project on Vercel and point it at the repository.
3. Vercel will run the build automatically (`pnpm install && pnpm build`).

Optional: If you want to host the service worker behavior differently in production, adjust `public/sw.js` or conditionally register the SW only when `process.env.NODE_ENV === 'production'`.

## Troubleshooting

Common issues and how to fix them.

- Blank or stale page after switching ports (e.g. `localhost:3001`)

  - Likely cause: a Service Worker installed for this app is serving a cached document from a different origin/port.
  - Quick fixes:
    1. Open DevTools → Application → Service Workers, find the SW for this site, and click Unregister.
    2. Clear Site Data (Application → Clear storage → Clear site data).
    3. Test in an Incognito/Private window where the SW is not registered.
  - Code fix: prefer registering the SW only in production builds. See `public/sw.js` and your SW registration logic in the project.

- TypeScript or build errors after editing files

  - Run a local build to see errors: `pnpm build`
  - Install missing types if needed: `pnpm add -D @types/react @types/node`

- Playwright tests failing because of old traces
  - Remove the `test-results` folder or clear traces before re-running tests.

## Project structure (important files)

- `app/` — Next.js app pages and layout
- `components/` — UI components
- `lib/` — `mock-data.ts`, `api.ts` (mock shim), `storage.ts`, `types.ts`, `utils.ts`
- `public/sw.js` — service worker (offline fallback)
- `tests/` — Playwright tests

## Next steps / improvements

- Optionally gate Service Worker registration to production only.
- Add a small script to automatically unregister the SW during development.
- Add a `README` section listing the mock datasets and how to extend them.

---

If you want, I can:

- Unregister the service worker automatically in development by patching the SW registration code.
- Run a `pnpm build` and `pnpm dev` inside this workspace to validate there are no build issues.
- Add a short CONTRIBUTING.md describing how to add or update mock datasets.
