function checkCorreccion(cliente)  {
  if(cliente.nombreApellido != "" && cliente.nombreApellido != null){
    document.getElementById("nombre-apellido").classList.remove("input-error")
    document.getElementById("nombre-apellidoError").style.display = "none";
  }
  if(document.getElementById("retiro").checked == true || document.getElementById("envio").checked == true) {
    document.getElementById("recepCompraError").style.display = "none";
  }
  if(!cliente.tipoDeEnvio){
    if(document.getElementById("provText").textContent != "Seleccioná la provincia") {
      document.getElementById("select-provincia").classList.remove("input-error");
      document.getElementById("select-provinciaError").style.display = "none";
    }
    if(document.getElementById("locText").textContent != "Seleccioná la localidad") {
      document.getElementById("select-localidad").classList.remove("input-error");
      document.getElementById("select-localidadError").style.display = "none";
    }    
  }
  if(cliente.tipoDeEnvio){
    document.getElementById("opsEnviosError").style.display = "none";
    //CORREGIR CORREO ARGENTINO
    if(cliente.tipoDeEnvio.forma_de_envio == 'Correo_Argentino'){
      if(cliente.tipoDeEnvio.Calle != ""){
        document.getElementById("correo-direccion").classList.remove("input-error");
        document.getElementById("correo-direccionError").style.display = "none";
      }
      if(cliente.tipoDeEnvio.Altura != ""){
        document.getElementById("correo-altura").classList.remove("input-error");
        document.getElementById("correo-alturaError").style.display = "none";
      }      
      if(cliente.tipoDeEnvio.CP != ""){
        document.getElementById("correo-cod-postal").classList.remove("input-error");
        document.getElementById("correo-cod-postalError").style.display = "none";
      }
      if(cliente.tipoDeEnvio.DNI != ""){
        const correct = document.getElementById("correo-dni");
        correct.classList.remove("input-error");
        document.getElementById("correo-dniError").style.display = "none";
      }
    }
    //CORREGIR EXPRESO
   if(cliente.tipoDeEnvio.forma_de_envio == 'Expreso'){
      if(cliente.tipoDeEnvio.Calle != ""){
        document.getElementById("expreso-direccion").classList.remove("input-error");
        document.getElementById("expreso-direccionError").style.display = "none";
      }
      if(cliente.tipoDeEnvio.Altura != ""){
        document.getElementById("expreso-altura").classList.remove("input-error");
        document.getElementById("expreso-alturaError").style.display = "none";
      }
      if(cliente.tipoDeEnvio.DNI != ""){
        const correct = document.getElementById("expreso-dni");
        correct.classList.remove("input-error");
        document.getElementById("expreso-dniError").style.display = "none";
      }
  }
  //CORREGIR POR MOTO
  if(cliente.tipoDeEnvio.forma_de_envio == "Moto"){
      if(cliente.tipoDeEnvio.Calle != ""){
        document.getElementById("caba-direccion").classList.remove("input-error");
        document.getElementById("caba-direccionError").style.display = "none";
      }
      if(cliente.tipoDeEnvio.Altura != ""){
        document.getElementById("caba-altura").classList.remove("input-error");
        document.getElementById("caba-alturaError").style.display = "none";
      } 
    }
  }  
  //CORREGIR FORMA DE CONTACTO
  if(document.getElementById("whatsapp").checked == true || document.getElementById("email").checked == true  || document.getElementById("tel-fijo").checked == true) {
    document.getElementById("errorContacto").style.display = "none";
  }
  if(cliente.formaDeContacto){
    if(cliente.formaDeContacto.contacto == "whatsapp"){
     if(cliente.formaDeContacto.numero != ""){     
      document.getElementById("whatsappError").style.display = "none";
     }
    }
    if(cliente.formaDeContacto.contacto == "Mail"){
     if(cliente.formaDeContacto.numero != ""){      
      document.getElementById("mailError").style.display = "none";
     }
    }
    if(cliente.formaDeContacto.contacto == "Telefono"){
     if(cliente.formaDeContacto.numero != ""){      
      document.getElementById("telError").style.display = "none";
     }
    }
  }

  //CORREGIR FORMA DE PAGO
  if(cliente.facturacion) {
    document.getElementById("facturacionError").style.display = "none";
   
    if(cliente.facturacion.tipo == "Monotributo"){
      if(cliente.facturacion.RazonSocial != ""){
        document.getElementById("monoRSerror").style.display = "none";       
      }
      if(cliente.facturacion.CUIT != ""){
        document.getElementById("monoCUITerror").style.display = "none";
      }    
    }
    if(cliente.facturacion.tipo == "Responsable Inscripto"){
      if(cliente.facturacion.RazonSocial != ""){
        document.getElementById("ivaInscriptoRSerror").style.display = "none";
      }
      if(cliente.facturacion.CUIT != ""){
        document.getElementById("ivaInscriptoCUITerror").style.display = "none";
      }
    }
    if(cliente.facturacion.tipo == "Exento"){
      if(cliente.facturacion.RazonSocial == ! ""){
        document.getElementById("exentoRSerror").style.display = "none";
      }
      if(cliente.facturacion.CUIT != ""){
        document.getElementById("exentoCUITerror").style.display = "none";
      }    
    }
  }

  //CORREGIR FORMA DE PAGO
  if(cliente.formaDePago){
    document.getElementById("formaPagoError").style.display = "none";
  }
}