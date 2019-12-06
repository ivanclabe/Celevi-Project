const express = require('express');
const router = express.Router();
const packageJson = require('../package.json');

// router.get('', (req, res) => res.redirect(''));
router.get('', (req, res) => {
  res.render('home', { title: packageJson.name, version: packageJson.version });
});
router.get('/about', (req, res) => {
  res.status(200).send(
    `API REST: Proyecto ${packageJson.name} para ${packageJson.author}. Version: ${packageJson.version}`
  );
});

module.exports = router;
