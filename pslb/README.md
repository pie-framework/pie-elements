# number-line example

## configure

```javascript
pie: {
  element: '@pie-ui/number-line@1.0.0';
}
```

pie-ui/number-line/module/manifest.json

```javascript
{
  name: '..',
  version: '..',
  import: true, // this bm can be used as a runtime import
  /**
   * If mappings is undefined, the only thing needed to do is to swap out the bare import source for
   * the module import source
   */
  mappings: undefined,
  modules: [
    {name: '@pie-ui/shared-lib', version: '^1.0.0'}
  ]
}
```

- read in this manifest above
  1. treat `@pie-ui/number-line` as a lib with no mappings
  2. pull in each lib module and use them as part of the dll build too.

cfg src;

```javascript
import React from 'react';
import { tickUtils } from '@pie-ui/number-line';
// =>

/**
 * This import is because the shared-lib is defined in the modules section of the manifest
 */
import { _dll_react } from '../../@pie-ui/shared-lib@1.0.0/module/index.js';
const React = _dll_react;

/**
 * number-line itself is a bm lib, but because there is no mapping - we just was the import source out instead.
 */
import { tickUtils } from '../../@pie-ui/number-line@1.0.0/module/index.js';
```

1. libs must build to same location `/module/index.js` to be consistent
1. pslb should support no mappings

.. OR ..

Just hand code the libs in pslb pointing to the shared libs, require manual adjustment etc
(but don't define them - just point to them), bit of a pain in the ass but easier to set up quickly?

maybe this is phase one ^ - just to get things working/building? then can look at doing the above?

have a quick play with bigger approach then scale back if needs be

bm package :

```shell
package.json ...
module/
  index.js # the bundled browser module
  manifest.json # the manifest
  demo.html?
  demo.js?
```

manifest:

````typescript
type Manifest = {
  // npm style name/version...
  name: string;
  version: string;
  /**
   * modules that this module depends on
   */
  modules: Module[];
  /**
   * mappings for this module eg for generated libs they'd be:
   * ```typescript
   * { react: '_dll_react', 'react-dom': '_dll_react_dom' }
   * ```
   */
  mappings?: Mapping;
};

type Module = { name: string; version: string };

type Mapping = { [importName: string]: string };
````
