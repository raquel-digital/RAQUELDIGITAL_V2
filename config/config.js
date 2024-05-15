const dotenv = require('dotenv');
dotenv.config();

config = {
    capDb: process.env.capDb,
    mail: process.env.GMAIL_USER,
    pmail: process.env.GMAIL_APP_PASS,
    admin: process.env.admin,
    padmin: process.env.padmin,
    padmin2: process.env.padmin2,
    envioCorreoNac: process.env.valorCorreoNac,
    envioCorreoReg: process.env.valorCorreoReg,
    envioMoto: process.env.valorMoto,
    envioExpreso: process.env.valorExpreso
};

module.exports = config;