// COMPOSITION ROOT: punto único donde se instancian las clases concretas y se
// inyectan por constructor (DIP). El resto de la aplicación solo consume abstracciones.
const AccountRepository = require('./services/account.repository');
const VerificationService = require('./services/verification.service');
const NotificationService = require('./services/notification.service');
const TransactionService = require('./services/transaction.service');
const AccountController = require('./controllers/account.controller');
const TransferController = require('./controllers/transfer.controller');

// Servicios de bajo nivel (SRP)
const accountRepository = new AccountRepository();
const verificationService = new VerificationService(accountRepository);
const notificationService = new NotificationService();

// Orquestador de dominio con sus dependencias inyectadas (DIP)
const transactionService = new TransactionService(
  verificationService,
  accountRepository,
  notificationService
);

// Controladores con el servicio inyectado por constructor (DIP)
const accountController = new AccountController(transactionService);
const transferController = new TransferController(transactionService);

module.exports = {
  accountRepository,
  verificationService,
  notificationService,
  transactionService,
  accountController,
  transferController
};
