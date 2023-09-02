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
            console.log(data)
            const model = require("./controlComprasModel")
            const check = await model.find({ shopId: data.shopId });
            if(check.length == 0){
                await model.create(data)
            }else{
                await model.updateOne({ shopId: data.shopId}, 
                    { 
                        $set: { fecha: data.fecha, 
                                compra: data.compra
                            }  
                    })
            }
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
    }
}

module.exports = store;