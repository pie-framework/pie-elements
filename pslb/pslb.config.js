module.exports = {
  packages: [
    {
      type: 'pie-element-pkg',
      name: '@pie-element/multiple-choice'
    }
  ],
  libs: [
    // set up a remote lib
    // how to make sure that the deps in the remote version work for this repo?
    { name: '@pie-ui/shared-lib', version: '???' }

    // OR...
    /**
     * for each package if they have a pie.element say mc@1.x.x
     * then get a list of bm deps that that module uses and add them as a lib
     *
     * - will need to get the pm to list the browser module it uses...
     *
     * - still need to version check?
     */
  ]
};

/**
 * open pkg.json
 *
 * open pie
 *
 *   if element - then we just need to point to the module url so : @pie-ui/mc@^4.11.12/module/index.js in a js file?
 *   if configure/controller - same?
 *
 *   building configure ...
 *   say cfg depends on pie ui - we want to mark that as an extrnal, then redirect it to the remote url
 *   also use the libs from any pie-ui el..
 *   - create any additional libs here
 *
 *   building controller - this is a node compatible + bm compatibale el - so should be a straight build (cant do a bm dependency) - so straight up
 *
 *
 *
 *   yarn pslb -c pslb.config.js
 *
 *
 *   > on npm publish - set up a hook that will pull the controller into a cf or lambda
 *
 */
