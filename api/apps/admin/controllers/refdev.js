'use strict';
/** @author Ivanclabe */

const moment = require('moment');

const {
  optFindDocuments
} = require('../../rsc');

exports.getReference = (req, res) => {
  var { contentStore, model } = req;
  var { filter, queryOpts } = optFindDocuments(req);
  delete filter['meta.belong_to'];

  model
    .paginate(filter, queryOpts, function (err, result) {
      contentStore.builder(err, result, req);
      return res
        .status(contentStore.status)
        .json(contentStore.beauty());
    });
};

exports.createReference = (req, res) => {
  const { contentStore, model } = req;

  const prepareToSaveReference = (obj, userId) => {
    obj.attributes.meta = {
      created: { by: userId, at: moment() }
    };
    return obj.attributes;
  };

  model.create(
    prepareToSaveReference(contentStore.data, req.user_id),
    function (err, result) {
      contentStore.builder(err, result, req);
      return res
        .status(contentStore.status)
        .json(contentStore.beauty());
    });
};
