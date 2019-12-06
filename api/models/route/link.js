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

const { Schema } = mongoose;
const BaseSchema = require('../_schema');

// Esquema Link
// var sentence = {
//   // Mensaje emitido por el dispositivo
//   firmware_version: String,
//   coordinates: {
//     lat: { type: Number, required: true, max: 90, alias: 'lat' },
//     lng: { type: Number, required: true, max: 180, alias: 'lng ' }
//   },
//   orientation: Number,
//   velocity: { type: Number, min: 0, default: 0 },
//   // Fecha en que se crea el registro en el dispositivo remoto.
//   sentence_date: Date,

//   // Metadatos local
//   complement: [Schema.Types.Mixed]
// };

var linkSchema = new BaseSchema({
  // ForeignKey. Cabezera de Registros
  imei: { type: String, require: true, ref: 'Device' },
  vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
  // Colleccion de datos del Device
  sentences: { type: [String], select: false }
}, {
  collection: 'links',
  index: { imei: 1 },
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 2000
  }
});
linkSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Link', linkSchema);
