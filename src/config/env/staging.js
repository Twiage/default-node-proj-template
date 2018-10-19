'use strict';

const defaultEnvConfig = require('./default');

module.exports = {
  log: {
    format: 'combined',
    options: {},
  },
  app: {
    title: `${defaultEnvConfig.app.title} - Staging Environment`,
  },
  baseUrl: 'https://api-stage.twiagemed.net',
  livereload: false,
  statsd: {
    mock: false,
    host: '172.17.0.2',
    port: 8125,
    prefix: 'twiage.',
    suffix: '.staging',
    globalTags: ['staging', 'api'],
  },
};
