'use strict';
/**
 * Modelo Route.
 * @version 0.1
 * @name Route
 * @author Ivanclabe
 * @module connect
 * @copyright Callback S.A.S / GeoRuta Proyect
 * @public
 */
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const BaseSchema = require('../_schema');

// Esquema Route
/* const allowedOrientation = [
  'Punto de ida y vuelta',
  'Punto de ida',
  'Punto de vuelta',
  'Punto inicial y final de la ruta',
  'Punto inicial de la ruta',
  'Punto final de la ruta'
];
 */

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

var routeSchema = new BaseSchema({
  name: { type: String, require: true, trim: true },
  sectors: [{
    order: { type: Number, require: true, min: 0 },
    name: { type: String, require: true }
  }],
  virtualPoints: [{
    order: { type: Number, require: true, min: 0 }, // Ordenamiento
    tags: { type: String, index: true, default: 'No Tag' },
    // punto mapeo virtual
    location: { type: pointSchema, required: true },
    // Tiempo desde punto de partida. Unidad de medida en Mins.
    from_start: { type: Number, required: true, min: 0 },
    // Rango de tolerancia. Unidad de medida en Segs.
    tolerance_time: {
      from: { type: Number, max: 0, default: -90 },
      until: { type: Number, min: 0, default: 90 }
    }
  }],
  // Metadata Local
  // Numero Maximo de vehiculos por ruta al dia.
  max_sheet: { type: Number, min: 0 }, // Se interpreta como el max de vehicle x ruta
  vehicular_frequency: { type: Number, min: 0 },
  // Tiempo maximo de recorrido. Unidad de medida en Mins.
  max_time: { type: Number, min: 0 } // Se interpreta como el max de vehicle x ruta
}, { collection: 'routes', index: { name: 1 }, toJSON: { virtuals: true } });
routeSchema.plugin(mongoosePaginate);
// End Esquema

module.exports = mongoose.model('Route', routeSchema);
