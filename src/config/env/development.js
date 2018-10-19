'use strict';

const defaultEnvConfig = require('./default');

module.exports = {
  db: {
    uri: process.env.MONGO_URL || process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || `mongodb://${process.env.DB_1_PORT_27017_TCP_ADDR || '34.225.28.36'}/twiage`,
    options: {
      mongos: false,
      user: 'twiageapi',
      pass: 'vp5mU0i7iOCk',
    },
    debug: process.env.MONGODB_DEBUG || false,
  },
  log: {
    format: 'combined',
    options: {
    },
  },
  app: {
    title: `${defaultEnvConfig.app.title} - Development Environment`,
  },
  livereload: true,
};
