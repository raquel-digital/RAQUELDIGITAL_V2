const model = require("./model");

const store = {
    write: async function (data) {
            const articuloExistente = await model.findOne({ tipo: data.tipo });
            
            if (articuloExistente) {
                // Actualizar la cantidad del artículo existente
                await model.updateOne(
                    { tipo: data.tipo }, 
                    { $set: { presupuesto: data.pedido } 
                });
            } else {
                // Crear un nuevo documento de artículo
                const nuevoArticulo = new model({tipo: data.tipo, presupuesto: data.pedido});
                await nuevoArticulo.save();
            }
        }
 }
 
 module.exports = store;