'use strict';
const pathroot = global['@'];
const _ = require('lodash');
const { company } = require(pathroot + '/models');
const CompanyModel = company.Company.Model;

const {
  USER_UPERMISSION_DENIED,
  COMPANY_NOT_FOUND
} = require(pathroot + '/bin/exceptionBlock');

module.exports = (req, res, next, companyId) => {
  if (!CompanyModel.exists({ _id: companyId })) {
    // Agregamos la exception generada a lista de errores de
    // nuestro objeto de respuesta de la peticion.
    COMPANY_NOT_FOUND.value = companyId;
    return next(COMPANY_NOT_FOUND);
  }
  const companyFound = _
    .find(req.user.affiliate_to, { id: companyId });

  if (!companyFound) {
    // Agregamos la exception generada a lista de errores de
    // nuestro objeto de respuesta de la peticion.
    USER_UPERMISSION_DENIED.value = companyId;
    return next(USER_UPERMISSION_DENIED);
  }
  req.company = companyId;
  delete req.params.companyId;

  next();
};
