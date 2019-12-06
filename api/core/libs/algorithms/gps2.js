'use strict';
// Skypatrol TT8750 N+
const pathroot = global['@'];

const log = require('log-to-file');
const { route } = require(pathroot + '/models');
const ModelLink = route.Link.Model;

module.exports = async message => {
  log(message, 'messageGPS2.log');
  const destructured = message.split(' ');
  // console.log(destructured);
  const IMEI = destructured[destructured.length - 3];
  try {
    if (!/^[0-9]{15}$/.test(IMEI)) {
      // eslint-disable-next-line no-new
      throw new Error(`IMEI "${IMEI}" invalid!`);
    }
    var link = await ModelLink.findOne(
      {
        imei: IMEI,
        'meta.is_active': true,
        'meta.is_deleted': false
      },
      'imei vehicle'
    );
    if (!link) {
      // eslint-disable-next-line no-new
      throw new Error(`Dispositivo con IMEI "${IMEI}" no se encuentra vinculado!`);
    }
    // Constructor de sentencia NMEA
    const sentence = destructured[destructured.length-1]
    log(sentence, 'sentenceGP2.log');
    return { sentence, link };
  } catch (e) {
    log(e.message, 'streamError.log');
    return { sentence: false };
  }
};
