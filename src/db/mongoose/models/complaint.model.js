'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;
const baseSchema = require('./base.model');
const arrayExtensions = require('./array.model');

const ComplaintSchema = new Schema({
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Name cannot be blank',
    editable: true,
  },
  priority: {
    type: Number,
    min: 1,
    max: 3,
    required: 'Priority must be one of 1=Emergent, 2=Urgent, 3=Routine',
  },
  sortOrder: {
    type: Number,
    default: 999,
    required: 'Sort Order cannot be blank',
  },
  tags: [{ type: mongoose.Schema.ObjectId, ref: 'Tag' }],
  showInterventions: {
    type: Boolean,
    default: true,
  },
  showSymptoms: {
    type: Boolean,
    default: true,
  },
  showLocation: {
    type: Boolean,
    default: false,
  },
  showOnsets: {
    type: Boolean,
    default: false,
  },
  showVitals: {
    type: Boolean,
    default: true,
  },
  complaintSet: {
    type: String,
    required: 'Complaint set cannot be blank',
    default: 'default',
  },
});

ComplaintSchema.plugin(baseSchema);
ComplaintSchema.plugin(arrayExtensions);
mongoose.model('Complaint', ComplaintSchema);
