'use strict';

// URL de segundo grado
const hasSecondGrade = (req, res, next) => {
  // Middleware conrespondientes para Url de 2do grado
  const { model, complement } = req;
  const nameModuleForeign = complement.nameModule;
  // Encuentra una key foranea y retorna su value
  try {
    // eslint-disable-next-line no-unused-vars
    console.log();
    var [key, value] = Object
      .entries(model.schema.obj)
      .find(([key, value]) => {
        return value.ref === nameModuleForeign;
      });
    req.params[key] = req.params._id;
    delete req.params._id;
    next();
  } catch (e) {
    return res.status(500).json({
      status: 500,
      description: 'URL invalid: Revise los parametros de consulta'
    });
  }
};

module.exports = hasSecondGrade;
