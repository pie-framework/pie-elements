/**
 * Rollup configuration for ESM builds
 * Creates parallel ESM bundles in esm/ directory
 */

const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { babel } = require('@rollup/plugin-babel');
const postcss = require('rollup-plugin-postcss');

const isProduction = process.env.NODE_ENV === 'production';

// All dependencies that should remain external
const external = [
  // React ecosystem
  'react',
  'react-dom',
  'react-dom/server',
  'prop-types',
  /^react\//,
  /^react-dom\//,
  
  // Material-UI (keep all sub-paths external)
  '@material-ui/core',
  '@material-ui/icons',
  /^@material-ui\//,
  
  // Lodash (keep all sub-paths external)
  'lodash',
  /^lodash\//,
  
  // Common utilities
  'classnames',
  'debug',
  
  // Konva (for hotspot)
  'konva',
  'react-konva',
  
  // Math libraries
  '@pie-framework/mathquill',
  
  // PIE framework
  '@pie-framework/pie-player-events',
  '@pie-framework/pie-configure-events',
  /^@pie-framework\//,
  
  // All @pie-lib packages (shared libraries)
  /@pie-lib\/.*/,
  
  // All @pie-element packages (other elements)
  /@pie-element\/.*/,
];

const plugins = [
  nodeResolve({
    extensions: ['.js', '.jsx'],
    browser: true,
    preferBuiltins: false,
  }),
  postcss({
    // Extract CSS to separate files (one per entry point)
    extract: true,
    // Minimize CSS in production
    minimize: isProduction,
    // Don't inject CSS into JS
    inject: false,
  }),
  babel({
    babelHelpers: 'bundled',  // Inline helpers for pure ESM
    exclude: /node_modules/,
    babelrc: false,  // Don't read .babelrc files
    configFile: false,  // Don't read babel.config.js
    assumptions: {
      // Force pure ESM output (no CommonJS)
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
          esmodules: true, // Target modern browsers with ESM support
        },
        modules: false, // Keep ES modules
        bugfixes: true,  // Use smaller, modern transforms
      }],
    ],
    extensions: ['.js', '.jsx'],
  }),
  commonjs({
    include: /node_modules/,
  }),
].filter(Boolean);

module.exports.default = function createConfig(input, output) {
  return {
    input,
    output: {
      file: output,
      format: 'esm',
      sourcemap: true,
      exports: 'auto',
    },
    external,
    plugins,
  };
}

