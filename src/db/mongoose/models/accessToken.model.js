'use strict';

const crypto = require('crypto');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const AccessTokenSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },

  token: {
    type: String,
    unique: true,
  },

  expirationDate: {
    type: Date,
  },
});

function hashToken(token) {
  return crypto.createHash('sha1').update(token).digest('hex');
}

AccessTokenSchema.pre('save', function (next) {
  if (this.token) {
    this.token = hashToken(this.token);
  }
  next();
});

AccessTokenSchema.methods.isExpired = function () {
  return Date.now() >= this.expirationDate;
};

AccessTokenSchema.statics.hashToken = hashToken;

mongoose.model('AccessToken', AccessTokenSchema);
