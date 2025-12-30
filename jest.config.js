module.exports = {
  testRegex: '(/__tests__/.*(\\.|/)(test|spec))\\.jsx?$',
  setupFilesAfterEnv: ['./jest.setup.js'],

  // Jest 29 requires explicit jsdom environment
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost',
  },

  verbose: true,
  testPathIgnorePatterns: ['old-packages', '/node_modules/', '/lib/', '/docs/'],

  // Transform ES modules from these packages
  transformIgnorePatterns: [
    'node_modules/(?!(@mui|@emotion|@testing-library|@dnd-kit|@hello-pangea|@tiptap)/)',
  ],

  // Custom resolver to handle node: protocol imports
  resolver: '<rootDir>/jest-resolver.js',

  moduleNameMapper: {
    // CSS/Style imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

    // Image imports
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/__mocks__/fileMock.js',

    // Ensure React is resolved from a single location (fixes MUI nested node_modules issue)
    '^react$': '<rootDir>/node_modules/react',
    '^react-dom$': '<rootDir>/node_modules/react-dom',

    // Legacy react-dnd mappings (for packages that haven't migrated to @dnd-kit)
    '^dnd-core$': 'dnd-core/dist/cjs',
    '^react-dnd$': 'react-dnd/dist/cjs',
    '^react-dnd-html5-backend$': 'react-dnd-html5-backend/dist/cjs',
    '^react-dnd-touch-backend$': 'react-dnd-touch-backend/dist/cjs',
    '^react-dnd-test-backend$': 'react-dnd-test-backend/dist/cjs',
    '^react-dnd-test-utils$': 'react-dnd-test-utils/dist/cjs',
  },

  // Collect coverage from source files
  collectCoverageFrom: [
    'packages/*/src/**/*.{js,jsx}',
    'packages/*/configure/src/**/*.{js,jsx}',
    'packages/*/controller/src/**/*.{js,jsx}',
    '!packages/*/src/**/*.d.ts',
    '!packages/*/src/**/__tests__/**',
    '!packages/*/src/**/__mocks__/**',
    '!packages/*/configure/src/**/__tests__/**',
    '!packages/*/controller/src/**/__tests__/**',
  ],
};
