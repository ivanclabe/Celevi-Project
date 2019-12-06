'use strict';

// Status status 200
exports.HTTP_200_OK = {
  code: 200,
  title: 'OK',
  detail: 'La solicitud se completó con éxito.'
};
exports.HTTP_201_CREATED = {
  code: 201,
  title: 'Created',
  detail: 'Se creó con éxito un nuevo recurso.'
};
exports.HTTP_202_ACCEPTED = { };
exports.HTTP_203_NON_AUTHORITATIVE_INFORMATION = { };
exports.HTTP_204_NO_CONTENT = { };
exports.HTTP_205_RESET_CONTENT = { };
exports.HTTP_206_PARTIAL_CONTENT = { };
exports.HTTP_207_MULTI_STATUS = { };
exports.HTTP_208_ALREADY_REPORTED = { };
exports.HTTP_226_IM_USED = { };

exports.HTTP_300_MULTIPLE_CHOICES = { };
exports.HTTP_301_MOVED_PERMANENTLY = { };
exports.HTTP_302_FOUND = { };
exports.HTTP_303_SEE_OTHER = { };
exports.HTTP_304_NOT_MODIFIED = {
  code: 304,
  title: 'Not Modified',
  detail: 'No hay necesidad de retransmitir los recursos solicitados'
};
exports.HTTP_305_USE_PROXY = { };
exports.HTTP_306_RESERVED = { };
exports.HTTP_307_TEMPORARY_REDIRECT = { };
exports.HTTP_308_PERMANENT_REDIRECT = { };

exports.HTTP_400_BAD_REQUEST = {
  code: 400,
  title: 'Bad Request',
  detail: 'La solicitud fue inválida.'
};
exports.HTTP_401_UNAUTHORIZED = {
  code: 401,
  title: 'Unauthorized',
  detail: 'La solicitud no incluía un token de autenticación o el token de autenticación caducó.'
};
exports.HTTP_402_PAYMENT_REQUIRED = { };
exports.HTTP_403_FORBIDDEN = {
  code: 403,
  title: 'Forbidden',
  detail: 'El cliente no tenía permiso para acceder al recurso solicitado.'
};
exports.HTTP_404_NOT_FOUND = {
  code: 404,
  title: 'Not Found',
  detail: 'No se encontró el recurso solicitado.'
};
exports.HTTP_405_METHOD_NOT_ALLOWED = {
  code: 405,
  title: 'Method Not Allowed',
  detail: 'El método HTTP en la solicitud no era compatible con el recurso.'
};
exports.HTTP_406_NOT_ACCEPTABLE = { };
exports.HTTP_407_PROXY_AUTHENTICATION_REQUIRED = { };
exports.HTTP_408_REQUEST_TIMEOUT = { };
exports.HTTP_409_CONFLICT = {
  code: 409,
  title: 'Conflict',
  detail: 'La solicitud no se pudo completar debido a un conflicto.'
};
exports.HTTP_410_GONE = { };
exports.HTTP_411_LENGTH_REQUIRED = { };
exports.HTTP_412_PRECONDITION_FAILED = { };
exports.HTTP_413_REQUEST_ENTITY_TOO_LARGE = { };
exports.HTTP_414_REQUEST_URI_TOO_LONG = { };
exports.HTTP_415_UNSUPPORTED_MEDIA_TYPE = { };
exports.HTTP_416_REQUESTED_RANGE_NOT_SATISFIABLE = { };
exports.HTTP_417_EXPECTATION_FAILED = { };
exports.HTTP_422_UNPROCESSABLE_ENTITY = { };
exports.HTTP_423_LOCKED = { };
exports.HTTP_424_FAILED_DEPENDENCY = { };
exports.HTTP_426_UPGRADE_REQUIRED = { };
exports.HTTP_428_PRECONDITION_REQUIRED = { };
exports.HTTP_429_TOO_MANY_REQUESTS = { };
exports.HTTP_431_REQUEST_HEADER_FIELDS_TOO_LARGE = { };
exports.HTTP_451_UNAVAILABLE_FOR_LEGAL_REASONS = { };

exports.HTTP_500_INTERNAL_SERVER_ERROR = {
  code: 500,
  title: 'Internal Server Error',
  detail: 'La solicitud no se completó debido a un error interno en el lado del servidor.'
};
exports.HTTP_501_NOT_IMPLEMENTED = { };
exports.HTTP_502_BAD_GATEWAY = { };
exports.HTTP_503_SERVICE_UNAVAILABLE = {
  code: 503,
  title: 'Service Unavailable',
  detail: 'El servidor no estaba disponible.'
};
exports.HTTP_504_GATEWAY_TIMEOUT = { };
exports.HTTP_505_HTTP_VERSION_NOT_SUPPORTED = { };
exports.HTTP_506_VARIANT_ALSO_NEGOTIATES = { };
exports.HTTP_507_INSUFFICIENT_STORAGE = { };
exports.HTTP_508_LOOP_DETECTED = { };
exports.HTTP_509_BANDWIDTH_LIMIT_EXCEEDED = { };
exports.HTTP_510_NOT_EXTENDED = { };
exports.HTTP_511_NETWORK_AUTHENTICATION_REQUIRED = { };
