const express = require('express');
const router = express.Router();
const main = require('../controllers/main.js');

router.get('/generateImage', main.generateImage);
router.get('/teste', main.teste);

module.exports = router;
