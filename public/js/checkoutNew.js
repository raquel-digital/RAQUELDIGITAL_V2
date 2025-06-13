const socket = io.connect();

const datos_cliente = JSON.parse(localStorage.getItem('datos-envio'));//recuperamos los datos del cliente
const pedido = JSON.parse(localStorage.getItem("carrito")) //recuperamos el carrito
document.getElementById("carrito-holder").value = JSON.stringify(pedido)//guardamos el pedido para que lo tome la cabecera del req.boy 
const cliente = {}
const provinciasSelect = document.getElementById("ulProvincia");
const localidadSelect = document.getElementById("ulLocalidad");
let provinciasLocalidades; //contenedor de localidades por provincia
let form = document.querySelector(".formAction");


//buscamos los datos de envío y listado de provincias
(async () => {
  await fetch('../system/envios/provinciasLocalidades.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('La solicitud no se pudo completar.');
    }
    return response.json();
  })
  .then(argentina => {
    // Trabaja con los datos JSON
    argentina.forEach( e => {
      provinciasSelect.innerHTML += `<li class="seleccionProv" role="option" data-value="${e.provincia}">${e.provincia}</li>`
    })
    provinciasLocalidades = argentina
  })
  .catch(error => {
    console.error('Error: ', error);
  }); 

  //guardamos pedido en historial
  const pedido = localStorage.getItem("carrito")
  const id = localStorage.getItem("login")
  const data = { id: id, pedido: JSON.parse(pedido), nombre: " ", tipo: "Historial"}
  socket.emit("guardar-pedido-usuario", data)
})()

//ingresamos carrito
document.querySelector(".carrito-cuerpo").innerHTML = "";
let total = 0;

pedido.forEach(e => {
    total += e.precio * e.cantidad
    document.querySelector(".carrito-cuerpo").innerHTML += `
    <div class="carrito-item">
        <div class="contenedor-img-carrito" style='background-image: url(${e.imagen});'>
            
        </div>
        <div class="carrito-item-info">
            <h3>${e.titulo}</h3>
            <p>Precio: $${e.precio}</p>
            <p>Cantidad: ${e.cantidad}</p>
        </div>
    </div>    
    `
    document.getElementById("total_de_compra").textContent = `$${total.toFixed(2)}`;
})
cliente.sys = {}
cliente.sys.compra = pedido
cliente.sys.totalCompra = total.toFixed(2)




function checkOut() {
  //algunas cosas se recaudan en esta funcion y otras solo con hacer click en el radioButton
  cliente.nombreApellido = document.getElementById("nombre-apellido").value;  
  //RETIRA EN LOCAL
  if(cliente.retira == "Retira en local" || document.getElementById("retiro").checked) {
      cliente.retira = "Retira en local"
  }

  //SI ES POR ENVIO
  if(cliente.retira == "Por Envio" || document.getElementById("envio").checked) {
      if(cliente.vamosAEnviar == "Correo Argentino" || document.getElementById("correo-argentino").checked) {
        cliente.tipoDeEnvio = {
          forma_de_envio: "Correo_Argentino",
          Calle: document.getElementById("correo-direccion").value,
          piso_departamento: document.getElementById("correo-piso-dpto").value,
          Provincia: document.getElementById("provText").textContent,  
          Costo: costoEnvio(document.getElementById("provText").textContent),
          Localidad: document.getElementById("locText").textContent,   
          Altura: document.getElementById("correo-altura").value,
          CP: document.getElementById("correo-cod-postal").value,
          DNI: document.getElementById("correo-dni").value,
        }
        
        cliente.retira = "Por Envio"
      }      
      if(cliente.vamosAEnviar == "expreso" || document.getElementById("expreso").checked) {
          cliente.tipoDeEnvio = {
            forma_de_envio: "Expreso",
            Calle: document.getElementById("expreso-direccion").value,
            Altura: document.getElementById("expreso-altura").value,
            piso_departamento: document.getElementById("expreso-piso-dpto").value,
            DNI: document.getElementById("expreso-dni").value,
            Empresa: document.getElementById("empresa-transporte").value,
            Costo: valoresEnvio.expreso,
            Provincia: document.getElementById("provText").textContent,
            Localidad: document.getElementById("locText").textContent, 
          }

          cliente.retira = "Por Envio"
      }      
      if(cliente.vamosAEnviar == "Por Moto") {
        cliente.tipoDeEnvio = {
            forma_de_envio: "Moto",
            Calle: document.getElementById("caba-direccion").value,
            Altura: document.getElementById("caba-altura").value,
            piso_departamento: document.getElementById("caba-piso-dpto").value,
            Horario_Entrega: document.getElementById("caba-franja-horaria").value,    
            Costo: valoresEnvio.moto,
            Provincia: "Ciudad Autonoma De Bs As",
          }
         
          cliente.retira = "Por Envio"
      }
    } 
    //FORMA DE CONTACTO
    if(document.getElementById("whatsapp").checked) {
        cliente.formaDeContacto = {
            contacto: "whatsapp",
            numero: document.getElementById("whatsapp-numero").value
        }
    }
    if(document.getElementById("email").checked) {
        cliente.formaDeContacto = {
            contacto: "Mail",
            numero: document.getElementById("mail-numero").value
        }
    }
    if(document.getElementById("tel-fijo").checked) {
        cliente.formaDeContacto = {
            contacto: "Telefono",
            numero: document.getElementById("tel-numero").value
        }
    }
    //facturacion
    if(document.getElementById("consumidor-final").checked) {
      cliente.facturacion = {
        tipo: "Consumidor Final",
        CUIT: "...",
        RazonSocial: "...",
      }
    }
    if(document.getElementById("monotributista").checked) {
      cliente.facturacion = {
        tipo: "Monotributo",
        CUIT: document.getElementById("usuario-cuit-monotributo").value,
        RazonSocial: document.getElementById("razon-social-monotributo").value,
      }
    }
    if(document.getElementById("iva-inscripto").checked) {
      cliente.facturacion = {
        tipo: "Responsable Inscripto",
        CUIT: document.getElementById("usuario-cuit-iva-inscripto").value,
        RazonSocial: document.getElementById("razon-social-iva-inscripto").value,
      }
    }
    if(document.getElementById("exento").checked) {
      cliente.facturacion = {
        tipo: "Exento",
        CUIT: document.getElementById("usuario-cuit-exento").value,
        RazonSocial: document.getElementById("razon-social-exento").value,
      }
    }
    //FORMA DE PAGO
    if(document.getElementById("mercadopago").checked) {
        //ajustes mercadopago
        let envioMP = 0
        if(cliente.tipoDeEnvio){
          envioMP = cliente.tipoDeEnvio.Costo
        }
        console.log(envioMP)
        document.querySelector(".precio").value = Number(cliente.sys.totalCompra) + Number(envioMP);
        document.querySelector(".titulo").value = "Carrito-Raquel-Digital";
        cliente.formaDePago = "Mercado Pago"        
        form.action = "/mercadopago"
    }
    if(document.getElementById("efectivo").checked) {
        cliente.formaDePago = "En Efectivo"
        form.action = "/success-transferencia" //redireccion al succes final
    }
    if(document.getElementById("transferencia").checked) {
        cliente.formaDePago = "Transferencia Bancaria"
        form.action = "/success-transferencia" //redireccion al succes final
    }

    checkCorreccion(cliente)//en caso que haya errores previos los corregimos
    //observaciones
    cliente.observaciones = document.getElementById("pedidoObservaciones").value;
    const check = checkOutErrors(cliente)//chequeamos errores
    //si hay error frenar envio
    if(!check) {
      console.log("HAY ERRORES, NO SE ENVIA", check)
      return
    }

    localStorage.setItem('datos-envio', JSON.stringify(cliente)); //LOCAL STORE

    //agregamos el carrito al cliente    
    //socket.emit("mail", cliente)
    //form.submit();
  }

