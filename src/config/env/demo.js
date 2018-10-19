'use strict';

const defaultEnvConfig = require('./default');

module.exports = {
  log: {
    format: 'combined',
    options: {},
  },
  app: {
    title: `${defaultEnvConfig.app.title} - Demo Environment`,
  },
  baseUrl: 'https://api-demo.twiagemed.net',
  livereload: false,
  statsd: {
    mock: false,
    host: '172.17.0.2',
    port: 8125,
    prefix: 'twiage.',
    suffix: '.demo',
    globalTags: ['demo', 'api'],
  },
};
