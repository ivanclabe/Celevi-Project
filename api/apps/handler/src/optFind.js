'use strict';
const pathroot = global['@'];

const _ = require('lodash');
const { basicQuery } = require(pathroot + '/config');

exports.optFindOne = ({ params, query, company }) => {
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

exports.optFindSomeone = ({ params, query, company }) => {
  return _
    .assign(query.filter, params, basicQuery, { 'meta.belong_to': company });
};
