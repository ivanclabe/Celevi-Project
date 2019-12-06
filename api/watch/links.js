class Emitter extends require('events') {}

var watch = new Emitter();
module.exports = watch;
