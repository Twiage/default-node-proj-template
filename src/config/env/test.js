'use strict';

const defaultEnvConfig = require('./default');

module.exports = {
  db: {
    uri: process.env.MONGO_URL || process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || `mongodb://${process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost'}/twiage-test`,
    options: {
      mongos: false,
      user: '',
      pass: '',
    },
    debug: process.env.MONGODB_DEBUG || false,
  },
  log: {
    format: process.env.LOG_FORMAT || 'combined',
    options: {
      stream: {
        directoryPath: process.cwd(),
        fileName: 'access.log',
        rotatingLogs: {
          active: false,
          fileName: 'access-%DATE%.log',
          frequency: 'daily',
          verbose: false,
        },
      },
    },
  },
  port: process.env.PORT || 3001,
  app: {
    title: `${defaultEnvConfig.app.title} - Test Environment`,
  },
};
