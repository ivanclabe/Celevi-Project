'use strict';
const moment = require('moment');

const {
  optFindDocuments,
  optFindOneDocument
} = require('../../rsc');

// Buscar x Id y Actualizar
exports.updateOne = (req, res) => {
  const { model, contentStore } = req;
  const filter = optFindOneDocument(req);
  const update = {
    $set: contentStore.data.attributes,
    $push: { 'meta.updated': { by: req.user_id, at: moment() } }
  };
  model
    .updateOne(filter, update, function (err, result) {
      contentStore.notify(err, result);
      return res
        .status(contentStore.status)
        .json(contentStore.beauty());
    });
};

exports.updateMany = (req, res) => {
  const { model, contentStore } = req;
  const { filter } = optFindDocuments(req);

  const update = {
    $set: contentStore.data.attributes,
    $push: { 'meta.updated': { by: req.user_id, at: moment() } }
  };

  model
    .updateMany(filter, update, function (err, result) {
      contentStore.notify(err, result);
      return res
        .status(contentStore.status)
        .json(contentStore.beauty());
    });
};

exports.findOneAndUpdate = (req, res) => {
  const { model, contentStore } = req;
  const filter = optFindOneDocument(req);

  const update = {
    $set: contentStore.data.attributes,
    $push: { 'meta.updated': { by: req.user_id, at: moment() } }
  };

  model
    .findOneAndUpdate(filter, update, {}, function (err, result) {
      contentStore.builder(err, result, req);
      return res
        .status(contentStore.status)
        .json(contentStore.beauty());
    });
};
