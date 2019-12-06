'use strict';
/** @author Ivanclabe */
const express = require('express');
const router = express.Router();

const mdre = require('../../../middleware');
const queries = require('../libs');
const ctrls = require('../src/controllers');
const adminValidator = require('./jsonValidator/admin');

var { Validator } = require('express-json-validator-middleware');
var validator = new Validator({ allErrors: true });
var validate = validator.validate;

// Middleware Nivel Parametros
// router.param('identifierCompany', mdre.param.identifierCompany);
router.param('keyModule', mdre.param.keyModule);
router.param('pathnamePopulate', mdre.param.pathnamePopulate);

// URL de validacion, ideal para verificar si el usuario autenticado tiene los
// permisos correspondientes para acceder al modulo y contenido requerido.
//
// El objectivo es conceder o denegar acceso al modulo
router.get('/:keyModule/access', ctrls.access);

router.route('/:keyModule')
  .all(function (res, req, next) {
    next();
  })
  // Obtiene documentos de una coleccion (modulo) requerida, idea para metodos de busqueda
  // y consulta, esta configuración ademas, tiene habilitada la función de paginación
  // de datos, limits, skips, sort entre otros.
  //
  //     #Requiere ser superusuario
  //     http://localhost:3000/api/admin/v1/devices
  //
  // Para mas información relacionado a propiedades de consulta y conceptos:
  //    <https://www.npmjs.com/package/api-query-params>.
  //
  .get(queries.find)
  // Crea y guarda un documento para coleccion (modulo) de acuerdo a una estructura de
  // datos de tipo JSON enviada desde el cliente.
  // Estas estructuras estan sujetas a validacion tanto de contenido como estructuras
  // y valores requeridos.
  //
  //     #Requiere ademas ser superusuario
  //     http://localhost:3000/api/admin/v1/vehicles
  //
  // Para estos casos es requerido que en la estructura JSON enviada se declare
  // 'meta.belong_to' con el _id de un documento 'Company'
  //
  .post(
    [
      mdre.router.company.getAndValidCompanyCode,
      validate({ body: adminValidator.create }),
      mdre.router.migrateBodyToContentStore
    ],
    queries.save
  )
  .put(
    [
      mdre.router.company.getAndValidCompanyCode,
      validate({ body: adminValidator.update.updateMany }),
      mdre.router.migrateBodyToContentStore
    ],
    queries.updateMany
  )
  .delete(
    [
      mdre.router.company.getAndValidCompanyCode
    ],
    queries.deleteMany
  );

router.route('/:keyModule/:_id')
  .all(function (req, res, next) {
    next();
  })
  // Instancia un documento en especial relacionando su _id en la colección
  //
  //     #Requiere ademas ser superusuario
  //     http://localhost:3000/api/admin/v1/devices/123456789123456
  //
  .get(queries.findOneById)
  .post(function (req, res, next) {
    next(new Error('not implemented'));
  })
  // Actualiza un documento para una coleccion (modulo) a traves de su '_id', estos
  // cambios son efectuados a traves de una fuente de datos  de tipo JSON enviada
  // al servidor desde el cliente.
  // Estas estructuras estan sujetas a validacion tanto de contenido como estructuras
  // y valores requeridos.
  //
  //     #Requiere ademas ser superusuario
  //     http://localhost:3000/api/admin/v1/devices/123456789123456
  //
  .put(
    [
      mdre.router.company.getAndValidCompanyCode,
      validate({ body: adminValidator.update.updateMany }),
      mdre.router.migrateBodyToContentStore,
      mdre.router.validIdToUpdate
    ],
    queries.findOneById
  )
  // Elimina un documento para una coleccion (modulo) a traves de su '_id', actualizando
  // sus meta configuraciones a inactivas y eliminadas, este proceso no tiene reversa
  // ya que no solo altera los valores del documento, sino, de todos los documentos que son
  // referentes al _id eliminado.
  //
  //     #Requiere ademas ser superusuario
  //     http://localhost:3000/api/admin/v1/devices/123456789123456
  //
  .delete(
    [
      mdre.router.company.getAndValidCompanyCode
    ],
    queries.deleteOne
  );

// Actualiza un path Array 'key' de un documento para una coleccion (modulo) a traves
// de su '_id', estos cambios son efectuados con datos enviados por el Query
// Los usos de esta URL son multiples:
//  OPERADORES
//    * PUSH
//    * PULL
//    * POP
//    * SHIFT
//    * SET
//
/* router.put(
  '/:identifierCompany/:keyModule/:_id/:key/apply/:operator',
  mdre.utils.vArray,
  queries.arrayOperators
); */

router.get(
  '/:keyModule/:_id/relationships/:pathnamePopulate',
  queries.findOneAndShowPopulate
);

module.exports = router;
