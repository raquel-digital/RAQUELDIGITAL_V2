function checkOutErrors(cliente) { 
  
  //FALTA NOMBRE
  if(cliente.nombreApellido == "" || cliente.nombreApellido == null){
    document.getElementById("nombre-apellido").classList.add("input-error");
    document.getElementById("nombre-apellidoError").style.display = "block";
    document.getElementById("nombre-apellido").focus();
    document.getElementById("nombre-apellido").scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }
  //NO SE SELECCIONO RETIRO O ENVIO
  if(document.getElementById("retiro").checked == false && document.getElementById("envio").checked == false) {
    document.getElementById("recepCompraError").style.display = "block";
    document.getElementById("recepCompraError").focus();
    document.getElementById("recepCompraError").scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }
  //NO SE SELECCIONO PROVINCIA O LOCALIDAD
  if(!cliente.tipoDeEnvio && cliente.retira == "Por Envio"){   
    //NO SE SELECCIONO CORREO ARGENTINO O EXPRESO
    if(document.getElementById("correo-argentino").checked == false && document.getElementById("expreso").checked == false) {
      document.getElementById("opsEnviosError").style.display = "block";
      document.getElementById("opsEnviosError").focus();  
      document.getElementById("opsEnviosError").scrollIntoView({ behavior: 'smooth', block: 'center' });
    }    

    if(document.getElementById("provText").textContent == "Seleccioná la provincia") {
      document.getElementById("select-provincia").classList.add("input-error");
      document.getElementById("select-provinciaError").style.display = "block";
      document.getElementById("select-provincia").scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    
    if(document.getElementById("locText").textContent == "Seleccioná la localidad" || cliente.tipoDeEnvio.Localidad == "Seleccioná la localidad") { 
      document.getElementById("select-localidad").classList.add("input-error");
      document.getElementById("select-localidadError").style.display = "block";
      document.getElementById("select-localidad").scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;    }
    
  }
  if(cliente.tipoDeEnvio){
    if(document.getElementById("locText").textContent == "Seleccione su localidad" || cliente.tipoDeEnvio.Localidad == "Seleccioná la localidad") { 
      document.getElementById("select-localidad").classList.add("input-error");
      document.getElementById("select-localidadError").style.display = "block";
      document.getElementById("select-localidad").scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    //ERRORRES CORREO ARGENTINO
    if(cliente.tipoDeEnvio.forma_de_envio == 'Correo_Argentino'){
      if(cliente.tipoDeEnvio.Calle == ""){        
        document.getElementById("correo-direccion").classList.add("input-error");
        document.getElementById("correo-direccionError").style.display = "block";
        document.getElementById("correo-direccion").focus();
        document.getElementById("correo-direccion").scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      }
      if(cliente.tipoDeEnvio.Altura == ""){        
        document.getElementById("correo-altura").classList.add("input-error");
        document.getElementById("correo-alturaError").style.display = "block";
        document.getElementById("correo-altura").focus();
        document.getElementById("correo-altura").scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      }      
      if(cliente.tipoDeEnvio.CP == ""){   
        document.getElementById("correo-cod-postal").classList.add("input-error") 
        const showError = document.getElementById("correo-cod-postalError");
        showError.style.display = "block";
        showError.focus();
        showError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      }
      if(cliente.tipoDeEnvio.DNI == ""){   
        const showError = document.getElementById("correo-dni") 
        showError.classList.add("input-error");
        document.getElementById("correo-dniError").style.display = "block";
        showError.focus();
        showError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      }
    }
    //ERRORES EXPRESO
    if(cliente.tipoDeEnvio.forma_de_envio == 'Expreso'){
      if(cliente.tipoDeEnvio.Calle == ""){   
        const showError = document.getElementById("expreso-direccion") 
        showError.classList.add("input-error");
        document.getElementById("expreso-direccionError").style.display = "block";
        showError.focus();
        showError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      }
      if(cliente.tipoDeEnvio.Altura == ""){        
        const showError = document.getElementById("expreso-altura") 
        showError.classList.add("input-error");
        document.getElementById("expreso-alturaError").style.display = "block";
        showError.focus();
        showError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      }   
      if(cliente.tipoDeEnvio.DNI == ""){   
        const showError = document.getElementById("expreso-dni") 
        showError.classList.add("input-error");
        document.getElementById("expreso-dniError").style.display = "block";
        showError.focus();
        showError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      }
    }
    //ERRORES MOTO
    if(cliente.tipoDeEnvio.forma_de_envio == "Moto"){
      if(cliente.tipoDeEnvio.Calle == ""){   
        const showError = document.getElementById("caba-direccion") 
        showError.classList.add("input-error");
        document.getElementById("caba-direccionError").style.display = "block";
        showError.focus();
        showError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      }
      if(cliente.tipoDeEnvio.Altura == ""){        
        const showError = document.getElementById("caba-altura") 
        showError.classList.add("input-error");
        document.getElementById("caba-alturaError").style.display = "block";
        showError.focus();
        showError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      }   
    }    
  }

  //ERROR CONTACTO
  if(!cliente.formaDeContacto){  
    document.getElementById("errorContacto").style.display = "block";
    document.getElementById("errorContacto").focus();
    document.getElementById("errorContacto").scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }  
  if(cliente.formaDeContacto){
     if(cliente.formaDeContacto.contacto == "whatsapp"){
      if(cliente.formaDeContacto.numero == ""){
        document.getElementById("whatsappError").style.display = "block";
        const showError = document.getElementById("whatsappError")        
        showError.focus();
        showError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      }      
     }
     if(cliente.formaDeContacto.contacto == "Mail"){
      if(cliente.formaDeContacto.numero == ""){
        document.getElementById("mailError").style.display = "block";
        const showError = document.getElementById("mailError")
        
        showError.focus();
        showError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      } 
      if(!cliente.formaDeContacto.numero.includes("@")){
        document.getElementById("mailError").style.display = "block";
        const showError = document.getElementById("mailError")
        
        showError.focus();
        showError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      }
      
     }
     if(cliente.formaDeContacto.contacto == "Telefono"){
      if(cliente.formaDeContacto.numero == ""){
        document.getElementById("telError").style.display = "block";
        const showError = document.getElementById("telError")        
        showError.scrollIntoView({ behavior: 'smooth', block: 'center' });      
        return false;  
      }      
     }
  }

  //ERROR FACTURACION
  if(!cliente.facturacion){
    document.getElementById("facturacionError").style.display = "block";
    document.getElementById("facturacionError").focus();
    document.getElementById("facturacionError").scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }
  if(cliente.facturacion){
    if(cliente.facturacion.tipo == "Monotributo"){
      if(cliente.facturacion.RazonSocial == ""){
        document.getElementById("monoRSerror").style.display = "block";
        const showError = document.getElementById("monoRSerror")        
        showError.focus();
        showError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      }
      if(cliente.facturacion.CUIT == ""){
        document.getElementById("monoCUITerror").style.display = "block";
        const showError = document.getElementById("monoCUITerror")        
        showError.focus();
        showError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      }
    }
    if(cliente.facturacion.tipo == "Responsable Inscripto"){
      if(cliente.facturacion.RazonSocial == ""){
        document.getElementById("ivaInscriptoRSerror").style.display = "block";
        const showError = document.getElementById("ivaInscriptoRSerror")        
        showError.focus();
        showError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      }
      if(cliente.facturacion.CUIT == ""){
        document.getElementById("ivaInscriptoCUITerror").style.display = "block";
        const showError = document.getElementById("ivaInscriptoCUITerror")        
        showError.focus();
        showError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      }
    }
    if(cliente.facturacion.tipo == "Exento"){
      if(cliente.facturacion.RazonSocial == ""){
        document.getElementById("exentoRSerror").style.display = "block";
        const showError = document.getElementById("exentoRSerror")        
        showError.focus();
        showError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      }
      if(cliente.facturacion.CUIT == ""){
        document.getElementById("exentoCUITerror").style.display = "block";
        const showError = document.getElementById("exentoCUITerror")        
        showError.focus();
        showError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
      }
    }
  }
  //ERROR FORMA DE PAGO
  if(!cliente.formaDePago){
    document.getElementById("formaPagoError").style.display = "block";
    document.getElementById("formaPagoError").focus();
    document.getElementById("formaPagoError").scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }
  if(cliente.formaDePago == "En Efectivo" && cliente.retira == "Por Envio"){
    document.getElementById("formaPagoError").style.display = "block";
    document.getElementById("formaPagoError").focus();
    document.getElementById("formaPagoError").scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }

  return true
}