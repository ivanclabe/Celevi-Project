/* eslint-disable prefer-const */
'use strict';
const pathroot = global['@'];

const services = require(pathroot + '/services');
const { AUTH_UNAUTHORIZED } = require(pathroot + '/bin/exceptionBlock');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    // El servidor opta por generar la exception al no tener
    // la propieedad 'authorization' en su registro de cabacera
    // de la peticion.
    // Agregamos la exception generada a lista de errores de
    // nuestro objeto de respuesta de la peticion.
    return next(AUTH_UNAUTHORIZED);
  }
  // De ser encontrada la propiedad procesamos su contenido
  const token = req.headers.authorization.split(' ')[1];
  services.decodeToken(token)
    .then(response => {
      req.user_id = response;
      next();
    })
    // Agregamos la exception generada a lista de errores de
    // nuestro objeto de respuesta de la peticion.
    .catch(response => next(response));
};
