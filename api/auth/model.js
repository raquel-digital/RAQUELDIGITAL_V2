const mongoose = require("mongoose");
const schema = mongoose.Schema;

const newSchema = new schema({
    id: String,
    nombre: String,
    mail: String,
    pedidos: [
      {
        fecha: String,      
        nombre: String,
        favorito: Boolean,
        compra: [
          {
            codigo: String,
            titulo: String,
            precio: Number,
            cantidad: Number,
            imagen: String
          }
        ]
      },
    ]    
})

const model = mongoose.model("usuario - auth", newSchema);

module.exports = model;