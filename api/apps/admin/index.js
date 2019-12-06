'use strict';
/** @author Ivanclabe */

const pathroot = global['@'];

const express = require('express');
const router = express.Router();

const globalMdre = require(pathroot + '/middleware');

const companyCtrls = require('./controllers/company');
const refdevCtrls = require('./controllers/refdev');
const { company, route } = require(pathroot + '/models');

router.route('/companies')
  .all(function (req, res, next) {
    req.model = company.Company.Model;
    req.keyModule = 'companies';
    next();
  })
  .get(companyCtrls.getCompanies)
  .post(
    [
      globalMdre.router.migrateBodyToContentStore
    ],
    companyCtrls.postCompany
  );

  router.route('/refdev')
  .all(function (req, res, next) {
    req.model = route.RefDev.Model;
    req.keyModule = 'refdev';
    next();
  })
  .get(refdevCtrls.getReference)
  .post(
    [
      globalMdre.router.migrateBodyToContentStore
    ],
    refdevCtrls.createReference
  );

module.exports = router;
