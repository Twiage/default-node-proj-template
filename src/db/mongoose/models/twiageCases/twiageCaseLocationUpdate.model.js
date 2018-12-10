'use strict';

const { all } = require('bluebird');
const { head } = require('lodash/fp');
const mongoose = require('mongoose');

const LocationUpdate = mongoose.model('LocationUpdate');

const create = (tCase, locationUpdateData) => {
  locationUpdateData.twiageCase = tCase._id;

  return tCase
    .populate('destinationHospital')
    .execPopulate()
    .then(popCase => {
      if (popCase.destinationHospital) {
        locationUpdateData.hospital = {
          longitude: popCase.destinationHospital.longitude,
          latitude: popCase.destinationHospital.latitude,
        };
      }

      return LocationUpdate.create(locationUpdateData);
    })
    .then(locationUpdate => {
      tCase.locationUpdates = [locationUpdate];
      return tCase.save();
    });
};

const remove = (tCase, id) => {
  tCase.locationUpdates.pull({ _id: id });
  return all([tCase.save(), LocationUpdate.findByIdAndRemove(id)]).then(head);
};

module.exports = { create, remove };
