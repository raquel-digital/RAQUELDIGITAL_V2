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
    findOld: async function (query){
        const deleteModel = require("./modelDelete");
        const res = await deleteModel.find({
            cliente: { "$regex": query, "$options": "i" }
        });
        return res;
    },
    findNumOrder: async function () {
        const res = await model.find().sort({ _id: -1 }).limit(1);
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
                pedido: data.pedido,
                faltas: data.faltas,
                notas: data.notas,
                forma_de_pago: data.forma_de_pago,
                envio: data.envio,
                zona: data.zona
            }
        })
     }catch(err){
        console.log("[ ERROR EN STORE UPDATE ] " + err)
     }  
    },
    delete: async function (orden){
        try{
            
            const deleteData = await model.find({ num_orden: orden })
            const deleteModel = require("./modelDelete");
            const data = deleteData[0];
            const order = {    
                fecha: data.fecha,
                num_orden: data.num_orden,
                cliente: data.cliente,
                prepara: data.prepara,
                estado: data.estado,
                contacto: data.contacto,
                pedido: data.pedido,
                faltas: data.faltas,
                notas: data.notas,
                forma_de_pago: data.forma_de_pago,
                envio: data.envio,
                zona: data.zona
               }
            const dataOld = new deleteModel(order);
            dataOld.save();
            await model.findOneAndRemove({ num_orden: orden })
        }catch(err){
            console.log("[ ERROR EN STORE DELETE ] " + err)
        }
    },
    oldOrders: async function (orden){ 
        const deleteModel = require("./modelDelete");
        const res = deleteModel.find().sort({ _id: -1 }).limit(50);
        return res;
    },
    actuRecordatorio: async function (data){ 
        await model.findOneAndUpdate({
            num_orden: data.orden
        },
        {
             $inc: { recordarEn: data.suma } 
        }  
        )
    },
}

module.exports = store;