const socket = io.connect();
let envios = undefined
let datos_cliente = JSON.parse(localStorage.getItem('datos-envio'));
const cliente = {}

//selectores HTML
const checkEnvio = document.querySelector("#envio");
const porEnvio = document.querySelector(".porEnvio");
const pagoEfectivo = document.querySelector(".pagoEfectivo");
const efectivoInput = document.querySelector("#efectivo");
//envios
const tiposDeEvio = document.querySelector(".ingresarTipoEnvio") ;
const selectEnvioRetiro = document.querySelector(".selectEnvioRetiro");
const provinciasSelect = document.querySelector(".listaProvincias");
const localidades = document.querySelector(".listaLocalidades");
const provinciasLocalidades = []
let valorCorreo = 1488;
let valorExpreso = 00;

const ingresoDestinoContainer = document.querySelector(".ingresoDestinoContainer")
const ingresarDestino = document.querySelector(".ingresarDestino")

//clicks inputs contacto
const formaContacto = document.querySelector(".formaContacto");
const whatsapp = document.querySelector("#formaContacto1");
const mail = document.querySelector("#formaContacto2");
const tel = document.querySelector("#formaContacto3");
const whatsappInput = document.querySelector("#whatsapp");
const mailInput = document.querySelector("#mail");
const telInput = document.querySelector("#tel");

//clicks inputs forma de pago
const formaDePago = document.querySelector(".forma-pago");
const formaMercadoPago = document.querySelector("#forma-mercadopago");
const formaTranferencia = document.querySelector("#banco");
const numerosCuentas = document.querySelector(".pago-transferencia");

//clicks inputs facturacion
const facturacion = document.querySelector(".facturacion");
const facturacion1 = document.querySelector("#facturacion1");
const facturacion2 = document.querySelector("#facturacion2");
const facturacion3 = document.querySelector("#facturacion3");
const facturacion4 = document.querySelector("#facturacion4");
const monotributo = document.querySelector(".monotributo");
const facturaA = document.querySelector(".facturaA");
const exento = document.querySelector(".exento");


fetch('../enviosData/dataEnvios.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('La solicitud no se pudo completar.');
    }
    return response.json();
  })
  .then(data => {
    // Trabaja con los datos JSON    
    console.log(data);
    envios = data[0]
  })
  .catch(error => {
    console.error('Error: ', error);
  });

fetch('../enviosData/provincias.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('La solicitud no se pudo completar.');
    }
    return response.json();
  })
  .then(provincias => {
    // Trabaja con los datos JSON    
    console.log(provincias);    
    provincias.forEach( e => {
      provinciasSelect.innerHTML += `<option value="${e.nombre}">${e.nombre}</option>`
    })
    provincias.forEach( e => {
      let arg = {
        provincia: e.nombre,
        localidades: []
      }    
      arg.localidades.push(`<option value="Seleccione su localidad">Seleccione su localidad</option>`);
      e.ciudades.forEach(c => {
        arg.localidades.push(`<option value="${c.nombre}">${c.nombre}</option>`);
      })
      
      provinciasLocalidades.push(arg)

    })
  })
  .catch(error => {
    console.error('Error: ', error);
  });

  reingresarDatos(datos_cliente)

  //cargar un envío
  selectEnvioRetiro.addEventListener("click", () => {
    if(checkEnvio.checked){
      porEnvio.style.display="block";
      provinciasSelect.style.display="inline";    
      pagoEfectivo.style.display="none";
      const ingresarExpreso = document.querySelectorAll(".valor-expreso")
      for(const e of ingresarExpreso){
        e.textContent = envios.expreso
      }
    }else{
      porEnvio.style.display="none";
      provinciasSelect.style.display="none";
      localidades.style.display="none";
      ingresoDestinoContainer.style.display="none";
      pagoEfectivo.style.display="block";
    }
  })
  provinciasSelect.addEventListener("click", () => {
    if(provinciasSelect.value == "Ciudad Autonoma De Bs As"){
      document.querySelector(".ingresarTipoEnvio").innerHTML = ""
      document.querySelector(".moto").style.display = "block";
      document.querySelector(".motoValor").innerHTML = `<h5 style="margin-bottom: 10px;">Realizamos envíos por moto dentro de CABA, valor $${envios.moto} </h5>`;
      localidades.style.display="none";
      document.querySelector(".correo").style.display = "none"
      document.querySelector(".expresos").style.display = "none"
    }else{
      document.querySelector(".moto").style.display = "none";
      provinciasLocalidades.forEach(e => {
        if(e.provincia == provinciasSelect.value){        
          localidades.style.display="inline";
          localidades.innerHTML = "";
          localidades.innerHTML +=  e.localidades;
        }
        if(provinciasSelect.value == "Buenos Aires" || provinciasSelect.value == "Cordoba" || provinciasSelect.value == "Entre Rios" || provinciasSelect.value == "La Pampa" || provinciasSelect.value == "Santa Fe"){
          valorCorreo = envios.correoReg
          document.querySelector(".valor-correo").textContent = valorCorreo;
          console.log(document.querySelector(".valor-correo"), valorCorreo)
        }
        else if(provinciasSelect.value == "Tucuman" || provinciasSelect.value == "Santiago Del Estero" || provinciasSelect.value == "San Luis" || provinciasSelect.value == "San Juan" || provinciasSelect.value == "Rio Negro" || provinciasSelect.value == "Neuquen" || provinciasSelect.value == "Misiones" || provinciasSelect.value == "Mendoza" || provinciasSelect.value == "La Rioja" || provinciasSelect.value == "Formosa" ||provinciasSelect.value == "Corrientes" || provinciasSelect.value == "Chaco" || provinciasSelect.value == "Catamarca"){
          valorCorreo = envios.correoNac;
          document.querySelector(".valor-correo").textContent = valorCorreo;
        }
        else{
          valorCorreo = envios.correoNac2;
          document.querySelector(".valor-correo").textContent = valorCorreo;
        }
      })    
    }
  }) 


localidades.addEventListener("click", () => {
  checkEnvio.checked = true;
  valorExpreso = envios.expreso
  if(localidades.value != "Seleccione Su Localidad"){   
    ingresoDestinoContainer.style.display = "block";
  }
})
//form de ingreso direccion
ingresoDestinoContainer.addEventListener("click", () => {  
 
  const check_correo = document.querySelector("#tipo-envio2")
  const check_expreso = document.querySelector("#tipo-envio1")
  correoCheck = check_correo;
  expresoCheck = check_expreso;
  
  if(check_correo.checked){
    document.querySelector(".correo").style.display = "block"
    document.querySelector(".expresos").style.display = "none"
  }
  if(check_expreso.checked){    
    document.querySelector(".expresos").style.display = "block"
    document.querySelector(".correo").style.display = "none"
  }
})

//clicks inputs de contacto
formaContacto.addEventListener("click", () => {
  if(whatsapp.checked){
    whatsappInput.style.display = "inline"
    mailInput.style.display = "none"
    telInput.style.display = "none"
  }
  if(mail.checked){
   
    whatsappInput.style.display = "none"
    mailInput.style.display = "inline"
    telInput.style.display = "none"
  }
  if(tel.checked){
    
    whatsappInput.style.display = "none"
    mailInput.style.display = "none"
    telInput.style.display = "inline"
  }
})

//clicks inputs facturacion
facturacion.addEventListener("click", () => {  

  if(facturacion1.checked){
    monotributo.style.display = "none";
    facturaA.style.display = "none";
    exento.style.display = "none";
  }
  if(facturacion2.checked){
    monotributo.style.display = "inline";
    monotributo.style.marginLeft = "10px";
    facturaA.style.display = "none";
    exento.style.display = "none";
  }
  if(facturacion3.checked){
    monotributo.style.display = "none";
    exento.style.display = "none";
    facturaA.style.display = "inline";
  }
  if(facturacion4.checked){
    monotributo.style.display = "none";
    facturaA.style.display = "none";
    exento.style.display = "inline";
  }
})

//clicks inputs forma de pago
formaDePago.addEventListener("click", () => {
  if(formaTranferencia.checked){
    numerosCuentas.style.display = "block"
  }else{
    numerosCuentas.style.display = "none"
  }
})

//Tools
function reingresarDatos(cliente){ 
    //reingresamos los datos
    //nombre
    if(cliente.nombreApellido)
    document.querySelector(".nombreApellido").value = cliente.nombreApellido;
    //checks
    document.querySelector("#retiro").checked = cliente.sys.checked.retiro;
    checkEnvio.checked = cliente.sys.checked.envio;
    if(checkEnvio.checked){
      document.querySelector(".ingresarTipoEnvio").innerHTML = correoExpreso;
      porEnvio.style.display = "block";
      provinciasSelect.innerHTML += `<option value="${cliente.tipoDeEnvio.Provincia}" selected>${cliente.tipoDeEnvio.Provincia}</option>` 
      //envio por moto
      if(cliente.tipoDeEnvio.Provincia == "Ciudad Autonoma De Bs As"){
        porEnvio.style.display = "none";
        document.querySelector(".ingresarTipoEnvio").innerHTML = ""
        document.querySelector(".moto").style.display = "block";
        document.querySelector(".motoValor").innerHTML = `<h5>${envios.moto}</h5>`;
        document.querySelector(".motoCalle").value = cliente.tipoDeEnvio.Calle;
        document.querySelector(".motoAltura").value = cliente.tipoDeEnvio.Altura;
        document.querySelector(".horario-entrega").value = cliente.tipoDeEnvio.Horario_Entrega;      
      }else{
        localidades.style.display = "inline";
        localidades.innerHTML += `<option value="${cliente.tipoDeEnvio.Localidad}" selected>${cliente.tipoDeEnvio.Localidad}</option>`;
      }
  
      const correo = document.querySelector("#tipo-envio2");
      const expreso = document.querySelector("#tipo-envio1");
  
      if(correo != null){
        correo.checked = cliente.sys.checked.correo;
        if(correo.checked){
          document.querySelector(".correoCalle").value = cliente.tipoDeEnvio.Calle
          document.querySelector(".correoAltura").value = cliente.tipoDeEnvio.Altura
          document.querySelector(".correoCP").value = cliente.tipoDeEnvio.CP
          document.querySelector(".correoDNI").value = cliente.tipoDeEnvio.DNI
          document.querySelector(".correo").style.display = "block"
        }
      }
      
      if(expreso != null){
        expreso.checked = cliente.sys.checked.expreso;
        if(expreso.checked){
          document.querySelector(".expresoEmpresa").value = cliente.tipoDeEnvio.Empresa
          document.querySelector(".expresoCalle").value = cliente.tipoDeEnvio.Calle
          document.querySelector(".expresoAltura").value = cliente.tipoDeEnvio.Altura
          document.querySelector(".expresoDNI").value = cliente.tipoDeEnvio.DNI
          document.querySelector(".expresos").style.display = "block"
        }
      }
    }else{
      porEnvio.style.display="none";
      provinciasSelect.style.display="none";
      localidades.style.display="none";
      ingresoDestinoContainer.style.display="none";
      pagoEfectivo.style.display="block";
      efectivoInput.checked = true;
    }
  
    whatsapp.checked = cliente.sys.checked.whatsapp;
    mail.checked = cliente.sys.checked.mail;
    tel.checked = cliente.sys.checked.tel;
  
    if(cliente.sys.checked.whatsapp){
      whatsappInput.style.display = "inline";
      whatsappInput.value = cliente.formaDeContacto.numero
    }
    if(cliente.sys.checked.mail){
      mailInput.style.display = "inline";
      mailInput.value = cliente.formaDeContacto.numero
    }
    if(cliente.sys.checked.tel){
      telInput.style.display = "inline";
      telInput.value = cliente.formaDeContacto.numero
    }
  
    facturacion1.checked = cliente.sys.checked.consumidor_final;
    facturacion2.checked = cliente.sys.checked.monotributo;
    facturacion3.checked = cliente.sys.checked.iva_inscripto;
    facturacion4.checked = cliente.sys.checked.exento;
  
    if(cliente.sys.checked.iva_inscripto){
      facturaA.style.display = "inline";
      document.querySelector(".aRS").value = cliente.facturacion.RazonSocial
      document.querySelector(".aCUIT").value = cliente.facturacion.CUIT
    }
    if(cliente.sys.checked.monotributo){
      monotributo.style.display = "inline";
      document.querySelector(".monotributoRS").value = cliente.facturacion.RazonSocial
      document.querySelector(".monotributoCUIT").value = cliente.facturacion.CUIT
    }
    if(cliente.sys.checked.exento){
      exento.style.display = "inline";
      document.querySelector(".exentoRS").value = cliente.facturacion.RazonSocial
      document.querySelector(".exentoCUIT").value = cliente.facturacion.CUIT
    }
  
    formaTranferencia.checked = cliente.sys.checked.transferencia
    formaMercadoPago.checked = cliente.sys.checked.mercado_pago
  
    if(cliente.sys.checked.transferencia){
      numerosCuentas.style.display = "block"
    }
    if(cliente.sys.checked.efectivo){
      pagoEfectivo.style.display = "block"
    }
}

//TODO envio
cliente.nombreApellido = document.querySelector(".nombreApellido").value

//ENVIO PEDIDO A SERVER
//socket.emit("mail", datosCliente)