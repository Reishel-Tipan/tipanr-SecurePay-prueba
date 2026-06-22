// Inicialización del SDK de Sentry para observabilidad distribuida.
// IMPORTANTE: este archivo debe importarse como la PRIMERA línea del backend
// (antes de Express y de cualquier otra librería) para instrumentar todo el runtime.
require('dotenv').config();
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // Captura del 100% de las trazas en entorno académico.
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV || 'development'
});

module.exports = Sentry;
