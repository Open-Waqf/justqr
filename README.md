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

More: [docs/TESTING.md](docs/TESTING.md), [docs/TRANSLATIONS.md](docs/TRANSLATIONS.md).

## Licence

[PolyForm Noncommercial 1.0.0](LICENSE).
