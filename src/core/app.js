const logger = require('./logger').default;
const config = require('../config/config');
const mongoose = require('./mongoose');
const express = require('./express');

mongoose.loadModels();

module.exports.loadModels = function loadModels() {
  mongoose.loadModels();
};

module.exports.init = function init(callback) {
  // eslint-disable-next-line import/no-named-as-default-member
  return Promise.all([mongoose.connect()])
    .then(values => {
      logger.info('Connected to Mongo');
      const db = values[0];
      const app = express.init(db);
      if (callback) callback(app, db, config);
    }).catch(e => {
      logger.error(e);
    });
};

module.exports.start = function start(callback) {
  logger.info('app starting');
  const _this = this;
  _this.init((app, db, appConfig) => {
    logger.info(`app initialized at ${Date.now()}`);
    // Start the app by listening on <port> at <host>
    app.listen(appConfig.port, appConfig.host, () => {
      // Create server URL
      const server = `${(process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + appConfig.host}:${appConfig.port}`;
      // Logging initialization
      logger.info(`App Name: ${appConfig.app.title}; Environment: ${process.env.NODE_ENV}; Server: ${server}; Database: ${appConfig.db.uri}; App version: ${appConfig.twiage.version}`);

      if (callback) callback(app, db, appConfig);
    });
  });
};
