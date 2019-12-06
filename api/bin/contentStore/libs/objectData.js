'use strict';
const pathroot = global['@'];

const _ = require('lodash');

const { HOST, port } = require(pathroot + '/config');
const { getReference } = require(pathroot + '/bin/funtions.default');
const models = require(pathroot + '/models');

const baseURL = `http://${HOST}:${port}/api`;
const RTS = 'relationships';

function ObjectSubData (subdoc, nameModule) {
  return {
    type: nameModule,
    // valida cuando existe population!
    id: (!_.isObjectLike(subdoc))
      ? subdoc
      : subdoc._id
  };
}

module.exports = class ObjectData {
  constructor (document, { keyModule, model, company }) {
    this.company = company;
    // Crea una estructura nueva a patir de la plantilla
    // y la retorna
    this.type = keyModule;
    this.id = document._id;
    this.attributes = document;
    // Ajustamos los pathname relacionales a relationships. Estos DEBEN ser
    // objectos con informacion explicita de la relación.
    this.relationships = _
      .map(model.schema.obj, getReference)
      .filter(function (n) { return n; });
  }

  get company () {
    return this._company;
  }

  set company (value) {
    this._company = value;
  }

  get id () {
    return this._id;
  }

  set id (value) {
    this._id = value;
  }

  get type () {
    return this._type;
  }

  set type (value) {
    this._type = value;
  }

  get attributes () {
    return this._attributes;
  }

  set attributes (value) {
    this._attributes = value;
  }

  get relationships () {
    return this._relationships;
  }

  set relationships (references) {
    const { company, id, type, attributes } = this;
    var relationships = {};
    // Iteramos cada uno de las path de nuestro modelo, intentando
    // encontrar aquellos que cumpla la condicion referencial.
    _.forEach(references, function ({ pathname, modelRef, isArray }) {
      const dist = _.findKey(models, dist => _.has(dist, modelRef));
      var {
        nameModule,
        displayName } = require(pathroot + '/models')[dist][modelRef];

      // Creamos
      var subLevel = {
        meta: { modelRef: modelRef, displayName: displayName }
      };

      // Adaptamos la subestructura 'subLevel.data' al tipo de referencia que maneje
      // el objeto relacional, esta puede ser de tipo Array o simple Object.
      if (isArray) {
        // Mapeamos los datos del array la propiedad objectiva de nuestra
        // iteracion 'pathname'.
        // Almacenamos objectos con datos explicitos de la relacion a 'subLevel.data'.
        // console.log(document, pathname);
        subLevel.data = _
          .map(attributes[pathname], subdocument => {
            return ObjectSubData(subdocument, nameModule);
          });
        // Datos de vinculacion con el modelo referencia.
        subLevel.links = {
          self: (company)
            ? `${baseURL}/cluster/${company}/${type}/${id}/${RTS}/${pathname}`
            : `${baseURL}/admin/${type}/${id}/${RTS}/${pathname}`
        };
      } else {
        var objectValue = attributes[pathname];
        if (!objectValue) return; // Ignore iteracion si 'objectValue' no existe!
        // Objecto de recursos del documento.
        subLevel.data = ObjectSubData(objectValue, nameModule);

        /** Prototipo */
        // importar Model en la iteracion actual.
        // var temp = { keyModule: nameModule, model: Model, company: company };
        // subLevel.data = new ObjectData(objectValue, temp);

        // Datos de vinculacion con el modelo referencia.
        subLevel.links = {
          self: (company)
            ? `${baseURL}/cluster/${company}/${type}/${id}/${RTS}/${pathname}`
            : `${baseURL}/admin/${type}/${id}/${RTS}/${pathname}`,
          related: (company) // ¿Tiene la url una composicion de company?
            ? `${baseURL}/cluster/${company}/${nameModule}/${id}`
            : `${baseURL}/admin/${nameModule}/${id}`
        };
      }
      // Agregamos nuestro objeto 'subLevel' al objeto de recursos de relaciones
      // 'objectRelationships'.
      relationships[pathname] = subLevel;
    });
    this._relationships = relationships;
  }

  beauty () {
    // Presenta una mejor estructuracion de los datos.
    return _
      .omitBy({
        type: this.type,
        id: this.id,
        attributes: this.attributes,
        relationships: this.relationships
      }, _.isNull);
  }
};
