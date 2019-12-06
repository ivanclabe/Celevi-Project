module.exports = {
  User: {
    nameModule: 'users',
    displayName: 'Usuario',
    Model: require('./user'),
    handlerRequest: true
  },
  Role: {
    nameModule: 'roles',
    displayName: 'Roles',
    Model: require('./role')
  },
  Permission: {
    nameModule: 'permissions',
    displayName: 'Permisos',
    Model: require('./permission')
  }
};
