const morgan = require('morgan');

// Simple wrapper to allow future extensions
const logger = morgan('combined');

module.exports = logger;
