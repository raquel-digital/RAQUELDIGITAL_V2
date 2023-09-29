const { async } = require("rxjs");
const { findOneAndUpdate } = require("./model");
const model = require("./model");

const store = {
    ingresar: async function (data){
        
        model.findOneAndUpdate(
          { id: data.id },
          { $push: { pedidos: data.pedidos } },
          { upsert: true, returnOriginal: false },
          (err, result) => {
            if (err) throw err;        
            console.log('Resultado:pedido guardado exitosamente');
          }
        );
    },
    login: async function (id){
      const res = await model.find({id: id})
      return res
    },
    del: async function (data){
      try{
        await model.updateOne({id: data.id}, { $pull: { pedidos: { fecha: data.fecha } } })
        return true
      }catch(err){
        console.log("[ ERROR AL BORRAR PEDIDO ] ", err)
        return false
      }
    },
    
}

module.exports = store;