'use strict';
const pathroot = global['@'];

const _ = require('lodash');
const moment = require('moment');

const { basicQuery } = require(pathroot + '/config');

// eslint-disable-next-line camelcase
exports.prepareToSave = ({ user_id, company, contentStore }) => {
  const fillMetaData = obj => {
    obj.attributes.meta = {
      created: { by: user_id, at: moment() },
      belong_to: company
    };
    return obj.attributes;
  };

  return _.isArray(contentStore.data)
    ? _.map(contentStore.data, fillMetaData)
    : fillMetaData(contentStore.data);
};

exports.optFindOneDocument = ({ params, query, company = null }) => {
  // _id: Puede representar tanto el identificardor primario del documento
  // como cualquier otro valor unique, siendo este ultimo configurando antes
  // en el query el parametro a traves de 'findBy'.
  var findBy = { _id: params._id };

  if (_.has(query.filter, 'findBy')) {
    findBy[query.filter.findBy] = params._id;
    delete findBy._id;
  }
  // Estructura unica de consulta.
  return _.assign(findBy, basicQuery, { 'meta.belong_to': company });
};

// Estructura de opticones del query de paginacion para interpolación
const paginateOpts = [
  { vars: 'select', paralel: 'projection' },
  { vars: 'sort', paralel: 'sort' },
  { vars: 'populate', paralel: 'population' },
  { vars: 'lean', paralel: 'lean' },
  { vars: 'leanWithId', paralel: 'leanWithId' },
  { vars: 'offset', paralel: 'offset' },
  { vars: 'page', paralel: 'page' },
  { vars: 'limit', paralel: 'limit' }
];
// Modificamos 'query.filter' y retornamos 'queryOpts'
exports.optFindDocuments = ({ params, query, company = null }) => {
  query.filter = _
    .assign(query.filter, params, basicQuery, { 'meta.belong_to': company });

  // Para usar el modo 'Paginate' es necesario asignar las keys
  // al objecto 'queryOpts' con la ayuda de paginateOpts.
  // luego sera enviado como parametro al metodo `model.paginate(query, queryOpts)`
  var queryOpts = {};
  _.forEach(paginateOpts, ({ vars, paralel }) => {
    // Si la propierdad 'paralel' existe en query a traves de la funcion 'evalOpts'.
    // y retorne el valor. De no existir entonces busquela en query.filter y efectue
    // el mismo procedimiento.
    if (_.has(query, paralel)) {
      queryOpts[vars] = query[paralel];
    } else if (_.has(query.filter, paralel)) {
      queryOpts[vars] = query.filter[paralel];
      delete query.filter[paralel];
    }
  });
  return {
    filter: query.filter,
    queryOpts
  };
};
