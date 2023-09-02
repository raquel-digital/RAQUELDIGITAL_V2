const mongoose = require("mongoose");
const schema = mongoose.Schema;

const newSchema = new schema({
    fecha: String,
    num_orden: Number,
    cliente: String,
    prepara: String,
    estado: String,
    compra: [
        {
          codigo: String,
          titulo: String,
          precio: Number,
          cantidad: Number,
          imagen: String
        }
      ],
    faltas: [
        {
          codigo: String,
          titulo: String,
          precio: Number,
          cantidad: Number,
          imagen: String,
          fecha_entrega: String
        }
      ],
    notas: String   
})

const model = mongoose.model("Pedidos - WEB", newSchema);

module.exports = model;