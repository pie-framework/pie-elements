# pie-elements

## What this is

A monorepo of **PIE (Portable Interactions & Elements)** assessment item-type widgets — multiple-choice, extended-text-entry, graphing, drag-in-the-blank, hotspot, etc. Each item type is a native `HTMLElement` subclass that mounts a React tree internally, so it can be embedded framework-agnostically by a host player (`pie-player-components`).

Sibling repo: **`pie-lib`** (`../pie-lib`) provides shared UI/logic building blocks, consumed as normal npm dependencies under the `@pie-lib/*` scope (not a local link — see `resolutions` in root `package.json`).

## Repo structure

- Lerna (independent versioning) + Yarn workspaces. Workspaces: `packages/*`, `packages/*/configure`, `packages/*/controller`, `packages/*/print`.
- `packages/` — 32 item packages, plus `pie-models` (TS model/schema defs) and `boilerplate-item-type` (scaffold for new elements).
- `old-packages/` — deprecated items, excluded from tests.
- `scripts/` — build/release tooling, wraps `@pie-framework/build-helper`.

## Package anatomy (per item type)

Each item type is split into up to three independently-published npm packages:

- **main** (`packages/<name>/src`) — the custom element: `model`/`session`/`options` setters, dispatches `ModelSetEvent`/`SessionChangedEvent`. This is what a host player embeds.
- **configure/** (`@pie-element/<name>-configure`) — authoring UI that edits the model (built on `@pie-lib/config-ui`, MUI).
- **controller/** (`@pie-element/<name>-controller`) — server/pre-render logic: `createDefaultModel`, `normalize`, and `model(question, session, env, updateSession)`. This is where scoring happens and where fields get stripped based on `env.mode` (`gather`/`view`/`evaluate`) and `env.role` (`student`/`instructor`) — the mechanism that keeps answers/rationale hidden from students. Don't weaken this filtering without understanding why it's there.

Each package builds `src/` (and `configure/src`, `controller/src`) → `lib/` via Babel. Model docs are auto-generated into `docs/pie-schema.json` / `docs/config-schema.json` from `pie-models`.

## Commands

- `yarn build` — build all packages (`scripts/build build`)
- `yarn test` — run tests (`scripts/build test`); Jest is configured **only at the repo root** (`jest.config.js`) — don't add per-package Jest config/devDependencies
- `yarn lint` — ESLint over `packages`
- `yarn update-pie-lib` — bump all `@pie-lib/*` deps to latest and sync the root `resolutions` block (`scripts/sync-pie-lib-resolutions.js`)
- `yarn release` — clean + test + build + `lerna publish`

## Conventions

- No TypeScript in item source (except `pie-models`) — plain JS/JSX with Babel.
- New item types start from `boilerplate-item-type`.
- Keep `@pie-lib/*` version bumps going through `update-pie-lib` / `sync-pie-lib-resolutions.js` rather than hand-editing versions in individual package.json files, so the root `resolutions` block stays consistent.

## Working preferences

- **Do not create git commits unless explicitly asked.** The user commits their own changes — leave the working tree staged/unstaged as appropriate and let them review and commit themselves.
