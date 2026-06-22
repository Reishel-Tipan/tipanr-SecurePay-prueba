const jwtService = require('../services/jwt.service');
const { accountRepository } = require('../container');

/**
 * Endpoint de autenticación. Emite un JWT RS256 para poder probar los
 * microservicios protegidos (Alpha/Beta). En un entorno real validaría una
 * contraseña; aquí valida que la cuenta exista en el repositorio.
 *
 * POST /v1/auth/login
 * Body JSON: { accountId }
 */
function login(req, res) {
  const { accountId } = req.body;

  if (!accountId) {
    return res.status(400).json({
      error: 'Petición incorrecta',
      message: 'El campo accountId es requerido (ej: ACC-12345).'
    });
  }

  const user = accountRepository.findByAccount(accountId);
  if (!user) {
    return res.status(401).json({
      error: 'Credenciales inválidas',
      message: `La cuenta '${accountId}' no existe.`
    });
  }

  // Claims seguros: sub (identificador de usuario) y name. exp lo agrega el servicio (2m).
  const token = jwtService.signToken({ sub: user.id, name: user.email });

  return res.status(200).json({
    message: 'Autenticación exitosa',
    tokenType: 'Bearer',
    expiresIn: '2m',
    accessToken: token
  });
}

module.exports = { login };
