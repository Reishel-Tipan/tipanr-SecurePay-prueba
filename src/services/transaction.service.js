// ORQUESTADOR (controlador de dominio).
// Aplica INVERSIÓN DE DEPENDENCIAS (DIP): recibe sus colaboradores de bajo nivel
// (verificación, repositorio de estado y notificaciones) por CONSTRUCTOR,
// dependiendo de abstracciones inyectadas y no de instancias concretas internas.
class TransactionService {
  constructor(verificationService, accountRepository, notificationService) {
    this.verificationService = verificationService;
    this.accountRepository = accountRepository;
    this.notificationService = notificationService;
  }

  executeTransfer(fromAccountId, toAccountId, amount) {
    // 1. Verificación financiera (delegada).
    const { sender, receiver } = this.verificationService.validateTransfer(fromAccountId, toAccountId, amount);

    // 2. Actualización de estado (delegada al repositorio).
    this.accountRepository.updateBalance(fromAccountId, sender.balance - amount);
    this.accountRepository.updateBalance(toAccountId, receiver.balance + amount);

    // 3. Registro de la transacción (delegado al repositorio).
    const newTransaction = {
      transactionId: `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      from: fromAccountId,
      to: toAccountId,
      amount: amount,
      status: 'COMPLETED',
      timestamp: new Date().toISOString()
    };
    this.accountRepository.saveTransaction(newTransaction);

    // 4. Notificaciones (delegadas).
    this.notificationService.sendDebitEmail(sender, fromAccountId, amount);
    this.notificationService.sendCreditEmail(receiver, fromAccountId, amount);

    return {
      success: true,
      message: 'Transferencia ejecutada con éxito',
      transaction: newTransaction,
      balanceRestante: sender.balance
    };
  }

  getAccountBalance(accountId) {
    const account = this.verificationService.validateAccountExists(accountId);
    return {
      accountId: account.accountAlpha,
      email: account.email,
      balance: account.balance
    };
  }
}

module.exports = TransactionService;
