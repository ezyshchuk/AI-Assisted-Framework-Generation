# SauceDemo Playwright E2E Framework

**Playwright + TypeScript** end-to-end test automation suite for [https://www.saucedemo.com](https://www.saucedemo.com), built with Page Object Model, typed fixtures, centralized environment management, and a full GitHub Actions CI pipeline.

---

## What it does

| Area | Coverage |
|---|---|
| Authentication | Login success, all failure modes (invalid credentials, missing fields) |
| Inventory | Products load, all 4 sort orders verified, item detail navigation |
| Cart | Badge counter, multi-item add, remove from inventory & cart pages |
| Checkout | Field validation (first name / last name / postal code), full happy path |
| Session | Logout via side menu |

**15 specs** across 5 test files — all reliable in headless CI with zero hard waits.

---

## Prerequisites

| Tool | Minimum version |
|---|---|
| Node.js | 18 LTS |
| npm | 9 |

---

## Installation & first run

```powershell
# 1 — clone / enter the project
cd "saucedemo-playwright-framework"

# 2 — install npm dependencies
npm ci

# 3 — install the Playwright browser (Chromium only)
npx playwright install --with-deps chromium

# 4 — run all tests (headless by default)
npx playwright test

# 5 — open the HTML report in your browser
npx playwright show-report
```

### Useful scripts

| Command | Purpose |
|---|---|
| `npm test` | Headless Chromium run |
| `npm run test:headed` | Same run but with browser window visible |
| `npm run test:debug` | Step-through debugging via Playwright Inspector |
| `npm run test:report` | Open the last HTML report |
| `npm run type-check` | TypeScript compilation check (no output) |

---

## Test credentials

The suite uses the **documented public test accounts** provided by Sauce Labs:

| Variable | Default value | Purpose |
|---|---|---|
| `SAUCE_USERNAME` | `standard_user` | Primary test account |
| `SAUCE_PASSWORD` | `secret_sauce` | Matching password |
| `BASE_URL` | `https://www.saucedemo.com` | Application under test |

Credentials are **never hard-coded in specs**. All tests access them through `src/utils/envHelper.ts`. Copy `.env.example` → `.env` to override locally.

---

## Project structure

```
saucedemo-playwright-framework/
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI pipeline (push + PR triggers)
│
├── src/
│   ├── pages/
│   │   ├── BasePage.ts             # Abstract base — safe wrappers, navigation helpers
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── InventoryItemPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutInformationPage.ts
│   │   ├── CheckoutOverviewPage.ts
│   │   └── CheckoutCompletePage.ts
│   │
│   ├── components/
│   │   ├── Header.ts               # Cart badge + burger menu (shared across pages)
│   │   └── SideMenu.ts             # Slide-out nav menu (logout, reset, all-items)
│   │
│   ├── utils/
│   │   ├── envHelper.ts            # Centralised env access — no direct process.env outside here
│   │   └── logger.ts               # Typed logger with timestamps + LOG_LEVEL control
│   │
│   └── fixtures/
│       └── index.ts                # Typed Playwright fixtures exposing all page objects
│
├── tests/
│   └── e2e/
│       ├── login.spec.ts           # 4 specs — success + 3 failure modes
│       ├── inventory.spec.ts       # 6 specs — load, sort ×4, item detail
│       ├── cart.spec.ts            # 4 specs — badge count, cart content, remove
│       ├── checkout.spec.ts        # 4 specs — validation ×3, happy path
│       └── logout.spec.ts          # 1 spec  — full logout flow
│
├── playwright.config.ts            # Chromium project, HTML reporter, CI retries
├── tsconfig.json                   # Strict TypeScript + path aliases
├── package.json
├── .env.example                    # Document all supported env vars
└── .gitignore
```

### Architecture decisions

- **Page Object Model** — all selectors live in page/component classes; specs contain no raw locators.
- **`BasePage`** — shared `safeClick`/`safeFill` helpers assert visibility before interacting, turning silent Playwright timeouts into clear assertion failures.
- **Components** — `Header` and `SideMenu` are composed _into_ pages rather than inherited, keeping the hierarchy flat and reusable.
- **Typed fixtures** — tests import `test` and `expect` from `src/fixtures/index.ts`. The `authenticatedInventoryPage` fixture handles login automatically; specs that need an authenticated session have zero setup code.
- **`envHelper`** — single source of truth for environment configuration with typed getters and sensible defaults. `process.env` is accessed only here.
- **`logger`** — structured, timestamped log output with `LOG_LEVEL` filtering. CI output stays clean.

---

## CI/CD

The GitHub Actions workflow (`.github/workflows/playwright.yml`) runs on every **push** and **pull request**:

1. Checkout code
2. Set up Node.js LTS with npm cache
3. `npm ci` — reproducible install
4. `npx playwright install --with-deps chromium` — downloads the browser
5. `npx playwright test` — runs in headless Chromium with 2 retries
6. Upload **HTML report** artifact (retained 14 days)
7. Upload **trace/screenshot/video** artifacts for any failures (retained 7 days)

To view the CI badge in your own repo, replace `<YOUR_ORG>/<YOUR_REPO>` in the badge URL at the top of this file.
