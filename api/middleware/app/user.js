/* eslint-disable prefer-const */
'use strict';
const pathroot = global['@'];

const { auth } = require(pathroot + '/models');
// Necesario para corresponder con documentos validos
const { basicQuery } = require(pathroot + '/config');
const {
  AUTH_UNAUTHORIZED,
  USER_UNASSIGNED_ROLE
} = require(pathroot + '/bin/exceptionBlock');

module.exports = (req, res, next) => {
  // Ocupamos la consulta para acceso a los datos
  auth.User.Model
    .findOne({ _id: req.user_id, ...basicQuery })
    .populate({
      path: 'role',
      match: basicQuery,
      populate: {
        select: 'action _module -_id',
        match: basicQuery,
        path: 'permissions'
      }
    })
    .populate({ path: 'affiliate_to', select: '_id', match: basicQuery })
    .exec(function (err, user) {
      if (err) {
        next(err);
      } else if (!user) {
        next(AUTH_UNAUTHORIZED);
      } else {
        if (user.is_main) {
          // Siendo 'Superusuario', el cliente posee los permisos necesarios para
          // acceder al contenido consultado.
          req.user = user;
          next();
        } else {
          // Fue posible la autenticacion pero, al usuario no le fue asignado rol
          // es necesario rechazar la peticion.
          if (!user.role) {
            return next(USER_UNASSIGNED_ROLE);
          }
          // De ser encontrado el rol el servidor asignara a la peticion los datos del usuario,
          // luego procedera a continuar con el siguiente middleware o controlador.
          req.user = user;
          next();
        }
      }
    });
};
