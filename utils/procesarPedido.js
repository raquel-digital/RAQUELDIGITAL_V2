const cli = require("nodemon/lib/cli");

function cliente(cliente){
    console.log(cliente)
    if(cliente.nombreApellido == ""){
        return {state: false, message: "Por favor ingrese su nombre", redMark: "nombre"};
    }
    if(cliente.retira == ""){
        return {state: false, message: "Por favor ingrese una forma de envío", redMark: "envio-retiro"};
    }
    if(cliente.retira == "Por Envio" &&  !cliente.tipoDeEnvio.hasOwnProperty("forma_de_envio")){
        return {state: false, message: "Por favor ingresar provincia, localidad y forma de envío", redMark: "selec-prov-loc"}
    }
    if(cliente.tipoDeEnvio.forma_de_envio == "Moto"){
      if(!cliente.tipoDeEnvio.Calle.length){
        return {state: false, message: "Por favor ingresa la calle", redMark: "moto-calle"};
      }
      if(!cliente.tipoDeEnvio.Altura){
        return {state: false, message: "Por favor ingresa la altura de la calle", redMark: "moto-altura"};
      }
    }
    if(cliente.tipoDeEnvio.forma_de_envio == "Correo_Argentino"){
      if(!cliente.tipoDeEnvio.Calle.length){
        return {state: false, message: "Por favor ingresa la calle", redMark: "correo-calle"};
      }
      if(!cliente.tipoDeEnvio.Altura){
        return {state: false, message: "Por favor ingresa la altura de la calle", redMark: "correo-altura"};
      }
      if(!cliente.tipoDeEnvio.CP){
        return {state: false, message: "Por favor ingresa el codigo postal", redMark: "correo-CP"};
      }
      if(!cliente.tipoDeEnvio.DNI){
        return {state: false, message: "Por favor ingresa el DNI de la persona que lo recibe", redMark: "correo-DNI"};
      }      
    }
    if(cliente.tipoDeEnvio.forma_de_envio == "Expreso"){
      if(!cliente.tipoDeEnvio.Calle){
        return {state: false, message: "Por favor ingresa la calle", redMark: "expreso-calle"};
      }
      if(!cliente.tipoDeEnvio.DNI){
        return {state: false, message: "Por favor ingresa el DNI de la persona que lo recibe", redMark: "expreso-DNI"};
      }        
    }
    if(!cliente.hasOwnProperty("formaDeContacto")){
      return {state: false, message: "Ingrese una forma de contacto", redMark: "forma-contacto"};
    }else{
      let contacto = "numero";
      if(cliente.formaDeContacto.contacto == 'Mail'){
        contacto = "mail"
      }
      if(!cliente.formaDeContacto.numero){
        return {state: false, message: `Por favor ingrese su ${contacto} para que podamos contactarnos`, redMark: "contacto-input"};
      }
    }
    if(!cliente.hasOwnProperty("facturacion")){
      return {state: false, message: `Por favor ingrese su forma de facturacion`, redMark: "facturacion"};      
    }else{
      if(cliente.facturacion.tipo == "IVA INSCRIPTO" || cliente.facturacion.tipo == "IVA Exento" || cliente.facturacion.tipo == "Monotributo"){
        if(!cliente.facturacion.RazonSocial){
          return {state: false, message: `Por favor ingrese su Razon Social`, redMark: "razon-social"}
        }
        if(!cliente.facturacion.CUIT){
          return {state: false, message: `Por favor ingrese su N° de CUIT`, redMark: "cuit"}
        }
      }
    }
    if(!cliente.hasOwnProperty("formaDePago")){
      return {state: false, message: `Por favor ingrese una forma de pago`, redMark: "forma-pago"}
    } 
    
    return {state: true};
}

module.exports = cliente;
  