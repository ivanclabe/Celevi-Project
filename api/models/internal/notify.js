'use strict';
/**
 * Modelo Notify.
 * @version 0.1
 * @author Ivanclabe
 * @module connect
 * @copyright Callback S.A.S / GeoRuta Proyect
 * @public
 */
const mongoose = require('mongoose');
const BaseSchema = require('../_schema');

const allowedType = ['Level1', 'Level2', 'Level3'];

// Esquema Notify
var notifySchema = new BaseSchema({
  body: { type: String },
  type: {
    type: String,
    enum: allowedType,
    default: 'Level1'
  }
}, { collection: 'notify', index: { type: 1 }, toJSON: { virtuals: true } });

exports.Notify = {
  URLNameRoute: 'nofies',
  model: mongoose.model('Notify', notifySchema)
};
