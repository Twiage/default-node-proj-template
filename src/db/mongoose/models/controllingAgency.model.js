'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const baseSchema = require('./base.model');
const arrayExtensions = require('./array.model');

const ControllingAgencySchema = new Schema({
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Name cannot be blank',
  },
  domains: [{ type: String, required: 'At least one domain should be set' }],
  hospitals: [{ type: mongoose.Schema.ObjectId, ref: 'Hospital' }],
  emsAgencies: [{ type: mongoose.Schema.ObjectId, ref: 'EMSAgency' }],
  administrators: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  members: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  alerterChannelId: String,
});

ControllingAgencySchema.pre('save', function (next) {
  if (this.isNew) {
    this.alerterChannelId = crypto.randomBytes(16).toString('hex');
  }

  next();
});

ControllingAgencySchema.plugin(baseSchema);
ControllingAgencySchema.plugin(arrayExtensions);
mongoose.model('ControllingAgency', ControllingAgencySchema);
