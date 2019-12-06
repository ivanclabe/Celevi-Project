'use strict';
const pathroot = global['@'];

const { MODULE_NOT_FOUND } = require(pathroot + '/bin/exceptionBlock');
const { getReference } = require(pathroot + '/bin/funtions.default');

// Middleware para el parametro 'pathnameModule'
module.exports = (req, res, next, pathnamePopulate) => {
  const schema = req.model.schema;
  if (schema.pathType(pathnamePopulate) !== 'real') {
    // Si no es posible acceder al recurso consultado
    // entonces el pathnameModule es invalido!
    // Agregamos la exception generada a lista de errores de
    // nuestro objeto de respuesta de la peticion.
    MODULE_NOT_FOUND.value = pathnamePopulate;
    return next(MODULE_NOT_FOUND);
  }
  const reference = getReference(schema.obj[pathnamePopulate]);
  const model = require(pathroot + '/models')[reference.modelRef];

  // Validamos si maneja handlerRequest el modulo.
  if (!model.handlerRequest) {
    // Agregamos la exception generada a lista de errores de
    // nuestro objeto de respuesta de la peticion.
    return next(MODULE_NOT_FOUND);
  }
  const populateFromPath = req.params.pathnamePopulate;

  // Establecemos el objeto de parametros para las peticiones de segundo grado.
  req.complement = { populateFromPath, model, reference };

  // Una vez procesado eliminamos el recurso de la peticion.
  delete req.params.pathnamePopulate;

  return next();
};
