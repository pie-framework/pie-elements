# ESM Build Implementation Guide

Ticket: [PD-5245](https://illuminate.atlassian.net/browse/PD-5245)

## Overview

This adds a **parallel ESM build track** to PIE elements without modifying existing builds (PSLB, Babel, Webpack).

## What Was Created

Just **2 files** for complete ESM support:

### 1. Rollup Configuration (`rollup.config.js`)

Configures ESM bundling with:

- External dependencies (React for element/controller/print, @pie-lib/*, @pie-element/*)
- **Special case:** Configure builds bundle BOTH React AND ReactDOM together (prevents version mismatches)
- Babel transpilation for JSX
- Modern browser targets (esmodules: true)
- Source maps
- Runtime Babel helpers for compatibility

### 2. Build Script (`scripts/build-esm.js`)

Builds ESM bundles for all packages:

- `esm/element.js` - Question UI
- `esm/configure.js` - Authoring UI
- `esm/controller.js` - Server-side logic
- `esm/print.js` - Print view

The `package.json` exports field is **already configured** (committed to git) with conditional exports:

```json
{
  "exports": {
    ".": {
      "import": "./esm/element.js",
      "require": "./lib/index.js",
      "default": "./esm/element.js"
    }
  }
}
```

## Blacklisted Packages

The following 7 packages contain **CommonJS source code** and are skipped (matching PSLB blacklist):

- `calculator`
- `hotspot`
- `math-inline`
- `math-templated`
- `protractor`
- `ruler`
- `select-text`

These can be converted to ESM source in a future update.

**Result:** 24 packages successfully built with ESM support.

## Package Structure

After build, each package will have:

```text
@pie-element/multiple-choice/
├── lib/              # CommonJS (Babel) - EXISTING
│   └── index.js
├── module/           # ESM (PSLB with DLL) - EXISTING  
│   ├── element.js
│   ├── configure.js
│   └── controller.js
├── esm/              # NEW: Pure ESM (no DLL)
│   ├── element.js    # Bundled, externals marked
│   ├── configure.js
│   ├── controller.js
│   └── print.js
├── dist/             # IIFE (Webpack) - EXISTING (if exists)
└── package.json      # exports → esm/
```

## Installation

**No installation required!** All dependencies are already in `package.json`:

✅ `rollup` (2.70.1)
✅ `@rollup/plugin-node-resolve` (13.3.0)
✅ `@rollup/plugin-babel` (5.3.1)
✅ `@rollup/plugin-commonjs` (20.0.0)
✅ `@babel/preset-react`
✅ `@babel/preset-env`
✅ `@babel/plugin-transform-runtime`

The build system is ready to use immediately after `yarn install`.

## Usage

### Build ESM Bundles

```bash
# Build all packages
yarn build:esm
```

This command:

- Builds ESM bundles for all packages
- Generates files in `esm/` directory (gitignored)
- **Does NOT modify** `package.json` (exports already configured)

**Note:** The `exports` field in each `package.json` is already set up and committed to git. You only need to regenerate exports if you add/remove entry points

### Regenerate Exports (Only if Needed)

If you add/remove entry points (element, configure, controller, print), you can regenerate the exports field:

1. Edit `scripts/build-esm.js`
2. Uncomment the `updatePackageExports()` call in `buildPackage()`
3. Run `yarn build:esm`
4. Commit the updated `package.json` files
5. Re-comment the `updatePackageExports()` call

Or manually update the `exports` field in each `package.json`.

### Integrate with Existing Build

Add to `package.json` scripts:

```json
{
  "scripts": {
    "build": "scripts/build build && node scripts/build-esm.js",
    "build:cjs": "scripts/build build",
    "build:esm": "node scripts/build-esm.js"
  }
}
```

**IMPORTANT:** `yarn build` now builds BOTH CommonJS and ESM by default to prevent accidental incomplete publishes.

Or modify `scripts/build` to run ESM build after existing builds.

## Testing

### 1. Test Build

```bash
# Build all packages
yarn build:esm

# Check output
ls packages/multiple-choice/esm/
# Should show: element.js, configure.js, controller.js, print.js

# Check exports
cat packages/multiple-choice/package.json | grep -A 10 '"exports"'
```

### 2. Test Import (Modern Bundler)

Create test project with Vite:

```javascript
// test-esm.js
import MultipleChoice from '@pie-element/multiple-choice';
console.log(MultipleChoice);
```

### 3. Test Node.js (CommonJS)

```javascript
// test-cjs.js
const MultipleChoice = require('@pie-element/multiple-choice');
console.log(MultipleChoice);
```

## Benefits

### For Modern Consumers

✅ **True ESM** - Native browser imports via import maps
✅ **Tree-shaking** - Better optimization
✅ **Faster loading** - Smaller bundles
✅ **No DLL complexity** - Standard module resolution

### For Legacy Consumers

✅ **Backward compatible** - `require()` still works
✅ **No breaking changes** - Existing builds unchanged

### For Maintenance

✅ **Standard tooling** - Rollup (no custom PSLB)
✅ **Parallel builds** - Can deprecate old builds gradually
✅ **Simple configuration** - One config file

## External Dependencies

### Standard Builds (element, controller, print)

The following are kept external (not bundled):

**React Core:**

- react

**PIE Packages:**

- @pie-lib/* (all pie-lib shared libraries)
- @pie-element/* (other elements)
- @pie-framework/* (framework packages)

**Everything Else is BUNDLED** (for maximum compatibility):

- react-dom (Slate needs it)
- Material UI (old versions, no reliable ESM)
- Lodash (works but bundled for safety)
- Slate ecosystem (no ESM support)
- All third-party deps

### Configure Builds (authoring UI)

**PIE Packages ONLY:**

- @pie-lib/*
- @pie-element/*
- @pie-framework/*

**Everything Else is BUNDLED** (including React + ReactDOM):

- React (bundled to match ReactDOM version)
- ReactDOM (bundled to match React version)
- Material UI
- All third-party deps

**Why bundle React in configure?**

- Configure builds used to have React external but ReactDOM bundled
- This caused version mismatches (React error #31)
- Configure components are isolated authoring UIs that don't need to share React instances
- Bundling both together guarantees version compatibility

### Strategy

#### "Bundle Everything Except Proven Safe"

- Only externalize what's 100% guaranteed to work on CDN
- Maximize compatibility over bundle size
- Optimize later based on real-world data

## Import Maps for PIE Player

When you update PIE Player, generate import maps like:

```json
{
  "imports": {
    "react": "https://esm.sh/react@16.14.0",
    "@pie-element/multiple-choice": "https://esm.sh/@pie-element/multiple-choice@11.0.0"
  }
}
```

**Note:** Only React is external for element/controller/print. Configure builds have React/ReactDOM bundled, so they don't appear in the import map.

Then load dynamically:

```javascript
// Element (for rendering questions)
const element = await import('@pie-element/multiple-choice');

// Configure (for authoring UI) - in editor mode
const configure = await import('@pie-element/multiple-choice/configure');
```

## Rollback

If needed, simply:

```bash
# Remove esm directories
find packages -name "esm" -type d -exec rm -rf {} +

# Revert package.json changes
git checkout -- packages/*/package.json

# Remove build files
rm scripts/build-esm.js rollup.config.js
```

## Quick Start

1. **Build all packages:**

   ```bash
   yarn build:esm
   ```

2. **Verify output:**

   ```bash
   ls packages/multiple-choice/esm/
   cat packages/multiple-choice/package.json | grep -A 10 '"exports"'
   ```

3. **Test publish:**

   ```bash
   cd packages/multiple-choice
   yarn pack
   tar -xzf pie-element-*.tgz
   cat package/package.json | grep -A 20 '"exports"'
   ls package/esm/
   ```

4. **Integrate with CI/CD:**
   Add `yarn build:esm` to your CI/CD pipeline after the main build

## Troubleshooting

### React Error #31 in Authoring Mode

**Symptom:** React error #31 ("Objects are not valid as a React child") when loading configure components in authoring mode.

**Cause:** Version mismatch between external React and bundled ReactDOM in configure builds.

**Solution:** Configure builds now bundle BOTH React AND ReactDOM together for version compatibility. This is configured automatically in `rollup.config.js` by detecting `/configure.js` output paths.

**Verification:**

```bash
# Check that React is NOT imported externally in configure.js
grep "import.*from.*['\"]react['\"]" packages/multiple-choice/esm/configure.js
# Should return empty (no results)

# Check that React is bundled
grep -c "React\.__SECRET_INTERNALS" packages/multiple-choice/esm/configure.js
# Should return 1 (React internals are present)
```

## FAQ

**Q: Does this replace PSLB?**
A: No, PSLB output remains in `module/`. ESM is a new parallel output in `esm/`.

**Q: Are existing consumers affected?**
A: No. The `main` field still points to `lib/index.js` (CommonJS). Only modern bundlers that understand `exports` will use ESM.

**Q: What about browser support?**
A: ESM is for modern browsers. Legacy browsers continue using IIFE bundles from `dist/`.

**Q: Can I use this with Node.js?**
A: Yes! Node.js 12+ supports conditional exports. `require()` gets CommonJS, `import` gets ESM.

**Q: What about TypeScript?**
A: Can be added later. For now, JSX → ESM works fine.

**Q: Why is configure.js so much larger than element.js?**
A: Configure builds bundle React + ReactDOM for version compatibility, while element builds keep React external. This is intentional to prevent React error #31.
