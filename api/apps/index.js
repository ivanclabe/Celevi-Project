'use strict';
const pathroot = global['@'];

const express = require('express');
const globalMdre = require(pathroot + '/middleware');

const {
  USER_UPERMISSION_DENIED
} = require(pathroot + '/bin/exceptionBlock');

const authRequired = [
  // globalMdre.app.contentStore,
  // Procedimiento de decodificacion y validacion de token por Bearer
  globalMdre.app.auth,
  // recuperacion de datos de usuario logeado: Usuario, Rol y Companies
  globalMdre.app.user,
  // Valida la estructura entrante a la peticion; de esta manera se
  // determina si se valida el contenido entrante
  globalMdre.app.contentType
  // globalMdre.app.validContent
];

const adminRequired = (req, res, next) => {
  if (!req.user.is_superuser || !req.user.is_main) {
    return next(USER_UPERMISSION_DENIED);
  }
  next();
};

var blog = express();
blog.on('mount', function (parent) {
  console.log('Blog App Mounted');
});
blog.use('', require('./blog'));

var auth = express();
auth.on('mount', function (parent) {
  console.log('auth App Mounted');
});
auth.use('/api/auth', require('./auth'));

var handler = express();
handler.on('mount', function (parent) {
  console.log('handler Mounted');
  // console.log(parent); // refers to the parent handler
});
handler.use('/api/handler', authRequired, require('./handler'));

var admin = express();
admin.on('mount', function (parent) {
  console.log('Admin App Mounted');
});
admin.use(['/api/admin', '/api/manager'], [authRequired, adminRequired], require('./admin'));

var cluster = express();
cluster.on('mount', function (parent) {
  console.log('cluster Mounted');
  // console.log(parent); // refers to the parent cluster
});
cluster.use('/api/cluster', authRequired, require('./cluster'));

module.exports = [
  auth,
  blog,
  admin,
  handler,
  cluster
];
