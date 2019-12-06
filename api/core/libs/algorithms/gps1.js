'use strict';
const pathroot = global['@'];

const log = require('log-to-file');
const { route } = require(pathroot + '/models');
const ModelLink = route.Link.Model;

module.exports = async message => {
  log(message, 'messageHQ.log');
  const destructured = message.split(','); // Array Constructor Sentences
  const IMEI = destructured[1];
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
      'imei vehicle meta.belong_to'
    );

    if (!link) {
      // eslint-disable-next-line no-new
      throw new Error(`Dispositivo con IMEI "${IMEI}" no se encuentra vinculado!`);
    }

    // Constructor de sentencia NMEA
    const sentence = [
      '$GPRMC',
      destructured[3], // Fix Taken Time
      'A', // Status
      destructured[5] + ',' + destructured[6], // Latitude
      destructured[7] + ',' + destructured[8], // Longitude
      destructured[10], // Speed over the ground in knots
      destructured[9], // Track angle in degrees True
      destructured[11], // Date
      '003.1,W', // Magnetic Variation
      '*6A' // The checksum data, always begins with *
    ].join(',');
    log(sentence, 'sentenceHQ.log');
    return { sentence, link };
  } catch (e) {
    log(e.message, 'streamError.log');
    return { sentence: false };
  }
};
