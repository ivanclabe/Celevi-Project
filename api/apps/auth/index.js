'use strict';
const express = require('express');
const router = express.Router();

const authCtrl = require('./controllers');

// Login
router.post('/sign_in', authCtrl.signIn);

// Registro Usuario Main
router.post('/sign_up', authCtrl.signUp);

module.exports = router;
