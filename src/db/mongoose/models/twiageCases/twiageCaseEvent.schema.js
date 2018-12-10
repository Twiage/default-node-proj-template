'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const baseSchema = require('../base.model');
const eventTypes = require('../../../../core/eventTypes').default;


const TwiageCaseEventSchema = new Schema({
  type: {
    type: String,
    enum: [
      eventTypes.CREATE_CASE,
      eventTypes.SET_DESTINATION,
      eventTypes.SET_COMPLAINT,
      eventTypes.SET_AGE,
      eventTypes.SET_GENDER,
      eventTypes.SET_TAG,
      eventTypes.REMOVE_TAG,
      eventTypes.ADD_PHOTO,
      eventTypes.ADD_ID,
      eventTypes.ADD_EKG,
      eventTypes.ADD_VIDEO,
      eventTypes.ADD_VOICE,
      eventTypes.ACKNOWLEDGE,
      eventTypes.CHAT_MESSAGE,
      eventTypes.ASSIGN_ROOM,
      eventTypes.CLOSED_BY_EMS,
      eventTypes.MARKED_AS_ARRIVED,
    ],
    required: true,
  },
  data: { type: String },
});

TwiageCaseEventSchema.plugin(baseSchema);
module.exports = TwiageCaseEventSchema;
