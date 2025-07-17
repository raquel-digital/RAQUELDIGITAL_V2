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
        limpiarPedidosTemporarios(model)        

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
            // if(data.compra == null || data.compra.length == null) {
            //     console.log("AFUERA INGRESO FUIRA")
            //     return    
            // }
                    
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




async function limpiarPedidosTemporarios(PedidosTemporarios) {
    try {
        
        const count = await PedidosTemporarios.countDocuments();       
        
        if (count > 100) {
           
            const cutoffDocs = await PedidosTemporarios.find({})
                                                      .sort({ _id: -1 }) // Ordena de más reciente a más antiguo
                                                      .skip(100)        // Salta los 100 más recientes (los que queremos conservar)
                                                      .limit(1)         // Toma el siguiente (el número 101)
                                                      .select('_id')    // Solo necesitamos el _id
                                                      .lean();          // Para obtener un objeto JS plano y no un documento Mongoose

            if (cutoffDocs.length > 0) {
                const cutoffId = cutoffDocs[0]._id;

                // 2. Borrar todos los documentos cuyo _id sea anterior (menor) al _id de corte
                const result = await PedidosTemporarios.deleteMany({ _id: { $lt: cutoffId } });
                
            } else {
                console.log('No se encontró un documento de corte. La colección puede tener 100 o menos documentos.');
            }
        } else {
            console.log('No hay suficientes documentos para borrar, la colección ya tiene 100 o menos.');
        }
    } catch (error) {
        console.error('Error al limpiar pedidos temporarios:', error);
    }
}
