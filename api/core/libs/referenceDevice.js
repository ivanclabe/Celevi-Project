
module.exports = port => {
  var func;
  switch (port) {
  case '8007':
    func = require('./algorithms/gps1');
    break;
  case '8006':
    func = require('./algorithms/gps2');
    break;
  }
  return func;
};
