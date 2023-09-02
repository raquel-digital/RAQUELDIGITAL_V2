const { date } = require("mercadopago/lib/utils");
const mongoose = require("mongoose");

const schema = mongoose.Schema;

const newSchema = new schema({
    numero_De_Orden: Number
})

const model = mongoose.model("numero-orden", newSchema);

module.exports = model;