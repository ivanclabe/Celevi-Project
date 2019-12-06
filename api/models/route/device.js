'use strict';
/**
 * Modelo Device and Link.
 * @version 0.1
 * @name Device
 * @author Ivanclabe
 * @module connect
 * @copyright Callback S.A.S / GeoRuta Proyect
 * @public
 */
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const BaseSchema = require('../_schema');
const { Schema } = mongoose;

var deviceSchema = new BaseSchema({
  _id: {
    type: String,
    required: [true, 'IMEI no encontrado'],
    min: [15, 'Se requieren min 15 digitos'],
    alias: 'IMEI'
  },
  // reference: Modelo y Marca del vehiculo.
  reference: { type: Schema.Types.ObjectId, ref: 'RefDev', required: true }
}, { collection: 'devices', index: { 'meta.created.at': -1, reference: 1 }, toJSON: { virtuals: true } });
deviceSchema.plugin(mongoosePaginate);

deviceSchema.virtual('links', {
  ref: 'Link', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'IMEI', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false,
  options: { sort: { 'meta.created.at': -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
});

module.exports = mongoose.model('Device', deviceSchema);
