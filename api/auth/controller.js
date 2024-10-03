const { model } = require("mongoose");
const { async } = require("rxjs");
const store = require("./store");

const controller = {
    ingresar: async function (data){  
            
       const date = new Date
       const user = {
        id: data.auth.sub,
        nombre: data.nombreApellido,
        mail: data.auth.email || " ",
        pedidos: {
            fecha: date.toLocaleString(),
            nombre: " ",
            favorito: false,
            compra: []
        }        
       }
       
       data.sys.compra.forEach(e => {
        user.pedidos.compra.push(e)
       });

       store.ingresar(user);
    },
    leer: async function (data) {
        const id = data.sub        
        const result = await store.login(id)
        return result[0]
    },
    guardarPedido: async function (data) {
       try{       
        if(!data.id){
            const pedidoRandom = require("../pedidos/controller")
            pedidoRandom.ingresarCarrito(data)
        }
        const date = new Date
        const user = {
         id: data.id,
         tipo: data.tipo,        
         pedidos: {
             fecha: date.toLocaleString(),
             nombre: data.nombre,
             favorito: true,
             tipo: data.tipo,
             compra: data.pedido
         }        
        }

        if(data.tipo == "Historial"){
            user.favorito = false
            await store.history(user)
        }else{
            await store.ingresar(user)
        }
        
        return true

       }catch(err){
        console.log("[ ERROR AL GUARDAR PEDIDO DE USUARIO (auth no logueado)] " + err)
        return false
       }
    },
    borrarPedido: async function (data){        
        const res = await store.del(data)
        return res
    },
    
}

module.exports = controller;