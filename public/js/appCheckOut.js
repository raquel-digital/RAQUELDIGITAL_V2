
// const socket = io.connect();
// let compra = JSON.parse(localStorage.getItem('carrito'));
// let totalCompra = 0;
// let datos_cliente = JSON.parse(localStorage.getItem('datos-envio'));
// console.log(datos_cliente)

// let envios = undefined
// socket.emit("get-valor-envio")
// socket.on("set-envio", async data => {
//   envios = await data;
  
// })

// if( compra == null || compra == undefined || compra.length == 0){
//   alert("Pedido vacio por favor reintente nuevamente")
//   window.location = "https://raqueldigital.herokuapp.com/"
// }


// //table();
// // function table(){
// //     if(Array.isArray(compra)){   

// //       var resumenCheckOut = document.querySelector(".resumen-check-out");
// //       resumenCheckOut.innerHTML = "";
      
// //       compra.forEach(e => {
// //         resumenCheckOut.innerHTML += `
// //         <td><img src="${e.imagen}" alt="imagen table" widht="60px" height="60px"></td>
// //         <td>${e.codigo}</td>
// //         <td>${e.titulo}<td>
// //         <td>${e.precio}</td>
// //         <td>${e.cantidad}</td>
// //         <td>${e.cantidad * e.precio}</td>
// //         `;
// //         totalCompra += e.cantidad * e.precio;
// //       })
// //       document.querySelector(".total-compra-final").innerHTML = `<td><b>EL TOTAL DE SU COMPRA: ${totalCompra.toFixed(2)}</b></td>`;
// //     }
// // }

// const provinciasSelect = document.querySelector(".listaProvincias");
// const localidades = document.querySelector(".listaLocalidades");
// let provincias;
// let provinciasLocalidades = []
// socket.emit("success");
// socket.on("provincias", data => {
//   console.log(data)
//   provincias = data;
//   data.forEach( e => {
//     provinciasSelect.innerHTML += `<option value="${e.nombre}">${e.nombre}</option>`
//   })
//   provincias.forEach( e => {
//     let arg = {
//       provincia: e.nombre,
//       localidades: []
//     }    
//     arg.localidades.push(`<option value="Seleccione su localidad">Seleccione su localidad</option>`);
//     e.ciudades.forEach(c => {
//       arg.localidades.push(`<option value="${c.nombre}">${c.nombre}</option>`);
//     })
    
//     provinciasLocalidades.push(arg)

//   })
  
// });




// const selectEnvioRetiro = document.querySelector(".selectEnvioRetiro");
// const checkEnvio = document.querySelector("#envio");
// const porEnvio = document.querySelector(".porEnvio");
// const pagoEfectivo = document.querySelector(".pagoEfectivo");
// const efectivoInput = document.querySelector("#efectivo");


// selectEnvioRetiro.addEventListener("click", () => {
//   if(checkEnvio.checked){
//     porEnvio.style.display="block";
//     provinciasSelect.style.display="inline";    
//     pagoEfectivo.style.display="none";
//   }else{
//     porEnvio.style.display="none";
//     provinciasSelect.style.display="none";
//     localidades.style.display="none";
//     ingresoDestinoContainer.style.display="none";
//     pagoEfectivo.style.display="block";
//   }
// })



// provinciasSelect.addEventListener("click", () => {
//   if(provinciasSelect.value == "Ciudad Autonoma De Bs As"){
//     document.querySelector(".ingresarTipoEnvio").innerHTML = ""
//     document.querySelector(".moto").style.display = "block";
//     document.querySelector(".motoValor").innerHTML = `<h5 style="margin-bottom: 10px;">Realizamos envíos por moto dentro de CABA, valor $${envios.moto} </h5>`;
//     localidades.style.display="none";
//     document.querySelector(".correo").style.display = "none"
//     document.querySelector(".expresos").style.display = "none"
//   }else{
//     document.querySelector(".moto").style.display = "none";
//     provinciasLocalidades.forEach(e => {
//       if(e.provincia == provinciasSelect.value){        
//         localidades.style.display="inline";
//         localidades.innerHTML = "";
//         localidades.innerHTML +=  e.localidades;
//       }
//     })    
//   } 
//   tiposDeEvio = document.querySelector(".ingresarTipoEnvio"); 
// }) 
// let tiposDeEvio;

// let valorCorreo = 1488;

// localidades.addEventListener("click", () => {
//   checkEnvio.checked = true;  
  
//   if(localidades.value != "Seleccione Su Localidad"){   
//     ingresoDestinoContainer.style.display = "block"; 
//     tiposDeEvio.innerHTML = "";
//     tiposDeEvio.innerHTML = correoExpreso;
  
//       if(provinciasSelect.value == "Buenos Aires" || provinciasSelect.value == "Cordoba" || provinciasSelect.value == "Entre Rios" || provinciasSelect.value == "La Pampa" || provinciasSelect.value == "Santa Fe"){
//         valorCorreo = envios.correoReg//1240;
//         document.querySelector(".valor-correo").textContent = valorCorreo;
//       }
//       else if(provinciasSelect.value == "Tucuman" || provinciasSelect.value == "Santiago Del Estero" || provinciasSelect.value == "San Luis" || provinciasSelect.value == "San Juan" || provinciasSelect.value == "Rio Negro" || provinciasSelect.value == "Neuquen" || provinciasSelect.value == "Misiones" || provinciasSelect.value == "Mendoza" || provinciasSelect.value == "La Rioja" || provinciasSelect.value == "Formosa" ||provinciasSelect.value == "Corrientes" || provinciasSelect.value == "Chaco" || provinciasSelect.value == "Catamarca"){
//         valorCorreo = envios.correoNac;
//         document.querySelector(".valor-correo").textContent = valorCorreo;
//       }
//       else{// provinciasSelect.value == "Chubut" || provinciasSelect.value == "Jujuy" || provinciasSelect.value == "Salta" || provinciasSelect.value == "Santa Cruz" || provinciasSelect.value == "Tierra Del Fuego"
//         valorCorreo = envios.correoNac2//1532;
//         document.querySelector(".valor-correo").textContent = valorCorreo;
//       }
//   }
// })

// const ingresoDestinoContainer = document.querySelector(".ingresoDestinoContainer")
// const ingresarDestino = document.querySelector(".ingresarDestino")

// //los iniciamos en null
// let correoCheck = null;
// let expresoCheck = null;

// ingresoDestinoContainer.addEventListener("click", () => {  
 
//   const check_correo = document.querySelector("#tipo-envio2")
//   const check_expreso = document.querySelector("#tipo-envio1")
//   correoCheck = check_correo;
//   expresoCheck = check_expreso;
  
//   if(check_correo.checked){
//     document.querySelector(".correo").style.display = "block"
//     document.querySelector(".expresos").style.display = "none"
//   }
//   if(check_expreso.checked){    
//     document.querySelector(".expresos").style.display = "block"
//     document.querySelector(".correo").style.display = "none"
//   }
// })


// const formaContacto = document.querySelector(".formaContacto");
// const whatsapp = document.querySelector("#formaContacto1");
// const mail = document.querySelector("#formaContacto2");
// const tel = document.querySelector("#formaContacto3");
// const whatsappInput = document.querySelector("#whatsapp");
// const mailInput = document.querySelector("#mail");
// const telInput = document.querySelector("#tel");

// formaContacto.addEventListener("click", () => {
//   if(whatsapp.checked){
//     whatsappInput.style.display = "inline"
//     mailInput.style.display = "none"
//     telInput.style.display = "none"
//   }
//   if(mail.checked){
   
//     whatsappInput.style.display = "none"
//     mailInput.style.display = "inline"
//     telInput.style.display = "none"
//   }
//   if(tel.checked){
    
//     whatsappInput.style.display = "none"
//     mailInput.style.display = "none"
//     telInput.style.display = "inline"
//   }
// })

// const facturacion = document.querySelector(".facturacion");
// const facturacion1 = document.querySelector("#facturacion1");
// const facturacion2 = document.querySelector("#facturacion2");
// const facturacion3 = document.querySelector("#facturacion3");
// const facturacion4 = document.querySelector("#facturacion4");
// const monotributo = document.querySelector(".monotributo");
// const facturaA = document.querySelector(".facturaA");
// const exento = document.querySelector(".exento");

// facturacion.addEventListener("click", () => {  

//   if(facturacion1.checked){
//     monotributo.style.display = "none";
//     facturaA.style.display = "none";
//     exento.style.display = "none";
//   }
//   if(facturacion2.checked){
//     monotributo.style.display = "inline";
//     monotributo.style.marginLeft = "10px";
//     facturaA.style.display = "none";
//     exento.style.display = "none";
//   }
//   if(facturacion3.checked){
//     monotributo.style.display = "none";
//     exento.style.display = "none";
//     facturaA.style.display = "inline";
//   }
//   if(facturacion4.checked){
//     monotributo.style.display = "none";
//     facturaA.style.display = "none";
//     exento.style.display = "inline";
//   }
// })

// const formaDePago = document.querySelector(".forma-pago");
// const formaMercadoPago = document.querySelector("#forma-mercadopago");
// const formaTranferencia = document.querySelector("#banco");
// const numerosCuentas = document.querySelector(".pago-transferencia");
// formaDePago.addEventListener("click", () => {
//   if(formaTranferencia.checked){
//     numerosCuentas.style.display = "block"
//   }else{
//     numerosCuentas.style.display = "none"
//   }
// })
// //-------------------------------------------------------------------------------------
// function close(){
//   let cheked = {
//     retiro: false,
//     envio: false,
//     correo: false,
//     expreso: false,
//     moto: false,
//     whatsapp: false,
//     mail: false,
//     tel: false,
//     consumidor_final: false, 
//     monotributo: false,
//     iva_inscripto: false,
//     exento: false,
//     mercado_pago: false,
//     transferencia: false,
//     efectivo: false
//   };

//   const nombreApellido = document.querySelector(".nombreApellido").value
//   let tipoRetiro = "";
//   let tipoDeEnvio = {Costo: undefined}
//   if(document.querySelector("#retiro").checked){
//     tipoRetiro = "Retira en local"
//     tipoDeEnvio = {Costo: undefined, forma_de_envio: undefined}
//     cheked.retiro = true;
//   }
//   if(checkEnvio.checked){
//     tipoRetiro = "Por Envio"
//     cheked.envio = true;
//   }
  
//   if(correoCheck != null){
//     if(correoCheck.checked){
//       tipoDeEnvio = {
//         forma_de_envio: "Correo_Argentino",
//         Costo: valorCorreo,
//         Provincia: provinciasSelect.value,
//         Localidad: localidades.value,
//         Calle: document.querySelector(".correoCalle").value,
//         Altura: document.querySelector(".correoAltura").value,
//         Piso: document.querySelector(".correoPiso").value,
//         CP: document.querySelector(".correoCP").value,
//         DNI: document.querySelector(".correoDNI").value
//       }
      
//       cheked.correo = true;
//     }
//   }
//   if(expresoCheck != null){
//     if(expresoCheck.checked){
//       tipoDeEnvio = {
//         forma_de_envio: "Expreso",
//         Costo: envios.expreso,
//         Empresa: document.querySelector(".expresoEmpresa").value,
//         Provincia: provinciasSelect.value,
//         Localidad: localidades.value,
//         Calle: document.querySelector(".expresoCalle").value,
//         Altura: document.querySelector(".expresoAltura").value,
//         Piso: document.querySelector(".expresoPiso").value,
//         DNI: document.querySelector(".expresoDNI").value
//       }
//       cheked.expreso = true;
//     }
//   }
//   if(provinciasSelect.value == "Ciudad Autonoma De Bs As"){
//     tipoDeEnvio = {
//       forma_de_envio: "Moto",
//       Costo: envios.moto,
//       Provincia: "Ciudad Autonoma De Bs As",
//       Calle: document.querySelector(".motoCalle").value,
//       Altura: document.querySelector(".motoAltura").value,
//       Piso: document.querySelector(".motoPiso").value,
//       Horario_Entrega: document.querySelector(".horario-entrega").value
//     }
//     cheked.moto = true;
//   } 

//   let contactoTipo;
//   if(whatsapp.checked){    
//     contactoTipo = {
//       contacto: "Whatsapp",
//       numero: whatsappInput.value
//     }
//     cheked.whatsapp = true;
//   }
//   if(mail.checked){
//     contactoTipo = {
//       contacto: "Mail",
//       numero: mailInput.value
//     }
//     cheked.mail = true;
//   }
//   if(tel.checked){
//     contactoTipo = {
//       contacto: "Telefono",
//       numero: telInput.value
//     }
//     cheked.tel = true;
//   }
//   let tipoFacturacion;
//   if(facturacion1.checked){
//     tipoFacturacion = {
//       tipo: "Consumidor Final",
//       RazonSocial: "-",
//       CUIT: "-"
//     }
//     cheked.consumidor_final = true;
//   }
//   if(facturacion2.checked){
//     tipoFacturacion = {
//       tipo: "Monotributo",
//       RazonSocial: document.querySelector(".monotributoRS").value,
//       CUIT:document.querySelector(".monotributoCUIT").value
//     }
//     cheked.monotributo = true;
//   }
//   if(facturacion3.checked){
//     tipoFacturacion = {
//       tipo: "IVA INSCRIPTO",
//       RazonSocial: document.querySelector(".aRS").value,
//       CUIT:document.querySelector(".aCUIT").value
//     }
//     cheked.iva_inscripto = true;
//   }
//   if(facturacion4.checked){
//     tipoFacturacion = {
//       tipo: "IVA Exento",
//       RazonSocial: document.querySelector(".exentoRS").value,
//       CUIT:document.querySelector(".exentoCUIT").value
//     }
//     cheked.exento = true;
//   }

//   let formaDepago;
  
//   if(formaTranferencia.checked){
//     formaDepago = "Transferencia Bancaria"
//     form.action = "/success-transferencia"
//     form.method = "get"
//     cheked.transferencia = true;
//   }
//   if(formaMercadoPago.checked){
//     formaDepago = "Mercado Pago"
//     form.action = "/mercadopago"
//     form.method = "post"
//     cheked.mercado_pago = true;
//   }
//   if(efectivoInput.checked){
//     formaDepago = "En Efectivo"
//     form.action = "/success-transferencia"
//     form.method = "get"
//     cheked.efectivo = true;
//   }

//   const cliente = {
//     nombreApellido: nombreApellido,
//     retira: tipoRetiro,
//     tipoDeEnvio: tipoDeEnvio,
//     formaDeContacto: contactoTipo,
//     facturacion: tipoFacturacion,
//     formaDePago: formaDepago,
//     sys: {
//       checked: cheked,
//       compra: compra
//     }
//   }
//   let costoEnvío = 0;
//   let costoFinal = totalCompra;
//   if(costoEnvío != null && tipoDeEnvio.Costo != undefined){
//     costoFinal += parseInt(tipoDeEnvio.Costo); 
//   }
  
//   const setClient = cliente;
//   localStorage.setItem('datos-envio', JSON.stringify(setClient));
//   document.querySelector(".precio").value = costoFinal;
//   document.querySelector(".titulo").value = "Carrito-Raquel-Digital";

//   socket.emit("nuevo-pedido", cliente);    
// }


// document.querySelector(".formAction").addEventListener("submit", (e) => {
//   e.preventDefault();
//   close()  
//   //reingresarDatos(cliente)  
// })

// socket.on("valPeticion", data => {
  
//   if(data.state){    
//     Swal.fire({
//       title: "Formulario procesado con exito!!",
//       // text: ,
//       icon: 'success',
//       confirmButtonText: 'Continuar',
//       confirmButtonColor: '#218838',      
//     }).then((res) => {
//       if(res.isConfirmed){
//         //form.submit();
//         const datosCliente = JSON.parse(localStorage.getItem('datos-envio'));
//         //datosCliente.auth = cliDat
//         //socket.emit("mail", datosCliente)
//         console.log(datosCliente)
//       }
//     })
//   }else{
//     //alert(data.message)
//     Swal.fire({
//       title: data.message,      
//       icon: 'error',
//       confirmButtonColor: '#218838',
//       confirmButtonText: 'Continuar'
//     })
//   }
// });


// let form = document.querySelector(".formAction");

// function reingresarDatos(cliente){ 
//   //reingresamos los datos
//   //nombre
//   if(cliente.nombreApellido)
//   document.querySelector(".nombreApellido").value = cliente.nombreApellido;
//   //checks
//   document.querySelector("#retiro").checked = cliente.sys.checked.retiro;
//   checkEnvio.checked = cliente.sys.checked.envio;
//   if(checkEnvio.checked){
//     document.querySelector(".ingresarTipoEnvio").innerHTML = correoExpreso;
//     porEnvio.style.display = "block";
//     provinciasSelect.innerHTML += `<option value="${cliente.tipoDeEnvio.Provincia}" selected>${cliente.tipoDeEnvio.Provincia}</option>` 
//     //envio por moto
//     if(cliente.tipoDeEnvio.Provincia == "Ciudad Autonoma De Bs As"){
//       porEnvio.style.display = "none";
//       document.querySelector(".ingresarTipoEnvio").innerHTML = ""
//       document.querySelector(".moto").style.display = "block";
//       document.querySelector(".motoValor").innerHTML = `<h5>${envios.moto}</h5>`;
//       document.querySelector(".motoCalle").value = cliente.tipoDeEnvio.Calle;
//       document.querySelector(".motoAltura").value = cliente.tipoDeEnvio.Altura;
//       document.querySelector(".horario-entrega").value = cliente.tipoDeEnvio.Horario_Entrega;      
//     }else{
//       localidades.style.display = "inline";
//       localidades.innerHTML += `<option value="${cliente.tipoDeEnvio.Localidad}" selected>${cliente.tipoDeEnvio.Localidad}</option>`;
//     }

//     const correo = document.querySelector("#tipo-envio2");
//     const expreso = document.querySelector("#tipo-envio1");

//     if(correo != null){
//       correo.checked = cliente.sys.checked.correo;
//       if(correo.checked){
//         document.querySelector(".correoCalle").value = cliente.tipoDeEnvio.Calle
//         document.querySelector(".correoAltura").value = cliente.tipoDeEnvio.Altura
//         document.querySelector(".correoCP").value = cliente.tipoDeEnvio.CP
//         document.querySelector(".correoDNI").value = cliente.tipoDeEnvio.DNI
//         document.querySelector(".correo").style.display = "block"
//       }
//     }
    
//     if(expreso != null){
//       expreso.checked = cliente.sys.checked.expreso;
//       if(expreso.checked){
//         document.querySelector(".expresoEmpresa").value = cliente.tipoDeEnvio.Empresa
//         document.querySelector(".expresoCalle").value = cliente.tipoDeEnvio.Calle
//         document.querySelector(".expresoAltura").value = cliente.tipoDeEnvio.Altura
//         document.querySelector(".expresoDNI").value = cliente.tipoDeEnvio.DNI
//         document.querySelector(".expresos").style.display = "block"
//       }
//     }
//   }else{
//     porEnvio.style.display="none";
//     provinciasSelect.style.display="none";
//     localidades.style.display="none";
//     ingresoDestinoContainer.style.display="none";
//     pagoEfectivo.style.display="block";
//     efectivoInput.checked = true;
//   }

//   whatsapp.checked = cliente.sys.checked.whatsapp;
//   mail.checked = cliente.sys.checked.mail;
//   tel.checked = cliente.sys.checked.tel;

//   if(cliente.sys.checked.whatsapp){
//     whatsappInput.style.display = "inline";
//     whatsappInput.value = cliente.formaDeContacto.numero
//   }
//   if(cliente.sys.checked.mail){
//     mailInput.style.display = "inline";
//     mailInput.value = cliente.formaDeContacto.numero
//   }
//   if(cliente.sys.checked.tel){
//     telInput.style.display = "inline";
//     telInput.value = cliente.formaDeContacto.numero
//   }

//   facturacion1.checked = cliente.sys.checked.consumidor_final;
//   facturacion2.checked = cliente.sys.checked.monotributo;
//   facturacion3.checked = cliente.sys.checked.iva_inscripto;
//   facturacion4.checked = cliente.sys.checked.exento;

//   if(cliente.sys.checked.iva_inscripto){
//     facturaA.style.display = "inline";
//     document.querySelector(".aRS").value = cliente.facturacion.RazonSocial
//     document.querySelector(".aCUIT").value = cliente.facturacion.CUIT
//   }
//   if(cliente.sys.checked.monotributo){
//     monotributo.style.display = "inline";
//     document.querySelector(".monotributoRS").value = cliente.facturacion.RazonSocial
//     document.querySelector(".monotributoCUIT").value = cliente.facturacion.CUIT
//   }
//   if(cliente.sys.checked.exento){
//     exento.style.display = "inline";
//     document.querySelector(".exentoRS").value = cliente.facturacion.RazonSocial
//     document.querySelector(".exentoCUIT").value = cliente.facturacion.CUIT
//   }

//   formaTranferencia.checked = cliente.sys.checked.transferencia
//   formaMercadoPago.checked = cliente.sys.checked.mercado_pago

//   if(cliente.sys.checked.transferencia){
//     numerosCuentas.style.display = "block"
//   }
//   if(cliente.sys.checked.efectivo){
//     pagoEfectivo.style.display = "block"
//   }
// }

// let correoExpreso;
// //------CARGA DESPUES DEL DOM-----------------
// document.addEventListener('DOMContentLoaded', (e) => {
 
//     correoExpreso = `
//       <h4>Seleccione el tipo de envío</h4>
//       <div class="form-check">
//             <input class="form-check-input check-correo" type="radio" name="tipo-envio" id="tipo-envio2">
//             <label class="form-check-label" for="tipo-envio2">
//             <span>Por Correo Argentino $ <p class="valor-correo" style="display: inline;">${valorCorreo} Valor por paquete de 5kg (en caso de superarse le vamos a avisar el costo)</p></span>
//  check           </label>
//         </div>
//         <div class="form-check">
//             <input class="form-check-input check-expreso" type="radio" name="tipo-envio" id="tipo-envio1">
//             <label class="form-check-label" for="tipo-envio1">
//             Por Expreso $500 de flete de envío a la terminal.
//             </label>
//         </div>
//       `
//       if(datos_cliente){
//         reingresarDatos(datos_cliente);
//       }
// })

// let cliDat;
// /**** RECIBIMOS USER DE AUTH */
// socket.on("usuario-auth", perfil => cliDat = perfil);
// /*** ***************************/