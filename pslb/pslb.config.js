const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');

const blacklist = ['pie-models', 'math-inline', 'protractor', 'ruler', 'calculator', 'select-text'];

const packagesDir = path.resolve(__dirname, '../packages');
/** Pslb will only support pie packages that have a configure and controller subpkg */
const listPackages = () => {
  // eslint-disable-next-line no-undef
  // const root = path.resolve(__dirname, 'packages');

  const files = fs.readdirSync(packagesDir);

  return _.compact(
    files
      .filter((f) => !f.includes('@'))

      .filter((f) => !blacklist.includes(f))
      .map((f) => {
        try {
          const rootPkg = fs.readJsonSync(path.join(packagesDir, f, 'package.json'));
          return rootPkg.name;
        } catch (e) {
          console.warn(`error for: ${f}, ${e.message}`);
        }
      }),
  );
};

module.exports = {
  packages: listPackages(),
  packagesDir,
  type: 'pie-package',
  piePkgOpts: {
    configure: true,
    controller: true,
    element: true,
  },
  extensions: {
    commonJs: {},
  },
  mode: 'production',
  range: '^',
  minify: true,
  libs: {
    repository: 'pie-framework/pie-elements',
    packages: [
      { name: '@pie-lib/drag-module', version: '^2.11.3' },
      { name: '@pie-lib/math-rendering-module', version: '^3.1.3' },
      { name: '@pie-lib/math-edit-module', version: '^2.8.3' },
      { name: '@pie-lib/shared-module', version: '^1.17.1' },
      { name: '@pie-lib/editable-html-module', version: '^5.9.3' },
      { name: '@pie-lib/config-module', version: '^2.23.1' },
    ],
  },
};
