const jwtService = require('../services/jwt.service');

/**
 * Middleware de Autenticación stateless para los microservicios simulados (Alpha y Beta).
 * Intercepta la cabecera Authorization, extrae el Bearer Token y lo verifica de forma
 * AUTÓNOMA usando únicamente la llave pública (RS256), sin estado compartido.
 *
 * Errores LÓGICOS de seguridad (token malformado/expirado) se responden 401/403
 * de forma controlada y NO se propagan como crash (no se reportan a Sentry).
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      error: 'Acceso no autorizado',
      message: 'Falta la cabecera Authorization en la petición.'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      error: 'Acceso no autorizado',
      message: 'Formato de cabecera de autenticación debe ser Bearer <token>.'
    });
  }

  const token = parts[1];

  try {
    // Verificación criptográfica autónoma con la llave pública.
    const decoded = jwtService.verifyToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    // Token expirado -> 401 controlado.
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
        message: 'El token de acceso ha expirado. Solicite uno nuevo.'
      });
    }
    // Token inválido/malformado/firma incorrecta -> 403 controlado.
    return res.status(403).json({
      error: 'Token inválido',
      message: 'La firma del token no es válida o está malformado.'
    });
  }
}

module.exports = authMiddleware;
