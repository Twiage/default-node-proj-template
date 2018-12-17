'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;
const baseSchema = require('../base.model');

const LocationUpdateSchema = new Schema({
  longitude: {
    type: Number,
    min: -180,
    max: 180,
    required: true,
  },
  latitude: {
    type: Number,
    min: -90,
    max: 90,
    required: true,
  },
  deviceCreatedAt: {
    type: Date,
    default: Date.now,
  },
  twiageCase: {
    type: Schema.ObjectId,
    ref: 'TwiageCase',
  },
  hospital: {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
});

LocationUpdateSchema.plugin(baseSchema);
mongoose.model('LocationUpdate', LocationUpdateSchema);

module.exports = LocationUpdateSchema;
