# pie-elements

A collection of PIE (Portable Interactive Elements) packages. These packages have an optional `configure` and/or `controller` sub-package.

**✨ ESM Support:** All packages now support modern ESM (ECMAScript Modules) alongside CommonJS. See [ESM Support](#esm-support) for details.

## Install

```shell
yarn install # install monorepo dependencies
lerna bootstrap # symlinks any dependencies, uses yarn workspaces to speed up install
```

### pie global

For some of the scripts you'll need the pie cli installed (note that you must use npm to install this)

```shell
npm install -g pie
```

### Commands

| Action             | Notes                                                                   |
| ------------------ | ----------------------------------------------------------------------- |
| test               | runs all the tests, all tests run from the root of the monorepo         |
| build              | build the libs (CommonJS, PSLB modules, Webpack IIFE)                   |
| build:esm          | build ESM bundles for modern browsers/bundlers (see [ESM Build](#esm-support)) |
| lint               | runs eslint                                                             |
| clean              | removes all the lib dirs                                                |
| release            | cleans, runs tests, builds, then runs lerna publish                     |
| pie-clean          | cleans out the `docs/demo` dir                                          |
| pie-install        | installs in the `docs/demo` dir                                         |
| pie-pack-clean     | cleans out the `docs/demo` dir + any generated assets from a `pie pack` |
| scripts/info \$pkg | run `pie info` for a package, with watch enabled                        |

> when building make sure all watchers are disabled - we had an issue where a watcher was corrupting the build.

## Running

Each package needs to be built before you can use it:

```shell
yarn build             # Build CommonJS, PSLB modules, Webpack IIFE
yarn build:esm         # Build ESM bundles (optional, for modern usage)
```

The following script will run a watched babel process and then run `pie info`:

```shell
scripts/info $package
```

> You need to have `pie>=10.1.1` installed | `npm install -g pie`.

## Tests

All tests are run from the root of the repo.

> Don't add any test `devDependencies` or `jest.config.js` etc in the packages - it's unnecessary and can break the tests.

```shell
yarn test
```

## ESM Support

This monorepo supports dual-package publishing - packages work with both CommonJS and modern ESM:

### Build Process

```shell
# Build CommonJS, PSLB modules, and Webpack IIFE (existing builds)
yarn build

# Build ESM bundles (parallel build track)
yarn build:esm
```

### Package Structure

After building, each package contains:

- **`lib/`** - CommonJS (via Babel) for Node.js
- **`module/`** - ESM with DLL system (via PSLB) for runtime loading
- **`esm/`** - Pure ESM bundles (via Rollup) for modern browsers/bundlers
- **`dist/`** - IIFE bundles (via Webpack) for legacy browsers

### Conditional Exports

Each package uses Node.js conditional exports in `package.json`:

```json
{
  "exports": {
    ".": {
      "import": "./esm/element.js",
      "require": "./lib/index.js"
    }
  }
}
```

This allows:

- Modern bundlers (Webpack 5+, Vite, Rollup) → use `esm/`
- Node.js `require()` → use `lib/`
- Browser ESM imports → use `esm/`

### Implementation Details

See [ESM-BUILD-IMPLEMENTATION.md](./ESM-BUILD-IMPLEMENTATION.md) for complete documentation.

**Blacklisted packages:** 7 packages with CommonJS source code are skipped: `calculator`, `hotspot`, `math-inline`, `math-templated`, `protractor`, `ruler`, `select-text`

**Result:** 24 packages with full ESM support.

## Publishing

### Standard Release

```shell
# 1. Build all formats
yarn build
yarn build:esm

# 2. Publish via lerna
yarn release
```

The `release` script runs: clean, test, build, and `lerna publish`.

**Important:** Make sure to run `yarn build:esm` before publishing to include ESM bundles in the published packages.

### Test Release (with custom tag)

To publish a test version without affecting the `latest` tag:

```shell
# 1. Build everything
yarn build
yarn build:esm

# 2. Version with prerelease tag (e.g., 11.0.1-esm.1)
yarn lerna version prerelease --preid esm --no-push

# 3. Publish with custom npm tag
yarn lerna publish from-package --npm-tag esm-test
```

This publishes under the `esm-test` tag, so users must explicitly install it:

```shell
yarn add @pie-element/multiple-choice@esm-test
```

### Canary Release

```shell
# Build first
yarn build && yarn build:esm

# Publish canary
yarn lerna publish --canary --dist-tag $TAG --preid $TAG --force-publish
```

### Verifying Published Package

```shell
# Check what will be included
cd packages/multiple-choice
yarn pack --dry-run

# Or extract and inspect:
yarn pack
tar -tzf pie-element-multiple-choice-*.tgz | grep -E "^package/(lib|module|esm|dist)/"

# Should include:
# - package/lib/        (CommonJS)
# - package/module/     (PSLB ESM)
# - package/esm/        (Pure ESM)
# - package/dist/       (IIFE)
```

### CI

We use circleci - see `.circleci/config.yml`

**Note:** Update CI to run `yarn build:esm` after the main build step.
