# Tests

All automated tests for the frontend live here.

## Layout

- `config/` — Vitest config and the global test setup file. Don't put tests here.
- `unit/` — Pure-logic tests (services, hooks, utilities). No DOM, no React rendering.
- `components/` — React component tests using React Testing Library.
- `integration/` — Multi-piece flows that wire several components + services together.

## Naming

Test files end with `.test.js`, `.test.jsx`, `.test.ts`, or `.test.tsx`.
Mirror the path of the thing under test:

    src/services/combatTracker.ts    -> tests/unit/services/combatTracker.test.ts
    src/components/CharacterItem.jsx -> tests/components/CharacterItem.test.jsx

## Running

From `frontend/`:

    npm test              # run once
    npm run test:watch    # watch mode
    npm run test:ui       # browser UI
    npm run coverage      # coverage report
