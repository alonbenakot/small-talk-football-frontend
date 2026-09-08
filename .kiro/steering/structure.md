# Project Structure

```
src/
├── main.tsx                  # App entry point; mounts Redux Provider + App
├── App.tsx                   # Renders RouterProvider
├── index.css                 # Global styles
├── vite-env.d.ts
│
├── pages/                    # Route-level page components
│   ├── RootLayout.tsx        # Shell: Header, Outlet, MobileNavbar
│   └── *.tsx                 # One file per route (Home, Matches, Articles, etc.)
│
├── routes/
│   ├── AppRoutes.tsx         # createBrowserRouter config; all route definitions
│   └── loaders/              # React Router data loaders (one per route that needs data)
│
├── components/
│   ├── features/             # Domain-specific components, grouped by feature
│   │   ├── articles/
│   │   ├── auth/
│   │   ├── cheat-cards/
│   │   ├── language/
│   │   └── matches/
│   └── ui/                   # Reusable, domain-agnostic UI primitives
│       ├── button/
│       ├── modals/
│       ├── spinner/
│       └── ...
│
├── store/                    # Redux Toolkit slices and typed hooks
│   ├── store.ts              # configureStore; exports useAuthStore, useLangStore
│   ├── user-slice.ts         # Auth state; persists user to localStorage
│   └── lang-slice.ts         # Selected language (BRITISH | AMERICAN | HEBREW)
│
├── models/                   # Shared response/domain types
│   └── small-talk-response.ts  # SmallTalkResponse<T> wrapper used by all API calls
│
└── utils/
    ├── api/
    │   ├── http.ts           # All API functions (plain axios + jwtAxios)
    │   ├── jwtAxios.ts       # Axios instance that injects JWT from localStorage
    │   ├── api-inputs.ts     # Request payload interfaces
    │   └── api-utils.ts      # Loader helper (handleLoaderApiCall)
    ├── hooks/
    │   ├── use-api.ts        # Generic data-fetching hook (useApi<T, P>)
    │   └── outside-click.tsx # Click-outside detection hook
    └── FormatUtil.ts
```

## Conventions

### Feature Components
Each feature folder under `components/features/` contains its own `models/` subfolder for domain types scoped to that feature.

### API Layer
- All HTTP calls live in `src/utils/api/http.ts`
- Use plain `axios` for public endpoints, `jwtAxios` for authenticated ones
- All responses are typed as `SmallTalkResponse<T>`
- Route loaders use `handleLoaderApiCall` from `api-utils.ts` for consistent error handling

### State Management
- Redux is used only for cross-cutting global state: auth (`user-slice`) and language (`lang-slice`)
- Access store state via the typed custom hooks exported from `store.ts` (`useAuthStore`, `useLangStore`) — never call `useSelector`/`useDispatch` directly in components
- User session is persisted to `localStorage`; JWT is read from there by `jwtAxios`

### Component Data Fetching
- Use the `useApi<T, P>` hook for component-level data fetching
- Use React Router loaders for route-level data that should be available before render

### Protected Actions
- Use `ProtectedButton` instead of `Button` when an action requires authentication; it automatically prompts login if the user is not authenticated

### Routing
- All routes are defined in `AppRoutes.tsx`
- Each route that needs data has a corresponding loader in `src/routes/loaders/`
- The default route (`/`) redirects to `/matches`
