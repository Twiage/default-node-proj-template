'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

mongoose.model('Counter', CounterSchema);
