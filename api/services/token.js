/* eslint-disable prefer-const */
/* eslint-disable prefer-promise-reject-errors */
'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../config');
const { TOKEN_EXPIRED, TOKEN_INVALID } = require('../bin/exceptionBlock');

// Creando token
function createToken (user) {
  const payload = {
    // Razon o valor a encriptar
    sub: user._id,
    // Indica cuando fue creado el JWT.
    iat: moment().unix(),
    // Verifica si el JWT esta vencido y obliga al usuario a volver a autenticarse.
    exp: moment().add(14, 'days').unix()
  };

  // decodificar, de forma predeterminada se verifica la firma del token
  return jwt.encode(payload, config.SECRET_TOKEN);
}

function decodeToken (token) {
  const decoded = new Promise((resolve, reject) => {
    try {
      // Decodifica verificando la firma del token
      const payload = jwt.decode(token, config.SECRET_TOKEN);
      if (payload.exp <= moment().unix()) {
        reject(TOKEN_EXPIRED);
      }
      resolve(payload.sub);
    } catch (err) {
      reject(TOKEN_INVALID);
    }
  });

  return decoded;
}

module.exports = {
  createToken,
  decodeToken
};
