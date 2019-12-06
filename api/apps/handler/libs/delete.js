'use strict';
// const pathroot = global['@'];
const moment = require('moment');

const {
  optFindDocuments,
  optFindOneDocument
} = require('../../rsc');

// Buscar x Id y Actualizar Metadatos
exports.findOneAndHide = (req, res) => {
  const { model, contentStore } = req;
  const filter = optFindOneDocument(req);

  model
    .findOneAndUpdate(filter, { 'meta.is_active': false, 'meta.is_deleted': true })
    .exec(function (err, result) {
      contentStore.builder(err, result, req);
      return res
        .status(contentStore.status)
        .json(contentStore.beauty());
    });
};

exports.deleteOne = (req, res) => {
  const { model, contentStore } = req;
  const filter = optFindOneDocument(req);
  const deletes = {
    $set: {
      'meta.deleted': { by: req.user_id, at: moment() },
      'meta.is_active': false,
      'meta.is_deleted': true
    }
  };

  model
    .updateOne(filter, deletes, function (err, result) {
      contentStore.notify(err, result);
      return res
        .status(contentStore.status)
        .json(contentStore.beauty());
    });
};

exports.deleteMany = (req, res) => {
  const { model, contentStore } = req;
  const { filter } = optFindDocuments(req);

  const deletes = {
    $set: {
      'meta.deleted': { by: req.user_id, at: moment() },
      'meta.is_active': false,
      'meta.is_deleted': true
    }
  };

  model
    .updateMany(filter, deletes, function (err, result) {
      contentStore.notify(err, result);
      return res
        .status(contentStore.status)
        .json(contentStore.beauty());
    });
};
