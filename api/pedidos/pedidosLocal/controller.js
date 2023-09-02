const { model } = require("mongoose");
const { async } = require("rxjs");
const store = require("./store");

const controller = {
    ingresar: async function (data){
       
        const dia = new Date().getDate().toString();
        const mesDate = new Date().getMonth() + 1;
        const mes = mesDate.toString();
        const anio = new Date().getFullYear().toString();
        const fecha = dia + "/" + mes  + "/" + anio;
        const contacto = { medio: data.contacto, nota: data.numero_mail};
        const num = await store.findNumOrder();

        const order = {    
        fecha: fecha,
        num_orden: num[0].num_orden + 1,
        cliente: data.cliente,
        prepara: data.prepara,
        estado: "Pedido Sin Asignar",
        contacto: contacto,
        pedido: data.pedido,
        faltas: " ",
        notas: " ",
        forma_de_pago: data.forma_de_pago,
        envio: data.envio,
        zona: "Sin asignar"
       }
        store.ingresar(order);
        return true;
   },
   buscar: async function () {
    try{
      const response = await store.find();
      return response;
    }catch(err){
        console.log("[ ERROR EN CONTROLLER BUSCAR ] " + err);
    }
   },
   buscarPedidoAnterior: async function (query) {
    try{
      const response = await store.findOld(query);
      return response;
    }catch(err){
        console.log("[ ERROR EN CONTROLLER BUSCAR ] " + err);
    }
   },
   updatePedidos: async function (pedidos){
    try{
      pedidos.forEach(e => {
        (async () => { 
          await store.update(e);
        })();
      });
      return true;
    }catch{
        console.log(" [ ERROR EN CONTROLLER ] " + err);
        return false;
    }
   },
   pedidosAnteriores: async function () { 
     const res = await store.oldOrders();
     return res;
   },
   borrarPedidos: async function (orden) {
    try{      
      await store.delete(orden);
      return true;
    }catch(err){
      console.log("[ ERROR EN CONTROLLER borrarPedido ] " + err)
    }
   }
}


module.exports = controller;