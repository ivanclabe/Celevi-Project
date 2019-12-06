'use strict';

exports.access = (req, res) => {
  const { contentStore } = req;
  contentStore
    .addsource('message', 'La solicitud se completó con éxito.');
  contentStore
    .addsource('access', true);

  return res
    .status(contentStore.status)
    .json(contentStore.beauty());
};
