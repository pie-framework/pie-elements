// babel.config.js
module.exports = (api) => {
  const isProd = api.env('production');
  api.cache(true);

  return {

    presets: [
      ['@babel/preset-env', {
        targets: '>0.5%, not dead',
        modules: false,
      }],
      ['@babel/preset-react', { runtime: 'automatic', development: !isProd }],
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-transform-runtime',
      '@babel/plugin-transform-destructuring',
      '@babel/plugin-transform-spread',
      '@babel/plugin-transform-classes',
      '@babel/plugin-proposal-object-rest-spread',
     '@babel/plugin-proposal-optional-chaining'
    ],
    // Custom ignore function to ensure MUI packages and source files are transpiled
    ignore: [
      function(filepath) {
        // Never ignore @mui packages - they need transpilation
        if (filepath.includes('@mui/') || filepath.includes('@material-ui/')) {
          return false;
        }
        // Never ignore @emotion packages
        if (filepath.includes('@emotion/')) {
          return false;
        }
        // Never ignore @pie-lib packages
        if (filepath.includes('@pie-lib/')) {
          return false;
        }
        // Don't ignore source files - they need transpilation
        if (filepath.includes('/src/') || filepath.includes('\\src\\')) {
          return false;
        }
        // Ignore other node_modules packages
        return filepath.includes('node_modules');
      }
    ],
    sourceMaps: true,
  };
};
