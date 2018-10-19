'use strict';

module.exports = {
  port: process.env.PORT || 3000,
  // Binding to 127.0.0.1 is safer in production.
  host: process.env.HOST || '0.0.0.0',
  db: {
    uri: process.env.MONGO_URL || '',
    options: {
      mongos: false,
      user: process.env.MONGO_USER || '',
      pass: process.env.MONGO_PASSWORD || '',
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false,
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    format: process.env.LOG_FORMAT || 'combined',
  },
  baseUrl: 'https://api.twiagemed.net',
  statsd: {
    mock: false,
    host: '172.17.0.1',
    port: 8125,
    prefix: 'twiage.',
    suffix: '.production',
    globalTags: ['production', 'api'],
  },
};
