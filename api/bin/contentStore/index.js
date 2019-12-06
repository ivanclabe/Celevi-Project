'use strict';
const pathroot = global['@'];

const _ = require('lodash');
const moment = require('moment');

const HandlerException = require('../exceptionBlock');
const { HOST, port } = require(pathroot + '/config');
const baseURL = `http://${HOST}:${port}`;

const ObjectData = require('./libs/objectData');

// Esta sección describe la estructura basica de un documento JSON: API,
// que se identifica por el tipo de medio application/vnd.api+json.
//
// A menos que se indique lo contrario, los objetos definidos por esta
// especificación NO DEBEN contener ningún miembro adicional.
// Las implementaciones de cliente y servidor DEBEN ignorar los miembros
// no reconocidos por esta especificación.
module.exports = class ContentStore {
  constructor (sources, data = null) {
    this.status = null;
    // Este objeto define el "nivel superior" de un documento.
    // Un documento DEBE contener al menos uno de los siguientes
    // miembros de nivel superior:
    //
    //  * data: los "datos primarios" del documento
    //  * errors: una matriz de objetos de error
    //  * meta: un metaobjeto que contiene metainformación no estándar.
    //
    // Los miembros 'data' y 'errors' NO DEBEN coexistir en el mismo documento.
    //
    //
    // Los datos primarios DEBEN ser:
    //
    //  * Un objeto de recurso único, un objeto identificador de recurso único o null,
    //    para solicitudes que se dirigen a recursos individuales.
    //  * Una matriz de objetos de recursos, una matriz de objetos identificadores de
    //    recursos o una matriz vacía ([]), para solicitudes que se dirigen a colecciones
    //    de recursos.
    this.data = data;
    this._errors = null;
    this.meta = null;
    // Un documento PUEDE contener cualquiera de estos miembros
    // de nivel superior:
    //
    //  * links: un objeto de enlaces relacionado con los datos primarios.
    //  * included: una matriz de objetos de recursos que están relacionados
    //    con los datos primarios y / o entre sí ("recursos incluidos").
    this.links = null;
    // Si está presente, este objeto de links PUEDE contener
    // un self enlace que identifica el recurso representado por
    // el objeto de recurso.
    this.sources = sources;
    // Si un documento no contiene la clave 'data' de nivel superior,
    // el miembro included NO DEBE estar presente tampoco.
  }

  get data () {
    return this._data;
  }

  set data (value) {
    this.status = 200;
    this._data = value;
  }

  get errors () {
    return this._errors;
  }

  get meta () {
    return this._meta;
  }

  set meta (value) {
    this._meta = value;
  }

  get links () {
    return this._links;
  }

  set links (value) {
    this._links = value;
  }

  addError (err) {
    if (!this._errors) {
      this._errors = [];
      // De encontrase al menos un error, entonces, el status del request
      // será el del primer error encontrado.
      // 'err' DEBE contener la key status de tipo entero.
      this.status = err.status || 500;
    }
    this._errors.push(err);
  }

  addSource (key, value) {
    this.sources[key] = value;
  }

  notify (err, result) {
    try {
      if (err) {
        // El servidor opta por detener el procesamiento tan pronto como se
        // encuentre un problema, entonces, el servidor respondera a la
        // solicitud con error codigo 500.
        throw new HandlerException(err);
        // El servidor respondera a la solicitud con status que
        // genero la excepcion.
      }
      if (!_.isPlainObject(this.meta)) this.meta = {};

      this.data = null;

      this.meta.docAffected = result.n;
      this.meta.docModified = result.nModified;

      return this;
    } catch (e) {
      // El servidor opta por detener el procesamiento tan pronto como se
      // presente una excepcion dentro del bloque 'try', entonces, el servidor
      // respondera a la solicitud con error codigo 500.
      this.addError(new HandlerException(e));
      return this;
      // El servidor respondera a la solicitud con status que
      // genero la excepcion.
    }
  }

  builder (err, result, req) {
    try {
      if (err) {
        // El servidor opta por detener el procesamiento tan pronto como se
        // encuentre un problema, entonces, el servidor respondera a la
        // solicitud con error codigo 500.
        throw new HandlerException(err);
        // El servidor respondera a la solicitud con status que
        // genero la excepcion.
      } else if (!result) {
        // El servidor opta por detener el procesamiento cuando el recurso
        // requerido no existe o es invalido, entonces, el servidor respondera a la
        // solicitud con error codigo 404.
        throw new HandlerException(HandlerException.DOCUMENT_NOT_FOUND);
      } else {
        // El enlace que generó el recurso de objetivo de la petición.
        this.links.self = `${baseURL}${req.originalUrl}`;
        // Si el recurso requerido existe, procesamos la informacion de acuerdo
        // como es solicitada por el cliente (Objecto de recursos ó Array de recursos).
        if (_.isArray(result) || _.has(result, 'docs')) { // ¿Es un array de recursos?
          /** Array de  recursos */
          // Mapeamos el array
          this.data = _.map(
            // Encontrar la fuente del array
            (result.docs) ? result.docs : result,
            document => new ObjectData(document, req).beauty()
          );

          if (result.docs) { // ¿Maneja paginación?
            // Sí el objeto 'document' maneja paginacion transferimos la metainformación
            // no estándar. El valor de cada meta DEBE ser un objeto (un "meta objeto").
            // Los metadatos de paginacion podrian ser: total, limit, page, pages.
            delete result.docs;
            this.meta = { ...result };
            if (this.meta.page) {
              var { page, pages } = this.meta;

              const setPageObj = (pageObj = 1) => {
                var { originalUrl } = req;
                if (page === 1) {
                  return (originalUrl.includes('?'))
                    ? `${originalUrl}&page=${pageObj}`
                    : `${originalUrl}?page=${pageObj}`;
                }
                return _
                  .replace(originalUrl, `page=${page}`, `page=${pageObj}`);
              };

              this.meta.first = `${baseURL}` + setPageObj();
              this.meta.last = `${baseURL}` + setPageObj(pages);

              if (page < pages) {
                this.meta.next = `${baseURL}` + setPageObj(page + 1);
              }
              if (page <= pages && page > 1) {
                this.meta.prev = `${baseURL}` + setPageObj(page - 1);
              }
            }
          }
          return this;
        } else {
          // Asignamos el objeto 'resourceObjects' a la estructura de recursos
          // de primer nivel 'this.data'.
          this.data = new ObjectData(result, req).beauty();
          return this;
        }
      }
    } catch (e) {
      // El servidor opta por detener el procesamiento tan pronto como se
      // presente una excepcion dentro del bloque 'try', entonces, el servidor
      // respondera a la solicitud con error codigo 500.
      this.addError(new HandlerException(e));
      return this;
      // El servidor respondera a la solicitud con status que
      // genero la excepcion.
    }
  }

  builderAsync () {
    return new Promise((resolve, reject) => {
      var built = this.builder(...arguments);
      if (built._errors) {
        reject(built);
      } else {
        resolve(built);
      }
    });
  }

  beauty () {
    // Presenta una mejor estructuracion de los datos.
    this.addSource('response_time', moment());
    return (this.errors)
      ? _.omitBy({
        status: this.status,
        errors: this.errors,
        links: this.links,
        sources: this.sources
      }, _.isNull)
      : _.omitBy({
        data: this.data,
        meta: this.meta,
        links: this.links,
        sources: this.sources
      }, _.isNull);
  }
};
