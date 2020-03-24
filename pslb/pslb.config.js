const path = require('path');

const reactIsExports = [
  'AsyncMode',
  'ConcurrentMode',
  'ContextConsumer',
  'ContextProvider',
  'Element',
  'ForwardRef',
  'Fragment',
  'Lazy',
  'Memo',
  'Portal',
  'Profiler',
  'StrictMode',
  'Suspense',
  'isAsyncMode',
  'isConcurrentMode',
  'isContextConsumer',
  'isContextProvider',
  'isElement',
  'isForwardRef',
  'isFragment',
  'isLazy',
  'isMemo',
  'isPortal',
  'isProfiler',
  'isStrictMode',
  'isSuspense',
  'isValidElementType',
  'typeOf'
];

const konva = [
  'Layer',
  'FastLayer',
  'Group',
  'Label',
  'Rect',
  'Circle',
  'Ellipse',
  'Wedge',
  'Transformer',
  'Line',
  'Sprite',
  'Image',
  'Text',
  'TextPath',
  'Star',
  'Ring',
  'Arc',
  'Tag',
  'Path',
  'RegularPolygon',
  'Arrow',
  'Shape',
  'useStrictMode',
  'Stage'
];

const commonJs = {
  namedExports: {
    'node_modules/react-konva/lib/ReactKonva.js': konva,
    'node_modules/react-redux/node_modules/react-is/index.js': reactIsExports,
    //TODO: common js should be picking these up?
    'node_modules/react-is/index.js': reactIsExports,
    'node_modules/react/index.js': [
      'memo',
      'useLayoutEffect',
      'useEffect',
      'useState',
      'useCallback',
      'useContext',
      'cloneElement',
      'createElement',
      'createContext',
      'isValidElement',
      'useMemo',
      'useRef',
      'createRef',
      'Component'
    ],
    'node_modules/react-dom/server.browser.js': ['renderToStaticMarkup'],
    'node_modules/react-dom/index.js': ['findDOMNode'],
    'node_modules/esrever/esrever.js': ['reverse'],
    'node_modules/immutable/dist/immutable.js': [
      'Map',
      'Set',
      'List',
      'Iterable',
      'Seq',
      'Collection',
      'OrderedMap',
      'Stack',
      'OrderedSet',
      'Record',
      'Range',
      'Repeat',
      'is',
      'fromJS'
    ]
  }
};

module.exports = {
  pkg: {
    type: 'pie-package',
    // eslint-disable-next-line no-undef
    root: path.resolve(__dirname, '../packages'),
    output: '$pkg/module/index.js',
    extensions: { commonJs }
  },
  packages: ['@pie-element/number-line'],
  libs: [
    {
      name: '@pie-element/shared-config',
      // eslint-disable-next-line no-undef
      output: path.resolve(__dirname, '../packages'),
      minify: false,
      mode: 'development',
      extensions: {
        commonJs
      },
      /**
       * Ideally namespace imports would be the default import method.
       * But this can cause problems if a library does the following:
       * `module.exports = require("path");` - this causes the properties to get lost,
       * when really we'd like all the properties to be set on the module.
       * For now - specify the import method as a key of `imports`.
       *
       * To fix this we'd probably need to make a change to rollup,
       * get it to follow the var until it gets to the object definition,
       * then to use the keys to set the export object.
       *
       * @see rollup/src/ast/NamespaceVariable
       * @see rollup/plugin-commonjs/ too
       */
      imports: {
        defaults: [],
        namespace: ['@pie-framework/pie-configure-events', '@pie-lib/config-ui']
      }
    }
  ]
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
