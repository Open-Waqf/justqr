# Just QR

QR codes that never expire. No account, no ads, no tracking. Free, as a waqf.

Many QR websites make "dynamic" codes that go through their server. After the free trial
they stop working unless you pay, and printed menus and posters go dead. Just QR makes only
plain (static) codes: your link or text is inside the code itself. No server is involved,
so the code works forever and nobody can see who scans it.

Part of the [Open Waqf](https://open-waqf.org) apps. [Privacy policy](docs/PRIVACY.md): nothing is collected.

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

Capacitor 8, Android 7 or newer. The Play Store app never has INTERNET, and its data is never
backed up to the cloud. On Android 11 and newer it asks for no permission at all; on Android 10
and older, Save asks once for storage access (to write into Documents/Just QR). A phone whose
WebView is older than Chrome 111 sees a short "please update Android System WebView" page.

Phone setup, once: Settings, About phone, tap "Build number" 7 times; then Developer options,
turn on "USB debugging". Plug the phone in and accept the prompt.

| Command                 | What it does                                                                                                                      |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `npm run android:run`   | Build and open **Just QR Dev** on the USB phone (own id `org.openwaqf.justqr.dev`, own data: it never touches the Play Store app) |
| `npm run android:live`  | Same, and the phone reloads on every file change (the dev build has INTERNET for this only)                                       |
| `npm run test:android`  | Install Just QR Dev and run the Maestro flows in `maestro/android/` (keep the phone unlocked)                                     |
| `npm run android:build` | Build the debug and release apps (`android/app/build/outputs/apk/`)                                                               |
| `npm run check:android` | Check the release app: no INTERNET, storage only up to Android 10, no trackers. GitHub runs it on every push                      |
| `npm run icons`         | Redraw the web and Android icon sources; then `npx @capacitor/assets generate --android`                                          |

Saved codes go to the phone's `Documents/Just QR` folder.

## Release

Unlock the Cryptomator vault first (the Android upload key lives there).

```
npm run release -- --dry-run    # see what would happen, change nothing
npm run release                 # next version (0.1.0 -> 0.2.0); the first release keeps 0.1.0
npm run release -- 1.0.0        # an exact version
```

It runs every check, sets the version, commits "Release X", tags vX and pushes. The tag
makes GitHub test again and deploy qr.open-waqf.org. Then it builds the signed bundle for
Google Play (`npm run android:release`, also on its own) and checks the upload key and that
the store app has no INTERNET. Upload the `.aab` it prints in Play Console yourself.

More: [docs/TESTING.md](docs/TESTING.md), [docs/TRANSLATIONS.md](docs/TRANSLATIONS.md),
[docs/PRIVACY.md](docs/PRIVACY.md).

### Store pictures and texts

`npm run build && npm run play:screenshots` writes the Play Store screenshots (1080 x 2160,
six per language, taken from the real app) and the 1024 x 500 banners into
`~/Downloads/qr-release/`. The store texts live there too, outside the repo.

## Licence

[PolyForm Noncommercial 1.0.0](LICENSE).
