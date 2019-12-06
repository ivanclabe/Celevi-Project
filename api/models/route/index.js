module.exports = {
  Device: {
    nameModule: 'devices',
    displayName: 'Dispositivos',
    Model: require('./device'),
    handlerRequest: true
  },
  RefDev: {
    nameModule: 'refdev',
    displayName: 'Referencias',
    Model: require('./refDevice'),
    handlerRequest: false
  },
  Link: {
    nameModule: 'links',
    displayName: 'Vinculaciones',
    Model: require('./link'),
    handlerRequest: true
  },
  Vehicle: {
    nameModule: 'vehicles',
    displayName: 'Vehiculos',
    Model: require('./vehicle'),
    handlerRequest: true
  },

  Route: {
    nameModule: 'routes',
    displayName: 'Rutas',
    Model: require('./route'),
    handlerRequest: true
  },
  Sheet: {
    nameModule: 'sheets',
    displayName: 'Hoja de Rutas',
    Model: require('./sheet'),
    handlerRequest: true
  }
};
