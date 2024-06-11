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
        },
        read: async function () {
            const res = await model.find()
            return res
        },
        updateCode: async function (code, newCode) {
            const res = await model.updateOne(
                { 'presupuesto.codigo': code },
                { $set: { 'presupuesto.$.codigo': newCode } }
              );
            return 
        }
 }
 
 module.exports = store;