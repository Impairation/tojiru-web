const bcrypt = require("bcrypt");

function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
}

async function comparePassword(plaintext, hash) {
    return bcrypt.compareSync(plaintext, hash);
}

module.exports = {
    hashPassword,
    comparePassword
}