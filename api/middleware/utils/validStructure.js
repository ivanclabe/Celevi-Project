'use strict';
const mongoose = require('mongoose');

// Validacion de estructura para opera Arrays
const vArray = (req, res, next) => {
  // Middleware para validar y evaluar key de schema de tipo Array
  const schema = req.model.schema;
  const key = req.params.key;
  // Verificamos que la key existe en nuestro Schema
  // ¿Existe? y ¿¡Cumple la condición de tipo array!?
  if (schema.path(key) instanceof mongoose.Schema.Types.Array) {
    next();
  } else {
    return res.status(404).json({ status: 404, description: `Key '${key}' invalida para la operacion` });
  }
};

module.exports = vArray;
