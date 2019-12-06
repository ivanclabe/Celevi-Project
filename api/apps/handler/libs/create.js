'use strict';
const {
  prepareToSave
} = require('../../rsc');

exports.save = async (req, res) => {
  const { model, contentStore } = req;
  model.create(prepareToSave(req), function (err, result) {
    contentStore.builder(err, result, req);
    return res
      .status(contentStore.status)
      .json(contentStore.beauty());
  });
};
