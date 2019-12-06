'use strict';

// const _ = require('lodash');
// const portscanner = require('portscanner');
const { getAddress } = require('./bin/funtions.default');

global['@'] = __dirname;

// const availablePorts = _
//   .range(5021, 5031)
//   .filter(async port => await portscanner.checkPortStatus(port, getAddress) === 'closed');

// process.env.HEADPORT = availablePorts.shift();
// process.env.NETPORTS = availablePorts;

module.exports = {
  HOST: getAddress() || '127.0.0.1',
  port: process.env.PORT || 3000,
  headPort: process.env.HEADPORT || 8007,
  netPorts: [5021, 5022, 5023, 5024, 5025, 5026], // process.env.NETPORTS || availablePorts,
  maxConnectionNetPort: 1000,
  // db: process.env.MONGODB || 'mongodb+srv://jjesquea:venezuela89@cluster0-lv9ia.mongodb.net/test?retryWrites=true&w=majority', // jjesquea
  db: process.env.MONGODB || 'mongodb+srv://root:root@cluster0-xzwpb.gcp.mongodb.net/test?retryWrites=true', // ivanclabe
  basicQuery: { 'meta.is_active': true, 'meta.is_deleted': false },
  SECRET_TOKEN: 'Mugiwara',
  actionMethods: {
    GET: 'Acceder',
    POST: 'Crear',
    PUT: 'Actualizar',
    DELETE: 'Eliminar'
  },
  modules: {
  }
};
