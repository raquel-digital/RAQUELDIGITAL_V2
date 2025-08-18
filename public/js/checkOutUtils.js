let valoresEnvio 
(async () => await getCostos())();//getCostos()
//----- UTILS -----//
function costoEnvio(provincia) {
  let valorCorreo = null
  const valor = document.getElementById("correo_argentino_costos")
 
  if(provincia == "Buenos Aires"){
    valorCorreo = valoresEnvio.correoReg
    valor.innerHTML = `Por Correo Argentino - Precio: $${valoresEnvio.correoReg}`
  }
  else if(provincia == "Tucuman" || provincia == "Santiago Del Estero" || provincia == "San Luis" || provincia == "San Juan" || provincia == "Rio Negro" || provincia == "Neuquen" || provincia == "Misiones" || provincia == "Mendoza" || provincia == "La Rioja" || provincia == "Formosa" ||provincia == "Corrientes" || provincia == "Chaco" || provincia == "Catamarca" || provincia == "Cordoba" || provincia == "Entre Rios" || provincia == "La Pampa" || provincia == "Santa Fe"){
    valorCorreo = valoresEnvio.correoNac
    valor.innerHTML = `Por Correo Argentino - Precio: $${valoresEnvio.correoNac}`
  }
  else{
    valorCorreo = valoresEnvio.correoNac2;
    valor.innerHTML = `Por Correo Argentino - Precio: $${valoresEnvio.correoNac2}`
  }
  
  return valorCorreo
}

async function getCostos() {
  try {
    const response = await fetch('../system/envios/dataEnvios.json')
    console.log(response)
    if (!response.ok) {
      throw new Error('No se pudo obtener los datos.');
    }    
    const data = await response.json(); // Esperar a que se resuelva la promesa JSON
    const stringCompra = document.getElementById("total_de_compra").textContent
    const totalDeCompra = parseFloat(stringCompra.replace("$", "").trim());
    
    //ingresamos expreso y moto que son valores fijos
    if(totalDeCompra >= 100000){
      document.querySelector(".texto-envio-caba").innerHTML = `Envío gratis por moto por superar los $100.000 en tu pedido <i>📦 Importante: si el pedido excede el tamaño de carga de la moto, se deberá abonar el costo de una segunda unidad.</i><span id="valor_moto" style="font-weight: 600;">${data[0].moto}</span>.</p>`
      //document.getElementById("valor_moto").textContent = ".";
      data[0].moto = 0
    }else{
      document.getElementById("valor_moto").textContent = "$" + data[0].moto;
    }

    //document.getElementById("valor_moto").textContent = "$" + data[0].moto;
    document.getElementById("valor_expreso").innerHTML = `Por Expreso - Precio: $${data[0].expreso} <span>(el flete de envío a la terminal)</span>`;
    document.getElementById("valor_expreso_tooltip").innerHTML = `$${data[0].expreso}`;
    valoresEnvio = data[0];
    
    //ingreso de datos previos de cliente
    if (datos_cliente) {
        ingresoDatosPrevios(datos_cliente);
    }
    
    return  
  } catch (error) {
    console.error('Error:', error);
  }
}

//ingreso de datos previos
function ingresoDatosPrevios(cliente) {
  document.getElementById("nombre-apellido").value = cliente.nombreApellido;
 
  //ENVIO
  if(cliente.retira == "Por Moto" || cliente.retira == "Por Envio") {
    document.getElementById("envio").checked = true;
    document.querySelector('.datos-envio').style.display = 'block';
  }
  if(cliente.retira == "Retira en local"){
    document.getElementById("retiro").checked = true;
  }
  if(cliente.retira != "Retira en local"){
    if(cliente.tipoDeEnvio.forma_de_envio == "Correo_Argentino") {

      document.getElementById("localidad").style.display = 'block';
      document.getElementById("provText").textContent = cliente.tipoDeEnvio.Provincia
      document.getElementById("locText").textContent = cliente.tipoDeEnvio.Localidad

      document.getElementById("localidad").style.display = 'block';
      document.getElementById("checkout-radiobuttons-opciones-envio").style.display = "block";
      document.getElementById("correo-argentino").checked = true;

      document.querySelector(".datos-correo-argentino").style.display = "block";
      
      document.getElementById("correo-direccion").value = cliente.tipoDeEnvio.Calle
      document.getElementById("correo-altura").value = cliente.tipoDeEnvio.Altura
      document.getElementById("correo-piso-dpto").value = cliente.tipoDeEnvio.piso_departamento    
      document.getElementById("correo-cod-postal").value = cliente.tipoDeEnvio.CP
      document.getElementById("correo-dni").value = cliente.tipoDeEnvio.DNI   

      costoEnvio(cliente.tipoDeEnvio.Provincia); 
    }
    if(cliente.tipoDeEnvio.forma_de_envio == "Expreso") {

      document.getElementById("localidad").style.display = 'block';
      document.getElementById("provText").textContent = cliente.tipoDeEnvio.Provincia
      document.getElementById("locText").textContent = cliente.tipoDeEnvio.Localidad

      document.getElementById("localidad").style.display = 'block';
      document.getElementById("checkout-radiobuttons-opciones-envio").style.display = "block";
      document.getElementById("expreso").checked = true;

      document.querySelector(".datos-expreso").style.display = "block";
      
      document.getElementById("expreso-direccion").value = cliente.tipoDeEnvio.Calle
      document.getElementById("expreso-altura").value = cliente.tipoDeEnvio.Altura
      document.getElementById("expreso-piso-dpto").value = cliente.tipoDeEnvio.piso_departamento    
      document.getElementById("empresa-transporte").value = cliente.tipoDeEnvio.Empresa
      document.getElementById("expreso-dni").value = cliente.tipoDeEnvio.DNI   
      
      costoEnvio(cliente.tipoDeEnvio.Provincia)
    }
    if(cliente.tipoDeEnvio.forma_de_envio == "Moto") {
      document.getElementById("provText").textContent = cliente.tipoDeEnvio.Provincia 

      document.getElementById("envio-caba").style.display = "block";
      
      document.getElementById("caba-direccion").value = cliente.tipoDeEnvio.Calle
      document.getElementById("caba-altura").value = cliente.tipoDeEnvio.Altura
      document.getElementById("caba-piso-dpto").value = cliente.tipoDeEnvio.piso_departamento    
      document.getElementById("caba-franja-horaria").value = cliente.tipoDeEnvio.Horario_Entrega
    }
  }
  

  //CONTACTO
  if(cliente.formaDeContacto.contacto == "whatsapp"){
    document.getElementById("whatsapp").checked = true;
    document.getElementById('whatsappInput').style.display = 'block';
    document.getElementById('whatsapp-numero').value = cliente.formaDeContacto.numero;
  }
  if(cliente.formaDeContacto.contacto == "Mail"){
    document.getElementById("email").checked = true;
    document.getElementById('emailInput').style.display = 'block';
    document.getElementById('mail-numero').value = cliente.formaDeContacto.numero;
  }
  if(cliente.formaDeContacto.contacto == "Telefono"){
    document.getElementById("tel-fijo").checked = true;
    document.getElementById('tel-fijoInput').style.display = 'block';
    document.getElementById('tel-numero').value = cliente.formaDeContacto.numero;
  }

  //FACTURACION
  if(cliente.facturacion.tipo == "Consumidor Final") {
    document.getElementById("consumidor-final").checked = true;
  }
  if(cliente.facturacion.tipo == "Monotributo") {
    document.getElementById("monotributista").checked = true;
    document.getElementById("monotributistaInput").style.display = 'block';
    document.getElementById("razon-social-monotributo").value = cliente.facturacion.RazonSocial;
    document.getElementById("usuario-cuit-monotributo").value = cliente.facturacion.CUIT;
  }
  if(cliente.facturacion.tipo == "Responsable Inscripto") {
    document.getElementById("iva-inscripto").checked = true;
    document.getElementById("iva-inscriptoInput").style.display = 'block';
    document.getElementById("razon-social-iva-inscripto").value = cliente.facturacion.RazonSocial;
    document.getElementById("usuario-cuit-iva-inscripto").value = cliente.facturacion.CUIT;
  }
  if(cliente.facturacion.tipo == "Exento") {
    document.getElementById("exento").checked = true;
    document.getElementById("exentoInput").style.display = 'block';
    document.getElementById("razon-social-exento").value = cliente.facturacion.RazonSocial;
    document.getElementById("usuario-cuit-exento").value = cliente.facturacion.CUIT;
  }
  

  //FORMA DE PAGO
  if(cliente.formaDePago == "En Efectivo") {
    document.getElementById("efectivo").checked = true;
  }
  if(cliente.formaDePago == "Mercado Pago") {
    document.getElementById("mercadopago").checked = true;
  }
  if(cliente.formaDePago == "Transferencia Bancaria") {
    document.getElementById("transferencia").checked = true;
    document.querySelector(".transferencia-bancaria").style.display = 'block';
  }
}

function alertModal(txt, txt2, confirmar, cancelar){
    document.getElementById("mensaje-1").textContent = txt
    if(txt2){
      document.getElementById("mensaje-2").textContent = txt2
    }

    document.getElementById("confirmar-mensaje").textContent = confirmar
    if(cancelar){
      document.getElementById("cancelar-mensaje").textContent = cancelar
    }
}