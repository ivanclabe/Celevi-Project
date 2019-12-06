'use strict';
/**
 * Modelo Route.
 * @version 0.1
 * @name Route
 * @author Ivanclabe
 * @module connect
 * @copyright Callback S.A.S / GeoRuta Proyect
 * @private
 */
const mongoose = require('mongoose');
const { Schema } = mongoose;

var eventSchema = new Schema({
  message: String,
  time: Date
}, { discriminatorKey: 'kind', _id: false });

var batchSchema = new Schema({
  events: [eventSchema]
}, { collection: 'batches' });

// `batchSchema.path('events')` gets the mongoose `DocumentArray`
var docArray = batchSchema.path('events');

// Make sure to attach any hooks to `eventSchema` and `clickedSchema`
// **before** calling `discriminator()`.
docArray.discriminator('Worker', new Schema({
  worker: { type: String, required: true }
}, { _id: false }));

// ... and a 'purchased' event that requires the product that was purchased.
docArray.discriminator('Net', new Schema({
  net: { type: String, required: true }
}, { _id: false }));

docArray.discriminator('Controller', new Schema({
  controller: { type: String, required: true }
}, { _id: false }));

exports.Bacth = {
  URLNameRoute: 'Batch',
  model: mongoose.model('Batch', batchSchema)
};
