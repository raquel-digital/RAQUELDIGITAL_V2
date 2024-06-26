
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
        
        await model.updateOne(
          { id: data.id },
          { $pull: { pedidos: { fecha: data.fecha } } }
        );
     
        return true
      }catch(err){
        console.log("[ ERROR AL BORRAR PEDIDO ] ", err)
        return false
      }
    },
    history: async function (user){
       const base = await model.find({ id: user.id }, {pedidos: 1})
       const history = base[0].pedidos.filter(e => e.tipo == "Historial")
       
      if(history.length > 30){
        await model.updateOne(
          { id: user.id },
          { $pull: { pedidos: { _id: history[0]._id } } }
        );
      }

      await model.updateOne(
        { id: user.id },
        { $push: { pedidos: user.pedidos } }
      )
    }    
}

module.exports = store;