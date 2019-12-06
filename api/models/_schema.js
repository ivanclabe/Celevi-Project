'use strict';
/**
 * Base Schema.
 * @version 0.1
 * @author Ivanclabe
 * @module connect
 * @copyright Callback S.A.S / GeoRuta Proyect
 * @private
 */
const util = require('util');

const mongoose = require('mongoose');
const { Schema } = mongoose;

// To make a nested object required, use a single nested schema
var updatedSchema = new Schema({
  by: { type: Schema.Types.ObjectId, ref: 'User' },
  at: { type: Date }
}, { _id: false });

var createdSchema = new Schema({
  by: { type: Schema.Types.ObjectId, ref: 'User' },
  at: { type: Date }
}, { _id: false });

function BaseSchema () {
  Schema.apply(this, arguments);
  this.add({
    meta: {
      // Metadata
      is_active: { type: Boolean, default: true },
      is_deleted: { type: Boolean, default: false, select: false },
      created: { type: createdSchema },
      updated: { type: [updatedSchema], select: false },
      // updated: [{ type: updatedSchema }],
      deleted: {
        by: { type: Schema.Types.ObjectId, ref: 'User', select: false },
        at: { type: Date, select: false }
      },
      belong_to: { type: Schema.Types.ObjectId, ref: 'Company', select: false, require: true }
    }
  });
}
util.inherits(BaseSchema, Schema);

module.exports = BaseSchema;
