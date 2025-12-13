/**
 * Rollup configuration for PIE element ESM builds.
 *
 * Goals:
 * - Generate browser-friendly ESM bundles under packages/<pkg>/esm/
 * - Keep existing build pipeline unchanged (Babel lib/ + PSLB/Webpack)
 * - Prefer externalizing React + PIE packages for smaller bundles and better tree-shaking
 */

const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { babel } = require('@rollup/plugin-babel');
const postcss = require('rollup-plugin-postcss');

const isProduction = process.env.NODE_ENV === 'production';

const external = [
  'react',
  'react-dom',
  /@pie-lib\/.*/,
  /@pie-element\/.*/,
  /^@pie-framework\//,
];

const plugins = [
  nodeResolve({
    extensions: ['.js', '.jsx', '.mjs', '.cjs', '.json'],
    browser: true,
    preferBuiltins: false,
  }),
  commonjs({
    include: /node_modules/,
  }),
  postcss({
    extract: true,
    minimize: isProduction,
    inject: false,
  }),
  babel({
    babelHelpers: 'bundled',
    exclude: /node_modules/,
    babelrc: false,
    configFile: false,
    assumptions: {
      setPublicClassFields: true,
      constantSuper: true,
      noDocumentAll: true,
      objectRestNoSymbols: true,
      pureGetters: true,
      setSpreadProperties: true,
      skipForOfIteratorClosing: true,
    },
    presets: [
      ['@babel/preset-react'],
      [
        '@babel/preset-env',
        {
          targets: { esmodules: true },
          modules: false,
          bugfixes: true,
        },
      ],
    ],
    extensions: ['.js', '.jsx', '.mjs'],
  }),
  commonjs({
    exclude: /node_modules/,
  }),
].filter(Boolean);

module.exports.default = function createConfig(input, outputFile) {
  return {
    input,
    output: {
      file: outputFile,
      format: 'esm',
      sourcemap: true,
      exports: 'auto',
    },
    external,
    plugins,
  };
};


