
module.exports = (res, req) => {
  return res
    .status(req.objectResponse.errors[0].status)
    .json(req.objectResponse);
};
