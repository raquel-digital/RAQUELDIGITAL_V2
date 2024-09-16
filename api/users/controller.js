const { async } = require("rxjs");
const store = require("./store");
const crudPedidos = require("../../api/pedidos/controller")
const artsController = require("../arts/controller")

const controller = {
   ingresar: async function (data){
       console.log(data.tipoDeEnvio.piso_departamento)
        const date = new Date();
        const fecha = date.toLocaleString();
        let ultimaOrden = await store.numero_orden();
        ultimaOrden += 1;
        console.log("SUMAMOS ORDEN",ultimaOrden)
        const user = {
        numero_orden: ultimaOrden,    
        fecha: fecha,
        nombreApellido: data.nombreApellido,
        retira: data.retira,
        tipoDeEnvio: {            
            Altura: data.tipoDeEnvio.Altura, 
            Calle: data.tipoDeEnvio.Calle, 
            piso_departamento: data.tipoDeEnvio.Piso,
            Costo: data.tipoDeEnvio.Costo, 
            Horario_Entrega:data.tipoDeEnvio.Horario_Entrega,  
            Provincia: data.tipoDeEnvio.Provincia, 
            Localidad: data.tipoDeEnvio.Localidad, 
            Empresa: data.tipoDeEnvio.Empresa, 
            DNI: data.tipoDeEnvio.DNI, 
            CP: data.tipoDeEnvio.CP, 
            forma_de_envio: data.tipoDeEnvio.forma_de_envio
        },
        formaDeContacto: {contacto: data.formaDeContacto.contacto, numero: data.formaDeContacto.numero},
        facturacion: {CUIT: data.facturacion.CUIT, RazonSocial: data.facturacion.RazonSocial, tipo: data.facturacion.tipo},
        formaDePago: data.formaDePago,
        compra: data.sys.compra,
        observaciones: data.observaciones
       }
       store.ingresar(user);
       artsController.stockControl(data.sys.compra)
    crudPedidos.ingresar(user);
   },

   buscar: async function (orden) {
    const res = await store.buscar_orden(orden);    
    return res
   },
   ultimosPedidos: async function () {
    const result = await store.lastOrders();
    return result;
   },

}

module.exports = controller;