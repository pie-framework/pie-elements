# PIE Code Health Check

This repository uses the [@pie-framework/pie-code-health](https://github.com/pie-framework/pie-code-health) tool to analyze code quality.

## Usage

```bash
# Scan packages and generate reports
npm run health:check

# Or run individual steps:
npm run health:scan      # Scan packages
npm run health:report    # Generate reports  
npm run health:serve     # Start dashboard server on http://localhost:8080
```

## What You Need

1. **Dependency in package.json:**
   ```json
   "@pie-framework/pie-code-health": "git+ssh://git@github.com:pie-framework/pie-code-health.git#main"
   ```

2. **NPM Scripts:**
   - `health:scan` - Scans packages directory
   - `health:report` - Generates reports
   - `health:serve` - Starts server on port 8080
   - `health:check` - Runs all steps

3. **Gitignore:**
   - Add `reports/` to ignore generated reports

## Development

To use a local version of pie-code-health during development:

```bash
# In pie-code-health repo
cd /path/to/pie-code-health
yarn link

# In this repo
cd /path/to/pie-elements
yarn link "@pie-framework/pie-code-health"

# Make changes in pie-code-health and they'll be reflected immediately
# When done:
yarn unlink "@pie-framework/pie-code-health"
yarn install --force
```

## Output

Reports are generated in the `reports/` directory:
- `dashboard.html` - Interactive dashboard
- `summary.json` - Summary statistics
- `scan-results.json` - Raw scan data
- `package-reports/` - Individual package reports

All configuration and logic lives in the pie-code-health repository.
