module.exports = {
  pkg: {
    type: 'pie-package'
  },
  packages: ['@pie-element/number-line']
};

/**
 * building element:
 *   open pkg.json, open pie
 *   if element - then we just need to point to the module url so : @pie-ui/mc@^4.11.12/module/index.js in a js file?
 *   if configure/controller - same?
 *
 * building configure:
 *   say cfg depends on pie ui - we want to mark that as an extrnal, then redirect it to the remote url
 *   also use the libs from any pie-ui el..
 *   - create any additional libs here
 *
 * building controller:
 * this is a node compatible + bm compatibale el - so should be a straight build (cant do a bm dependency) - so straight up
 *
 * (deployment): on npm publish - set up a hook that will pull the controller into a cf or lambda
 *
 * cmd usage:
 *   yarn pslb -c pslb.config.js
 *
 */
