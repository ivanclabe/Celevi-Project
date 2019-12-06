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
const BaseSchema = require('../_schema');

const { allowedAction, allowedModule } = require('../../services');
// const allowedTypes = ['Acceder', 'Crear', 'Actualizar', 'Eliminar'];
// const allowedModels = ['Dispositivos'];

// eslint-disable-next-line no-unused-vars
var permissionSchema = new BaseSchema({
  action: { type: String, trim: true, required: true, enum: allowedAction },
  _module: { type: String, trim: true, required: true, enum: allowedModule }
}, { collection: 'permissions', index: { type: 1, module: 1 }, toJSON: { virtuals: true } });

module.exports = mongoose.model('Permission', permissionSchema);
