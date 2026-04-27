// Mock lodash-es by re-exporting lodash (CommonJS version for Jest compatibility)
// This allows Jest to use lodash-es imports without ES module transformation issues
const lodash = require('lodash');
module.exports = lodash;
