# Manual Beta Publishing Guide

This guide explains how to manually publish pie-elements packages as beta versions and update dependencies.

## Prerequisites

1. Ensure you're logged into npm: `npm whoami`
2. Ensure you have build artifacts: `yarn build`
3. Ensure tests pass: `yarn test`

## Publishing Beta Versions

### Option 1: Publish All Changed Packages

```bash
# Publish all packages that have changed since last release
yarn publish:beta:prerelease

# Or for a patch bump
yarn publish:beta:patch

# Or for a minor bump  
yarn publish:beta:minor

# Or for a major bump (premajor)
yarn publish:beta
```

### Option 2: Publish Specific Packages

```bash
# Publish only specific packages (replace with actual package names)
lerna publish prerelease --dist-tag beta --preid beta --force-publish @pie-element/categorize,@pie-element/categorize-configure,@pie-element/categorize-controller --ignore-scripts
```

### Option 3: Continue from Previous Failed Publish

If a previous publish was interrupted:

```bash
yarn publish:beta:continue
```

## Updating Dependencies After Publishing

After publishing new beta versions, you need to update dependencies in packages that depend on the newly published packages.

### Manual Process

1. **Find packages that depend on the published package:**

```bash
# Example: Find packages depending on @pie-element/multiple-choice
grep -r "@pie-element/multiple-choice" packages/ --include="package.json"
```

2. **Update the version in each dependent package's package.json**

3. **Run yarn install to update yarn.lock**

### Automated Script

Use the provided script to automatically update dependencies:

```bash
node scripts/update-pie-element-deps.js @pie-element/package-name 13.0.0-beta.1
```

This will:
- Find all packages depending on the specified package
- Update their package.json files
- Update yarn.lock

## Step-by-Step Example

Let's say you want to publish `@pie-element/categorize` and update its dependents:

1. **Build the packages:**
   ```bash
   yarn build
   ```

2. **Publish categorize:**
   ```bash
   lerna publish prerelease --dist-tag beta --preid beta --force-publish @pie-element/categorize,@pie-element/categorize-configure,@pie-element/categorize-controller --ignore-scripts
   ```

3. **Note the new version** (e.g., `12.0.0-beta.1`)

4. **Find packages depending on categorize:**
   ```bash
   grep -r "@pie-element/categorize" packages/ --include="package.json"
   ```

5. **Update dependencies** using the script or manually

6. **Install dependencies:**
   ```bash
   yarn install
   ```

## Important Notes

- Lerna uses independent versioning, so each package has its own version
- The `--force-publish` flag ensures packages are published even if unchanged
- The `--ignore-scripts` flag skips lifecycle scripts during publish
- Always update `yarn.lock` after changing dependencies
- Test after updating dependencies to ensure compatibility
