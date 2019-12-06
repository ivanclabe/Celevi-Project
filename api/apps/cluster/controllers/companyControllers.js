'use strict';
// const _ = require('lodash');
const { Company } = require('../../../models');
const exec = require('../../../callback/response');

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
exports.createCompany = async (req, res) => {
  // var requiredPaths = Company.Model.schema.requiredPaths();
  var exists = true;
  try {
    // Efectuamos un ciclo para generar ID's que no existan
    while (exists) {
      var identifier = ID();
      exists = await Company.Model.exists({ identifier: identifier });
    }
    // Una vez obtenido nuestro identificador instanciamos y guardamos
    const user = req.user;
    const company = new Company.Model({
      nit: req.body.nit,
      name: req.body.name,
      identifier: identifier,
      'meta.created.by': user._id
    });
    company.save(exec.document(res));

    /* company.save(function (err, documentCompany) {
      if (err) {
        return res.status(500).json({ status: 500, description: err.message });
      }
      // Una vez grabado el registro company exitosamente es necesario almacenar
      // el registro en el array companies del usuario autenticado.
      user.companies.push(documentCompany._id);
      user.save(function (_err, user) {
        exec.simple(res, _err, documentCompany);
      });
    }); */
  } catch (e) {
    return res.status(500).json({
      status: 500,
      description: e.message
    });
  }
};
