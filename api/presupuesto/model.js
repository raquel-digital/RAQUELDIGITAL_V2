const mongoose = require("mongoose");

const schema = mongoose.Schema;

const newSchema = new schema({
      tipo: String,  
      presupuesto: [
                        {
                                codigo: String,
                                imagen: String,
                                codigo: String,
                                precio: String,
                                titulo: String,
                                cantidad: String,
                        }
                ],          
})

const model = mongoose.model("Presupuestos", newSchema);

module.exports = model;