# Known Bugs

Findings from a bug hunt carried out alongside the Vitest migration and the React 19
upgrade (September 2026), extended twice: first when coverage was widened to the loaders,
pages and auth forms, then again when the logic-bearing components that had been skipped
(`CheatCardsPage`, `LanguageDropDown`, `ArticlesPage`, `MatchView`, `AdminPage`,
`ArticleView`, `AddArticle`, `CheatCardDisplay`, `LoggedInArea`) were finally tested.
Items 8 and 9 were found that way — by writing tests against code nobody had exercised.

Each item below was reproduced with a probe test or verified against build output — none
are inferred from reading alone. **None have been fixed.**

Several now have regression guards in the suite, noted per item. Those tests assert the
*current, wrong* behaviour so it cannot change silently; each one must be inverted when the
bug is fixed.

Suite status at the time of writing: 309 tests across 32 files, all passing.
Coverage is 85.22% of statements — measured against every source file, since
`vite.config.ts` sets an explicit `coverage.include`.

Ordered roughly by how likely they are to bite.

---

## 1. `.env.production` produces a dead API base URL

**Severity:** high for local production builds; currently masked in the deployed app.
**Guarded by a test:** no.

`.env.production` contains:

```
VITE_API_BASE_URL=http:https://small-talk-football-backend-production.up.railway.app
```

Two separate faults in one line:

1. A stray `http:` prefix in front of the real `https://` URL.
2. No trailing slash, whereas `.env.development` ends with one
   (`http://localhost:8080/`).

The trailing slash matters because `src/utils/api/http.ts:12-16` builds every endpoint by
plain concatenation:

```ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const LOGIN_URL = `${BASE_URL}users/login`;
```

**Evidence.** Running `npm run build` bakes the value straight into the bundle:

```console
$ grep -o 'http[s:]*[^"]*railway[^"]*' dist/assets/index-*.js
http:https://small-talk-football-backend-production.up.railway.app
```

which concatenates and resolves to:

```
http:https://…up.railway.appusers/login
→ http://https//small-talk-football-backend-production.up.railway.appusers/login
```

Note the host has become `https`, and `app` has been glued onto `users`.

**Why the live site still works.** Vercel almost certainly supplies `VITE_API_BASE_URL` as
a real environment variable in the build environment. Vite gives already-present
environment variables precedence over `.env` file values, so the broken file value is
discarded in the Vercel build and only surfaces where the file is the sole source.

**Impact.** Anyone running `npm run build && npm run preview` locally gets a build that
talks to nothing, with no error at build time. The file also reads as authoritative
configuration while being wrong, which is a trap for the next person who edits it.

**Suggested fix.** Correct the value to
`https://small-talk-football-backend-production.up.railway.app/` (drop `http:`, add the
trailing slash). Consider normalising in `http.ts` instead — e.g. deriving a `BASE_URL`
that always ends in exactly one `/` — so the whole config stops depending on an invisible
trailing character. `src/utils/api/http.test.ts` pins the current concatenation, so it will
need updating alongside. Confirm what Vercel has set before changing anything, so the two
do not diverge further.

---

## 2. `Matches` throws and takes down `/matches` when competition data is missing

**Severity:** medium — a render-time crash, and `errorElement` does not catch it.
**Guarded by tests:** yes — two in `src/pages/MatchesPage.test.tsx`, named
"currently crashes …". **Invert both when fixing.**

Two unguarded `.toLowerCase()` calls on values that can legitimately be absent:

- `src/components/features/matches/Matches.tsx:30`
  ```ts
  (m) => m.competition.toLowerCase() === selectedCompetition.toLowerCase()
  ```
- `src/pages/MatchesPage.tsx:27` (inside `extractAvailableDates`)
  ```ts
  .filter(match => match.competition.toLowerCase() === competition.toLowerCase())
  ```

`MatchesPage.tsx:47` seeds its state from `matchesResponse.competitions[0]`, which is
`undefined` when the API returns an empty `competitions` array.

**Reproduced** at both the component and the page level:

| Input | Result |
|---|---|
| `selectedCompetition={undefined}` with one fixture | `TypeError: Cannot read properties of undefined (reading 'toLowerCase')` |
| a fixture with `competition: null` | `TypeError: Cannot read properties of null (reading 'toLowerCase')` |

**Trigger conditions.** An empty `competitions[]` arriving alongside a non-empty
`fixtures[]`, or any single fixture whose `competition` is null. Note that empty
`competitions` *and* empty `fixtures` together is harmless, because the filter callback
never runs — so this hides until the two lists disagree.

**Impact.** This throws during render, not inside a loader, so the route's
`errorElement: <ErrorPage/>` does not engage. The user gets a blank page.

**Suggested fix.** Guard both comparisons (optional chaining plus a null-safe compare), and
give `MatchesPage` a defined fallback when `competitions` is empty.

---

## 3. `ProtectedButton` replays a spent React event

**Severity:** low today, latent — it only misbehaves on the post-login path.
**Guarded by a test:** no (the replay itself is covered; the null `currentTarget` is not).

`src/components/ui/button/ProtectedButton.tsx` stores the click event of a logged-out user
and replays it after login:

```ts
const pendingClickRef = useRef<React.MouseEvent<HTMLButtonElement> | null>(null);
// …
e.preventDefault();
pendingClickRef.current = e;        // line 27, stashed
// …
onClick?.(pendingClickRef.current); // line 19, replayed from an effect
```

By the time the effect runs, React has finished dispatching the original event and nulled
its `currentTarget`. The stashed event has also already had `preventDefault()` called on
it.

**Reproduced.** A probe handler recording what it receives on the replay:

```
REPLAY currentTarget = null
REPLAY target = BUTTON
REPLAY type = click
```

So `target` and `type` survive; `currentTarget` does not.

**Impact.** None right now — the sole consumer is
`onClick={() => navigate("post-article")}` in `src/pages/ArticlesPage.tsx:59`, which
ignores its argument. But any future handler that reads `e.currentTarget` (to get a
`dataset` value, a form, a name) will work when logged in and break only after a login
prompt. That is the path least likely to be exercised in manual testing.

**Suggested fix.** Do not stash the event object. Capture the specific values the handler
needs at click time, or store a zero-argument thunk and invoke that on replay.

---

## 4. `/admin` has no client-side role guard

**Severity:** needs a server-side answer before it can be rated.
**Guarded by a test:** no.

`src/routes/AppRoutes.tsx:74` registers the route with no protection:

```ts
{ path: "admin", element: <AdminPage/> }
```

Grepping for `UserRole` or `ADMIN` across `AppRoutes.tsx`, `AdminPage.tsx`, `Header.tsx`
and `MobileNavbar.tsx` returns nothing. There is no route guard, no check inside the page,
and no nav link.

The one place the role *is* checked is `LoggedInArea.tsx`, which makes the greeting
("Hi Yekutiel") clickable for admins and navigates to `/admin`. That is the only entry
point in the UI, and it is a presentation-layer convenience, not access control — the route
answers to anyone who types the URL. Covered by
`src/components/features/auth/logged-in-area/LoggedInArea.test.tsx`.

**Impact.** Any visitor — logged out, or a `MEMBER` — can navigate directly to `/admin` and
press "Delete Fixtures" or "Delete Teams". `AdminPage` calls these through `jwtAxios`, so
an unauthenticated request carries no token.

**Unverified.** Whether the backend rejects these calls has *not* been checked from this
repository. If it enforces the `ADMIN` role, this is a UI polish issue. If it does not, it
is a serious authorisation hole. **Confirm server-side before deciding.**

**Suggested fix.** Regardless of the backend answer, gate the route on
`selectedUser?.role === UserRole.ADMIN` and redirect otherwise — showing destructive
controls to users who cannot use them is its own problem.

---

## 5. Cheat cards are cached for the lifetime of the page and never refreshed

**Severity:** medium — stale content with no way for a user to recover short of a reload.
**Guarded by a test:** yes — "keeps serving stale data after the backend content changes"
in `src/routes/loaders/CheatCardLoader.test.ts`. **Invert when fixing.**

`src/routes/loaders/CheatCardLoader.ts:20` holds a module-level cache that nothing ever
clears:

```ts
let cache: CheatCardsPageLoaderOutput | null = null;

export const cheatCardsLoader = async () => {
  if (cache) {
    return cache;
  }
  // …
  cache = result;
  return result;
};
```

**Reproduced.** After one successful load, changing what the API returns has no effect —
the loader keeps handing back the first result, and the API is not called again.

**Impact.** Cheat cards added or edited on the backend never appear until a full page
reload. An admin running "Initialize Cheat Cards" from `/admin` sees no change on
`/cheat-cards`, which reads as the operation having failed.

**Not entirely a bug:** the cache is clearly deliberate, and cheat cards are near-static.
The problem is that it has no invalidation and no TTL. One redeeming detail, confirmed by
test: failures are *not* cached, so a failed load correctly retries next time.

**Suggested fix.** Add a TTL, or expose a way to invalidate — at minimum, clear the cache
after the admin "Initialize Cheat Cards" action succeeds.

---

## 6. A user with no `preferredLanguage` sets the app language to `undefined`

**Severity:** low — needs a backend response with no `userIndications`.
**Guarded by a test:** yes — "sets the language to undefined when the user has no
preferred language" in `src/components/features/auth/login-form/LoginForm.test.tsx`.
**Invert when fixing.**

Both auth forms do this on a successful response:

```ts
dispatchToggleLang(fetchedData.data.userIndications?.preferredLanguage);
```

— `src/components/features/auth/login-form/LoginForm.tsx:33` and
`src/components/features/auth/signup-form/SignUpForm.tsx:50`.

The optional chaining prevents a crash but then passes `undefined` straight into
`toggleLang`, which assigns it unconditionally (`src/store/lang-slice.ts`). The store ends
up holding `lang: undefined` rather than falling back to the `Lang.HEBREW` default.

**Reproduced.** Logging in with a user whose `userIndications` is absent leaves
`store.getState().lang.lang === undefined`.

**Impact.** `getOneLiner` sends `lang=undefined` as a query parameter, and
`LanguageDropDown` has no matching option to highlight. The `?.` shows the author already
expected this field to be missing sometimes, so the guard is half-finished rather than
absent.

**Suggested fix.** Only dispatch when a language is actually present, or fall back to the
slice default — e.g. `dispatchToggleLang(user.userIndications?.preferredLanguage ?? Lang.HEBREW)`.
Guarding inside the reducer would cover every caller at once.

---

## 7. The custom email-validation message is unreachable

**Severity:** cosmetic / dead code.
**Guarded by a test:** yes — "blocks submission of a malformed email" in
`LoginForm.test.tsx` asserts the native behaviour.

`LoginForm.tsx` registers a react-hook-form `pattern` rule with the message
`"Enter a valid email address"`, but the field is `type="email"` inside a form with no
`noValidate`. Native constraint validation blocks submission first, so react-hook-form
never runs and the custom message never renders.

**Reproduced.** Typing `not-an-email` and submitting:

```
input type    = email
checkValidity = false
validity      = { typeMismatch: true }
api called    = 0
RHF message   = not shown
```

**Impact.** None functionally — invalid emails are correctly rejected, just by the browser's
own tooltip rather than the styled in-form message. Worth knowing that the two validation
layers are not both live, so editing the `pattern` message has no visible effect.

**Suggested fix.** Either accept the native behaviour and drop the redundant `pattern`
rule, or add `noValidate` to the form so the styled messages are the single source of
validation feedback. `SignUpForm` has the same arrangement.

---

## 8. Visiting cheat cards silently changes the user global language

**Severity:** medium — a page-local constraint leaks into global, persistent state.
**Guarded by tests:** yes — "silently switches a Hebrew user to American, globally" in
`src/pages/CheatCardsPage.test.tsx`, plus "renders no body when the card has no text in the
selected language" in `CheatCardDisplay.test.tsx`. **Invert when fixing.**

`src/pages/CheatCardsPage.tsx:49-51` dispatches to the Redux store from the render body:

```tsx
if (selectedLang == Lang.HEBREW) {
  dispatchToggleLang(Lang.AMERICAN);
}
```

The intent is clear and reasonable: cheat cards carry no Hebrew `infoTexts`, so a Hebrew
user would see a blank card body — `CheatCardDisplay` looks the text up by language and
renders nothing when it misses. `LanguageDropDown` cooperates by hiding the Hebrew option
on that route.

The problem is the fix is applied to **global** state and never undone. Nothing anywhere
restores the previous language — `dispatchToggleLang` has only three call sites, and none
of them is a cleanup.

**Reproduced.** Rendering the page with the store language set to Hebrew leaves
`store.getState().lang.lang === 'AMERICAN'` after the first render.

**Impact.** A Hebrew-speaking user browses to `/cheat-cards`, then goes back to a match.
Their one-liners now come back in American English, with no indication of why. The
preference is silently rewritten for the rest of the session, and persists through the
language dropdown's own display.

**Worth noting it is not a React error.** Dispatching during render looked like it should
warn or loop; probing showed it does neither — the page renders correctly and the console
is clean. It is a state-management problem, not a rendering one.

**Suggested fix.** Keep the constraint local: pick a display language for the cheat-card
body (`selectedLang === HEBREW ? AMERICAN : selectedLang`) and pass it down, leaving the
store untouched. If the global switch really is wanted, restore the previous language in an
effect cleanup when leaving the route.

---

## 9. `TextArea` never renders the label it requires

**Severity:** low, but it is an accessibility defect on a user-facing form.
**Guarded by a test:** yes — "currently leaves the article body without an accessible
label" in `src/components/features/articles/AddArticle.test.tsx`. **Invert when fixing.**

`src/components/ui/text-area/TextArea.tsx` declares `label: string` as a required prop and
then never uses it:

```tsx
const TextArea = forwardRef<HTMLTextAreaElement, Props>(
    ({id, rows, error, isError, ...props}, ref) => {
      // `label` is not destructured, so it stays in ...props
      return <div className="mb-4"><textarea ref={ref} id={id} {...props} /></div>;
```

Because `label` is not pulled out of `props`, it is spread onto the DOM node and renders as
a literal `label="Article"` attribute on the `<textarea>`. No `<label>` element is
produced. The sibling `Input` component does render one, so the inconsistency is easy to
miss.

**Reproduced.** In `AddArticle`, `screen.getByLabelText('Article')` finds nothing, while the
textarea itself carries `label="Article"` as a stray attribute.

**Impact.** The article body field — the main input on the submit-an-article form — has no
visible caption and no accessible name, so screen readers announce it as an unlabelled text
field. `AddArticle` is the only current consumer.

**Suggested fix.** Destructure `label` and render a `<label htmlFor={id}>` exactly as
`Input` does.

---

## Open question, not a confirmed bug

### `DateUtils.findNearestDate` assumes its input is sorted

`src/utils/DateUtils.ts:74` falls back to the "most recent past date" like this:

```ts
// fall back to most recent past date
return availableDates[availableDates.length - 1];
```

That returns the **last element**, not the **latest date** — correct only when the caller
passes an ascending array, which the JSDoc states as an assumption. The only current
caller, `extractAvailableDates` in `src/pages/MatchesPage.tsx`, does sort ascending, so
there is no live defect.

Both behaviours are pinned in `src/utils/DateUtils.test.ts` so a future change is
deliberate rather than accidental. The open question is whether the fallback should search
for the maximum instead, which would make the function correct for any input and let the
JSDoc caveat go away.

---

## Checked and cleared

**`getRelativeDateLabel` across DST.** `src/utils/DateUtils.ts` computes a day difference by
dividing a millisecond delta by `86_400_000`, which looked fragile given that a day
containing a DST transition is 23 or 25 hours. Probed under `TZ=Europe/London` against both
2025 transitions (clocks forward 30 March, back 26 October): `Math.round` absorbs the
±1 hour in every case, and Today/Yesterday/Tomorrow all come out correct. No bug.

**Cheat card loader error caching.** A failed load does not poison the cache; the next
call retries. Covered by test.

**React 19 compatibility.** The upgrade from 18.3.1 needed no application source changes.
No `defaultProps` on function components, `propTypes`, string refs, `ReactDOM.render`,
legacy context, `React.FC`, or argument-less `useRef()` exist in this codebase, and
`tsc -b` passed on the first attempt after the version bump.

---

## Still unexamined

These areas have no tests and have not been reviewed for defects, so their absence from
this document means nothing:

`Home`, `ErrorPage`, `RootLayout`, `AboutPage`, `NotFoundPage`; `Header`, `MobileNavbar`,
`TogglePill`, `GlobalSpinner`, `Footer`; `AuthArea`, `LoggedOutArea`; `ArticleCard` and
`ArticlesList`; `Analytics` and `AppRoutes`. `OneLinerResult` (the clipboard copy path),
`PasswordInput` (the reveal toggle) and `Modal` (outside-click dismissal) are only
partially exercised.

Most of what remains is genuinely presentational — static markup or a mapped list — with
two exceptions worth a look eventually: `Header` (the pending-articles indicator) and
`OneLinerResult` (clipboard write plus the 2-second "Copied!" reset).
