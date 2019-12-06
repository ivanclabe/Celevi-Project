'use strict';
/**
 * Modelo Route.
 * @version 0.1
 * @name Travel
 * @author Ivanclabe
 * @module connect
 * @copyright Callback S.A.S / GeoRuta Proyect
 * @public
 */
const mongoose = require('mongoose');
// const moment = require('moment');
const BaseSchema = require('../_schema');

const { Schema } = mongoose;

// Esquema Sheet
var travelSchema = new BaseSchema({
  order: { type: Number, min: 0 },
  // Array de subdocumentos del registro del viaje.
  // Opera de manera deependiente a los VirtualPoints del Modelo 'Route'
  record_points: [{
    order: Number, // Misma order de Route >> virtualPoints >> order
    estimated_time: Date,
    registration_time: { type: Date, default: Date.now } // Tiempo de registro
    // difference: mongoose.Decimal128
  }],
  // ¿Esta finalizado el viaje?
  is_done: { type: Boolean, default: false },
  // Anexa reporte si es registrado!
  report: { description: String, time_at: Date }
}, { _id: false, index: { order: 1, 'record_points.order': 1 }
});

travelSchema.virtual('di').get(function () {
  return this.name.first + ' ' + this.name.last;
});
/* async function generadorSheetId () {
  var newId = await this.model('Sheet').findOne({}, '_id', { sort: { 'meta.createdAt': -1 } });
  return newId + 1;
}
 */
var sheetSchema = new BaseSchema({
  // _id: { type: Number, require: true, unique:true, index: true, default: generadorSheetId }, // No disponible
  // Dia en que se iniciara el viaje. Formato dd/mm/yyyy
  work_day: {
    type: Date,
    require: true,
    validate: {
      validator: function (v) {
        return v;
      },
      message: props => `${props.value} La fecha de trabajo no puede ser menor a la actual`
    }
  },

  // Hora de salida del vehiculo
  start_time: {
    hour: { type: Number, required: true, min: 0, max: 23 },
    minutes: { type: Number, required: true, min: 0, max: 59 }
  },
  // Hora de salida del vehiculo
  end_time: {
    hour: { type: Number, min: 0, max: 23 },
    minutes: { type: Number, min: 0, max: 59 }
  },

  // ForeignKey. Cabezera de Registros
  link_id: { type: Schema.Types.ObjectId, require: true, ref: 'Link' },
  route_id: { type: Schema.Types.ObjectId, ref: 'Route' },

  // Subdocumentos Travels
  travels: [travelSchema]
}, { collection: 'sheets', index: { day_travel: -1 } });
// Middleware

module.exports = mongoose.model('Sheet', sheetSchema);
