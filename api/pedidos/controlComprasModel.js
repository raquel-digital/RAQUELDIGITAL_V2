const mongoose = require("mongoose");
const { stringify } = require("nodemon/lib/utils");

const schema = mongoose.Schema;

const newSchema = new schema({
    shopId: String,
    fecha: String,
    compra: [
        {
          codigo: String,
          titulo: String,
          precio: Number,
          cantidad: Number,
          imagen: String
        }
      ],        
})

const model = mongoose.model("pedidos temporario", newSchema);

module.exports = model;