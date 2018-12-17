'use strict';

import eventTypes from '../../../../core/eventTypes';
import {
  MEDIA_TYPE_EKG,
  MEDIA_TYPE_ID,
  MEDIA_TYPE_PHOTO,
  MEDIA_TYPE_VIDEO,
  MEDIA_TYPE_VOICE_MEMO,
} from '../../../../core/constants';

const mongoose = require('mongoose');

const create = (twiageCase, event) => mongoose
  .model('TwiageCase')
  .findByIdAndUpdate(twiageCase.id, {
    $push: {
      events: {
        $each: [event],
        $position: 0,
      },
    },
  }, { new: true })
  .exec();

const remove = (twiageCase, id) => mongoose
  .model('TwiageCase')
  .findByIdAndUpdate(twiageCase.id, {
    $pull: { events: { _id: id } },
  }, { new: true })
  .exec();

const createMediaEvent = (mediaType, twiageCase, user) => {
  let eventType = '';
  switch (mediaType) {
  case MEDIA_TYPE_EKG: {
    eventType = eventTypes.ADD_EKG;
    break;
  }
  case MEDIA_TYPE_ID: {
    eventType = eventTypes.ADD_ID;
    break;
  }
  case MEDIA_TYPE_PHOTO: {
    eventType = eventTypes.ADD_PHOTO;
    break;
  }
  case MEDIA_TYPE_VIDEO: {
    eventType = eventTypes.ADD_VIDEO;
    break;
  }
  case MEDIA_TYPE_VOICE_MEMO: {
    eventType = eventTypes.ADD_VOICE;
    break;
  }
  default: return null;
  }
  const event = {
    type: eventType,
    createdBy: user,
  };
  return module.exports.create(twiageCase, event);
};

module.exports = { create, remove, createMediaEvent };
