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

newSchema.index({ categorias: 1 });

const model = mongoose.model("articulos", newSchema);

model.ensureIndexes((err) => {
        if (err) {
            console.error('Error al crear el índice:', err);
        } else {
            console.log('Índice creado con éxito');
        }
    });

module.exports = model;