// RESPONSABILIDAD ÚNICA (SRP): Almacenamiento y acceso al estado.
// Encapsula la "base de datos" en memoria de cuentas y el historial de transacciones.
// No conoce reglas de negocio ni notificaciones: solo persiste y recupera estado.
class AccountRepository {
  constructor() {
    this._usersDb = [
      { id: 'usr_001', email: 'estudiante.alpha@espe.edu.ec', accountAlpha: 'ACC-12345', balance: 1500.0 },
      { id: 'usr_002', email: 'docente.beta@espe.edu.ec', accountAlpha: 'ACC-67890', balance: 350.5 }
    ];
    this._transactionsHistory = [];
  }

  findByAccount(accountId) {
    return this._usersDb.find(u => u.accountAlpha === accountId);
  }

  updateBalance(accountId, newBalance) {
    const account = this.findByAccount(accountId);
    if (account) {
      account.balance = newBalance;
    }
    return account;
  }

  saveTransaction(transaction) {
    this._transactionsHistory.push(transaction);
    return transaction;
  }

  getHistory() {
    return this._transactionsHistory;
  }
}

module.exports = AccountRepository;
