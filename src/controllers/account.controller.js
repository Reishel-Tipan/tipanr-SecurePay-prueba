// Controlador HTTP de cuentas. Recibe el servicio de dominio por CONSTRUCTOR (DIP).
class AccountController {
  constructor(transactionService) {
    this.transactionService = transactionService;
    // Se enlaza el contexto para poder usarlo como handler de Express.
    this.getBalance = this.getBalance.bind(this);
  }

  /**
   * GET /v1/account-alpha/balance?accountId=ACC-12345
   */
  getBalance(req, res) {
    try {
      const accountId = req.query.accountId;

      if (!accountId) {
        return res.status(400).json({
          error: 'Petición incorrecta',
          message: 'Debe proporcionar un parámetro accountId por query string (ej: ?accountId=ACC-12345).'
        });
      }

      const accountInfo = this.transactionService.getAccountBalance(accountId);
      return res.status(200).json(accountInfo);
    } catch (error) {
      return res.status(404).json({
        error: 'Recurso no encontrado',
        message: error.message
      });
    }
  }
}

module.exports = AccountController;
