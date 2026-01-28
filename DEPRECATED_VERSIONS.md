# Deprecated Library Versions

This document tracks library versions that are deprecated, incompatible with React 18, Node 18+, or have known security/performance issues found in the pie-elements codebase.

## Current Environment Requirements

- **React**: 18.2.0 (current, not upgrading)
- **Node.js**: 18+ (recommended, Node 20+ preferred)
- **Target**: Modern browsers (as per browserslist config)

---
```

---

```
---

### 1. `@testing-library/react`: `^16.3.0` ❌

**Status**: **DEPRECATED** - Incompatible with React 18

**Location**: Root `package.json`

**Issue**: Version 16.x does not properly support React 18 features (concurrent rendering, automatic batching, etc.). React 18 requires v13.0.0+.

**Recommended Upgrade**: 
```json
"@testing-library/react": "^13.4.0"
```

**Breaking Changes**:
- `renderHook` is no longer exported (moved to `@testing-library/react-hooks` or use `@testing-library/react` v13+)
- Some query methods have been updated
- Requires React 18 compatible version (v13+)

**Migration Notes**:
- Update test utilities to use React 18 patterns
- Review `renderHook` usage if migrating from v16
- Test concurrent rendering features

---

### 2. `@testing-library/react-hooks`: `^8.0.1` ⚠️

**Status**: **DEPRECATED** - Functionality merged into `@testing-library/react`

**Location**: Root `package.json`

**Issue**: This package is deprecated. React hooks testing is now built into `@testing-library/react` v13+.

**Recommended Action**: 
- Remove this dependency
- Use `renderHook` from `@testing-library/react` v13+ instead

**Migration**:
```javascript
// Old (v8.0.1)
import { renderHook } from '@testing-library/react-hooks';

// New (v13+)
import { renderHook } from '@testing-library/react';
```

---

### 3. `d3-selection`: `^1.4.1` ❌ 
### Solved within https://github.com/pie-framework/pie-elements/pull/2878/changes

**Status**: **VERY OLD** - Incompatible with React 18 and modern JavaScript

**Location**: `packages/number-line/package.json`

**Issue**: Version 1.4.1 is from 2018. Version 3.0.0+ is required for React 18 compatibility and modern JavaScript features.

**Recommended Upgrade**:
```json
"d3-selection": "^3.0.0"
```

**Breaking Changes**:
- `mouse()` function removed, replaced with `pointer()`
- Event handling API changed
- Better TypeScript support
- Improved performance

**Migration Notes**:
- Replace `mouse()` with `pointer()` in event handlers
- Update event binding patterns
- See: `packages/number-line/src/number-line/graph/index.jsx` for migration example

---

### 4. `d3-scale`: `^3.2.1` ⚠️
### Solved within https://github.com/pie-framework/pie-elements/pull/2878/changes

**Status**: **OUTDATED** - Should be upgraded

**Location**: `packages/number-line/package.json`

**Issue**: Version 3.2.1 is old. Version 4.0.0+ has better TypeScript support and React 18 compatibility.

**Recommended Upgrade**:
```json
"d3-scale": "^4.0.2"
```

**Breaking Changes**:
- Better TypeScript definitions
- Improved API consistency
- Performance improvements

---

### 5. `react-beautiful-dnd`: `^11.0.2` ⚠️

**Status**: **DEPRECATED** - No longer maintained

**Location**: `packages/rubric/configure/package.json`

**Issue**: This package is no longer maintained. The maintainer recommends migrating to `@dnd-kit/core` which is actively maintained and supports React 18.

**Recommended Migration**:
```json
"@dnd-kit/core": "^6.1.0",
"@dnd-kit/sortable": "^8.0.0",
"@dnd-kit/utilities": "^3.2.2"
```

**Migration Notes**:
- Different API - requires code refactoring
- Better TypeScript support
- Active maintenance and React 18+ support
- Already used in other packages (e.g., `number-line`, `match`)

---

### 6. `react-swipeable-views`: `^0.12.17` ⚠️

**Status**: **UNMAINTAINED** - Very old version

**Location**: `packages/match/configure/package.json`

**Issue**: Version 0.12.17 is from 2018. The package appears to be unmaintained. Last release was in 2019.

**Recommended Alternatives**:
- Use Material-UI's `Tabs` component with swipe support (already using MUI)
- Use `react-swiper` (actively maintained)
- Use native CSS scroll-snap with React

**Migration**:
```json
"swiper": "^11.0.0"
```

---

### 7. `react-transition-group`: `^2.3.1` ⚠️

**Status**: **OUTDATED** - Very old version

**Location**: Multiple packages:
- `packages/number-line/package.json`
- `packages/multiple-choice/package.json`
- `packages/placement-ordering/package.json`
- `packages/likert/package.json`

**Issue**: Version 2.3.1 is from 2019. Version 4.4.5+ has better React 18 support and bug fixes.

**Recommended Upgrade**:
```json
"react-transition-group": "^4.4.5"
```

**Breaking Changes**:
- Better TypeScript support
- Improved React 18+ compatibility
- Some API changes in transition callbacks

---

### 8. `react-jss`: `^8.4.0` ⚠️

**Status**: **OUTDATED** - Consider migrating to Emotion

**Location**: 
- `packages/number-line/package.json`
- `packages/placement-ordering/package.json`

**Issue**: Version 8.4.0 is old. The project already uses `@emotion/react` in many places. Consider standardizing on Emotion.

**Recommended Action**:
- Migrate to `@emotion/react` (already in use)
- Or upgrade to `react-jss@^10.9.0` if keeping JSS

**Note**: Emotion is already used extensively in the codebase (MUI uses it), so migration to Emotion would reduce dependencies and improve consistency.

---

### 9. `react-konva`: `18.1.0` ⚠️

**Status**: **OUTDATED** - Should check for updates

**Location**:
- `packages/hotspot/package.json`
- `packages/hotspot/configure/package.json`
- `packages/drawing-response/package.json`

**Issue**: Version 18.1.0 may not have full React 18 support. Check for newer versions.

**Recommended Action**:
- Check latest version: `npm view react-konva versions`
- Upgrade to latest version compatible with React 18
- Test canvas rendering with React 18's concurrent rendering

---

### 10. `minimist`: `^1.2.0` 🔴

**Status**: **SECURITY RISK** - Very old version with known vulnerabilities

**Location**: Root `package.json`

**Issue**: Versions < 1.2.6 have prototype pollution vulnerabilities (CVE-2021-44906)

**Recommended Upgrade**:
```json
"minimist": "^1.2.8"
```

**Note**: Consider migrating to `yargs` or `commander` for better CLI argument parsing.

---

### 11. `lerna`: `^3.13.1` ⚠️

**Status**: **OUTDATED** - Limited Node 18+ support

**Location**: Root `package.json`

**Issue**: Lerna v3 is from 2019. Version 5+ has better Node 18+ support and improved performance.

**Recommended Upgrade**:
```json
"lerna": "^8.0.0"
```

**Breaking Changes**:
- Lerna v4+ requires Node 14+
- Lerna v5+ requires Node 16+
- Lerna v6+ requires Node 18+
- Major changes to configuration format
- Consider migrating to Nx, Turborepo, or pnpm workspaces as alternatives

**Migration Notes**:
- Review `lerna.json` configuration
- Update scripts that use Lerna CLI
- Test workspace linking and publishing

---

### 12. `yarn`: `^1.22.0` ⚠️

**Status**: **DEPRECATED** - Yarn 1 is in maintenance mode

**Location**: Root `package.json`

**Issue**: Yarn Classic (v1) is deprecated. Yarn Berry (v2+) or npm is recommended.

**Recommended Options**:

**Option 1 - Yarn Berry**:
```json
"packageManager": "yarn@3.6.4"
```

**Option 2 - npm** (remove yarn dependency):
- Use npm workspaces (built-in since npm 7+)
- Remove yarn from devDependencies

**Migration Notes**:
- Yarn 2+ uses Plug'n'Play (PnP) by default (can be disabled)
- Different lockfile format (`.yarn/cache` vs `yarn.lock`)
- Different CLI commands
- Consider `corepack` for package manager version management

---

## Moderate Issues (Medium Priority)

### 13. `chalk`: `^2.4.2` ⚠️

**Status**: **OUTDATED** - Limited Node 18+ support

**Location**: Root `package.json`

**Issue**: Chalk v2 is EOL. Version 4+ has better Node 18+ support and ESM compatibility.

**Recommended Upgrade**:
```json
"chalk": "^4.1.2"
```

**Breaking Changes**:
- Chalk v4+ is ESM-only, may require `.mjs` extension or `"type": "module"` in package.json
- If ESM migration is not feasible, consider `chalk@^5.3.0` (also ESM) or stick with v4

---

### 14. `rimraf`: `^2.6.2` ⚠️

**Status**: **OUTDATED** - Poor Node 18+ support

**Location**: Root `package.json`

**Issue**: Version 2.x has issues with Node 18+ and modern filesystem APIs.

**Recommended Upgrade**:
```json
"rimraf": "^5.0.5"
```

**Breaking Changes**:
- v3+ requires Node 10+
- v5+ is ESM-only
- If ESM migration is not feasible, use `rimraf@^3.0.2`

---

### 15. `semver`: `^5.6.0` ⚠️

**Status**: **OUTDATED** - Very old version

**Location**: Root `package.json`

**Issue**: Version 5.x is from 2018. Version 7+ has better TypeScript support and bug fixes.

**Recommended Upgrade**:
```json
"semver": "^7.5.4"
```

**Breaking Changes**:
- Some API methods have changed
- Better TypeScript definitions
- Improved performance

---

### 16. `child-process-promise`: `^2.2.1` ⚠️

**Status**: **UNMAINTAINED** - Last updated in 2018

**Location**: Root `package.json`

**Issue**: Package appears to be unmaintained. Consider native alternatives or maintained alternatives.

**Recommended Alternatives**:
- Use native `util.promisify()` with `child_process`
- Use `execa` (actively maintained)
- Use `node:child_process` with async/await

**Example Migration**:
```javascript
// Old
const { exec } = require('child-process-promise');

// New (native)
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Or use execa
const { execa } = require('execa');
```

---

### 17. `babel-core`: `^7.0.0-bridge.0` ⚠️

**Status**: **BRIDGE PACKAGE** - May not be needed

**Location**: Root `package.json`

**Issue**: This is a bridge package for Babel 6 → 7 migration. If fully on Babel 7, this may not be needed.

**Action**: Review if this is still required. If all packages use Babel 7+, this can likely be removed.

---

### 18. `identity-obj-proxy`: `^3.0.0` ⚠️

**Status**: **OUTDATED** - May have issues with newer Jest

**Location**: Root `package.json`

**Issue**: Version 3.0.0 is from 2017. Newer versions have better Jest 29+ compatibility.

**Recommended Upgrade**:
```json
"identity-obj-proxy": "^3.0.2"
```

**Note**: Consider using `jest-transform-css` or CSS module mocks if migrating to Jest 29+.

---

### 19. `debug`: `^4.1.1` and `^3.1.0` ⚠️

**Status**: **OUTDATED** - Version 4.3.4+ recommended

**Location**: 
- Root `package.json`: `^4.1.1`
- `packages/match/configure/package.json`: `^3.1.0` (very old)

**Issue**: Older versions may have minor compatibility issues. Version 3.1.0 is very old.

**Recommended Upgrade**:
```json
"debug": "^4.3.4"
```

**Action**: Standardize on one version across all packages.

---

## Version Inconsistencies

### 20. `lodash`: Multiple versions ⚠️

**Status**: **VERSION INCONSISTENCY** - Should be standardized

**Locations**: Various packages use different versions:
- `^4.17.10` (number-line, multiple-choice, placement-ordering, etc.)
- `^4.17.11` (ebsr, drawing-response, complex-rubric)
- `^4.17.15` (most configure packages)
- `^4.17.19` (placement-ordering/controller)

**Recommended Action**:
- Standardize on `^4.17.21` (latest 4.x) or migrate to individual lodash functions
- Consider using `lodash-es` for tree-shaking
- Or migrate to native JavaScript alternatives where possible

**Note**: Consider using individual lodash packages (e.g., `lodash.debounce`) for better tree-shaking.

---

### 21. `prop-types`: Multiple versions ⚠️

**Status**: **VERSION INCONSISTENCY** - Should be standardized

**Locations**: Various packages use different versions:
- `^15.6.1` (many packages)
- `^15.6.2` (many configure packages)
- `^15.7.2` (rubric, image-cloze-association, complex-rubric, drawing-response)

**Recommended Action**:
- Standardize on `^15.8.1` (latest version)
- Or consider removing prop-types if using TypeScript

**Note**: If migrating to React 20 and TypeScript, prop-types may not be needed.

---

## Low Priority / Monitoring

### 22. `@babel/plugin-proposal-*` packages

**Status**: **NOMENCLATURE CHANGE** - Consider renaming

**Location**: Root `package.json`

**Issue**: Babel 7.9+ renamed "proposal" plugins to standard plugins as features became stable.

**Action**: These still work but consider updating names:
- `@babel/plugin-proposal-class-properties` → `@babel/plugin-transform-class-properties`
- `@babel/plugin-proposal-export-default-from` → `@babel/plugin-transform-export-default-from`
- `@babel/plugin-proposal-export-namespace-from` → `@babel/plugin-transform-export-namespace-from`
- `@babel/plugin-proposal-object-rest-spread` → Built into `@babel/preset-env` (can be removed)
- `@babel/plugin-proposal-optional-chaining` → Built into `@babel/preset-env` (can be removed)

**Note**: Some proposals are now part of `@babel/preset-env` and don't need separate plugins.

---

## Migration Checklist

When upgrading these dependencies:

### Critical (React 18 Compatibility)
- [ ] Update `@testing-library/react` to v13.4.0+ (required for React 18)
- [ ] Remove `@testing-library/react-hooks` and migrate to `renderHook` from `@testing-library/react`
- [ ] Upgrade `d3-selection` to v3.0.0+ (update code to use `pointer()` instead of `mouse()`)
- [ ] Upgrade `d3-scale` to v4.0.2+
- [ ] Migrate `react-beautiful-dnd` to `@dnd-kit/core`
- [ ] Replace or update `react-swipeable-views`
- [ ] Upgrade `react-transition-group` to v4.4.5+ in all packages
- [ ] Migrate `react-jss` to `@emotion/react` or upgrade
- [ ] Update `react-konva` to latest version compatible with React 18

### Security & Maintenance
- [ ] Upgrade `minimist` to v1.2.8+ (security fix)
- [ ] Upgrade `chalk` to v4+ (consider ESM migration)
- [ ] Upgrade `rimraf` to v3+ or v5+ (consider ESM migration)
- [ ] Upgrade `semver` to v7+
- [ ] Upgrade `lerna` to v8+ (major migration required)
- [ ] Migrate from Yarn 1 to Yarn 3+ or npm
- [ ] Replace `child-process-promise` with native or `execa`
- [ ] Review and remove `babel-core` bridge if not needed
- [ ] Upgrade `identity-obj-proxy` to v3.0.2+
- [ ] Standardize `debug` version to v4.3.4+

### Standardization
- [ ] Standardize `lodash` version across all packages
- [ ] Standardize `prop-types` version across all packages
- [ ] Update Babel plugin names (proposal → transform)
- [ ] Ensure Babel preset-react supports React 18

### Testing & Validation
- [ ] Test all build and test scripts
- [ ] Update CI/CD pipelines if needed
- [ ] Review and update documentation

---

## Testing After Upgrades

After upgrading dependencies, ensure:

1. ✅ All tests pass
2. ✅ Build process completes successfully
3. ✅ Lerna workspace commands work correctly
4. ✅ Package publishing works (if applicable)
5. ✅ No deprecation warnings in console
6. ✅ React 18 features work as expected (concurrent rendering, automatic batching, etc.)
7. ✅ Node 18+ compatibility verified (Node 20+ preferred)
8. ✅ Concurrent rendering works correctly
9. ✅ Automatic batching behaves as expected
10. ✅ D3 interactions work with React 18's concurrent rendering
11. ✅ Drag and drop functionality works (after migrating from react-beautiful-dnd)
12. ✅ Transitions and animations work correctly
13. ✅ Canvas rendering works (react-konva)
14. ✅ No React 18-specific warnings or errors

---

## Resources

- [React 18 Upgrade Guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
- [React 18 Release Notes](https://react.dev/blog/2022/03/29/react-v18)
- [Node.js 18 Release Notes](https://nodejs.org/en/blog/release/v18.0.0)
- [Node.js 20 Release Notes](https://nodejs.org/en/blog/release/v20.0.0)
- [Lerna Migration Guide](https://lerna.js.org/docs/getting-started)
- [Yarn Migration Guide](https://yarnpkg.com/getting-started/migration)
- [Testing Library React 18 Support](https://github.com/testing-library/react-testing-library/releases)
- [D3 Selection v3 Migration](https://github.com/d3/d3-selection/releases/tag/v3.0.0)
- [@dnd-kit Migration Guide](https://docs.dndkit.com/introduction/migrating-from-react-beautiful-dnd)

---

## React 18 Compatibility Considerations

### React 18 Features to Consider

- **Concurrent Rendering**: Automatic batching, transitions, suspense improvements
- **New Hooks**: useId, useTransition, useDeferredValue, useSyncExternalStore
- **Automatic Batching**: Better performance with automatic batching of state updates
- **Improved Suspense**: Better support for data fetching and code splitting

### Compatibility Checklist for React 18

- [ ] All dependencies support React 18
- [ ] No deprecated React APIs in use
- [ ] Testing library updated to v13.4.0+
- [ ] Babel preset-react supports React 18
- [ ] ESLint React plugin updated
- [ ] TypeScript types updated (if using TypeScript)
- [ ] D3 libraries updated and tested
- [ ] Drag and drop libraries updated
- [ ] Canvas libraries (react-konva) tested
- [ ] Transitions work correctly with concurrent rendering

---

## Notes

- This document should be updated as dependencies are upgraded
- Check for security advisories regularly: `npm audit` or `yarn audit`
- Consider using Dependabot or Renovate for automated dependency updates
- Test thoroughly in a separate branch before merging upgrades
- React 18 requires careful testing - ensure all user interactions work correctly with concurrent rendering
- Some packages may have transitive dependencies that also need updating
- Use `yarn why <package>` or `npm ls <package>` to find all usages of deprecated packages

---

**Last Updated**: 2024
**Maintained By**: PIE Framework Team
