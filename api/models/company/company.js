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
const mongoosePaginate = require('mongoose-paginate');

const BaseSchema = require('../_schema');

var companySchema = new BaseSchema({
  nit: {
    type: String,
    required: [true, 'Se requiere NIT'],
    min: [3, 'Se requieren min 3 caracteres']
  },
  name: { type: String, trim: true, required: true },
  code: { type: String, trim: true, unique: true }
}, { collection: 'companies', index: { name: 1 }, toJSON: { virtuals: true } });
companySchema.plugin(mongoosePaginate);

// Genera ID únicos para usar como nombres pseudo-privados / protegidos.
// Similar en concepto a
// <http://wiki.ecmascript.org/doku.php?id=strawman:names>.
//
// Los objetivos de esta función son dobles:
//
// * Proporciona una forma de generar una cadena garantizada para ser única cuando se compara
// a otras cadenas generadas por esta función.
// * Haz que la cadena sea lo suficientemente compleja como para que sea muy poco probable que sea
// duplicado accidentalmente a mano (esta es la clave si está utilizando 'ID'
// como un nombre privado / protegido en un objeto).
//
// Uso:
//
//     var privateName = ID();
//     var o = { 'public': 'foo' };
//     o[privateName] = 'bar';
var ID = function () {
  // Math.random debera ser único debido a su algoritmo de inicialización.
  // Conviértelo en base 36 (números + letras) y tome los primeros 9 caracteres
  // después del decimal.
  return Math.random().toString(36).substr(2, 9);
};

companySchema.pre('save', function (next) {
  var company = this;
  if (company.isNew) company.code = ID();
  this.wasNew = this.isNew;
  next();
});

companySchema.post('save', async function (doc, next) {
  if (this.wasNew) {
  // Agregamos el _id del documento company al array 'affiliate_to'
  // del Usuario quien realizo la creacion del mismo.
    try {
      const UserModel = mongoose.models.User;
      const user = await UserModel.findById(doc.meta.created.by);
      user.affiliate_to.push(doc._id);
      user.save();
    } catch (err) {
      next(err);
    }
  }
});

module.exports = mongoose.model('Company', companySchema);
