/* eslint-disable prefer-promise-reject-errors */
'use strict';
const pathroot = global['@'];

const _ = require('lodash');

const models = require(pathroot + '/models');
const config = require(pathroot + '/config');

const { MODULE_NOT_FOUND } = require(pathroot + '/bin/exceptionBlock');

const findModel = keyModule => {
  return _
    .chain(models)
    .find(function (dist) {
      return _.find(dist, { nameModule: keyModule });
    })
    .find({ nameModule: keyModule })
    .value();
};

module.exports = (req, res, next, keyModule) => {
  const user = req.user;
  // Buscamos la propiedad 'nameModule' en el archivo 'index' de los modelos
  // a traves de nuestro parametro 'keyModule', de esta manera determinaremos
  // que la llave existe y pertenece a un modulo configurado.
  const found = findModel(keyModule);

  if (!found || !found.handlerRequest) {
    // Si la propiedad no fue encontrada o esta no posee configuracion 'handlerRequest'
    // rechazaremos la peticion y responderemos con codigo 404

    // Agregamos la exception generada a lista de errores de
    // nuestro objeto de respuesta de la peticion.
    return next(MODULE_NOT_FOUND);
  }

  // Validamos los permisos correspodientes de acceso a contenido.
  if (!req.user.is_main) {
    /** @summary Validacion de Permisos */
    // Verificamos el rol del usuario autenticado, validamos los permisos, y evaluamos su acceso.
    const foundPermission = _.find(
      user.role.permissions,
      { action: config.actionMethods[req.method], _module: found.displayName }
    );
    // 1ra condicion: de no ser encontrado el permiso corespondiente el servidor respondera con error
    // de codigo 403 ya que el cliente no posee los permisos necesarios para acceder al contenido,
    // por lo que el servidor está rechazando otorgar una respuesta apropiada.
    //
    // ó
    //
    // 2da condicion: sí el usuario autenticado no es superusuario y tampoco main validamos que
    // su peticion no incluya el parametro 'company', ya que por jerarquia de middleware de params
    // esta se evalua primero que 'keyModule'. Asi verificamos que no exista filtracion
    // de datos. Si la peticion contiene 'company', el servidor respondera a la solicitud con
    // error codigo 403.
    if (!foundPermission || (!req.user.is_superuser && req.company)) {
      // Agregamos la exception generada a lista de errores de
      // nuestro objeto de respuesta de la peticion.
      MODULE_NOT_FOUND.value = found.displayName;
      return next(MODULE_NOT_FOUND);
    }
    // De ser encontrado el permiso el servidor asignara a la solicitud los datos del modulo
    // encontrado; luego procedera a continuar con el siguiente middleware o controlador.
    req.keyModule = keyModule;
    req.model = found.Model;
    delete req.params.keyModule;
    return next();
  }

  // Siendo 'Main' el usuario posee acceso a todo el contenido generado.
  req.keyModule = keyModule;
  req.model = found.Model;
  delete req.params.keyModule;
  next();
};
