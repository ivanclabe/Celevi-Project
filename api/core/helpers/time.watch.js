// Plugin para moment!
const { extendMoment } = require('moment-range');
const moment = extendMoment(require('moment'));
moment.locale('es-CO'); // 'es'

class Emitter extends require('events') { }
const watch = new Emitter();

const DAY = 'day';
const PERIOD = 60 * 30 * 1000; // 30 Mins
const setRange = () => {
  // Retorna el rango horario del dia actual de trabajo. EJ:
  // {
  //   start: moment("2019-08-01T00:00:00.000"),
  //   end: moment("2019-08-01T23:59:59.999")
  // }
  return moment().range(
    moment().startOf(DAY),
    moment().endOf(DAY)
  );
};

// Inicia el proceso de verificacion de registros que se
// habilitan a través de fecha por parte del servidor.
var rangeWorkDay = setRange();
setInterval(() => {
  if (!rangeWorkDay.contains(moment(), { excludeStart: true })) {
    // Ingresa al condicional sí ha cambiado el día, entonces,
    // obtenemos un nuevo rango para el dia actual.
    rangeWorkDay = setRange();
    watch.emit('dayChanged', moment());
  } else {
    watch.emit('online', moment().format('dddd, MMMM Do YYYY, h:mm:ss a'));
  }
}, PERIOD);

// Time Watch para Sheet
const { Sheet } = require('../../models');
watch.on('dayChanged', async (time) => {
  try {
    await Sheet.updateMany({ day_travel: time }, { 'meta.isActive': true });
  } catch (e) {
    console.log(e);
  }
});

module.exports = watch;
