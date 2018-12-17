import logger from './logger';
import setupExpress from './express';

const config = require('../config/config');
const mongoose = require('./mongoose');

function seedDB() {
  if (config.seedDB && config.seedDB.seed) {
    logger.warn('Warning:  Database seeding is turned on');
  }
}

mongoose.loadModels(seedDB);

module.exports.loadModels = function loadModels() {
  mongoose.loadModels();
};

module.exports.init = function init(callback) {
  setupExpress();
  return Promise.all([mongoose.connect()])
    .then(() => {
      logger.info('connected to mongo');
      if (callback) callback();
    })
    .catch(e => {
      logger.info(e);
    });
};

module.exports.start = function start(callback) {
  logger.info('app starting');
  const _this = this;
  _this.init(() => {
    logger.info('app initialized');
    if (callback) callback();
  });
};
