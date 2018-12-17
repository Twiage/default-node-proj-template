'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;
const crypto = require('crypto');

const baseSchema = require('./base.model');
const arrayExtensions = require('./array.model');

const EMSAgencySchema = new Schema({
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Name cannot be blank',
  },
  complaintSet: {
    type: String,
    default: 'default',
    required: 'Complaint Set cannot be blank',
  },
  maxCaseLength: {
    type: Number,
    min: 1,
    max: 10080,
    default: 120,
  },
  domains: [{ type: String, required: 'At least one domain should be set' }],
  trucks: [{ type: mongoose.Schema.ObjectId, ref: 'Truck' }],
  controllingAgencies: [{ type: mongoose.Schema.ObjectId, ref: 'ControllingAgency' }],
  hospitals: [{ type: mongoose.Schema.ObjectId, ref: 'Hospital' }],
  administrators: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  members: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  alerterChannelId: String,
});

EMSAgencySchema.pre('save', function (next) {
  if (this.isNew) {
    this.alerterChannelId = crypto.randomBytes(16).toString('hex');
  }

  next();
});

EMSAgencySchema.plugin(baseSchema);
EMSAgencySchema.plugin(arrayExtensions);
mongoose.model('EMSAgency', EMSAgencySchema);
