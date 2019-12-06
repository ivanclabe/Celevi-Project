const express = require('express');
const router = express.Router();

// Require controller modules.
const vehicleControllers = require('../controllers/vehicleControllers');

// Solicitud de creación de device.
router.get('/create', vehicleControllers.vehicle_create_get);

module.exports = router;
