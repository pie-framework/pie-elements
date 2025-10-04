/**
 * Rollup configuration for ESM builds
 * Creates parallel ESM bundles in esm/ directory
 */

const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { babel } = require('@rollup/plugin-babel');

const isProduction = process.env.NODE_ENV === 'production';

// All dependencies that should remain external
const external = [
  // React ecosystem
  'react',
  'react-dom',
  'react-dom/server',
  'prop-types',
  
  // Material UI
  '@material-ui/core',
  '@material-ui/icons',
  
  // Common utilities
  'classnames',
  'lodash',
  'debug',
  
  // PIE framework
  '@pie-framework/pie-player-events',
  '@pie-framework/pie-configure-events',
  
  // All @pie-lib packages (shared libraries)
  /@pie-lib\/.*/,
  
  // All @pie-element packages (other elements)
  /@pie-element\/.*/,
  
  // React ecosystem sub-paths
  /^react\//,
  /^react-dom\//,
  /^lodash\//,
];

const plugins = [
  nodeResolve({
    extensions: ['.js', '.jsx'],
    browser: true,
    preferBuiltins: false,
  }),
  commonjs({
    include: /node_modules/,
  }),
  babel({
    babelHelpers: 'runtime',
    exclude: /node_modules/,
    plugins: [['@babel/plugin-transform-runtime', { regenerator: false }]],
    presets: [
      ['@babel/preset-react'],
      ['@babel/preset-env', {
        targets: {
          esmodules: true, // Target modern browsers with ESM support
        },
        modules: false, // Keep ES modules
      }],
    ],
    extensions: ['.js', '.jsx'],
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

