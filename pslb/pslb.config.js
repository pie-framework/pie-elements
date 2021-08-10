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
    'node_modules/react-beautiful-dnd/node_modules/react-is/index.js': [
      'isValidElementType',
      'isContextConsumer',
    ],
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

const packagesDir = path.resolve(__dirname, '../packages');
/** Pslb will only support pie packages that have a configure and controller subpkg */
const listPackages = () => {
  // eslint-disable-next-line no-undef
  // const root = path.resolve(__dirname, 'packages');

  const files = fs.readdirSync(packagesDir);

  return _.compact(
    files
      .filter((f) => !f.includes('@'))
      .filter((f) => f.includes('multiple-choice')) //!blacklist.includes(f))
      .map((f) => {
        try {
          const rootPkg = fs.readJsonSync(
            path.join(packagesDir, f, 'package.json')
          );
          return rootPkg.name;
        } catch (e) {
          console.warn(`error for: ${f}, ${e.message}`);
        }
      })
  );
};

console.log('packages: ', listPackages());

module.exports = {
  packages: listPackages(),
  packagesDir,
  type: 'pie-package',
  piePkgOpts: {
    configure: false,
    controller: false,
    element: true,
  },
  extensions: {
    commonJs,
  },
  mode: 'development',
  range: '^',
  minify: false,
  libs: {
    repository: 'pie-framework/pie-elements',
    /**
     * ["@pie-lib/drag-module@1.0.1",
     * "@pie-lib/math-rendering-module@1.0.3",
     * "@pie-lib/math-edit-module@1.0.1",
     * "@pie-lib/shared-module@1.1.0",
     * "@pie-lib/editable-html-module@1.0.1",
     * "@pie-lib/config-module@1.0.1"]
     */
    packages: [
      { name: '@pie-lib/drag-module', version: '^1.0.0' },
      { name: '@pie-lib/math-rendering-module', version: '^1.0.0' },
      { name: '@pie-lib/math-edit-module', version: '^1.0.0' },
      { name: '@pie-lib/shared-module', version: '^1.1.0' },
      { name: '@pie-lib/editable-html-module', version: '^1.0.0' },
      { name: '@pie-lib/config-module', version: '^1.0.0' },
    ],
  },
};
