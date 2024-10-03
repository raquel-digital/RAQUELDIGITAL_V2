const { async } = require("rxjs");
const model = require("./model");

const store = {
    ingresar: function (data){
        const order = new model(data);
        return order.save();
    },
    find: async function (){
        const res = await model.find();
        return res;
    },
    findOld: async function (){
        const model = require("./controlComprasModel")

        const count = await model.countDocuments();

        // Si hay más de 3 documentos, eliminar el más antiguo
        if (count > 100) {
            // Eliminar el primer documento (más antiguo)
            const result = await model.deleteOne({}, { sort: { _id: 1 } });
        }

        const res = await model.find();
        return res;
    },
    update: async function (data){
     try{
        await model.findOneAndUpdate({
            num_orden: data.num_orden
        },{
            $set: {
                prepara: data.prepara,
                estado: data.estado,
                compra: data.compra,
                faltas: data.faltas,
                notas: data.notas
            }
        })
     }catch(err){
        console.log("[ ERROR EN STORE UPDATE ] " + err)
     }  
    },
    writeCarrito: async function (data){
        try{
            const model = require("./controlComprasModel")            
            const order = new model(data);
            await order.save(data)
            return
        }catch(err){
            console.log(err)
        }
        
    },
    delete: async function (orden){
        try{
            await model.findOneAndRemove({ num_orden: orden})
        }catch(err){
            console.log("[ ERROR EN STORE DELETE ] " + err)
        }
    },
    
}

module.exports = store;