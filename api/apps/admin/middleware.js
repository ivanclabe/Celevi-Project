'use strict';
const pathroot = global['@'];
const _ = require('lodash');
const { company } = require(pathroot + '/models');
const CompanyModel = company.Company.Model;

const {
  USER_UPERMISSION_DENIED,
  OBJECT_INVALID,
  COMPANY_NOT_FOUND
} = require(pathroot + '/bin/exceptionBlock');

module.exports = {
  companyId: (req, res, next) => {
    const { query } = req;

    if (req.company) return next();
    // Recuperando companyId de los parametros del Query
    if (!query.filter.companyId) {
      var reason = '"companyId" no fue encontrado.';
      OBJECT_INVALID.reason = reason;
      return next(OBJECT_INVALID);
    }

    const companyId = query.filter.companyId;
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
    delete query.filter.companyCode;
    next();
  }
};
