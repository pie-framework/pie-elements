// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', { 
      targets: { browsers: 'last 2 versions' }, 
      modules: false
    }],
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-transform-runtime',
  ],
  // Custom ignore function to ensure MUI packages are transpiled
  ignore: [
    function(filepath) {
      // Never ignore @mui packages - they need transpilation
      if (filepath.includes('@mui/') || filepath.includes('@material-ui/')) {
        return false;
      }
      // Ignore other node_modules packages
      return filepath.includes('node_modules');
    }
  ],
  sourceMaps: true,
};
