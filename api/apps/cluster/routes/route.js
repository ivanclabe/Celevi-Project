const express = require('express');
const router = express.Router();

// Require controller modules.
const routeControllers = require('../controllers/routeControllers');

// Solicitud de creación de device.
router.get('/create', routeControllers.route_create_get);

module.exports = router;
