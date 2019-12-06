'use strict';
const pathroot = global['@'];

const _ = require('lodash');
const moment = require('moment');

const models = require(pathroot + '/models');
const exec = require(pathroot + '/callback/response');
const { basicQuery } = require(pathroot + '/config');

const has = Object.prototype.hasOwnProperty;
exports.arrayOperators = async (req, res) => {
  const { model, params, query } = req;
  // Objecto para la operacion mediante dos variables
  // index y value
  const queryObject = query.filter;
  const key = params.key; // Nombre de la llave que contiene el array

  try {
    /** @param {Object} queryFind - Objecto de consulta para model */
    const queryFind = _.assign(
      { _id: params._id },
      basicQuery,
      (req.company)
        // Si company es una propiedad de req, incluyalo en la consulta
        ? { 'meta.belong_to': req.company._id }
        : {}
    );
    /** @param {DocumentQuery} instance - Documento MongoDB */
    const instance = await model.findOne(queryFind);
    // Verificamos el estado de la instancia
    // Si instance es 'undefinded', osea no se encontro valor alguno
    if (!instance) {
      // No es posible acceder al recurso solicitado
      return res.status(404).json({
        status: 404,
        description: 'No se encontró el recurso solicitado.'
      });
    }

    switch (params.operator) {
    /**
     * Push: añade uno o más elementos al final de un array
     * y devuelve la nueva longitud del array.
     */
    case 'push':
      const keyCaster = model.schema.path(key).caster;
      // El siguiente procedimiento puede desecadenar en dos opciones bases:
      // 1. El array de subdocumentos sea de tipo Referencial para ObjectsId
      // 2. El array de subdocumentos para Objects
      if (has.call(keyCaster, 'instance')) {
        // para el primer caso:
        if (!queryObject.value) {
          // eslint-disable-next-line prefer-const
          return res.status(404).json({
            status: 404,
            description: 'Faltan parametro "value" en el query'
          });
        }
        const foreigmodel = models[keyCaster.options.ref].Model;
        foreigmodel.findById(queryObject.value, exec.document(res, (_err, doc) => {
          instance[key].push(doc._id);
          // Registro de la modificacion del documento
          document.meta.update.push({ by: req.user._id, at: moment() });
          instance.save(exec.document(res));
        }));
      } else {
        // Something...
      }
      break;
    /**
     * Pull: Extrae elementos del Array atómicamente, mediante la conversión
     * del valor proporcionado a un documento incrustado y luego comparación.
     */
    case 'pull':
      if (!queryObject.value) {
        return res.status(404).json({
          status: 404,
          description: 'Faltan parametro "value" en el query'
        });
      }
      var value = queryObject.value;
      instance[key].pull(value);
      // Registro de la modificacion del documento
      document.meta.update.push({ by: req.user._id, at: moment() });
      instance.save(exec.document(res));
      break;
    /**
     * Pop: elimina el último elemento de un array y lo devuelve.
     * Este método cambia la longitud del array.
     */
    case 'pop':
      instance[key].pop();
      // Registro de la modificacion del documento
      document.meta.update.push({ by: req.user._id, at: moment() });
      instance.save(exec.document(res));
      break;
    /**
     * Shift: elimina el primer elemento del array y lo retorna.
     * Este método modifica la longitud del array.
     */
    case 'shift':
      instance[key].shift();
      // Registro de la modificacion del documento
      document.meta.update.push({ by: req.user._id, at: moment() });
      instance.save(exec.document(res));
      break;
    /**
     * Set: Establece el valor en el índice y modifica el array.
     */
    case 'set':
      if (!queryObject.index && !queryObject.value) {
        return res.status(404).json({
          status: 404,
          description: 'Faltan parametro "value" y/o "index" en el query'
        });
      }
      // eslint-disable-next-line no-redeclare
      var { index, value } = queryObject;
      instance[key].set(index, value);
      // Registro de la modificacion del documento
      document.meta.update.push({ by: req.user._id, at: moment() });
      instance.save(exec.document(res));
      break;
    default:
      return res.status(404).json({
        status: 404,
        description: `Operador '${params.operator}' no valido.`
      });
    }
  } catch (e) {
    return res.status(404).json({ status: 404, description: e.message });
  }
};
