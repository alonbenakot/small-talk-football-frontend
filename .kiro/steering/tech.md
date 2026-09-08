# Tech Stack

## Core

- **Framework**: React 18 with TypeScript (strict mode)
- **Build Tool**: Vite 6
- **Language**: TypeScript ~5.6, targeting ES2020

## Key Libraries

| Library | Purpose |
|---|---|
| `react-router-dom` v7 | Client-side routing with data loaders |
| `@reduxjs/toolkit` + `react-redux` | Global state management |
| `axios` | HTTP client; `jwtAxios` instance for authenticated requests |
| `react-hook-form` | Form state and validation |
| `tailwindcss` v4 (Vite plugin) | Utility-first styling |
| `motion` (Motion for React) | Animations and transitions |
| `lucide-react` | Icon library |
| `react-flagkit` | Country flag components |
| `react-ga4` | Google Analytics 4 integration |

## Testing

- **Runner**: Jest 29 with `ts-jest`
- **Environment**: Node (not jsdom)

## Environment Variables

- `VITE_API_BASE_URL` — backend API base URL (set in `.env.development` / `.env.production`)
- `VITE_GA_TRACKING_ID` — Google Analytics 4 measurement ID (production only)

## Common Commands

```bash
# Start dev server
npm run dev

# Type-check and build for production
npm run build

# Run tests (single pass)
npm test

# Lint
npm run lint

# Preview production build
npm run preview
```
