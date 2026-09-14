# Implementation plan — Teams page, team one-liner, player one-liner

Frontend plan for the backend contract in `frontend-handoff-oneliners.md` (same folder). The handoff is the
source of truth for endpoints and payload shapes; this document only records how the React app consumes them
and in what order the work happens.

Status: **approved, ready to implement**. Every open question has been answered (§8). The work is split into
phases (§9); each phase has a status line that the implementing session updates, so this file doubles as the
progress board between sessions.

---

## 0. How to execute a phase (read this first in every session)

1. Read, in this order: `CLAUDE.md` (repo conventions), `frontend-handoff-oneliners.md` (API contract), this
   file. Then open the existing files the phase names as its pattern to copy — the new code must look like it
   was written by the same hands.
2. Check the **Status** lines in §9. Do only the phase you were asked for; earlier phases are done, later
   phases are not started. Do not "prepare" for later phases.
3. Implement to the phase's **Done when** list. Run `npm run build`, `npm run lint`, `npm test` — all three
   must be green before the phase counts as done. If something in the plan turns out to be wrong against the
   real code, fix the plan text in the same session and say so in your summary.
4. Flip the phase's status to `done (YYYY-MM-DD)` and add a one-line note under it if anything deviated from
   the plan.
5. Do not commit unless Alon asks. Do not touch `bugs.md`; if you find a pre-existing bug, mention it in
   your summary.

Ground rules that apply to all phases (from `CLAUDE.md`, repeated because they matter here):

- Keep it simple. No caching layers, no retry logic, no abstractions beyond what the phase names.
- Every HTTP call lives in `src/utils/api/http.ts`; request payload types in `api-inputs.ts`.
- Route data comes from a loader in `src/routes/loaders/` using `handleLoaderApiCall`; component-level
  fetches use `useApi`.
- Redux hooks only via `useAuthStore()` / `useLangStore()`.
- Tests sit beside their subject and use `renderWithProviders` from `src/test/utils.tsx`.
- Styling: copy from the nearest existing component (§6 "Styling"). No new design.

---

## 1. Navigation (decided)

- **Mobile bar** (`src/components/ui/mobile-navbar/MobileNavbar.tsx`) becomes
  **Home · Articles · Matches · Teams · Cheat Cards**. `About` leaves the bar. `Matches` stays in the centre
  slot (that centre position is what marks it as the main feature; there is no other highlight). `Teams`
  goes directly right of `Matches`, icon `Shield` from `lucide-react`.
- **Desktop header** (`src/components/ui/header/Header.tsx`) gains `Teams` between `Matches` and `About`.
- **About on mobile**: the existing `src/components/ui/footer/Footer.tsx` (currently rendered nowhere) is
  rendered at the bottom of `RootLayout` below the `<Outlet/>`, with a `Link` to `/about` next to the
  copyright. It needs bottom padding on mobile so `MobileNavbar` does not cover it (see commit `53d2900` for
  how that was handled for page content).
- **Cross-links**: `MatchCard` crests/names link to `/teams/{id}` (fixture team ids are the same as
  `/teams` ids — D1). Team/player pages link `fixtureId`s back to `/matches/{fixtureId}`.
- `Home`'s "Get Started" CTA stays on `/matches`.

Why not the alternatives (for the record): a sixth icon cramps the bar at 400px and flattens the feature
hierarchy; reaching Teams only through Matches hides a first-class feature; dropping Articles or Cheat Cards
removes a promoted feature to make room for another.

---

## 2. Routes

Add to `src/routes/AppRoutes.tsx`, following the `matches` / `matches/:id` entries (loader + `errorElement:
<ErrorPage/>`):

| Path | Page | Loader | Loader output |
|---|---|---|---|
| `/teams` | `pages/TeamsPage.tsx` | `teamsLoader` → `getTeams()` | `{ data: TeamsResponse }` |
| `/teams/:id` | `pages/TeamPage.tsx` | `teamLoader` → `getTeams()` and `getSquad(id)` in parallel | `{ team: TeamSummary, competitions: string[], squad: SquadPlayer[] }` |
| `/teams/:teamId/players/:playerId` | `pages/PlayerPage.tsx` | `playerLoader` → `getSquad(teamId)` | `{ teamId: string, player: SquadPlayer }` |

Loader details:

- All three are public (plain `axios`), all use `handleLoaderApiCall` and `throw new Response(error, {status})`
  like `matchLoader`. Each exports its `*LoaderOutput` type.
- `teamLoader`: `GET /teams` returns every team once per competition it has a table in. Filter rows by `id`;
  `team` is the first row (name/crest are identical across rows), `competitions` is the list of that team's
  `competition` values. No rows → `throw new Response("Team not found", {status: 404})`. The `:id` comes
  from `params` (`LoaderFunctionArgs`), not `extractIdFromUrl`, because the nested player route has two ids.
- `playerLoader`: find `playerId` in the squad; absent → `throw new Response("Player not found",
  {status: 404})`.
- Optional query `?competition=CHAMPIONS_LEAGUE` on `/teams/:id` (§5 "Competition"). Read it in the page with
  `useSearchParams`, not in the loader.

Why nested player route: there is no facts-only player endpoint, and the squad list is the only instant source
of a player's identity. Nesting keeps deep links and the back button working with no LLM call on navigation
(D3).

Why `teamLoader` fetches the whole list: there is no `GET /teams/{id}`. **Backend wish-list: `GET /teams/{id}`**
returning name, crest, coach and the competitions the club has a table in; when it lands, `teamLoader`
switches to it and the header can show the coach before the one-liner arrives (D4).

---

## 3. API layer

`src/utils/api/http.ts` — four new functions, plain `axios`, typed with `SmallTalkResponse<T>`; `TEAMS_URL`
already exists there:

```ts
getTeams()                             // GET /teams                       → TeamsResponse
getSquad(teamId: string)               // GET /players/teams/{teamId}      → SquadPlayer[]
getTeamOneLiner(input: TeamOneLinerInput)     // GET /one-liners/teams/{teamId}?lang&perspective?&competition?
getPlayerOneLiner(input: PlayerOneLinerInput) // GET /one-liners/players/{playerId}?lang
```

`src/utils/api/api-inputs.ts`:

```ts
export interface TeamOneLinerInput   { teamId: string; lang: Lang; perspective?: Perspective; competition?: string }
export interface PlayerOneLinerInput { playerId: string; lang: Lang }
```

Build `params` the way `getOneLiner` does; omit undefined keys (axios drops them anyway).

---

## 4. Models

`src/components/features/teams/models/`:

- `TeamsResponse.ts` — `{ competitions: string[]; teams: TeamSummary[] }` and
  `TeamSummary = { id, name, crest, competition, position, points }`. List rows are keyed on `id + competition`.
- `Perspective.ts` — `enum Perspective { FAN = "FAN", RIVAL_FAN = "RIVAL_FAN", NEUTRAL = "NEUTRAL" }`.
- `TeamOneLiner.ts` — `{ oneLiner: { language, competition, perspective, text, generatedAt }, facts: TeamFacts }`.
  `TeamFacts`, `Standing`, `FormEntry`, `NextFixture` typed from handoff §3. `notablePlayers: PlayerRecord[]`.

`src/components/features/players/models/`:

- `SquadPlayer.ts` — `{ id, name, image, number, position, injured, matchesPlayed: number | null }`.
- `PlayerRecord.ts` — the full player record (identity + the flat stat fields), used by `notablePlayers` and
  as the base of `PlayerFacts.season`.
- `PlayerOneLiner.ts` — `{ oneLiner: { language, text, generatedAt }, facts: PlayerFacts }` typed from handoff
  §4 (`team` / `competition` / `teamStanding` nullable together).

Every stat is `number | null` (`rating` is `string`); `null` renders as "–", never `0`. Timestamps stay
strings and become `new Date(...)` at render time, as `MatchView` does. Ids are strings.

---

## 5. The reusable one-liner generator

### Today

`src/components/features/matches/MatchView.tsx` owns the flow: `useApi(getOneLiner)` → `AiSpinner` →
`AnimatePresence` swapping `OneLinerForm` (radio group home / away / neutral built from the match, `react-hook-form`)
for `OneLinerResult` (quote + Copy + "Start over"). `OneLinerResult` is already generic; `OneLinerForm` is
match-specific only in how it builds its options and its "Back to Matches" button.

### Target

New folder `src/components/features/one-liners/` — the match one-liner files move here because "one-liner" is
now a cross-feature concept:

```
one-liners/
  OneLinerGenerator.tsx      # owns useApi + AiSpinner + form + result; the only thing pages render
  OneLinerForm.tsx           # generic: takes `options` instead of `match`
  OneLinerResult.tsx         # quote + Copy only (the "Start over" button is removed — D7)
  models/OneLinerOption.ts
```

```ts
export type OneLinerOption<V extends string> = { value: V; label: string; icon: ReactNode };

type Props<T, V extends string> = {
  title: string;                                   // "Choose your team!" / "Whose side are you on?"
  options: OneLinerOption<V>[];                    // radio choices; [] for players
  defaultValue?: V;                                // HOME for matches, FAN for teams
  submitLabel?: string;                            // default "Generate One-Liner!"; player page overrides
  fetchOneLiner: (choice: V | undefined) => Promise<SmallTalkResponse<T>>;
  getText: (data: T) => string;
  onResult?: (data: T) => void;                    // team/player pages lift `facts` out with this
  backLabel: string;                               // "Back to Matches" / "Back to Teams" / "Back to squad"
  backTo: string | number;                         // route or -1, passed to navigate()
};
```

Behaviour (D7, "no Start over"): **the form never leaves the screen.** Generating renders the result card
beneath the form (fade-in via `motion`), replacing any previous result. To get another perspective the user
changes the radio and taps Generate again; after a language change the user taps Generate again. The result
card is quote + Copy, nothing else. `formKey` and the `AnimatePresence` swap in today's `MatchView` go away.
When the result arrives, scroll it into view (`ref.current?.scrollIntoView({behavior: "smooth", block:
"nearest"})`) so it is visible on mobile. With `options: []` the form is just the title, the submit button and
the back button.

`OneLinerForm`'s existing `motion` variants and the `Input radio` usage stay exactly as they are; only the
option source changes.

### Callers

- **`MatchView`** — options from `match.homeTeam` / `match.awayTeam` (crest icons) / "Keep it Neutral"
  (`Scale`), default `HOME`; `fetchOneLiner` maps the choice to `teamType` (neutral → omitted) and calls
  `getOneLiner`. The only visible change on the match page is the D7 behaviour.
- **`TeamPage`** — options in this order: `FAN` (label `"{team name} fan"`, team crest icon), `RIVAL_FAN`
  (label `"Rival fan"`, `Swords` icon), `NEUTRAL` (label `"Keep it Neutral"`, `Scale` icon); default `FAN`
  (D6). `fetchOneLiner` calls `getTeamOneLiner` with `lang` from `useLangStore()` and `competition` from the
  query string when present. `onResult` stores `facts` in page state.
- **`PlayerPage`** — `options: []`, `submitLabel: "What do I say about him?"` (D10), `fetchOneLiner` calls
  `getPlayerOneLiner`; `onResult` stores `facts`.

Not in the generator: caching, retry, automatic refetch on language change.

### Why form-then-generate rather than auto-fetch on arrival

It is what the app already does, it gives the shared component one behaviour, and it avoids an LLM round-trip
on every team page visit while the user browses a table. The cost is that the team facts card appears only
after a tap. An `autoFetch` prop can be added later; not in v1.

### Competition for two-table clubs (D8)

No toggle in v1. `TeamsPage` appends `?competition=CHAMPIONS_LEAGUE` to a team link only when the selected
tab is `CHAMPIONS_LEAGUE`; otherwise no query (backend defaults to the domestic league). `TeamPage` reads it
with `useSearchParams`, shows it in the header, and passes it to `getTeamOneLiner`.

---

## 6. Pages and components

### `TeamsPage` (`src/pages/TeamsPage.tsx`) — copy `MatchesPage`

Title + subtitle in the same markup as `MatchesPage`, `SubjectButtons` over `data.competitions` (D5 — no
`/competitions` call), then `TeamList` for the selected competition. Rows are already in table order.
Empty `competitions` → `MessageBlock`.

- `features/teams/TeamList.tsx` — `motion.ul` with the same `listVariants` / `itemVariants` as `Matches.tsx`.
- `features/teams/TeamRow.tsx` — `Link` to `/teams/{id}` (+ query per §5); row shows position, crest
  (`FallbackImage`), name, points. Card classes copied from `MatchCard`.

### `TeamPage` (`src/pages/TeamPage.tsx`)

Layout container copied from `MatchView` (`min-h-screen flex justify-center p-4` → `max-w-…`). Top to bottom:

1. `features/teams/TeamHeader.tsx` — crest, name, competition label (from query; omitted when absent).
2. `OneLinerGenerator` (§5), `backLabel: "Back to Teams"`, `backTo: "/teams"`.
3. `features/teams/TeamFacts.tsx` — rendered only when `facts` is set: primary standing (position, points,
   played, W‑D‑L from `standings[primaryCompetition]`), secondary standing as one smaller line when a second
   key exists, coach, `recentForm` as up to five chips (`W`/`D`/`L`; green / gray / red text; score shown as
   given, `home` flag decides "vs" / "at"), `nextFixture` as a `Link` to `/matches/{fixtureId}` (omitted when
   `null`).
4. `features/players/Squad.tsx` — always rendered from the loader. Group consecutive rows by `position`
   (the list already arrives Goalkeepers → Defenders → Midfielders → Forwards) with a small heading per group.
   Each row (`features/players/PlayerRow.tsx`) is a `Link` to `/teams/{teamId}/players/{id}` showing photo
   (`FallbackImage`), number, name; `injured` → small red "Injured" badge; `matchesPlayed === null` →
   `opacity-60`. When `facts` is set, rows whose id appears in `facts.notablePlayers` get a small emerald dot.
   Empty squad → `MessageBlock`.

### `PlayerPage` (`src/pages/PlayerPage.tsx`)

1. `features/players/PlayerHeader.tsx` — from the loader's `SquadPlayer`: photo, name, number, position,
   injured badge.
2. `OneLinerGenerator` with `options: []`, `backLabel: "Back to squad"`, `backTo: "/teams/{teamId}"`. The
   generator's back button is the page's only back link.
3. `features/players/PlayerFacts.tsx` — rendered only when `facts` is set: age and captain badge; club stub
   (crest, name, `teamStanding` position/points) omitted when `team` is `null`; scorer-rank badge when
   `leagueScorerRank` is 1–5; season stat sheet as a two-column grid that skips `null` values, with the
   goalkeeper trio (`saves`, `insideBoxSaves`, `goalsConceded`) shown only when `position === "Goalkeepers"`;
   `recentContributions` as a short list of `Link`s to `/matches/{fixtureId}` (omitted when empty);
   `nextFixture` as on the team page.

### `Home` (`src/pages/Home.tsx`) — present the new features (D2)

1. Hero: unchanged.
2. Feature tiles: add a fifth tile **"Team & Player One-Liners"** right after "Match One-Liners" — `Shield`
   icon, emerald like the match tile, copy *"Pick a club or a player and get a line you can actually say — as
   a fan, a rival, or a neutral."*, link "Browse Teams →" to `/teams`. Grid becomes
   `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (3 + 2).
3. "See It In Action": under the existing offside quote add *"Or ask about a club as one of their own fans:"*
   followed by a second hard-coded `blockquote` (use the Man City `FAN` sentence from handoff §3), same
   classes. Not fetched.
4. "Ready to Get Started": Step 1 gets a `Link` to `/teams` ("browse the tables and see what there is to say
   about each club"); Step 3 reads *"Use Match, Team and Player One-Liners…"* with `/matches`, `/teams`,
   `/teams` links.

### Shared UI

- `src/components/ui/fallback-image/FallbackImage.tsx` — `<img>` wrapper: when `src` is empty or `onError`
  fires, render a lucide placeholder (`Shield` for crests, `User` for players) in the same box. Props: `src`,
  `alt`, `className`, `fallback: "crest" | "player"`.
- Reused as-is: `SubjectButtons`, `MessageBlock`, `Button`, `Input`, `AiSpinner`, `Spinner`.

### Styling — keep the existing look, no new design

The new pages must be indistinguishable in style from `MatchesPage` / `MatchView`:

- Copy class names from the nearest existing equivalent: page title/subtitle from `MatchesPage`; list rows
  from `MatchCard` (`bg-gray-50 rounded-xl shadow-sm`, `m-2 p-3 sm:p-4`); generator and facts cards from
  `OneLinerForm` / `OneLinerResult` (`bg-white p-6 rounded-lg shadow-md`); pills from `SubjectButtons`.
- Palette: `zinc-800` chrome, `slate-300/400` text on the dark page, `emerald-600` accents and active state,
  `gray-900` text inside white cards. No new colours except red for the injured badge and the W/D/L chips.
- `motion` entrances copied from the existing pages (`pageVariants`, staggered list items,
  `whileHover={{scale: 1.02}}`); no new animation patterns. Import from `"motion/react"` in new files (the
  package is `motion`; some older files import `framer-motion` — do not add new `framer-motion` imports).
- Icons from `lucide-react` only, at the existing sizes (`w-4 h-4` inline, `w-5 h-5` nav, `w-6 h-6` / `w-8
  h-8` radio icons).
- Hebrew: `OneLinerResult` already sets `dir="rtl"` from `useLangStore()`.

---

## 7. Tests

Conventions: `*.test.tsx` beside the subject, `renderWithProviders` from `src/test/utils.tsx`, `vi.mock` for
`http.ts` with self-contained factories. Existing tests that the work touches: `MatchView.test.tsx`,
`OneLinerForm.test.tsx`, `http.test.ts`, `MatchLoader.test.ts`. There are **no** tests today for `Header`,
`MobileNavbar`, `Home`, `OneLinerResult`, `MatchCard`, `Footer` — add them where a phase changes those files.

- `http.test.ts` — the four new calls build the right URL and `params`.
- Loaders — envelope error → thrown `Response`; `teamLoader` picks the team and its competitions from the
  list and 404s when absent; `playerLoader` finds the player and 404s when absent.
- `OneLinerGenerator` — submit → loading → result shown beneath the form; submit again → result replaced;
  `options: []` renders only title + buttons; `onResult` receives `data`; back button navigates.
- `MatchView` — existing tests pass after the move, with only the "start over" assertions rewritten.
- `TeamsPage` — tab filter; CL tab links carry `?competition=`; empty state.
- `TeamPage` — grouping, dimmed/injured rows, facts hidden until generation, `null` stats as "–".
- `PlayerPage` — goalkeeper block gating, `team: null` hides club stub, empty contributions hidden.
- `Header` / `MobileNavbar` / `Footer` — link sets.
- `Home` — new tile and links present.

Coverage is measured against `coverage.include` in `vite.config.ts`; new files fall under it automatically.

---

## 8. Decisions (answered 2026-09-14)

| # | Decision |
|---|---|
| D1 | Fixture team ids **are** the `/teams` ids. `MatchCard` crests link to `/teams/{id}`. |
| D2 | Home: hero unchanged; five tiles in a 3 + 2 grid; hard-coded team example in "See It In Action". |
| D3 | Player route is `/teams/:teamId/players/:playerId`. |
| D4 | `teamLoader` filters `GET /teams` for now. Ask the backend for `GET /teams/{id}` and switch when it lands. |
| D5 | Competition tabs are `SubjectButtons` text pills; `GET /competitions` is not used. |
| D6 | Team form order `FAN`, `RIVAL_FAN`, `NEUTRAL`; default `FAN` — engages the football noob and mirrors the fixture form ("pick a side first, neutral last"). |
| D7 | No "Start over" anywhere, including Matches. The form stays on screen; the result renders beneath it; Generate again replaces it. |
| D8 | Champions League competition inferred from the tab via `?competition=`; no toggle in v1. |
| D9 | About leaves the mobile bar into the footer; Teams takes the slot right of Matches. |
| D10 | Player button copy is "What do I say about him?". |
| D11 | No GA events. |

---

## 9. Phases

Phases are ordered by dependency; each ends in a `main`-worthy state (build, lint, tests green, nothing
half-wired). Run them sequentially, never in parallel. Follow §0 in every session.

Opening prompt for a session:

> *Read `.claude/docs/frontend-handoff-oneliners.md` and `.claude/docs/implementation-plan-oneliners.md`,
> follow §0, and implement Phase N. Do not start the next phase.*

### Recommended session grouping

Four sessions rather than six — the small phases pair naturally and the two big ones stay alone:

| Session | Phases | Why |
|---|---|---|
| **1** | 1 + 2 | Both are plumbing with no pages. Phase 1 is an hour of typing; Phase 2 is a contained refactor whose gate is the existing `MatchView` tests. Together they are still a short session. |
| **2** | 3 | Teams page + navigation. Medium. Kept alone because it is the first new page and sets the pattern the next two copy. |
| **3** | 4 | Team page. The biggest phase (header, generator wiring, facts card, squad). Alone. |
| **4** | 5 + 6 | Player page is a smaller copy of the team page; Home/cross-links/docs are mostly copy edits. Together they finish the feature in one go. |

Prompt for a grouped session: *"…implement Phases 1 and 2, in order, and stop."*

### Phase 0 — Decisions

Status: **done (2026-09-14)** — see §8.

### Phase 1 — API layer and models

Status: **done (2026-09-14)**

Notes for the next session (Phase 2):
- Models landed as planned; two small naming additions worth knowing: `PlayerRecord.ts` also exports
  `PlayerStats` (the flat nullable stat fields) which `PlayerFacts.season` reuses, and `TeamOneLiner.ts`
  exports `Standing`, `NextFixture`, `FormEntry`, `Venue` which `PlayerOneLiner.ts` imports for
  `teamStanding` / `nextFixture`.
- `http.ts` params objects keep `undefined` keys (`perspective: undefined`) exactly like `getOneLiner`;
  the tests assert that shape.
- `npm run lint` reports 3 pre-existing warnings (`react-hooks/exhaustive-deps`), none in touched files.
- Nothing under `pages/`, `routes/` or `components/ui` was touched. No commit made.

Pattern to copy: `getOneLiner` in `http.ts`; `OneLinerInput` in `api-inputs.ts`; `features/matches/models/`.

- Models per §4 in `features/teams/models/` and `features/players/models/`.
- `http.ts`: `getTeams`, `getSquad`, `getTeamOneLiner`, `getPlayerOneLiner`. `api-inputs.ts`:
  `TeamOneLinerInput`, `PlayerOneLinerInput` (§3).
- Tests added to `http.test.ts`.

Done when: build/lint/test green; nothing under `pages/`, `routes/` or `components/ui` touched.

### Phase 2 — Extract the reusable one-liner generator

Status: **done (2026-09-14)**

Notes for the next session (Phase 3):
- `OneLinerGenerator` props are exactly §5. Call it with explicit generics when the payload type cannot be
  inferred from `fetchOneLiner`: `<OneLinerGenerator<TeamOneLiner, Perspective> … />` (see `MatchView.tsx`
  for the pattern, including how the options array and `fetchOneLiner` are built).
- `OneLinerForm` radio ids are the option `value`s, so option values must be unique per form (they are enums).
  With `options: []` it submits `undefined`; do not pass a `defaultValue` in that case.
- `onResult` fires from a `useEffect` on `fetchedData` (deps deliberately exclude `onResult`, with an
  eslint-disable line) so an inline arrow from the page does not re-trigger it on every render.
- `src/test/setup.ts` now stubs `Element.prototype.scrollIntoView` (jsdom lacks it); the generator calls it
  on every result.
- The `NEUTRAL` constant is now private to `MatchView.tsx`; `OneLinerFormData` no longer exists. The
  `console.log` of the form data in the old `MatchView` was dropped along with its test spy.
- Moved files (`OneLinerForm`, `OneLinerResult`) switched to `motion/react` imports as part of the rewrite.
- `CLAUDE.md` still lists the one-liner files under `features/matches`; it is updated in Phase 6 per plan.

Pattern to copy: today's `MatchView.tsx`, `OneLinerForm.tsx`, `OneLinerResult.tsx` (and their tests).

- Create `features/one-liners/` per §5; move `OneLinerForm`/`OneLinerResult` there (git mv), make the form
  generic, remove "Start over", add `OneLinerGenerator`.
- Rewire `MatchView` to render `OneLinerGenerator`. The only visible change on the match page is D7.
- Move the existing tests with the files; rewrite only the "start over" assertions. Add
  `OneLinerGenerator.test.tsx`.

Done when: match page works as before minus "Start over"; all tests green. Nothing else in this phase.

### Phase 3 — Teams page and navigation

Status: **open**

Pattern to copy: `MatchesPage.tsx` + `Matches.tsx` + `MatchCard.tsx`, `matchesLoader`, their tests.

- `teamsLoader`, route `/teams`, `TeamsPage`, `TeamList`, `TeamRow`, `FallbackImage` (§2, §6).
- `Header` and `MobileNavbar` per §1 (Teams in, About out of the mobile bar); `Footer` rendered in
  `RootLayout` with the About link.
- Tests: loader, page (tab filter, CL `?competition=` links, empty state), `Header`, `MobileNavbar`, `Footer`.

Done when: from any page a user can reach `/teams`, switch competitions and tap a team (the team route may
still 404 — that is Phase 4); About is reachable on mobile through the footer.

### Phase 4 — Team page

Status: **open**

Pattern to copy: `MatchView.tsx` (layout + generator usage after Phase 2), `matchLoader`.

- `teamLoader`, route `/teams/:id`, `TeamPage`, `TeamHeader`, `TeamFacts`, `Squad`, `PlayerRow` (§2, §6).
  Generator wired with `FAN` / `RIVAL_FAN` / `NEUTRAL` and `?competition=`.
- `nextFixture` → `/matches/{fixtureId}` link.
- Tests: loader (lookup, competitions, 404), page (grouping, dimmed/injured, facts hidden until generation,
  `null` as "–", notable-player dot).

Done when: the team one-liner works end to end from the Teams page in all three perspectives, the squad
renders grouped, and player rows link to the (not yet existing) player route.

### Phase 5 — Player page

Status: **open**

Pattern to copy: `TeamPage` from Phase 4.

- `playerLoader`, route `/teams/:teamId/players/:playerId`, `PlayerPage`, `PlayerHeader`, `PlayerFacts` (§2,
  §6). Generator with `options: []` and the D10 label.
- `recentContributions` / `nextFixture` → `/matches/{fixtureId}` links.
- Tests: loader (lookup, 404), page (goalkeeper gating, `team: null`, empty contributions, facts hidden
  until generation).

Done when: Teams → team → player → one-liner works end to end.

### Phase 6 — Home, cross-links, docs

Status: **open**

- `Home` per §6 "Home" (fifth tile, second example, step copy).
- `MatchCard` crests/names link to `/teams/{id}` (D1). Note `MatchCard` is itself wrapped in a `Link` inside
  `Matches.tsx` — nested anchors are invalid; make the crest links only where `MatchView` renders the card
  (a `linkTeams` prop) or render the links outside the card. Keep it simple.
- Tests for `Home` and the `MatchCard` links.
- Update `CLAUDE.md`: new routes, `features/one-liners`, `features/teams`, `features/players`, the
  `OneLinerGenerator` convention ("all one-liner UIs render `OneLinerGenerator`"). There is no `.kiro/`
  directory in this repo despite what `CLAUDE.md` says — remove that note.

Done when: every entrance to the new features exists and `CLAUDE.md` describes the new structure.
