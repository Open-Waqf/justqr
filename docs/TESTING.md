# Testing

## Where tests live

| Folder        | Runner        | What                                                                                      |
| ------------- | ------------- | ----------------------------------------------------------------------------------------- |
| `tests/unit/` | Vitest (Node) | Pure logic in `src/lib`: encoders, escaping, contrast, rendering. Coverage threshold 90%. |
| `tests/e2e/`  | Playwright    | The real app, built (`dist/`), in Chromium.                                               |

## Browser test rules

- Tests run against the production build through `vite preview`, on their own port (5185),
  with a fresh server every time. The code tested is the code shipped.
- Three projects: `phone` (Pixel 5), `phone-ar` (Pixel 5 in Arabic, only tests tagged
  `@rtl` or `@rtl-only`) and `desktop` (tests tagged `@phone` are skipped there,
  `@desktop` tests run only there).
- Find elements by `data-testid`, never by translated text (except to check a translation).
- Import `test` and `expect` from `tests/e2e/support/test.ts`, not from Playwright. It adds the
  **network guard**: any request to a host other than localhost, or any Content Security
  Policy violation, fails the test. This is how "nobody can track" is proved.
- `expectAccessible(page)` runs axe (WCAG 2.1 AA, contrast included) on what is on screen.
- At most 4 workers locally (memory on this machine), 2 on GitHub.

## Startup time

`tests/e2e/startup.spec.ts` prints the time to the first screen on every desktop run
(`Startup: N ms`). It fails only above 2 s, because CI machines are noisy. When a change
touches startup, compare the number before and after.

## Proving a guard works

When adding a guard, check once that it fails on purpose (a throwaway test that breaks the
rule), then delete that test. Done for the network guard and axe on 2026-11-04.
