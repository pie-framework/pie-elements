// Custom Jest resolver to handle node: protocol imports and workspace packages
const path = require('path');
const fs = require('fs');

module.exports = (request, options) => {
  // Strip 'node:' prefix from built-in module imports
  if (request.startsWith('node:')) {
    request = request.replace(/^node:/, '');
  }

  // Handle @pie-element workspace packages for Jest mocking
  if (request.startsWith('@pie-element/')) {
    const packageName = request.replace('@pie-element/', '');
    const parts = packageName.split('/');
    const mainPackage = parts[0];
    
    // Check if it's a subpath like "rubric/configure/lib"
    if (parts.length > 1) {
      const subpath = parts.slice(1).join('/');
      const libPath = path.join(options.rootDir, 'packages', mainPackage, subpath, 'index.js');
      if (fs.existsSync(libPath)) {
        return libPath;
      }
    }
    
    // Try main package lib/index.js
    const libPath = path.join(options.rootDir, 'packages', mainPackage, 'lib', 'index.js');
    if (fs.existsSync(libPath)) {
      return libPath;
    }
    
    // Fallback to src/index.js if lib doesn't exist
    const srcPath = path.join(options.rootDir, 'packages', mainPackage, 'src', 'index.js');
    if (fs.existsSync(srcPath)) {
      return srcPath;
    }
  }

  // Use the default Jest resolver
  return options.defaultResolver(request, options);
};
