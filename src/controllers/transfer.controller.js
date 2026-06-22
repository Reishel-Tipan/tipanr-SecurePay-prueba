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

      const result = this.transactionService.executeTransfer(fromAccountId, toAccountId, Number(amount));
      return res.status(200).json(result);
    } catch (error) {
      // Errores de validación/negocio se responden como bad request controlado (400).
      return res.status(400).json({
        error: 'Error en la transacción',
        message: error.message
      });
    }
  }
}

module.exports = TransferController;
