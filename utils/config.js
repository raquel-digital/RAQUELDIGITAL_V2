const dotenv = require('dotenv');
dotenv.config();

config = {
    capDb: process.env.capDb,
    mail: process.env.GMAIL_USER,
    pmail: process.env.GMAIL_APP_PASS,
    admin: process.env.admin,
    padmin: process.env.padmin,
    envioCorreoNac: process.env.valorCorreoNac,
    envioCorreoReg: process.env.valorCorreoReg,
    envioMoto: process.env.valorMoto,
    envioExpreso: process.env.valorExpreso,
    mongo: process.env.mongo,
    test: "ok"
};

module.exports = config;