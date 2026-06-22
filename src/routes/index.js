const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const accountRoutes = require('./account.routes');
const transferRoutes = require('./transfer.routes');

// Agrupar rutas de módulos
router.use('/auth', authRoutes);
router.use('/account-alpha', accountRoutes);
router.use('/transfer-beta', transferRoutes);

module.exports = router;
