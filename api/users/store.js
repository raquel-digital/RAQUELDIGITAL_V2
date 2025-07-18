const model = require("./model");

const store = {
    numero_orden: async function () {
        const ultimaOrden = await model.findOne().sort({ _id: -1 });
        return ultimaOrden.numero_orden;
    },
    buscar_orden: async function (data) {
        
        if(!isNaN(data)){
            const num = Number(data)
            const find = await model.find({numero_orden: num});            
            return find;     
        }else{
            const nombre = await model.find({nombreApellido: new RegExp(data, 'i')})
            return nombre;
            
        }
    },
    ingresar: function (data){
        const user = new model(data);
        return user.save();
    },

    lastOrders: async function () {       
       const base = await model.find().sort({ _id: -1}).limit(10);
       return base;
    },
    largeOrders: async function (carrito) {      
        //caso extremo cuando el pedido es tan grande que excede la memoria del server 
       const user = new model(carrito);
       return user.save();
    },

 }
 
 module.exports = store;