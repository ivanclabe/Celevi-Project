'use strict';
const pathroot = global['@'];

const bcrypt = require('bcrypt');
const moment = require('moment');

const { auth } = require(pathroot + '/models');
const token = require('./token');

const UserModel = auth.User.Model;

// Crea un usuario con privilegios globales superusuario y cuenta Main
// Este usuario tiene acceso a todas las funcionalidades habilitadas en el API.
exports.signUp = (req, res) => {
  const user = new UserModel({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    is_superuser: true,
    is_main: true
  });
  user.save((err, user) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 500, description: `${err.message}` });
    }
    return res
      .status(201)
      .json({ user: user, token: token.createToken(user) });
  });
};

// Autentica un usuario desde la interfaz de logIn publica.
exports.signIn = (req, res) => {
  const { username, password } = req.body;
  UserModel
    .findOne({ username: username, 'meta.is_active': true, 'meta.is_deleted': false })
    .populate({
      path: 'affiliate_to',
      select: 'name',
      match: { 'meta.is_active': true, 'meta.is_deleted': false }
    })
    .select('username password affiliate_to')
    .exec(function (err, user) {
      if (err) {
        return res.status(500).json({ status: 500, description: err.message });
      } else if (!user) {
        return res.status(401).json({ status: 401, description: 'User not found.' });
      } else {
        // Comparamos Passwords para la autenticación
        bcrypt.compare(password, user.password, function (_err, samePassword) {
          if (_err) {
            return res.status(500).json({ status: 500, description: _err.message });
          } else if (!samePassword) {
            return res.status(401).json({ status: 401, description: 'Password incorrect.' });
          } else {
            // Update date_joined
            UserModel.updateOne(
              { _id: user._id },
              { $set: { last_login: moment() } },
              function (err, document) {
                if (err) res.status(500).json({ status: 500, description: err.message });
                return res.status(200).json({
                  user: user,
                  token: token.createToken(user)
                });
              }
            );
          }
        });
      }
    });
};
