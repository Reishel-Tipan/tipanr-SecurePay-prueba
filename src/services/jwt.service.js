const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Carga del par de llaves OpenSSL (PKCS#8) desde la raíz del proyecto.
// La ruta se resuelve relativa al módulo para no depender del cwd del proceso.
const PRIVATE_KEY_PATH = path.join(__dirname, '../../private.pem');
const PUBLIC_KEY_PATH = path.join(__dirname, '../../public.pem');

/**
 * Genera un Token JWT firmado de forma ASIMÉTRICA con la clave privada (RS256).
 * Payload con claims seguros: sub, name y exp configurado a 2 minutos.
 *
 * @param {Object} user - { sub, name }
 * @returns {string} JWT firmado.
 */
function signToken(user) {
  const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');

  const payload = {
    sub: user.sub,
    name: user.name
  };

  // exp a 2 minutos mediante expiresIn; firma asimétrica RS256.
  return jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '2m'
  });
}

/**
 * Verifica un Token JWT usando ÚNICAMENTE la clave pública (RS256).
 * Permite la validación autónoma/stateless en cada microservicio.
 *
 * @param {string} token
 * @returns {Object} Payload decodificado si es válido (lanza excepción si no).
 */
function verifyToken(token) {
  const publicKey = fs.readFileSync(PUBLIC_KEY_PATH, 'utf8');

  // Se fuerza el algoritmo RS256 para impedir ataques de degradación (alg=none / HS256).
  return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
}

module.exports = {
  signToken,
  verifyToken
};
