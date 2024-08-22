const socket = io.connect();
let envios = undefined
let datos_cliente = JSON.parse(localStorage.getItem('datos-envio'));
let form = document.querySelector(".formAction");
//selectores HTML
const checkEnvio = document.querySelector("#envio");
const porEnvio = document.querySelector(".porEnvio");
const pagoEfectivo = document.querySelector(".pagoEfectivo");
const efectivoInput = document.querySelector("#efectivo");
const correo = document.querySelector("#tipo-envio2");
const expreso = document.querySelector("#tipo-envio1");
//envios
const tiposDeEvio = document.querySelector(".ingresarTipoEnvio") ;
const selectEnvioRetiro = document.querySelector(".selectEnvioRetiro");
const provinciasSelect = document.querySelector(".listaProvincias");
const localidades = document.querySelector(".listaLocalidades");
const provinciasLocalidades = []
let valorCorreo = 1488;
let valorExpreso = 0;

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

const compraFinal = document.getElementById('datos-compra');  

(async () => {
  try {
    const response = await fetch('../system/envios/dataEnvios.json')
    console.log(response)
    if (!response.ok) {
      throw new Error('No se pudo obtener los datos.');
    }    
    const data = await response.json(); // Esperar a que se resuelva la promesa JSON
    envios = data[0]
    valorExpreso = envios.expreso
     
  } catch (error) {
    console.error('Error:', error);
  }
  
 
await fetch('../system/envios/provincias.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('La solicitud no se pudo completar.');
    }
    return response.json();
  })
  .then(provincias => {
    // Trabaja con los datos JSON
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

  if(datos_cliente){    
    reingresarDatos(datos_cliente)
  }   

  //guardamos pedido en historial
  const pedido = localStorage.getItem("carrito")
  const id = localStorage.getItem("login")
  const data = { id: id, pedido: JSON.parse(pedido), nombre: " ", tipo: "Historial"}
  socket.emit("guardar-pedido-usuario", data)
})()


  //cargar un envío tipo-envio2 tipo-envio1
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
      const footer = document.querySelector("tfoot tr td b")
      const total = footer.textContent.replace("EL TOTAL DE SU COMPRA: $ ", "")
      document.getElementById("total-transferencia").innerHTML = `<b>total a depositar: $${total}</b>`

      porEnvio.style.display="none";
      provinciasSelect.style.display="none";
      localidades.style.display="none";
      ingresoDestinoContainer.style.display="none";
      pagoEfectivo.style.display="block";
    }
  })
  provinciasSelect.addEventListener("click", () => {
    if(provinciasSelect.value == "Ciudad Autonoma De Bs As"){
      document.querySelector(".ingresarTipoEnvio").style.display = "none";
      document.querySelector(".moto").style.display = "block";
      document.querySelector(".motoValor").innerHTML = `<h5 style="margin-bottom: 10px;">Realizamos envíos por moto dentro de CABA, valor $${envios.moto} </h5>`;
      localidades.style.display="none";
      document.querySelector(".correo").style.display = "none"
      document.querySelector(".expresos").style.display = "none"

      const footer = document.querySelector("tfoot tr td b")
      const total = footer.textContent.replace("EL TOTAL DE SU COMPRA: $ ", "")
      const totalEnvio = envios.moto + Number(total)
      document.getElementById("total-transferencia").innerHTML = `<b>total a depositar: $${totalEnvio.toFixed(2)} (ya incluido el envío por moto)</b>`


    }else{
      document.querySelector(".moto").style.display = "none";
      document.querySelector(".ingresarTipoEnvio").style.display = "block";
      provinciasLocalidades.forEach(e => {
        if(e.provincia == provinciasSelect.value){        
          localidades.style.display="inline";
          localidades.innerHTML = "";
          localidades.innerHTML +=  e.localidades;
        }
        if(provinciasSelect.value == "Buenos Aires"){
          valorCorreo = envios.correoReg
          document.querySelector(".valor-correo").textContent = valorCorreo;
        }
        else if(provinciasSelect.value == "Tucuman" || provinciasSelect.value == "Santiago Del Estero" || provinciasSelect.value == "San Luis" || provinciasSelect.value == "San Juan" || provinciasSelect.value == "Rio Negro" || provinciasSelect.value == "Neuquen" || provinciasSelect.value == "Misiones" || provinciasSelect.value == "Mendoza" || provinciasSelect.value == "La Rioja" || provinciasSelect.value == "Formosa" ||provinciasSelect.value == "Corrientes" || provinciasSelect.value == "Chaco" || provinciasSelect.value == "Catamarca" || provinciasSelect.value == "Cordoba" || provinciasSelect.value == "Entre Rios" || provinciasSelect.value == "La Pampa" || provinciasSelect.value == "Santa Fe"){
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
    if(document.getElementById("tipo-envio2").checked){
      const footer = document.querySelector("tfoot tr td b")
      const total = footer.textContent.replace("EL TOTAL DE SU COMPRA: $ ", "")
      const totalEnvio = valorCorreo + Number(total)
      document.getElementById("total-transferencia").innerHTML = `<b>total a depositar: $${totalEnvio.toFixed(2)} (ya incluido el correo)</b>`
    }
  }
  if(check_expreso.checked){    
    document.querySelector(".expresos").style.display = "block"
    document.querySelector(".correo").style.display = "none"
    if(document.getElementById("tipo-envio1").checked){
      const footer = document.querySelector("tfoot tr td b")
      const total = footer.textContent.replace("EL TOTAL DE SU COMPRA: $ ", "")
      const totalEnvio = valorExpreso + Number(total)
      document.getElementById("total-transferencia").innerHTML = `<b>total a depositar: $${totalEnvio.toFixed(2)} (ya incluido el flete de envío)</b>`
    }
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
    const footer = document.querySelector("tfoot tr td b")
    const total = footer.textContent.replace("EL TOTAL DE SU COMPRA: $ ", "")
    
    if(document.getElementById("retiro").checked){
      document.getElementById("total-transferencia").innerHTML = `<b>total a depositar: $${total}</b>`//(el pedido se pasa a preparar el deposito previo no es obligatorio)
    }
    if(document.getElementById("tipo-envio2").checked){
      const totalEnvio = valorCorreo + Number(total)
      document.getElementById("total-transferencia").innerHTML = `<b>total a depositar: $${totalEnvio.toFixed(2)} (ya incluido el correo)</b>`
    }    
    if(document.getElementById("tipo-envio1").checked){
      const totalEnvio = valorExpreso + Number(total)
      document.getElementById("total-transferencia").innerHTML = `<b>total a depositar: $${totalEnvio.toFixed(2)} (ya incluido el flete de envío)</b>`
    }
    
    
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
      //document.querySelector(".ingresarTipoEnvio").innerHTML = correoExpreso;
      ingresoDestinoContainer.style.display="block";
      porEnvio.style.display = "block";
      provinciasSelect.innerHTML += `<option value="${cliente.tipoDeEnvio.Provincia}" selected>${cliente.tipoDeEnvio.Provincia}</option>` 
      //envio por moto
      if(cliente.tipoDeEnvio.Provincia == "Ciudad Autonoma De Bs As"){
        //porEnvio.style.display = "none";
        document.querySelector(".ingresarTipoEnvio").style.display = "none";
        document.querySelector(".moto").style.display = "block";
        document.querySelector(".motoValor").innerHTML = `<h5>Realizamos envíos por moto dentro de CABA, valor $${envios.moto}</h5>`;
        document.querySelector(".motoCalle").value = cliente.tipoDeEnvio.Calle;
        document.querySelector(".motoAltura").value = cliente.tipoDeEnvio.Altura;
        document.querySelector(".horario-entrega").value = cliente.tipoDeEnvio.Horario_Entrega;      
      }else{
        localidades.style.display = "inline";
        localidades.innerHTML += `<option value="${cliente.tipoDeEnvio.Localidad}" selected>${cliente.tipoDeEnvio.Localidad}</option>`;
      }
  
      
      //if(correo != null){
      if(cliente.sys.checked.correo){
        correo.checked = cliente.sys.checked.correo;
        if(correo.checked){
          document.querySelector(".correoCalle").value = cliente.tipoDeEnvio.Calle
          document.querySelector(".correoAltura").value = cliente.tipoDeEnvio.Altura
          document.querySelector(".correoCP").value = cliente.tipoDeEnvio.CP
          document.querySelector(".correoDNI").value = cliente.tipoDeEnvio.DNI

          const ingresarExpreso = document.querySelectorAll(".valor-expreso")
          for(const e of ingresarExpreso){
            e.textContent = valorExpreso
          }
          if(provinciasSelect.value == "Buenos Aires" || provinciasSelect.value == "Cordoba" || provinciasSelect.value == "Entre Rios" || provinciasSelect.value == "La Pampa" || provinciasSelect.value == "Santa Fe"){
            valorCorreo = envios.correoReg
            document.querySelector(".valor-correo").textContent = valorCorreo;
          }
          else if(provinciasSelect.value == "Tucuman" || provinciasSelect.value == "Santiago Del Estero" || provinciasSelect.value == "San Luis" || provinciasSelect.value == "San Juan" || provinciasSelect.value == "Rio Negro" || provinciasSelect.value == "Neuquen" || provinciasSelect.value == "Misiones" || provinciasSelect.value == "Mendoza" || provinciasSelect.value == "La Rioja" || provinciasSelect.value == "Formosa" ||provinciasSelect.value == "Corrientes" || provinciasSelect.value == "Chaco" || provinciasSelect.value == "Catamarca"){
            valorCorreo = envios.correoNac;
            document.querySelector(".valor-correo").textContent = valorCorreo;
          }
          else{
            valorCorreo = envios.correoNac2;
            document.querySelector(".valor-correo").textContent = valorCorreo;
          }

          document.querySelector(".correo").style.display = "block"
        }
      }
      
      //if(expreso != null){
      if(cliente.sys.checked.expreso){
        expreso.checked = cliente.sys.checked.expreso;
        if(expreso.checked){
          document.querySelector(".expresoEmpresa").value = cliente.tipoDeEnvio.Empresa
          document.querySelector(".expresoCalle").value = cliente.tipoDeEnvio.Calle
          document.querySelector(".expresoAltura").value = cliente.tipoDeEnvio.Altura
          document.querySelector(".expresoDNI").value = cliente.tipoDeEnvio.DNI

          const ingresarExpreso = document.querySelectorAll(".valor-expreso")
          for(const e of ingresarExpreso){
            e.textContent = valorExpreso
          }
          if(provinciasSelect.value == "Buenos Aires" || provinciasSelect.value == "Cordoba" || provinciasSelect.value == "Entre Rios" || provinciasSelect.value == "La Pampa" || provinciasSelect.value == "Santa Fe"){
            valorCorreo = envios.correoReg
            document.querySelector(".valor-correo").textContent = valorCorreo;
          }
          else if(provinciasSelect.value == "Tucuman" || provinciasSelect.value == "Santiago Del Estero" || provinciasSelect.value == "San Luis" || provinciasSelect.value == "San Juan" || provinciasSelect.value == "Rio Negro" || provinciasSelect.value == "Neuquen" || provinciasSelect.value == "Misiones" || provinciasSelect.value == "Mendoza" || provinciasSelect.value == "La Rioja" || provinciasSelect.value == "Formosa" ||provinciasSelect.value == "Corrientes" || provinciasSelect.value == "Chaco" || provinciasSelect.value == "Catamarca"){
            valorCorreo = envios.correoNac;
            document.querySelector(".valor-correo").textContent = valorCorreo;
          }
          else{
            valorCorreo = envios.correoNac2;
            document.querySelector(".valor-correo").textContent = valorCorreo;
          }
          
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

//cliente.nombreApellido = document.querySelector(".nombreApellido").value

//ENVIO PEDIDO A SERVER
//socket.emit("mail", datosCliente)

function envio_mock(){
  //TODO caso envío moto fijarse tambien si la párte HTML esta OK   
  
  const cliente = {
    nombreApellido: document.querySelector(".nombreApellido").value,
    sys: {
      checked: {
        retiro: document.querySelector("#retiro").checked,
        envio: checkEnvio.checked,
        expreso: document.querySelector("#tipo-envio1") ? document.querySelector("#tipo-envio1").checked : false,
        correo: document.querySelector("#tipo-envio2") ? document.querySelector("#tipo-envio2").checked : false,        
        whatsapp: whatsapp.checked,
        mail: mail.checked,
        tel: tel.checked,
        consumidor_final: facturacion1.checked,
        monotributo: facturacion2.checked,
        iva_inscripto: facturacion3.checked,
        exento: facturacion4.checked,
        mercado_pago: formaMercadoPago.checked,
        transferencia: formaTranferencia.checked,
        efectivo: efectivoInput.checked
      },
      compra: JSON.parse(compraFinal.dataset.datos),
      totalCompra: 0
    }    
  }

  
  
  for(const p of cliente.sys.compra){
    const valor = Number(p.precio) * p.cantidad
    cliente.sys.totalCompra += valor
  }  

  let tipoDeEnvio;
  let tipoRetiro = "";
  if(cliente.sys.checked.retiro){
    tipoRetiro = "Retira en local"
    tipoDeEnvio = {Costo: undefined, forma_de_envio: undefined}
    cliente.sys.checked.expreso = false
    cliente.sys.checked.correo = false
  }
  if(cliente.sys.checked.correo){
    tipoRetiro = "Por Correo Argentino"
     tipoDeEnvio = {
        forma_de_envio: "Correo_Argentino",
        Costo: valorCorreo,
        Provincia: provinciasSelect.value,
        Localidad: localidades.value,
        Calle: document.querySelector(".correoCalle").value,
        Altura: document.querySelector(".correoAltura").value,
        Piso: document.querySelector(".correoPiso").value,
        CP: document.querySelector(".correoCP").value,
        DNI: document.querySelector(".correoDNI").value
     }    
  }
  if(cliente.sys.checked.expreso){   
    tipoRetiro = "Por Expreso"
    tipoDeEnvio = {
      forma_de_envio: "Expreso",
      Costo: envios.expreso,
      Empresa: document.querySelector(".expresoEmpresa").value,
      Provincia: provinciasSelect.value,
      Localidad: localidades.value,
      Calle: document.querySelector(".expresoCalle").value,
      Altura: document.querySelector(".expresoAltura").value,
      Piso: document.querySelector(".expresoPiso").value,
      DNI: document.querySelector(".expresoDNI").value
    }
  }

  if(provinciasSelect.value == "Ciudad Autonoma De Bs As" && checkEnvio.checked){
    tipoRetiro = "Por Moto"
    tipoDeEnvio = {
      forma_de_envio: "Moto",
      Costo: envios.moto,
      Provincia: "Ciudad Autonoma De Bs As",
      Calle: document.querySelector(".motoCalle").value,
      Altura: document.querySelector(".motoAltura").value,
      Piso: document.querySelector(".motoPiso").value,
      Horario_Entrega: document.querySelector(".horario-entrega").value
    }
    cliente.sys.checked.moto = true
  }

  cliente.tipoDeEnvio = tipoDeEnvio
  cliente.retira = tipoRetiro

  let contactoTipo;
  if(whatsapp.checked){    
    contactoTipo = {
      contacto: "Whatsapp",
      numero: whatsappInput.value
    }
  }
  if(mail.checked){
    contactoTipo = {
      contacto: "Mail",
      numero: mailInput.value
    }
  }
  if(tel.checked){
    contactoTipo = {
      contacto: "Telefono",
      numero: telInput.value
    }
  }

  cliente.formaDeContacto = contactoTipo

  let tipoFacturacion;
  if(facturacion1.checked){
    tipoFacturacion = {
      tipo: "Consumidor Final",
      RazonSocial: "-",
      CUIT: "-"
    }
  }
  if(facturacion2.checked){
    tipoFacturacion = {
      tipo: "Monotributo",
      RazonSocial: document.querySelector(".monotributoRS").value,
      CUIT:document.querySelector(".monotributoCUIT").value
    }
  }
  if(facturacion3.checked){
    tipoFacturacion = {
      tipo: "IVA INSCRIPTO",
      RazonSocial: document.querySelector(".aRS").value,
      CUIT:document.querySelector(".aCUIT").value
    }
  }
  if(facturacion4.checked){
    tipoFacturacion = {
      tipo: "IVA Exento",
      RazonSocial: document.querySelector(".exentoRS").value,
      CUIT:document.querySelector(".exentoCUIT").value
    }
  }

  cliente.facturacion = tipoFacturacion

  let formaDepago;
  
  //form.method = "post" //
  if(formaTranferencia.checked){
    formaDepago = "Transferencia Bancaria"
    form.action = "/success-transferencia"    
  }
  if(formaMercadoPago.checked){
    let envio = 0
    if(tipoDeEnvio.Costo){
      envio = tipoDeEnvio.Costo
    }
    document.querySelector(".precio").value = cliente.sys.totalCompra + envio;
    document.querySelector(".titulo").value = "Carrito-Raquel-Digital";
    
    formaDepago = "Mercado Pago"
    form.action = "/mercadopago"
  }
  if(efectivoInput.checked){
    formaDepago = "En Efectivo"
    form.action = "/success-transferencia"    
  }

  cliente.formaDePago = formaDepago

  document.querySelector("#carrito-holder").value = JSON.stringify(cliente.sys.compra)
  localStorage.setItem("carrito", JSON.stringify(cliente.sys.compra))
  cliente.observaciones = document.getElementById("pedidoObservaciones").value
  console.log(cliente.observaciones)
  const res = controlDatos(cliente)   
  alertsCheckOut(res)
}


function controlDatos(cliente){
  console.log(cliente.Localidad, cliente.Provincia)
  if(cliente.nombreApellido == ""){
      return {state: false, message: "Por favor ingrese su nombre", redMark: "nombre"};
  }
  if(cliente.retira == ""){
      return {state: false, message: "Por favor ingrese una forma de envío", redMark: "envio-retiro"};
  }
  if(cliente.retira == "Por Envio" &&  !cliente.tipoDeEnvio.hasOwnProperty("forma_de_envio") || cliente.Localidad === "Seleccione su localidad" || cliente.Localidad === "" || cliente.Provincia === "Seleccione Su Provincia"| cliente.Provincia === ""){
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
    if(!cliente.tipoDeEnvio.Empresa){
      return {state: false, message: "Por favor ingresa por que empresa de transporte se envia", redMark: "expreso-DNI"};
    }   
    if(!cliente.tipoDeEnvio.Altura){
      return {state: false, message: "Por favor ingresa la altura de la calle", redMark: "expreso-DNI"};
    }      
  }
  if(!cliente.formaDeContacto){
    return {state: false, message: `Por favor ingrese su forma de contacto para que podamos contactarnos`, redMark: "contacto-input"};
  }
  if(!cliente.formaDeContacto.numero){
    return {state: false, message: `Por favor completa tus datos de contacto para que podamos contactarnos`, redMark: "contacto-input"};
  }
  if(!cliente.facturacion){
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
  if(!cliente.formaDePago){
    return {state: false, message: `Por favor ingrese una forma de pago`, redMark: "forma-pago"}
  } 
  
  cliente.state = true
  return  cliente
}

function alertsCheckOut(data){
  if(data.state){        
    Swal.fire({
      title: "Formulario procesado con exito!!",
      // text: ,
      icon: 'success',
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#218838',      
    }
    ).then((res) => {
      if(res.isConfirmed){ 
        
        //ENVIO PEDIDO A MAIL
        localStorage.setItem('datos-envio', JSON.stringify(data));
        socket.emit("mail", data)
        form.submit();  
      }
    })
  }else{
    //alert(data.message)
    Swal.fire({
      title: data.message,      
      icon: 'error',
      confirmButtonColor: '#218838',
      confirmButtonText: 'Continuar'
    })
  }
}


//Tomar la tabla y guardar en carrito
document.addEventListener('DOMContentLoaded', () => {
  localStorage.setItem("carrito", compraFinal.dataset.datos)
})



