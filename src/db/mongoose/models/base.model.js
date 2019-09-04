'use strict';

const mongoose = require('mongoose');


const { Schema } = mongoose;


const Promise = require('bluebird');

module.exports = function twiageBaseModel(schema) {
  schema.add({
    createdBy: {
      type: Schema.ObjectId,
      required: true,
      message: 'createdBy is required',
      ref: 'User',
    },
  });

  schema.add({
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  schema.add({
    updatedBy: {
      type: Schema.ObjectId,
      ref: 'User',
    },
  });

  schema.add({
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  });

  schema.set('toJSON', {
    virtuals: true,
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret.__v;
    },
  });

  schema.set('toObject', {
    virtuals: true,
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret.__v;
    },
  });

  schema.statics.seed = function (entities) {
    const _this = this;
    return new Promise(((resolve, reject) => {
      _this.create(entities, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }));
  };
};
