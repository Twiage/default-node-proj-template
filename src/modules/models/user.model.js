'use strict';

/**
 * Module dependencies
 */
const mongoose = require('mongoose');
const crypto = require('crypto');
const _ = require('lodash');
const validator = require('validator');
const generatePassword = require('generate-password');
const owasp = require('owasp-password-strength-test');
const Promise = require('bluebird');
const uniqueValidator = require('mongoose-unique-validator');

const arrayExtensions = require('../../core/models/array.model');

const { Schema } = mongoose;
/**
 * A Validation function for local strategy properties
 */
const validateLocalStrategyProperty = function (property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy email
 */
const validateLocalStrategyEmail = function (email) {
  return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email, { require_tld: false }));
};

/**
 * User Schema
 */
const UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your first name'],
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your last name'],
  },
  email: {
    type: String,
    unique: 'Email {VALUE} is already exists',
    lowercase: true,
    trim: true,
    default: '',
    validate: [validateLocalStrategyEmail, 'Please fill a valid email address'],
  },
  username: {
    type: String,
    unique: 'Username {VALUE} is already exists',
    required: 'Please fill in a username',
    lowercase: true,
    trim: true,
  },
  mobilePhone: {
    type: String,
    validate: {
      validator(v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: '{VALUE} is not a valid phone number!',
    },
  },
  callbackNumber: {
    type: String,
    validate: {
      validator(v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: '{VALUE} is not a valid phone number!',
    },
  },
  password: {
    type: String,
    default: '',
  },
  salt: {
    type: String,
  },
  profileImageURL: {
    type: String,
    default: 'src/modules/users/client/img/profile/default.png',
  },
  provider: {
    type: String,
    required: 'Provider is required',
  },
  providerData: {},
  additionalProvidersData: {},
  roles: {
    type: [{
      type: String,
      enum: ['user', 'bigBoard', 'admin'],
    }],
    default: ['user'],
    required: 'Please provide at least one role',
  },
  updated: {
    type: Date,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  lastLoggedIn: {
    type: Date,
  },
  statShift: {
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
  },
  lastPasswordReset: {
    type: Date,
  },
  /* For reset password */
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  emsAgencyMemberships: [{ type: mongoose.Schema.ObjectId, ref: 'EMSAgency' }],
  emsAgenciesAdministered: [{ type: mongoose.Schema.ObjectId, ref: 'EMSAgency' }],
  hospitalMemberships: [{ type: mongoose.Schema.ObjectId, ref: 'Hospital' }],
  hospitalsAdministered: [{ type: mongoose.Schema.ObjectId, ref: 'Hospital' }],
  controllingAgencyMemberships: [{ type: mongoose.Schema.ObjectId, ref: 'ControllingAgency' }],
  controllingAgenciesAdministered: [{ type: mongoose.Schema.ObjectId, ref: 'ControllingAgency' }],
  filters: [{
    isSelected: Boolean,
    _id: false,
    entity: {
      id: String,
      name: String,
      priority: Number,
    },
  }],
  preferences: {
    timeFormat: {
      type: String,
      default: '12Hour',
      enum: ['12Hour', '24Hour'],
    },
    dashboardFilters: [{
      type: String,
    }],
    defaultDashboardFilter: {
      type: String,
    },
    currentFilters: {
      type: {},
      default: null,
    },
    disabledAlerts: {
      type: Array,
      default: [],
    },
    alertsBehavior: [{
      complaintId: {
        type: Schema.ObjectId,
      },
      events: [{
        types: {
          type: Array,
          default: [],
        },
        soundFileName: String,
        audioRepetition: Number,
        showAlerterBox: {
          type: Boolean,
          default: true,
        },
      }],
    }],
  },
  statEnabled: {
    type: Boolean,
    default: false,
  },
  isAlerter: {
    type: Boolean,
    default: false,
  },
}, {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform(doc, ret) {
    delete ret.__v;
  },
});

UserSchema
  .virtual('displayName')
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

UserSchema
  .virtual('displayNameReverse')
  .get(function () {
    return `${this.lastName}, ${this.firstName}`;
  });

UserSchema
  .virtual('isAdmin')
  .get(function () {
    return _.includes(this.roles, 'admin');
  });

UserSchema
  .virtual('channels.pubnub')
  .get(function () {
    return `user-${this._id}`;
  });

UserSchema
  .virtual('channels.firebase')
  .get(function () {
    return `user-${this._id}`;
  });

function findPopulateRelatedObjects(next) {
  this
    .populate('emsAgencyMemberships', 'name alerterChannelId')
    .populate('emsAgenciesAdministered', 'name alerterChannelId')
    .populate('hospitalMemberships', 'name alerterChannelId updatesChannelId allowedIps')
    .populate('hospitalsAdministered', 'name alerterChannelId')
    .populate('controllingAgencyMemberships', 'name alerterChannelId')
    .populate('controllingAgenciesAdministered', 'name alerterChannelId');

  next();
}

UserSchema.pre('find', findPopulateRelatedObjects);
UserSchema.pre('findOne', findPopulateRelatedObjects);

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = this.hashPassword(this.password);
  }

  next();
});

/**
 * Hook a pre validate method to test the local password
 */
owasp.configs = {
  allowPassphrases: true,
  maxLength: 128,
  minLength: 10,
  minPhraseLength: 20,
  minOptionalTestsToPass: 3,
  strict: true,
};

UserSchema.pre('validate', function (next) {
  if (this.provider === 'local' && this.password && this.isModified('password')) {
    owasp.config(owasp.configs);
    const result = owasp.test(this.password);

    if (!result.strong && result.errors.length) {
      const error = `Your password must be between ${owasp.configs.minLength} and ${owasp.configs.maxLength} characters long, must not contain more than 2 repeating characters and must contain ${owasp.configs.minOptionalTestsToPass} out of 4 of the following categories: lower case letter, upper case letter, number, special character/symbol.`;
      this.invalidate('password', error);
    }
  }

  next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
  if (this.salt && password) {
    // eslint-disable-next-line no-buffer-constructor
    return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64, 'sha1').toString('base64');
  }
  return password;
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
  const _this = this;
  const possibleUsername = username.toLowerCase() + (suffix || '');

  _this.findOne({
    username: possibleUsername,
  }, (err, user) => {
    if (!err) {
      if (!user) {
        callback(possibleUsername);
      } else {
        return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
      }
    } else {
      callback(null);
    }
  });
};

/**
 * Generates a random passphrase that passes the owasp test
 * Returns a promise that resolves with the generated passphrase, or rejects with an error if something goes wrong.
 * NOTE: Passphrases are only tested against the required owasp strength tests, and not the optional tests.
 */
UserSchema.statics.generateRandomPassphrase = function () {
  return new Promise(((resolve, reject) => {
    let password = '';
    const repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');

    owasp.config(owasp.configs);

    // iterate until the we have a valid passphrase
    // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present
    while (password.length < 20 || repeatingCharacters.test(password)) {
      // build the random password
      password = generatePassword.generate({
        length: Math.floor(Math.random() * (20)) + 20, // randomize length between 20 and 40 characters
        numbers: true,
        symbols: false,
        uppercase: true,
        excludeSimilarCharacters: true,
      });

      // check if we need to remove any repeating characters
      password = password.replace(repeatingCharacters, '');
    }

    // Send the rejection back if the passphrase fails to pass the strength test
    if (owasp.test(password).errors.length) {
      reject(new Error('An unexpected problem occured while generating the random passphrase'));
    } else {
      // resolve with the validated passphrase
      resolve(password);
    }
  }));
};

UserSchema.statics.generateRandomPassword = function () {
  return new Promise(((resolve, reject) => {
    let password = '';
    const repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');

    owasp.config(owasp.configs);

    let count = 0;
    // iterate until we have a valid passphrase or 500 times max
    // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present
    while (count < 500 && (password.length < 10 || repeatingCharacters.test(password) || !owasp.test(password).strong)) {
      count += 1;

      // build the random password
      password = generatePassword.generate({
        length: 10,
        numbers: true,
        symbols: false,
        uppercase: true,
        excludeSimilarCharacters: true,
      });

      // check if we need to remove any repeating characters
      password = password.replace(repeatingCharacters, '');
    }

    // Send the rejection back if the passphrase fails to pass the strength test
    if (!owasp.test(password).strong) {
      reject(new Error('An unexpected problem occured while generating the random password'));
    } else {
      // resolve with the validated passphrase
      resolve(password);
    }
  }));
};

UserSchema.statics.seed = function (entities) {
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

UserSchema.plugin(arrayExtensions);
UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);
exports.UserSchema = UserSchema;
