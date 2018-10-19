'use strict';

const _ = require('lodash');
const crypto = require('crypto');
const mongoose = require('mongoose');

const { Schema } = mongoose;
const path = require('path');

const baseSchema = require(path.resolve('./src/core/models/base.model'));
const arrayExtensions = require(path.resolve('./src/core/models/array.model'));
const isCidr = require('is-cidr').isCidrV4;

/**
 * Hospital Schema
 */
const HospitalSchema = new Schema({
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Name cannot be blank',
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  addressLine1: {
    type: String,
    trim: true,
  },
  addressLine2: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  postalCode: {
    type: String,
    trim: true,
  },
  allowedIps: [{ type: String }],
  domains: [{ type: String, required: 'At least one domain should be set' }],
  controllingAgencies: [{ type: mongoose.Schema.ObjectId, ref: 'ControllingAgency' }],
  emsAgencies: [{ type: mongoose.Schema.ObjectId, ref: 'EMSAgency' }],
  administrators: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  members: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  alerterChannelId: String,
});

HospitalSchema.pre('save', function (next) {
  if (this.isNew) {
    this.alerterChannelId = crypto.randomBytes(16).toString('hex');
  }

  process.nextTick(next);
});

HospitalSchema.virtual('updatesChannelId').get(function () {
  return [
    { version: 1, value: `updates-v1-${this.alerterChannelId}` },
  ];
});

HospitalSchema.path('allowedIps')
  .validate(allowedIps => {
    if (!allowedIps || _.isEmpty(allowedIps)) {
      return true;
    }
    return _.every(allowedIps, isCidr);
  }, 'Must be a valid IP address in a CIDR format.');

HospitalSchema.plugin(baseSchema);
HospitalSchema.plugin(arrayExtensions);
exports.HospitalSchema = HospitalSchema;
mongoose.model('Hospital', HospitalSchema);
