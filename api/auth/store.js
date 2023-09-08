const { async } = require("rxjs");
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
}

module.exports = store;