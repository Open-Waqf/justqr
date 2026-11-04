# Just QR

QR codes that never expire. No account, no ads, no tracking. Free, as a waqf.

Many QR websites make "dynamic" codes that go through their server. After the free trial
they stop working unless you pay, and printed menus and posters go dead. Just QR makes only
plain (static) codes: your link or text is inside the code itself. No server is involved,
so the code works forever and nobody can see who scans it.

Part of the [Open Waqf](https://open-waqf.org) apps.

## Development

Needs Node 22 or newer.

```sh
npm install
npm run dev          # http://localhost:5173
npm run check        # everything, before every commit (about 10 s)
```

`npm run check` runs, in order, and stops at the first failure:

1. lint and format (Biome; `npm run format` fixes most problems)
2. typecheck (app, tests, configs, and the scripts)
3. translations (every language has every text, every text is used)
4. unit tests with coverage (90% of `src/lib` at least)
5. production build
6. size budget (250 KB of JavaScript and CSS)
7. browser tests on the build: phone and Arabic phone. Every test fails if the app tries to
   reach the network. Accessibility (axe) is checked in light, dark and OLED.

`npm run check -- --desktop` adds the desktop screen. GitHub always runs that.

Other commands:

| Command             | What it does                                        |
| ------------------- | --------------------------------------------------- |
| `npm run test:unit` | Unit tests only (Vitest)                            |
| `npm test`          | Build, then browser tests on phone and Arabic phone |
| `npm run test:all`  | Build, then browser tests on all three screens      |
| `npm run format`    | Fix formatting and simple lint problems             |
| `npm run icons`     | Redraw the PNG icons from `public/icons/icon.svg`   |

On Ubuntu 26.04, Playwright needs `PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64`
(`npm run check` sets it).

## Android app

Capacitor 8, Android 11 or newer. The Play Store app asks for no permissions at all (no
INTERNET), and its data is never backed up to the cloud.

Phone setup, once: Settings, About phone, tap "Build number" 7 times; then Developer options,
turn on "USB debugging". Plug the phone in and accept the prompt.

| Command                 | What it does                                                                                                                      |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `npm run android:run`   | Build and open **Just QR Dev** on the USB phone (own id `org.openwaqf.justqr.dev`, own data: it never touches the Play Store app) |
| `npm run android:live`  | Same, and the phone reloads on every file change (the dev build has INTERNET for this only)                                       |
| `npm run test:android`  | Install Just QR Dev and run the Maestro flows in `maestro/android/` (keep the phone unlocked)                                     |
| `npm run android:build` | Build the debug and release apps (`android/app/build/outputs/apk/`)                                                               |
| `npm run check:android` | Check the release app: no permissions, no trackers. GitHub runs it on every push                                                  |
| `npm run icons`         | Redraw the web and Android icon sources; then `npx @capacitor/assets generate --android`                                          |

Saved codes go to the phone's `Documents/Just QR` folder.

More: [docs/TESTING.md](docs/TESTING.md), [docs/TRANSLATIONS.md](docs/TRANSLATIONS.md).

## Licence

[PolyForm Noncommercial 1.0.0](LICENSE).
