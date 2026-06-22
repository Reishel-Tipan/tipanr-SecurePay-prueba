const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /v1/auth/login -> emite un JWT RS256
router.post('/login', authController.login);

module.exports = router;
