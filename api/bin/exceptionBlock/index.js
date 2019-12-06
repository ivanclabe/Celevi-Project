'use strict';

const httpStatus = require('./src/httpStatus');
const log = require('log-to-file');
// const moment = require('moment');

module.exports = class {
  constructor ({
    status = 500,
    code = 'INTERNAL_SERVER_ERROR',
    message,
    name,
    value,
    reason,
    reportLog = false
  }) {
    this.status = status;
    this.code = code;
    this.message = message;

    if (name) this.name = name;
    if (value) this.value = value;
    if (reason) this.reason = reason;

    if (reportLog || code === 'INTERNAL_SERVER_ERROR') { // ¿Reporta log?
      // Save log to default log file "default.log".
      // log('Some data');
      // Save log to custom log file "my-log.log".
      log(code, 'my-log.log');
    }
  }

  static get CONTENT_TYPE_JSON_REQUIRED () {
    return {
      code: 'CONTENT_TYPE_JSON_REQUIRED',
      message: 'Se require "content-type: application/json',
      status: httpStatus.HTTP_401_UNAUTHORIZED.code,
      reportLog: true
    };
  }

  static get AUTH_UNAUTHORIZED () {
    return {
      code: 'AUTH_UNAUTHORIZED',
      message: 'Se requiere autorización para acceder',
      status: httpStatus.HTTP_401_UNAUTHORIZED.code,
      reportLog: true
    };
  }

  static get USER_NOT_FOUND () {
    return {
      code: 'USER_NOT_FOUND',
      message: 'Usuario no encontrado',
      status: httpStatus.HTTP_404_NOT_FOUND.code
    };
  }

  static get USER_UNASSIGNED_ROLE () {
    return {
      code: 'USER_UNASSIGNED_ROLE',
      message: 'Al usuario no se le ha asignado un rol',
      status: httpStatus.HTTP_403_FORBIDDEN.code
    };
  }

  static get USER_UPERMISSION_DENIED () {
    return {
      code: 'USER_UPERMISSION_DENIED',
      message: 'No posee permisos para acceder al recurso o no existe',
      status: httpStatus.HTTP_403_FORBIDDEN.code
    };
  }

  static get TOKEN_ERROR () {
    return {
      code: 'TOKEN_ERROR',
      message: 'Error en autenticación por token.',
      status: httpStatus.HTTP_401_UNAUTHORIZED.code
    };
  }

  static get TOKEN_EXPIRED () {
    return {
      code: 'TOKEN_EXPIRED',
      message: 'El token ha expirado',
      status: httpStatus.HTTP_401_UNAUTHORIZED.code
    };
  }

  static get TOKEN_INVALID () {
    return {
      code: 'TOKEN_INVALID',
      message: 'Token invalido',
      status: httpStatus.HTTP_500_INTERNAL_SERVER_ERROR.code
    };
  }

  static get COMPANY_NOT_FOUND () {
    return {
      code: 'COMPANY_NOT_FOUND',
      message: 'El identificador invalido o no existe',
      status: httpStatus.HTTP_404_NOT_FOUND.code
    };
  }

  static get DOCUMENT_NOT_FOUND () {
    return {
      code: 'DOCUMENT_NOT_FOUND',
      message: 'El documento no fue encontrado o no existe.',
      status: httpStatus.HTTP_404_NOT_FOUND.code
    };
  }

  static get MODULE_NOT_FOUND () {
    return {
      code: 'MODULE_NOT_FOUND',
      message: 'Modulo invalido o no existe',
      status: httpStatus.HTTP_404_NOT_FOUND.code
    };
  }

  static get OBJECT_INVALID () {
    return {
      code: 'OBJECT_INVALID',
      message: 'La solicitud fue inválida.',
      status: httpStatus.HTTP_400_BAD_REQUEST.code
    };
  }

  static get URL_NOT_FOUND () {
    return {
      code: 'URL_NOT_FOUND',
      message: 'No se encontró el recurso solicitado.',
      status: httpStatus.HTTP_404_NOT_FOUND.code
    };
  }

  static get INTERNAL_SERVER_ERROR () {
    return {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'La solicitud no se completó debido a un error interno en el lado del servidor.',
      status: httpStatus.HTTP_500_INTERNAL_SERVER_ERROR.code,
      reportLog: true
    };
  }
};
