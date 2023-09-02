const mongoose = require("mongoose");
const schema = mongoose.Schema;

const newSchema = new schema({
    fecha: String,
    num_orden: Number,
    cliente: String,
    prepara: String,
    estado: String,
    contacto: [{ 
        medio: String,
        nota: String
    }],
    pedido: String,
    faltas: String,
    notas: String,
    forma_de_pago: String,
    envio: String,
    zona: String    
})

const model = mongoose.model("Pedidos - Local - Terminados", newSchema);

module.exports = model;