const Sentry = require('@sentry/node');

// Controlador HTTP de transferencias. Recibe el servicio de dominio por CONSTRUCTOR (DIP).
class TransferController {
  constructor(transactionService) {
    this.transactionService = transactionService;
    this.executeTransfer = this.executeTransfer.bind(this);
  }

  /**
   * POST /v1/transfer-beta/execute
   * Body JSON: { fromAccountId, toAccountId, amount }
   */
  executeTransfer(req, res, next) {
    try {
      const { fromAccountId, toAccountId, amount } = req.body;

      if (!fromAccountId || !toAccountId || amount === undefined) {
        return res.status(400).json({
          error: 'Petición incorrecta',
          message: 'Los campos fromAccountId, toAccountId y amount son requeridos en el cuerpo de la petición.'
        });
      }

      // --- DISPARADOR DE ERROR OPERACIONAL (500) ---
      // Simula un fallo de conexión a la base de datos de saldos. Es un error operacional
      // (no lógico): debe alertar a Sentry adjuntando como Tag el ID del usuario del JWT.
      if (req.body.simulateDbFailure === true) {
        const userId = req.user ? req.user.sub : 'desconocido';
        Sentry.setTag('user_id', userId);
        Sentry.setUser({ id: userId, username: req.user ? req.user.name : undefined });
        throw new Error('Conexión interrumpida con el Clúster de Datos SecurePay');
      }

      const result = this.transactionService.executeTransfer(fromAccountId, toAccountId, Number(amount));
      return res.status(200).json(result);
    } catch (error) {
      // Error OPERACIONAL: se delega a next(err) para que el handler de Sentry lo
      // reporte como crash 500 con la telemetría (Tags) ya adjuntada.
      if (error.message === 'Conexión interrumpida con el Clúster de Datos SecurePay') {
        return next(error);
      }
      // Errores LÓGICOS de validación/negocio: bad request controlado (400), sin alertar.
      return res.status(400).json({
        error: 'Error en la transacción',
        message: error.message
      });
    }
  }
}

module.exports = TransferController;
