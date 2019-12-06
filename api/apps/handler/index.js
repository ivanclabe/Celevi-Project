'use strict';
/** @author Ivanclabe */

const pathroot = global['@'];

const express = require('express');
const router = express.Router();

const globalMdre = require(pathroot + '/middleware');
const localMdre = require('./middleware');
const ctrls = require('./controllers');
const queries = require('./libs');

const handlerValidator = require('./jsonValidator');

var { Validator } = require('express-json-validator-middleware');
var validator = new Validator({ allErrors: true });
var validate = validator.validate;

// Middleware Nivel Parametros
router.param('companyId', localMdre.param.companyId);
router.param('keyModule', localMdre.param.keyModule);
router.param('pathnamePopulate', localMdre.param.pathnamePopulate);

// URL de validacion, ideal para verificar si el usuario autenticado tiene los
// permisos correspondientes para acceder al modulo y contenido requerido.
//
// El objectivo es conceder o denegar acceso al modulo
router.get('/:companyId/:keyModule/access', ctrls.access);

router.route('/:companyId/:keyModule')
  .all(function (res, req, next) {
    next();
  })
  // Obtiene documentos de una coleccion (modulo) requerida, idea para metodos de busqueda
  // y consulta, esta configuración ademas, tiene habilitada la función de paginación
  // de datos, limits, skips, sort entre otros.
  //
  // Los usos de esta configuracion son muchos:
  //
  //  Ocupando un 'companyId' del modelo Company
  //
  //     http://localhost:3000/api/nx66odmo7/v1/devices
  //     http://localhost:3000/api/nx66odmo7/v1/devices?page=1&limit=1
  //     http://localhost:3000/api/nx66odmo7/v1/devices?fields=type,reference
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
  // Uso:
  //     http://localhost:3000/api/nx66odmo7/v1/vehicles
  //
  .post(
    [
      validate({ body: handlerValidator.create }),
      globalMdre.router.migrateBodyToContentStore
    ],
    queries.save
  )
  .put(
    [
      validate({ body: handlerValidator.update.updateMany }),
      globalMdre.router.migrateBodyToContentStore
    ],
    queries.updateMany
  )
  .delete(queries.deleteMany);

router.route('/:companyId/:keyModule/:_id')
  .all(function (req, res, next) {
    next();
  })
  // Instancia un documento en especial relacionando su _id en la colección
  //
  // Uso para casos similares al anterior:
  //
  //     http://localhost:3000/api/nx66odmo7/v1/devices/123456789123456
  //     http://localhost:3000/api/nx66odmo7/v1/devices/123456789123456?fields=type,reference
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
  // Uso:
  //     http://localhost:3000/api/nx66odmo7/v1/devices/123456789123456
  //
  .put(
    [
      validate({ body: handlerValidator.update.updateMany }),
      globalMdre.router.migrateBodyToContentStore,
      globalMdre.router.validIdToUpdate
    ],
    queries.findOneAndHide
  )
  // Elimina un documento para una coleccion (modulo) a traves de su '_id', actualizando
  // sus meta configuraciones a inactivas y eliminadas, este proceso no tiene reversa
  // ya que no solo altera los valores del documento, sino, de todos los documentos que son
  // referentes al _id eliminado.
  //
  // Uso:
  //    http://localhost:3000/api/nx66odmo7/v1/devices/123456789123456
  //
  .delete(queries.deleteOne);

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
  '/:companyId/:companyId/:keyModule/:_id/:key/apply/:operator',
  localMdre.utils.vArray,
  queries.arrayOperators
); */

router.get(
  '/:companyId/:keyModule/:_id/relationships/:pathnamePopulate',
  queries.findOneAndShowPopulate
);

module.exports = router;
