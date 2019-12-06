'use strict';
/**
 * Modelo User.
 * @version 0.1
 * @name User
 * @author Ivanclabe
 * @module connect
 * @copyright Callback S.A.S / GeoRuta Proyect
 * @public
 */
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const moment = require('moment');

const { Schema } = mongoose;
const BaseSchema = require('../_schema');

var userSchema = new BaseSchema({
  // Fields Auth
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, select: false },

  display_name: { type: String, trim: true, require: true },
  email: {
    type: String,
    trim: true,
    unique: true,
    require: [true, 'email requerido'],
    lowercase: true
  },
  phone: {
    // Validation succeeds! Phone number is defined
    // and fits `DDD-DDD-DDDD`
    type: String,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
    // required: [true, 'User phone number required']
  },
  avatar: String,

  last_login: Date,
  date_joined: { type: Date, default: Date.now },

  is_main: { type: Boolean, default: false },
  is_superuser: { type: Boolean, default: false },

  is_vehicle_owner: { type: Boolean, default: true },
  role: { type: Schema.Types.ObjectId, ref: 'Role' },
  // Company a la cual se afilia el usuario. No habilitado para Main User
  affiliate_to: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: function () {
        return !this.is_main;
      }
    }
  ]
}, { collection: 'users', index: { last_login: -1, username: 1 }, toJSON: { virtuals: true } });
userSchema.plugin(mongoosePaginate);

userSchema.virtual('companies_created', {
  ref: 'Company', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'meta.created.by', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false,
  options: { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
});

userSchema.pre('save', function (next) {
  // eslint-disable-next-line prefer-const
  const user = this;
  if (user.isNew) user.last_login = moment();
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (_err, hash) => {
      if (_err) return next(_err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.gravatar = function () {
  if (!this.email) return 'https://es.gravatar.com/avatar/?s=200&d=retro';

  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://es.gravatar.com/avatar/${md5}?s=200&d=retro`;
};

module.exports = mongoose.model('User', userSchema);
