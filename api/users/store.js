const model = require("./model");

const store = {
    numero_orden: async function () {
        const ultimaOrden = await model.findOne().sort({ _id: -1 });
        return ultimaOrden.numero_orden;
    },
    buscar_orden: async function (num) {
        const find = await model.find({numero_orden: num});
        return find;
    },
    ingresar: function (data){
        const user = new model(data);
        return user.save();
    },

    lastOrders: async function () {       
       const base = await model.find().sort({ _id: -1}).limit(10);
       return base;
    },

 }
 
 module.exports = store;