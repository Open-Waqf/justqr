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

## Android

- `tests/e2e/android.spec.ts` runs the app with a fake Android bridge
  (`tests/e2e/support/native-fake.ts`, from Signer): save to Documents, share, Back button,
  system bars, file names that never collide. Fast, runs in `npm run check`.
- `maestro/android/` flows run on the real phone (`npm run test:android`): save (the script then
  checks a new PNG is in `Documents/Just QR`), the real share sheet, History and Back, the
  draft after Android closes the app, Arabic. Select by HTML `id` only, no "if visible" steps.
- `npm run check:android` reads the release APK: no permissions, no trackers.

Found on the phone, not in the browser (Nov 2026): the app drew under the status bar (Android
draws edge to edge; Capacitor gives the bar heights as `--safe-area-inset-*`), and two saves the
same day used the same file name (now the time is in the name, and a taken name gets `-2`).
