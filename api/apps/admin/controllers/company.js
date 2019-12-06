'use strict';
/** @author Ivanclabe */

const moment = require('moment');
const _ = require('lodash');

const {
  optFindDocuments
} = require('../../rsc');

const prepareToSaveCompany = (obj, userId) => {
  obj.attributes.meta = {
    created: { by: userId, at: moment() }
  };
  return obj.attributes;
};

exports.getCompanies = (req, res) => {
  var { contentStore, model, query } = req;
  var { queryOpts, filter } = optFindDocuments(req);

  // Agregamos un nuevo filtro para seleccionar
  // los registros de 'Company' afiliados al usuario
  // autenticado.
  filter._id = {
    $in: _.map(req.user.affiliate_to, obj => obj.id)
  };
  delete filter['meta.belong_to'];

  model
    .paginate(query.filter, queryOpts, function (err, result) {
      contentStore.builder(err, result, req);
      return res
        .status(contentStore.status)
        .json(contentStore.beauty());
    });
};

exports.postCompany = (req, res) => {
  const { contentStore, model } = req;
  model.create(
    prepareToSaveCompany(contentStore.data, req.user_id),
    function (err, result) {
      contentStore.builder(err, result, req);
      return res
        .status(contentStore.status)
        .json(contentStore.beauty());
    });
};
