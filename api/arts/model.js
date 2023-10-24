const { date } = require("mercadopago/lib/utils");
const mongoose = require("mongoose");

const schema = mongoose.Schema;

const newSchema = new schema({

        codigo: String,
        categorias: String,
        nombre: String,
        nombre2: String,
        CantidadDeVenta: String,
        imagendetalle: String,
        precio: String,
        descripcion: String,
        stock: Number,
        tags: String,
        fechaDeIngreso: String,
        fechaModificacion: String,
        fechaUltimaVenta: String,
        imgActualizada: Boolean,
        mostrar: Boolean,
        colores: [ { codigo: String,
                     color: String,
                     stock: Number,
                     mostrar: Boolean,
                     id: Number   
                } ],
        id: Number
        
})

const model = mongoose.model("articulos", newSchema);

module.exports = model;