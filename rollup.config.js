/**
 * Rollup configuration for ESM builds - SIMPLE VERSION
 * 
 * Strategy: Bundle EVERYTHING except what's 100% proven safe
 * 
 * Safe External (proven to work):
 * - React (universal, always works) - EXCEPT for configure builds
 * - @pie-lib/* (our packages, we control the ESM)
 * - @pie-element/* (other elements, we control the ESM)
 * - @pie-framework/* (our packages, we control the ESM)
 * 
 * Everything Else: BUNDLED
 * - react-dom (Slate needs it)
 * - Material-UI (old versions)
 * - Lodash (works but bundle for safety)
 * - Slate ecosystem (no ESM)
 * - konva/react-konva (old versions)
 * - All third-party deps
 * 
 * SPECIAL CASE: Configure (authoring) builds
 * - Bundle BOTH React AND ReactDOM together
 * - Prevents version mismatches between external React and bundled ReactDOM
 * - Configure components are isolated UIs that don't need shared React instances
 * 
 * Benefits:
 * - Maximum compatibility
 * - Zero CDN transformation issues
 * - Predictable behavior
 * - Optimize later based on real data
 */

const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { babel } = require('@rollup/plugin-babel');
const postcss = require('rollup-plugin-postcss');

const isProduction = process.env.NODE_ENV === 'production';

// MINIMAL external list - Only 100% proven safe dependencies
const external = [
  // React core - Universal, always works fine external
  'react',
  
  // PIE packages - Our own, we control the ESM builds
  /@pie-lib\/.*/,
  /@pie-element\/.*/,
  '@pie-framework/pie-player-events',
  '@pie-framework/pie-configure-events',
  /^@pie-framework\//,
];

// Configure builds: Bundle React + ReactDOM together to avoid version mismatches
// Configure components are isolated authoring UIs that don't share React instances
const configureExternal = [
  // PIE packages only - Bundle React/ReactDOM for version safety
  /@pie-lib\/.*/,
  /@pie-element\/.*/,
  '@pie-framework/pie-player-events',
  '@pie-framework/pie-configure-events',
  /^@pie-framework\//,
];

const plugins = [
  nodeResolve({
    extensions: ['.js', '.jsx'],
    browser: true,
    preferBuiltins: false,
  }),
  // CommonJS MUST come BEFORE Babel
  // Convert require() to import FIRST, then transpile
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
      ['@babel/preset-env', {
        targets: {
          esmodules: true,
        },
        modules: false,
        bugfixes: true,
      }],
    ],
    extensions: ['.js', '.jsx'],
  }),
].filter(Boolean);

module.exports.default = function createConfig(input, output) {
  // Detect configure builds: bundle React + ReactDOM to avoid version mismatches
  const isConfigure = output.includes('/configure.js');
  const externalDeps = isConfigure ? configureExternal : external;
  
  return {
    input,
    output: {
      file: output,
      format: 'esm',
      sourcemap: true,
      exports: 'auto',
    },
    external: externalDeps,
    plugins,
  };
};

