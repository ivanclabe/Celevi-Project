// Dependencias
const aqp = require('api-query-params');

const aqpMiddlware = (req, res, next) => {
  req.query = aqp(req.query);
  next();
};
module.exports = aqpMiddlware;
