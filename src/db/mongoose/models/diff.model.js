'use strict';

const _ = require('lodash');

module.exports = function (schema, options) {
  schema.pre('save', function (next) {
    if (this.isNew) {
      next();
    }

    const paths = _.difference(this.modifiedPaths(), options.ignoredPaths);
    this._lastDiff = _.reduce(paths, (result, path) => {
      const before = _.get(this, ['_original', path], null);
      const after = _.get(this, path, null);

      const similarA = after && before && after.equals && after.equals(before.id || before._id);
      const similarB = after && before && before.equals && before.equals(after.id || after._id);

      if (similarA || similarB) {
        return result;
      }

      result[path] = {
        before,
        after,
      };

      return result;
    }, {});
    next();
  });

  schema.post('init', function () {
    this._original = this.toObject();
  });
};
