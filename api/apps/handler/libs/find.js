'use strict';

const {
  optFindDocuments,
  optFindOneDocument
} = require('../../rsc');

// Buscar y Buscar y paginar
exports.find = (req, res) => {
  const { model, contentStore } = req;
  const { queryOpts, filter } = optFindDocuments(req);
  console.log(filter);
  console.log(queryOpts);
  model
    .paginate(filter, queryOpts, function (err, result) {
      contentStore.builder(err, result, req);
      return res
        .status(contentStore.status)
        .json(contentStore.beauty());
    });
};

exports.findOneById = (req, res) => {
  const { model, query, contentStore } = req;
  var condition = optFindOneDocument(req);
  model
    .findOne(condition)
    .select(query.projection)
    .populate(query.population)
    .lean()
    .exec(function (err, result) {
      contentStore.builder(err, result, req);
      return res
        .status(contentStore.status)
        .json(contentStore.beauty());
    });
};

exports.findOneAndShowPopulate = (req, res) => {
  const { model, complement } = req;

  const find = this.find;
  const findOneById = this.findOneById;

  model
    .findOne(optFindOneDocument(req))
    .select(complement.populateFromPath)
    .exec(function (err, doc) {
      if (err) return;
      // Eliminamos el parametro '_id' para que este no se incluya entre
      // las opciones de consulta del proximo query.
      delete req.params._id;
      // Actualizamos valores del objecto request(req) por los del
      // modelo complementario y a su vez objectivo del populate.
      req.model = complement.model.Model;
      req.keyModule = complement.model.nameModule;
      // Guardamos el o los valor(es) referencia de la relacion.
      var refValue = doc[complement.populateFromPath];
      // Preconsulta
      if (complement.reference.isArray) {
        req.query.filter._id = { $in: refValue };
        find(req, res);
      } else {
        findOneById(req, res);
      }
    });
};
