'use strict';
/**
 * Block Devices/Recursos.
 * @version 0.1
 * @author Ivanclabe
 * @name jobs
 * @copyright Callback S.A.S / GeoRuta Proyect
 * @public
 * @summary Block Devices/Recursos.
 */
const assert = require('assert');

// Models
const { Link } = require('../../models');
const preYear = '20';

/**
 * Extrae el dato IMEI de una cadena de caracteres.
 * @name findIMEIOnString
 * @param {String} message
 * @return {Number}
 */
const getIMEIOnString = async message => {
  assert(typeof (message) === 'string');
  try {
    var array = await message.split(',') || [];
    var IMEIfound = await array.find(element => element.length === '15');

    /**
     * Validamos la extructura del dato obtenido en el paso anterior
     * y verificamos su contenido. En caso de fallar arroja un error.
     */
    // eslint-disable-next-line valid-typeof
    if (/^[0-9]{15}$/.test(IMEIfound) || typeof (IMEIfound) !== undefined) {
      return Number(IMEIfound);
    } else {
      // eslint-disable-next-line no-new
      new Error('IMEI no encontrado.');
    }
  } catch (e) {
    console.log(e);
  }
};

/**
 * Estructura la informacion recibida del pulso del GPS.
 * @name structuringAlgorithm
 * @param {String} type
 * @param {String} message
 * @return {Object}
 */
async function structuringAlgorithm (type, message) {
  assert(typeof (message) === 'string');

  var convertedLatitude, convertedLongitude;
  var objectReturn = {};

  // Funcion Local de conversion de coordenadas
  const convertGeoCoordenates = (latitude, longitude) => {
    const _latitude = Number(latitude.substr(2));
    const _longitude = Number(longitude.substr(3));

    if (Number.isNaN(_latitude) || Number.isNaN(_longitude)) {
      throw new Error('ValueError LATITUDE or LONGITUDE');
    }
    return [((_latitude / 60) + 10), (((_longitude / 60) + 73) * -1)];
  };

  const convertMonth = month => (Number(month) - 1).toString();

  switch (type) {
  case 'Type A':
    // Convirtiendo extructura String a Array
    var msgContent = await message.split(',') || [];
    [convertedLatitude, convertedLongitude] = convertGeoCoordenates(msgContent[5], msgContent[7]);
    objectReturn['coordinates'] = { lat: convertedLatitude, lng: convertedLongitude };
    objectReturn['firmware_version'] = msgContent[2];
    objectReturn['orientation'] = Number(msgContent[9]);
    objectReturn['velocity'] = Number(msgContent[10]);
    objectReturn['message_date'] = await new Date(
      preYear.concat(msgContent[11].substring(4, 6)), // Year
      convertMonth(msgContent[11].substring(2, 4)), // Month
      msgContent[11].substring(0, 2), // Day
      msgContent[3].substring(0, 2), // Hour
      msgContent[3].substring(2, 4), // Minutes
      msgContent[3].substring(4, 6) // Seconds
    ).toLocaleString('es-CO', { timeZone: 'America/Bogota' });
    break;
  case 'Type B':
    // Sentencias ejecutadas cuando el resultado de expresion coincide con valor2
    break;
  case 'Type C':
    // Sentencias ejecutadas cuando el resultado de expresion coincide con valorN
    break;
  default:
    throw new Error('Tipo de algoritmo de estructuracion no encontrado.');
  }
  return objectReturn;
}

exports.register_data = async message => {
  console.time('getIMEIOnString');
  const IMEI = await getIMEIOnString(message); // Return {Number} - Value Numeric
  console.timeEnd('getIMEIOnString');
  try {
    console.time('findRecordGPS');
    const instance = await Link
      .findOne({ IMEI: IMEI, 'meta.is_active': true })
      .populate({ path: 'IMEI', select: 'structuring_algorithm' });

    if (instance == null) {
      throw new Error('Dispositivo no vinculado');
    }
    console.timeEnd('findRecordGPS');

    // Return Object Estructurado
    console.time('structuringContent');
    await instance.messages.push(await structuringAlgorithm(instance.IMEI.structuring_algorithm, message));
    await instance.save();
    console.timeEnd('structuringContent');
  } catch (e) {
    console.log(e);
  }
};

/**
 * Pendiente por validacion:
 *  - Evitar almacenar informacion de vehiculos detenidos.
 *  - Listado de GPS activos cuando inicia el Worker.
 */
