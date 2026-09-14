# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev            # Vite dev server
npm run build          # tsc -b (project references, strict) then vite build
npm run lint           # eslint .
npm test               # vitest run (single pass)
npm run test:watch     # vitest in watch mode
npm run test:coverage  # vitest run --coverage (v8)
npm test -- src/utils/DateUtils.test.ts   # single file
npm test -- -t "returns null for an empty list"   # single test by name
npm run preview        # serve the production build
```

Deployed on Vercel; `vercel.json` rewrites all paths to `/index.html` for client-side routing.

## Product

Small Talk Football helps casual fans join football conversations. Features: match fixtures/details, AI-generated **one-liners** per match (varying by team side and language), **cheat cards** (reference "small info" cards by category), community **articles** with an admin approve/remove workflow, and auth with `MEMBER` / `ADMIN` roles. Content language is one of `BRITISH | AMERICAN | HEBREW`.

This is a frontend only — all data comes from a separate backend at `VITE_API_BASE_URL` (`.env.development` / `.env.production`). `VITE_GA_TRACKING_ID` enables GA4 (production only); when unset, analytics is a no-op.

## Architecture

Entry chain: `main.tsx` (Redux `Provider` + GA init) → `App.tsx` (`RouterProvider`) → `routes/AppRoutes.tsx` (`createBrowserRouter`) → `pages/RootLayout.tsx` (background, `Header`, `<Outlet/>`, `MobileNavbar`, `GlobalSpinner` driven by `useNavigation()`, `<Analytics/>` pageview tracker).

### API layer (`src/utils/api/`)
- **Every** HTTP call lives in `http.ts`. Public endpoints use plain `axios`; authenticated ones use `jwtAxios`, whose request interceptor reads `localStorage["user"]` and sets `Authorization: Bearer <jwt>`.
- All backend payloads are wrapped in `SmallTalkResponse<T>` (`src/models/small-talk-response.ts`): `{ data, statusCode, systemMessage?: { messageText, isError }, jwt? }`. Error text lives in `systemMessage`, not in the HTTP status alone — check `systemMessage.isError`.
- Request payload interfaces go in `api-inputs.ts`.

### Two data-fetching paths
1. **Route-level**: a loader in `src/routes/loaders/` wraps the `http.ts` call in `handleLoaderApiCall(apiCall, errorMessage, fallbackData)` (from `api-utils.ts`), then `throw new Response(error, {status})` so the route's `errorElement: <ErrorPage/>` renders. Loaders export their own `*LoaderOutput` type. `extractIdFromUrl(request)` pulls the trailing path segment.
2. **Component-level**: `useApi<T, P>(fetchMethod, initialData?)` returns `{ fetchedData, setFetchedData, isLoading, error, success, invokeApi }`. `invokeApi` resolves to a boolean success flag and unwraps axios errors into `error`.

### State (`src/store/`)
Redux Toolkit holds only cross-cutting state: `auth` (`user-slice`) and `lang` (`lang-slice`). Components must use the typed hooks `useAuthStore()` and `useLangStore()` exported from `store.ts` — do not call `useSelector`/`useDispatch` directly. The user slice hydrates from and writes through to `localStorage["user"]` on login/logout, which is the same key `jwtAxios` reads.

### Testing
Vitest drives the suite and reuses `vite.config.ts`, so `import.meta.env` (read by `http.ts`) resolves in tests the same way it does in the app. The `test` block lives in `vite.config.ts`: `jsdom` environment, `globals: true`, with `src/test/setup.ts` as the setup file.

- Tests sit beside their subject as `*.test.ts` / `*.test.tsx`.
- `src/test/setup.ts` wires `@testing-library/jest-dom`, stubs `matchMedia`/`ResizeObserver` for `motion`, and clears `localStorage` after each test.
- `src/test/utils.tsx` exports `renderWithProviders(ui, { preloadedState, store, route })`, which wraps the tree in a Redux `Provider` (same reducer map as `store.ts`) and a `MemoryRouter` — needed because `useAuthStore`/`useLangStore` call `useSelector` underneath. It also exports `makeUser()` and `makeTestStore()`.
- To drive auth state in a component test, dispatch `login(...)` on the store returned by `renderWithProviders` rather than mocking the hooks.
- `vi.mock` is hoisted above the file body, so mock factories must be self-contained — they cannot reference local helpers.
- Coverage is measured against **every** file matching `coverage.include` in `vite.config.ts`, not just the ones a test imports. Without that setting the number counts only exercised files and badly overstates completeness.
- Don't build global stubs in `src/test/setup.ts` out of `vi.fn()` — a test calling `vi.resetAllMocks()` strips the implementation. The `matchMedia` stub is a plain function for this reason.

Known-bug regression guards live in the suite and assert current, wrong behaviour; they are cross-referenced by number to `bugs.md` and must be inverted when a bug is fixed.

### Components
- `components/features/<domain>/` for domain components; each feature keeps its own `models/` subfolder for types scoped to it (e.g. `features/matches/models/MatchModel.ts`).
- `components/ui/` for domain-agnostic primitives, one folder per component.
- Use `ProtectedButton` (not `Button`) for actions requiring auth — it opens the login modal, then replays the pending click once the user is authenticated.

### Routing
All routes are declared in `AppRoutes.tsx`; `/` redirects to `/home`. Adding a data-backed route means: page component in `pages/`, loader in `routes/loaders/`, and a route entry with `loader` + `errorElement`.

## Coding Standards

- Use latest versions of libraries and idiomatic approaches as of today.
- Keep it simple - NEVER over-engineer, ALWAYS simplify, NO unnecessary defensive programming. No extra features - focus on simplicity.

## Notes

- The `.kiro/` directory holds Kiro steering docs (`.kiro/steering/`) that overlap with this file, plus feature specs under `.kiro/specs/`. Keep them in sync if you change architecture conventions.
- `README.md` is the unmodified Vite template README and carries no project-specific information.
