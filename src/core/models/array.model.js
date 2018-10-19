'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const OBJECT_ID_REGEXP = /^[0-9a-fA-F]{24}$/;

function isExists(collection, item) {
  const validObjectId = ObjectId.isValid(item) && OBJECT_ID_REGEXP.test(item);
  const comparer = validObjectId
    ? id => id.equals(item)
    : id => _.isEqual(id, item);
  return _.some(collection, comparer);
}

module.exports = function (schema) {
  schema.methods.addToSet = function (subsetName, item) {
    const subset = this[subsetName];
    const exists = isExists(subset, item);
    if (exists) {
      return false;
    }

    subset.push(item);
    return true;
  };

  schema.methods.removeFromSet = function (subsetName, item) {
    const subset = this[subsetName];
    const exists = isExists(subset, item);
    if (!exists) {
      return false;
    }

    subset.pull(item);
    return true;
  };
};
