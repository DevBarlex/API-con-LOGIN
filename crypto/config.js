const crypto = require('crypto')
const bcrypt = require('bcrypt')

const secret = crypto.randomBytes(64).toString('hex'); //Genera una clave aleatoria
const hashedSecret = bcrypt.hashSync(secret, 10); // Encripta esa clave aleatoria

module.exports = { hashedSecret };