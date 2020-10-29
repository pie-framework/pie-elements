const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
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
  'typeOf',
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
  'Stage',
];

const immutable = [
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
  'fromJS',
];

const commonJs = {
  namedExports: {
    'node_modules/js-combinatorics/combinatorics.js': ['combination'],
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
      'Component',
      'useReducer',
    ],
    'node_modules/humps/humps.js': ['camelizeKeys'],
    'node_modules/react-dom/server.browser.js': ['renderToStaticMarkup'],
    'node_modules/react-dom/index.js': [
      'findDOMNode',
      'unstable_batchedUpdates',
    ],
    'node_modules/esrever/esrever.js': ['reverse'],
    'node_modules/slate-plain-serializer/node_modules/immutable/dist/immutable.js': immutable,
    'node_modules/immutable/dist/immutable.js': immutable,
  },
};

const blacklist = [
  'pie-models',
  'math-inline',
  'protractor',
  'ruler',
  'calculator',
];

/** Pslb will only support pie packages that have a configure and controller subpkg */
const listPackages = () => {
  // eslint-disable-next-line no-undef
  const root = path.resolve(__dirname, 'packages');
  const files = fs.readdirSync(root);

  return _.compact(
    files
      .filter((f) => !f.includes('@'))
      .filter((f) => !blacklist.includes(f))
      .map((f) => {
        try {
          const rootPkg = fs.readJsonSync(path.join(root, f, 'package.json'));
          return rootPkg.name;
        } catch (e) {
          console.warn(`error for: ${f}, ${e.message}`);
        }
      })
  );
};

module.exports = {
  packages: listPackages(),
  packagesDir: path.resolve(__dirname, './packages'),
  type: 'pie-package',
  extensions: {
    commonJs,
  },
  mode: 'development',
  range: '^',
  minify: false,
  libs: {
    repository: 'pie-framework/pie-elements',
    packages: [
      {
        name: '@pie-element/shared-config',
        // eslint-disable-next-line no-undef
        output: path.resolve(__dirname, '../packages'),
        repository: 'pie-framework/pie-elements',
        modules: [
          /** make use of the pie-ui shared lib */
          { name: '@pie-ui/shared-lib', version: '^4.0.0' },
          { name: '@pie-ui/shared-math-edit', version: '^1.17.1' },
        ],
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
          default: ['@pie-lib/editable-html'],
          namespace: [
            '@pie-framework/pie-configure-events',
            '@pie-lib/config-ui',
          ],
        },
      },
    ],
  },
};
