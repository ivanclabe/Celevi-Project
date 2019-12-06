'use strict';
const _ = require('lodash');
/**
 * Valida si el path contiene referencia a otros modelos.
 * @param {*} value
 */
exports.getReference = (value, pathname) => {
  // Solo valido para pathType "real"
  if (!value.ref) {
    if (_.isArray(value)) {
      if (!_.has(value[0], 'ref')) return false;
      return { pathname, modelRef: value[0].ref, isArray: true };
    } else { return false; }
  }
  return { pathname, modelRef: value.ref, isArray: false };
};

exports.getAddress = () => {
  var os = require('os');
  var ifaces = os.networkInterfaces();
  var address = '';

  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
      if (iface.family !== 'IPv4' || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        console.log(ifname + ':' + alias, iface.address);
      } else {
        // this interface has only one ipv4 adress
        address = iface.address;
      }
      ++alias;
    });
  });

  return address;
};
