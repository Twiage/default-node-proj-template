'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const baseSchema = require('./base.model');

const TagSchema = new Schema({
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Name cannot be blank',
  },
  type: {
    type: String,
    enum: ['intervention', 'location', 'onset', 'symptom', 'traumaLevel', 'vital'],
    required: 'type must be one of intervention, location, onset, symptom, traumaLevel or vital',
  },
  groupIdentifier: {
    type: String,
    trim: true,
  },
});

TagSchema.pre('save', function (next) {
  if (!this.get('groupIdentifier')) {
    this.groupIdentifier = this.get('name');
  }
  next();
});

TagSchema.plugin(baseSchema);
mongoose.model('Tag', TagSchema);
