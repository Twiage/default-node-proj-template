'use strict';

const path = require('path');
const mongoose = require('mongoose');
const BluebirdPromise = require('bluebird');
const logger = require('./logger').default;
const config = require('../config/config');

// Set Mongoose to use Bluebird promises implementation
mongoose.Promise = BluebirdPromise;

// Load the mongoose models
module.exports.loadModels = callback => {
  config.files.models.forEach(modelPath => {
    require(path.resolve(modelPath));
  });

  if (callback) callback();
};


module.exports.connect = () => new Promise((resolve, reject) => {
  mongoose.connect(config.db.uri, config.db.options).then(() => {
    mongoose.set('debug', config.db.debug);
    resolve(mongoose);
  }).catch(err => {
    logger.error('Could not connect to MongoDB!');
    logger.error(err);
    reject(err);
  });
});

module.exports.disconnect = cb => {
  mongoose.disconnect(err => {
    console.info('Disconnected from MongoDB');
    cb(err);
  });
};
