'use strict';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const BaseSchema = require('../_schema');

var referenceDeviceSchema = new BaseSchema({
  name: { type: String, required: true },
  serve_port: { type: String, required: true }
}, { collection: 'refdev', index: { name: 1 }, toJSON: { virtuals: true } });
referenceDeviceSchema.plugin(mongoosePaginate);

referenceDeviceSchema.virtual('device', {
  ref: 'Device', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'reference', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false,
  options: { sort: { 'meta.created.at': -1 }, limit: 5 }
  // Query options, see http://bit.ly/mongoose-query-options
});

module.exports = mongoose.model('RefDev', referenceDeviceSchema);
