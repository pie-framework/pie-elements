module.exports = {
  verbose: true,
  setupFiles: ['./jest.setup.js'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testRegex: '(/__tests__/.*(\\.|/)(test|spec))\\.jsx?$',
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '/docs/'],
  //modulePathIgnorePatterns: ['/lib/']
};
