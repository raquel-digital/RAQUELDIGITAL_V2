const socket = io.connect();
const compra = JSON.parse(localStorage.getItem('carrito'));
let datosCliente = JSON.parse(localStorage.getItem('datos-envio'));


localStorage.removeItem("carrito");

//evitamos que el form feedback use submit
document.getElementById("feedbackForm").addEventListener("submit", function(e){
    e.preventDefault(); // cancela el envío
});

const mensajeCierre =  document.querySelector("#ovalo");
if(datosCliente.sys.checked.mercado_pago){
  mensajeCierre.innerHTML = `<h1>Gracias Por Tu Compra:</h1>`
  mensajeCierre.innerHTML += `<h1>Tu pago se proceso de forma exitosa!!</h1>`
  mensajeCierre.innerHTML += `<h1>Pasamos a preparar su pedido y nos pondremos en contacto.</h1>`
  mensajeCierre.innerHTML += `<h1>Cualquier duda consultenos.</h1>`
}
if(datosCliente.sys.checked.transferencia){
  mensajeCierre.innerHTML = `<h1>Gracias Por Tu Compra:</h1>`
  mensajeCierre.innerHTML += `<h1>Por favor envianos tu comprobante de transferencia por:</h1>`
  mensajeCierre.innerHTML += `<h1>whatsapp: 11 3693 3250 o mail: info@casaraquel.com.ar</h1>`
  mensajeCierre.innerHTML += `<h1>Mientras pasamos a preparar su pedido y nos pondremos en contacto. Una vez listo</h1>`
  mensajeCierre.innerHTML += `<h1>Cualquier duda consultenos.</h1>`
}
if(datosCliente.sys.checked.efectivo){
  mensajeCierre.innerHTML = `<h1>Gracias Por Tu Compra:</h1>`
  mensajeCierre.innerHTML += `<h1>Pasamos a preparar su pedido y nos pondremos en contacto. Una vez listo asi puede venir a retirarlo.</h1>`
  mensajeCierre.innerHTML += `<h1>Estamos en lavalle 2665 de lunes a viernes de 9 a 18hs y sábados de 9:30 a 13hs.</h1>`
  mensajeCierre.innerHTML += `<h1>Cualquier duda consultenos.</h1>`
}

var resumenCheckOut = document.querySelector(".resumen-check-out");

let totalCompra = 0;
//table(); 

function table(){
    if(Array.isArray(compra)){
      
      resumenCheckOut.innerHTML = "";
      
      compra.forEach(e => {
        resumenCheckOut.innerHTML += `
        <td><img src="${e.imagen}" alt="imagen table" widht="60px" height="60px"></td>
        <td>${e.codigo}</td>
        <td>${e.titulo}<td>
        <td>${e.precio}</td>
        <td>${e.cantidad}</td>
        <td>${e.cantidad * e.precio}</td>
        `;
        totalCompra += e.cantidad * e.precio;
      })
      document.querySelector(".total-compra-final").innerHTML = `<td><b>EL TOTAL DE SU COMPRA: ${totalCompra.toFixed(2)}</b></td>`;
      
    }
}

document.querySelector(".contacto").innerHTML = `Mediante: ${datosCliente.formaDeContacto.contacto} ${datosCliente.formaDeContacto.numero}`;
document.querySelector(".reservado").innerHTML = `Por cualquier consulta, dejamos reservado tu pedido a nombre de: ${datosCliente.nombreApellido}`

if(datosCliente.sys.checked.transferencia){
  document.querySelector(".datos-cliente").innerHTML = `
  <h1 style="text-align: center;">Nuestros N° de cuenta son:</h1>
  <div class="pago-transferencia" style="font-weight: bold; display: block; text-align: center;">
      
      <li>ICBC: CBU 0150505402000102323287 ALIAS: CASARAQUEL.</li><li>MERCADOPAGO: CVU 0000003100034337461618 ALIAS CASARAQUELSA.</li>
      <span style="margin-top: 5px;">Por favor avisarnos una vez realizado el pago así podemos confirmar la acreditación.</span>
  </div>
  `
}


if(datosCliente.retira === "Por Envio"){
  
  if(datosCliente.sys.checked.moto){
    let horario = "A convenir";
    let pisoHTML = ""; 
    if(datosCliente.tipoDeEnvio.Horario_Entrega != ""){
      horario = datosCliente.tipoDeEnvio.Horario_Entrega 
    }
    if(datosCliente.tipoDeEnvio.Piso != ""){
      pisoHTML = `<li>Piso/Dpto: ${datosCliente.tipoDeEnvio.Piso}</li>`
    }
    document.querySelector(".casoEnvio").innerHTML = `
    Por favor chequea una ultima vez si tus datos de envío son correctos:
    <ul>
      <li>Envío por: ${datosCliente.tipoDeEnvio.forma_de_envio}</li>
      <li>Calle: ${datosCliente.tipoDeEnvio.Calle} Altura: ${datosCliente.tipoDeEnvio.Altura}</li>      
      ${pisoHTML}
      <li>Horario De Entrega: ${horario}</li>
    </ul> 
  `;
    
  }
  if(datosCliente.sys.checked.expreso){
    let deposito;
    if(datosCliente.tipoDeEnvio.Calle != ""){
      deposito = `Direccion Calle: ${datosCliente.tipoDeEnvio.Calle} Altura: ${datosCliente.tipoDeEnvio.Altura}`
    }else{
      deposito = "Retira en deposito";
    }

    let pisoHTML = "";

    if(datosCliente.tipoDeEnvio.Piso != ""){
      pisoHTML = `<li>Piso/Dpto: ${datosCliente.tipoDeEnvio.Piso}</li>`
    }
    document.querySelector(".casoEnvio").innerHTML = `
    Por favor chequea una ultima vez si tus datos de envío son correctos:
    <ul>
      <li>Envío por: ${datosCliente.tipoDeEnvio.forma_de_envio}</li>
      <li>Por la empresa: ${datosCliente.tipoDeEnvio.Empresa}</li>      
      <li>A la provincia: ${datosCliente.tipoDeEnvio.Provincia} Localidad: ${datosCliente.tipoDeEnvio.Localidad}</li>
      <li>${deposito} ${pisoHTML}</li>
      <li>El envío sale a nombre de: ${datosCliente.nombreApellido} DNI: ${datosCliente.tipoDeEnvio.DNI}</li>
    </ul>  
  `;
  }  
  if(datosCliente.sys.checked.correo){
    let piso = datosCliente.tipoDeEnvio.Piso;
    if(piso != ""){
      piso = `Piso: ${piso}`
    }
    document.querySelector(".casoEnvio").innerHTML = `
    Por favor chequea una ultima vez si tus datos de envío son correctos:
    <ul>
      <li>Envío por: Correo Argentino</li>      
      <li>A la provincia: ${datosCliente.tipoDeEnvio.Provincia} Localidad: ${datosCliente.tipoDeEnvio.Localidad}</li>
      <li>Direccion Calle: ${datosCliente.tipoDeEnvio.Calle} Altura: ${datosCliente.tipoDeEnvio.Altura} ${piso} Codigo Postal: ${datosCliente.tipoDeEnvio.CP}</li>
      <li>El envío sale a nombre de: ${datosCliente.nombreApellido} DNI: ${datosCliente.tipoDeEnvio.DNI}</li>
    </ul>  
  `;
  }
}
if(datosCliente.retira === "Retira en local"){
  document.querySelector(".casoEnvio").innerHTML = `Pasamos a preparar tu pedido para confirmarte el stock e importe. Apenas listo no estamos poniendo en contacto. Para que puedas venir a retirarlo por nuestro local en lavalle 2665 de lunes a viernes de 9 a 18hs y sábados de 9:30 a 13hs.`
}

datosCliente.compra = resumenCheckOut.innerHTML;

//socket.emit("mail", datosCliente)
localStorage.removeItem("carrito");

document.getElementById("consultas").innerHTML = `
    <h1>Aqui podes dejarnos tus consultas o sugerencias para mejorar el sitio</h1>
    <div class="container   
 mt-5">
        <h2>¡Déjanos tu opinión!</h2>
        
            <div class="mb-3">
                <label for="sugerencias" class="form-label">Tus sugerencias:</label>
                <textarea class="form-control" id="pedidoObservaciones" rows="5"></textarea>
            </div>
            <div class="mb-3">
                <label for="contacto" class="form-label">Contacto (opcional):</label>
                <input type="text" class="form-control" id="contacto-consultas">
            </div>
            <button id="boton-envio-consulta" class="btn btn-primary">Enviar</button>
        
    </div>
    `
    document.getElementById("boton-envio-consulta").addEventListener("click", () => {
      const consulta = document.getElementById("pedidoObservaciones").value
      const contacto = document.getElementById("contacto-consultas").value
      const confirm = document.getElementById("custom-modal")
      
      if(contacto){
        alert("Gracias por tu mensaje nos pondremos en contacto al " + contacto)
      }else{
        alert("Gracias por tu mensaje")
      }
      const data = {
        consulta: consulta,
        contacto: contacto
      } 
                
      socket.emit("consulta-cliente", data)
      window.location.href = "https://raqueldigital.herokuapp.com/"; 
            
})

function feedback() {
   const conociste = document.getElementById("conociste").value
   const xpCompra = document.getElementById("xpCompra").value
   const userXP = document.getElementById("products").value
   const comentarios = document.getElementById("comments").value
   
   const data = {
    nombre: datosCliente.nombreApellido,
    contacto: datosCliente.formaDeContacto.numero,
    conociste: conociste,
    xpCompra: xpCompra,
    userXP: userXP,
    comentarios: comentarios
   }
   console.log(data)
   socket.emit("feedback", data)
   window.location.href = "https://raqueldigital.herokuapp.com/"; 
}
  

    