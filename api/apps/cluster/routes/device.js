const express = require('express');
const router = express.Router();

// Require controller modules.
const deviceController = require('../controllers/deviceController');

// Solicitud de creación de device.
router.get('/create', deviceController.device_create_get);

module.exports = router;
