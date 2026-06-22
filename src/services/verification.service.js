// RESPONSABILIDAD ÚNICA (SRP): Verificación financiera y reglas de negocio.
// Solo valida (existencia de cuentas, monto, saldo). No muta estado ni notifica.
// Depende de una abstracción de repositorio inyectada por constructor (DIP).
class VerificationService {
  constructor(accountRepository) {
    this.accountRepository = accountRepository;
  }

  // Valida una transferencia y devuelve {sender, receiver} si todo es correcto.
  validateTransfer(fromAccountId, toAccountId, amount) {
    const sender = this.accountRepository.findByAccount(fromAccountId);
    if (!sender) {
      throw new Error(`Error de validación: La cuenta origen '${fromAccountId}' no existe en la base de datos.`);
    }

    const receiver = this.accountRepository.findByAccount(toAccountId);
    if (!receiver) {
      throw new Error(`Error de validación: La cuenta destino '${toAccountId}' no existe en la base de datos.`);
    }

    if (amount <= 0) {
      throw new Error('Error de validación: El monto a transferir debe ser mayor a cero.');
    }

    if (sender.balance < amount) {
      throw new Error(`Saldo insuficiente: La cuenta '${fromAccountId}' tiene $${sender.balance}, requiere $${amount}.`);
    }

    return { sender, receiver };
  }

  validateAccountExists(accountId) {
    const account = this.accountRepository.findByAccount(accountId);
    if (!account) {
      throw new Error(`La cuenta '${accountId}' no existe.`);
    }
    return account;
  }
}

module.exports = VerificationService;
