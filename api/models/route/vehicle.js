'use strict';
/**
 * Modelo Vehicle.
 * @version 0.1
 * @author Ivanclabe
 * @module connect
 * @copyright Callback S.A.S / GeoRuta Proyect
 * @public
 */
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const { Schema } = mongoose;
const BaseSchema = require('../_schema');

const allowedStatus = ['Level1', 'Level2', 'Level3'];
const validatePhone = {
  validator: function (v) {
    return /\d{3}-\d{3}-\d{4}/.test(v);
  },
  message: '{VALUE} no es un numero de telefono valido!!'
};

// Esquema Vehicle
var vehicleSchema = new BaseSchema({

  description: { type: String, default: 'No description' },
  // reference: Modelo y Marca del vehiculo.
  reference: {
    brand: { type: String, default: 'No Registrado' },
    model: { type: String, default: 'No Registrado' }
  },
  // Identid
  number_plate: {
    type: String,
    uppercase: true,
    required: true,
    trim: true,
    unique: true
  },
  // Information
  driver: { name: String, phone: { type: String, validate: validatePhone } },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  // Metadata local
  max_passenger: { type: Number, min: 0 },
  velocity_max: { type: Number, min: 0 },
  status: { type: String, enum: allowedStatus, default: 'Level1' }
}, { collection: 'vehicles', index: { number_plate: -1 }, toJSON: { virtuals: true } });
vehicleSchema.plugin(mongoosePaginate);

vehicleSchema.virtual('links', {
  ref: 'Link', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'vehicleId', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false,
  options: { sort: { number_plate: -1 }, limit: 5 } // Query options
});

// End Esquema Vehicle
module.exports = mongoose.model('Vehicle', vehicleSchema);
