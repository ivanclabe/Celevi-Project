'use strict';
/**
 * Modelo User.
 * @version 0.1
 * @name User
 * @author Ivanclabe
 * @module connect
 * @copyright Callback S.A.S / GeoRuta Proyect
 * @public
 */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const BaseSchema = require('../_schema');

var roleSchema = new BaseSchema({
  name: { type: String, trim: true, required: true },
  permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }]
}, { collection: 'roles', index: { name: 1 }, toJSON: { virtuals: true } });

module.exports = mongoose.model('Role', roleSchema);
