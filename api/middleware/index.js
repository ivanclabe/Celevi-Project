'use strict';

const _ = require('lodash');
const {
  OBJECT_INVALID,
  CONTENT_TYPE_JSON_REQUIRED
} = require('../bin/exceptionBlock');

module.exports = {
  app: {
    contentType: (req, res, next) => {
      // Middleware para evaluar si el tipo de contenido enviado es JSON
      if (req.method !== 'GET') {
        if (req.headers['content-type'] !== 'application/json') {
          // Agregamos la exception generada a lista de errores de
          // nuestro (objeto de respuesta de la peticion.
          return next(CONTENT_TYPE_JSON_REQUIRED);
        }
      }
      next();
    },
    auth: require('./app/auth'),
    user: require('./app/user')
  },
  router: {
    migrateBodyToContentStore: (req, res, next) => {
      const { body, contentStore, keyModule } = req;

      // Validams que la estructura cumpla con Keys requeridas
      if (!_.has(body, 'data.type') || !_.has(body, 'data.attributes')) {
        return next(OBJECT_INVALID);
      }

      const validTypeModule =
        obj => (obj.type === keyModule) ? obj : next(OBJECT_INVALID);
      // Valida la estructura interna de la propiedad data y fuente
      // de la verdad.
      contentStore.data = (_.isArray(body.data))
        ? _.map(body.data, validTypeModule)
        : validTypeModule(body.data);

      return next();
    },
    validIdToUpdate: (req, res, next) => {
      const { params, contentStore } = req;
      // El atributo '_id' del documento DEBE ser igual al que se
      // envia a traves del body y que tiene como ubicacion 'data.id'
      // si no soin iguales entonces, el servidor respondera con
      // codigo de error OBJECT_INVALID.
      if (params._id !== contentStore.data.id) {
        OBJECT_INVALID.reason = ' "data.id" enviado por el cliente no corresponde al suministrado en la URL';
        OBJECT_INVALID.value = contentStore.data.id;
        return next(OBJECT_INVALID);
      }
      next();
    }
  },
  utils: {
    // No usadas
    vArray: require('./utils/validStructure'),
    hasSecondGrade: require('./utils/hasSecondGrade')
  }
};
