// PRIMERA LÍNEA del backend: inicializa Sentry antes que Express o cualquier librería.
const Sentry = require('./src/instrument');

require('dotenv').config();
const express = require('express');
const routes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración básica para parsear JSON en las peticiones HTTP
app.use(express.json());

// Montar el enrutador principal en /v1
app.use('/v1', routes);

// Endpoint base informativo
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'fintech-securepay-base',
    description: 'API base para evaluaciones de aplicaciones distribuidas (ESPE)',
    status: 'ONLINE'
  });
});

// Handler de errores de Sentry: captura las excepciones no controladas (errores
// OPERACIONALES) que llegan vía next(err) y las reporta al dashboard. Los errores
// LÓGICOS de seguridad (401/403) se resuelven antes en el middleware y nunca llegan aquí.
Sentry.setupExpressErrorHandler(app);

// Manejo centralizado de la respuesta 500 al cliente.
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Servidor Fintech ejecutándose en: http://localhost:${PORT}`);
  console.log(`   - Balance Alpha: GET http://localhost:${PORT}/v1/account-alpha/balance`);
  console.log(`   - Transferencia Beta: POST http://localhost:${PORT}/v1/transfer-beta/execute`);
  console.log(`======================================================\n`);
});
