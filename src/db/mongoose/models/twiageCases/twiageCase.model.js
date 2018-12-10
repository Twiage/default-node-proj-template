'use strict';

const crypto = require('crypto');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const Counter = mongoose.model('Counter');
const baseSchema = require('../base.model');
const LocationUpdateSchema = require('./twiageCaseLocationUpdate.schema');
const TwiageCaseEventSchema = require('./twiageCaseEvent.schema');

const arrayExtensions = require('../array.model');
const diffExtension = require('../diff.model');

const TwiageCaseSchema = new Schema({
  caseNumber: {
    type: Number,
  },
  eta: {
    type: Number,
    default: -1,
  },
  emsAgency: {
    type: mongoose.Schema.ObjectId,
    ref: 'EMSAgency',
    required: 'EMS Agency cannot be blank',
  },
  truck: {
    type: mongoose.Schema.ObjectId,
    ref: 'Truck',
    required: 'Truck cannot be blank',
  },
  destinationHospital: {
    type: mongoose.Schema.ObjectId,
    ref: 'Hospital',
  },
  beganAt: {
    type: Date,
    default: Date.now,
  },
  arrivedAt: {
    type: Date,
  },
  markedArrivedAt: {
    type: Date,
  },
  closedAt: {
    type: Date,
  },
  complaint: {
    type: mongoose.Schema.ObjectId,
    ref: 'Complaint',
  },
  gender: {
    type: String,
    validate: {
      validator(v) {
        return /^[mMfF]{1}$/.test(v);
      },
    },
    message: 'Gender must be M or F',
  },
  age: {
    validate: {
      validator(v) {
        // Weeks
        if (this.agePeriod === 1 && v >= 1 && v <= 24) { return true; }

        // Months
        if (this.agePeriod === 2 && v >= 1 && v <= 24) { return true; }

        // Years
        if (this.agePeriod === 3 && v >= 1 && v <= 120) { return true; }

        return false;
      },
    },
    type: Number,
  },
  agePeriod: {
    min: 1,
    max: 3,
    type: Number,
  },
  room: {
    type: String,
  },
  patientIdentifier: {
    type: String,
  },
  patientFirstName: {
    type: String,
  },
  patientLastName: {
    type: String,
  },
  patientAddress1: {
    type: String,
  },
  patientAddress2: {
    type: String,
  },
  patientCity: {
    type: String,
  },
  patientState: {
    type: String,
    uppercase: true,
    maxLength: 2,
    minLength: 2,
    validate: {
      validator(v) {
        return /^A[LKSZRAEP]|C[AOTZ]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]$/.test(v);
      },
    },
    message: 'State must be a valid US state or territory abbreviation',
  },
  patientPostalCode: {
    min: 1,
    max: 3,
    type: String,
    validate: {
      validator(v) {
        return /^[a-zA-Z0-9]+[ -]{0,1}[a-zA-Z0-9]+$/.test(v);
      },
    },
  },
  patientDateOfBirth: {
    type: Date,
  },
  previousHospitals: [{ type: mongoose.Schema.ObjectId, ref: 'Hospital' }],
  tags: [{ type: mongoose.Schema.ObjectId, ref: 'Tag' }],
  locationUpdates: [LocationUpdateSchema],
  events: [TwiageCaseEventSchema],
  media: [],
  channelId: String,
}, {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
});

TwiageCaseSchema.index({ createdAt: -1 });

TwiageCaseSchema
  .virtual('uploads')
  .get(function () {
    return this.mapMediaToUploads();
  });

TwiageCaseSchema
  .virtual('callbackNumber')
  .get(function () {
    if (this.createdBy && this.createdBy.callbackNumber) {
      return this.createdBy.callbackNumber;
    } if (this.truck && this.truck.callbackNumber) {
      return this.truck.callbackNumber;
    }
    return '';
  });

TwiageCaseSchema.methods.addUpload = function (upload, callback) {
  this.uploads.push(upload);
  callback();
};

TwiageCaseSchema.methods.toJSON = function () {
  const twiageCase = this.toObject();
  twiageCase.uploads = this.mapMediaToUploads();
  delete twiageCase.media;
  return twiageCase;
};

TwiageCaseSchema.methods.mapMediaToUploads = function () {
  return this.media.map(media => ({
    id: media.filename,
    createdAt: media.createdAt,
    createdBy: this.createdBy,
    type: media.type,
  }));
};

TwiageCaseSchema.methods.getComplaint = function () {
  const name = this.complaint ? this.complaint.name : 'Unknown';
  const priority = this.complaint ? this.complaint.priority : 4;
  return { name, priority };
};

TwiageCaseSchema.pre('save', function (next) {
  const doc = this;

  if (this.isNew) {
    this.channelId = crypto.randomBytes(16).toString('hex');

    Counter.findByIdAndUpdate({ _id: 'twiageCase' }, { $inc: { seq: 1 } }, {
      upsert: true,
      new: true,
    }, (error, counter) => {
      if (error) { return next(error); }

      doc.caseNumber = counter.seq;
      next();
    });
  } else {
    next();
  }
});

function findOnePopulateRelatedObjects(next) {
  this
    .populate('emsAgency', 'name members administrators controllingAgencies alerterChannelId maxCaseLength')
    .populate('destinationHospital', 'name members administrators allowedIps controllingAgencies latitude longitude alerterChannelId')
    .populate('truck', 'name isALS callbackNumber')
    .populate('complaint', 'name priority showInterventions showSymptoms showLocation showOnsets showVitals')
    .populate('tags', 'name type groupIdentifier')
    .populate('createdBy', 'firstName lastName displayName displayNameReverse email mobilePhone')
    .populate('updatedBy', 'firstName lastName displayName displayNameReverse email')
    .populate('uploads.createdBy', 'firstName lastName displayName displayNameReverse email')
    .populate('events.createdBy', 'firstName lastName displayName displayNameReverse email');

  next();
}

function findPopulateRelatedObjects(next) {
  this
    .populate('emsAgency', 'name alerterChannelId controllingAgencies maxCaseLength')
    .populate('destinationHospital', 'name latitude longitude alerterChannelId controllingAgencies')
    .populate('truck', 'name isALS callbackNumber')
    .populate('complaint', 'name priority showInterventions showSymptoms showLocation showOnsets showVitals')
    .populate('tags', 'name type groupIdentifier')
    .populate('createdBy', 'firstName lastName displayName displayNameReverse email mobilePhone')
    .populate('updatedBy', 'firstName lastName displayName displayNameReverse email')
    .populate('uploads.createdBy', 'firstName lastName displayName displayNameReverse email')
    .populate('events.createdBy', 'firstName lastName displayName displayNameReverse email');

  next();
}

TwiageCaseSchema.pre('find', findPopulateRelatedObjects);
TwiageCaseSchema.pre('findOne', findOnePopulateRelatedObjects);
TwiageCaseSchema.pre('findById', findOnePopulateRelatedObjects);

TwiageCaseSchema.plugin(baseSchema);
TwiageCaseSchema.plugin(arrayExtensions);
TwiageCaseSchema.plugin(diffExtension, { ignoredPaths: ['updatedBy', 'events'] });

mongoose.model('TwiageCase', TwiageCaseSchema);
exports.TwiageCaseSchema = TwiageCaseSchema;
