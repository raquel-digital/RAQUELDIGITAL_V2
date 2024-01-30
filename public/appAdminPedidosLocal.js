const socket = io.connect();
const mostrador =  document.querySelector(".mostrador");
let pedidos;
let pedidosTemp;
const cambios = [];

const date = new Date()
const dia = date.getDate();
const mes = date.getMonth()+1;
const anio = date.getFullYear();
mostrador.innerHTML = `
    <div style="margin-top: 4rem;">
    <h1> ADMINISTRADOR DE PEDIDOS LOCAL </h1>
    <h2> NO HAY PEDIDOS PENDIENTES </h2>        
    </div>
`
socket.emit("buscar-pedidos-local");
socket.on("buscar-pedidos-local-res", data => {
    pedidos = data;
    draw.tabla(pedidos)
})

mostrador.addEventListener("click", e => {
    const mouse = e.target;

    if(mouse.classList.contains("botonConfirmar")){
        mouse.classList.remove("btn-primary");
        mouse.classList.add("btn-warning");
    }
    if(mouse.classList.contains("editarOrden")){        
        const orden =  mouse.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
        editarPedido(orden);
    }
    if(mouse.id == "seleccionar-todo"){
        const checkBox = document.querySelector("#seleccionar-todo")
        if(checkBox.checked){
            const allOrders = document.querySelectorAll(".borrarPedidoInput")            
            allOrders.forEach(e => {
                e.checked =  true
            })
        }else{
            const allOrders = document.querySelectorAll(".borrarPedidoInput")
            allOrders.forEach(e => {
                e.checked =  false
            })
        }
        
    }
})

function submitForm() {    
    const cliente =  document.querySelector("#cliente").value;
    const prepara =  document.querySelector("#prepara").value;
    const contacto =  document.querySelector("#contacto").value;
    const numero_mail = document.querySelector("#numero-mail").value;
    const pedido = document.querySelector("#pedidoIngreso").value;
    const zona_guardado = document.querySelector("#zona-de-guardado").value;
    const est_pedido = document.querySelector("#est_pedido").value;

    if(cliente == " "){
        alert("DEBE INGRESAR NOMBRE DE CLIENTE");
        return;
    }

    //forma de pago
    const local = document.querySelector("#pagoLocal").checked;
    const icbc = document.querySelector("#pagoICBC").checked;
    const mercadopago = document.querySelector("#pagoMercadopago").checked;
    const presupuesto = document.querySelector("#pagoPresupuesto").checked;
    let formaDePago = " ";

    
    if(local){
        formaDePago = "local"
    }
    if(icbc){
        formaDePago = "icbc"
    }
    if(mercadopago){
        formaDePago = "mercadopago"
    }
    if(presupuesto){
        formaDePago = "presupuesto"
    }
    //forma de envío
    let envio = " ";
    const retiraLocal = document.querySelector("#retiraLocal").checked;
    const correo = document.querySelector("#correoArgentino").checked;
    const expreso = document.querySelector("#expreso").checked;
    const moto = document.querySelector("#moto").checked;
    if(retiraLocal){
        envio = "retira"
    }
    if(correo){
        envio = "correo"
    }
    if(expreso){
        envio = "expreso"
    }
    if(moto){
        envio = "moto"
    }
    
    if(contacto != "Cliente_del_local" && numero_mail == ""){
        alert("ingresar numero o mail");
        return;
    }
    if(cliente == ""){
        alert("ingresar campo cliente");
        return;
    }

    const data = {
        cliente: cliente,
        prepara: prepara,
        contacto: contacto,
        numero_mail: numero_mail,
        pedido: pedido,
        envio: envio,
        forma_de_pago: formaDePago,
        zona: zona_guardado,
        estado: est_pedido
    }
    console.log(data)
    socket.emit("nuevo-pedido-local", data)

    //BORRAR DATOS TODO
    document.querySelector("#cliente").value = " ";
    document.querySelector("#prepara").value = "Sin Asignar";    
    document.querySelector("#numero-mail").value = "ingresado";
    document.querySelector("#pedidoIngreso").value = " ";

    document.querySelector("#correoArgentino").checked = false;
    document.querySelector("#expreso").checked = false;
    document.querySelector("#moto").checked = false;
    document.querySelector("#pagoLocal").checked = false;
    document.querySelector("#pagoICBC").checked = false;    
    document.querySelector("#pagoMercadopago").checked = false;
}
socket.on("nuevo-pedido-local-res",res => {
    console.log(res)
    if(res){
        alert("Pedido ingresado correctamente");
    }else{
        alert("Fallo al ingresar intente nuevamente");
    }

    socket.emit("buscar-pedidos-local");
})

const draw = {
    orders: () => {
        mostrador.innerHTML = "";
        pedidos.forEach(p => {
            draw.pedido(p, mostrador);    
        });              
    },
    pedido: (p, area) => { 
            const fechaSplit = p.fecha.split("/");
            let suma = 0;
            if(anio != Number(fechaSplit[2])){
              suma += 365 * (anio - Number(fechaSplit[2]))
            }
            if(mes != Number(fechaSplit[1])){
              suma += 30 * (mes - Number(fechaSplit[1]))
            }
            if(dia != Number(fechaSplit[0])){
              suma += dia - Number(fechaSplit[0])
            }
            area.innerHTML += `
            <hr style="margin-top: 1rem;">
            <div class="cardItem">
                <div class="card border-success">        
                    <div class="card-body">
                        <h5 class="card-title">Orden N° ${p.num_orden}</h5>
                        <h5 class="card-title">Fecha De Ingreso: ${p.fecha}</h5>
                        <h5 class="card-title">Dias en preparacion: ${suma}</h5>
                        <h5 class="card-title">Cliente: ${p.cliente}</h5>                        
                        <h5 class="card-title">Prepara:</h5>
                            <select name="" id="preparado${p.num_orden}">
                                <option value="Alejandro" >Alejandro</option>
                                <option value="Eric" >Eric</option>
                                <option value="Graciela" >Graciela</option>
                                <option value="Javier" >Javier</option>
                                <option value="Karina" >Karina</option>
                                <option value="Mario" >Mario</option>
                                <option value="Monica" >Monica</option>
                                <option value="Oscar" selected>Oscar</option>
                            </select>    
                        <h5 class="card-title">Contacto: ${p.contacto[0].medio}</h5>  
                        <h5 class="card-title">Numero / Mail: ${p.contacto[0].nota}</h5>                     
                        <div class="">
                            <h5 class="card-title">Estado:</h5>
                            <select name="" id="estado${p.num_orden}">
                                <option value="Pedido Sin Asignar">Pedido Sin Asignar</option>
                                <option value="En preparacion">En preparacion</option>
                                <option value="En preparacion -- Falta Mercaderia">En preparacion</option>
                                <option value="Mercaderia encargada">Mercaderia encargada</option>
                                <option value="pasamos faltas">pasamos faltas</option>
                                <option value="Señado" >Señado</option>
                                <option value="Pedido Terminado">Pedido Terminado</option>
                                <option value="Importe pasado">Importe pasado</option>
                                <option value="Reiteramos aviso importe">Reiteramos aviso importe</option>
                                <option value="Pagado">Pagado</option>
                                <option value="Listo para enviar">Listo para enviar</option>
                                <option value="Listo para que retire">Listo para que retire</option>
                            </select>
                            <h5 class="card-title">Zona Guardado:</h5>
                            <select name="" id="zona${p.num_orden}" value=${p.zona}>
                                <option value="${p.zona}">${p.zona}</option>
                                <option value="Pedido Sin Asignar">Pedido Sin Asignar</option>
                                <option value="Zona Blanca">Zona Blanca</option>
                                <option value="Zona Amarilla" >Zona Amarilla</option>
                                <option value="Zona Estante" >Zona Estante</option>
                                <option value="Zona Verde" >Zona Verde</option>
                                <option value="Zona Caja" >Zona Caja</option>
                                <option value="Embolsado" >Embolsado</option>
                            </select>
                        </div>
                        <div class ="row" style="margin-top: 0.5rem;">
                            <h5 class="card-title" style="margin-top: 0.5rem;">Pedido:</h5>
                            <textarea name="" id="pedido${p.num_orden}" cols="3" rows="4">${p.pedido}</textarea>
                        </div> 
                        <h5 class="card-title" style="margin-top: 0.5rem;">Faltas:</h5>
                        <div class ="row" style="margin-top: 0.5rem;">
                            <textarea name="" id="faltas${p.num_orden}" cols="3" rows="4">${p.faltas}</textarea>
                        </div>
                        <div class ="row" style="margin-top: 0.5rem;">
                            <h5 class="card-title" style="margin-top: 0.5rem;">Notas:</h5>
                            <textarea name="anotaciones" id="anotaciones${p.num_orden}" cols="3" rows="4">${p.notas}</textarea>
                        </div> 
                        <div class ="row" style="margin-top: 0.5rem;">
                            <h5 class="card-title" style="margin-top: 0.5rem;">Paga:</h5>
                            
                            <fieldset>
                                <label for="pagoLocal${p.num_orden}">Paga en local</label>  
                                <input id="pagoLocal${p.num_orden}" type="radio" name="pagos">
                                <label for="pagoICBC${p.num_orden}">Por transferencia ICBC</label>  
                                <input id="pagoICBC${p.num_orden}" type="radio" name="pagos">
                                <label for="pagoMercadopago${p.num_orden}">Mercadopago</label>  
                                <input id="pagoMercadopago${p.num_orden}" type="radio" name="pagos">
                                <label for="pagoPresupuesto${p.num_orden}">Presupuesto</label>  
                                <input id="pagoPresupuesto${p.num_orden}" type="radio" name="pagos">
                            </fieldset>

                            <h5 class="card-title" style="margin-top: 2rem;">Retiro / Envío:</h5>
                            <fieldset>
                                <label for="retiraLocal${p.num_orden}">Retira en local</label>  
                                <input id="retiraLocal${p.num_orden}" type="radio" name="envios">
                                <label for="correoArgentino${p.num_orden}">Correo Argentino</label>  
                                <input id="correoArgentino${p.num_orden}" type="radio" name="envios">
                                <label for="expreso${p.num_orden}">Expreso</label>  
                                <input id="expreso${p.num_orden}" type="radio" name="envios">
                                <label for="moto${p.num_orden}">Moto</label>  
                                <input id="moto${p.num_orden}" type="radio" name="envios">
                            </fieldset>
                        </div>
                        <div class="card-footer row">
                        <button class="botonConfirmar btn btn-primary" style="margin-right: 20px;" onclick="agregarCambio(${p.num_orden})">Corfirmar</button>
                        <button class="botonConfirmar btn btn-danger" style="margin-right: 20px; margin-top: 0.5rem;" onclick="borrarPedido(${p.num_orden})">Borrar</button>
                      </div>
                    </div>
                </div>
            </div>    
        `
        draw.estado("estado"+p.num_orden, p.estado)
        draw.preparado("preparado"+p.num_orden, p.prepara)
        draw.zona("zona"+p.num_orden, p.zona)
        console.log(p.zona)
        if(p.envio || p.forma_de_pago){
            draw.checkBox(p.envio, p.forma_de_pago, p.num_orden)
        }
    },
    checkBox: (envio, pago, orden) => {
        
        switch(envio){
            case "retira":
                document.querySelector("#retiraLocal"+orden).checked = true;
            break; 
            case "correo":
                document.querySelector("#correoArgentino"+orden).checked = true;
            break;
            case "expreso":
                document.querySelector("#expreso"+orden).checked = true;
            break;
            case "moto":
                document.querySelector("#moto"+orden).checked = true;
            break;
        }
        switch(pago){
            case "local":
                document.querySelector("#pagoLocal"+orden).checked = true;
            break; 
            case "icbc":
                document.querySelector("#pagoICBC"+orden).checked = true;
            break;         
            case "mercadopago":
                document.querySelector("#pagoMercadopago"+orden).checked = true;
            break;
            case "presupuesto":
                document.querySelector("#pagoPresupuesto"+orden).checked = true;
            break;
        }
    },
    zona: (id, zona) => {
        console.log(id, zona)
        const select = document.querySelector("#"+id);
        select.innerHTML += `<option value="${zona}" selected>${zona}</option>`;
    },
    estado: (id, estado) => {
        const select = document.querySelector("#"+id);
        select.innerHTML += `<option value="${estado}" selected>${estado}</option>`;
    },
    preparado: function (id, preparado){
        const select = document.querySelector("#"+id);
        select.innerHTML += `<option value="${preparado}" selected>${preparado}</option>`;
    },
    tabla: (pedidos) => {
        
        mostrador.innerHTML = `
        <div class="tablaMensage"></div>          
        <table class="table table-striped" style="margin-top: 6rem;">
            <thead class="thead-light" >
            <tr>
            <th scope="col">- N°</th>
            <th scope="col">VENDEDOR</th>
            <th scope="col">DE FECHA</th>
            <th scope="col">DIAS EN PREPARACION</th>
            <th scope="col">CLIENTE</th>
            <th scope="col">ESTADO</th>
            <th scope="col">GUARDADO ZONA</th>
            <th scope="col"> ######## </th>
            <th scope="col"> BORRAR <input type="checkbox" id="seleccionar-todo" name="seleccionarTodo"></th>
            </tr>
            </thead>
            <tbody class="tableBody">
            
            </tbody>
        </table>
        <div class="editarPedido"></div>
        `;

        const body =  document.querySelector(".tableBody");
        pedidos.forEach(e =>{
            const fechaSplit = e.fecha.split("/");
            let suma = 0;
            if(anio != Number(fechaSplit[2])){
              suma += 365 * (anio - Number(fechaSplit[2]))
            }
            if(mes != Number(fechaSplit[1])){
              suma += 30 * (mes - Number(fechaSplit[1]))
            }
            if(dia != Number(fechaSplit[0])){
              suma += dia - Number(fechaSplit[0])
            }
            
            if(e.notas.length > 1|| e.pedido.length > 1){
                body.innerHTML += `
            <tr>
                <td><b>${e.num_orden}</b></td>
                <td><b>${e.prepara}</b></td>
                <td><b>${e.fecha}</b></td>
                <td><b>${suma}</b></td>
                <td><b>${e.cliente}</b></td>
                <td><b>${e.estado}</b></td>
                <td><b>${e.zona}</b></td>
                <td class="editarOrden" style="color: blue;"  data-bs-toggle="tooltip" data-bs-placement="right" title="${e.notas + " " + e.faltas}">[ EDITAR ]</td>
                <td><input class="borrarPedidoInput" type="checkbox" id="miCheckbox" name="miCheckbox"></td>
            </tr>
            `
            }else{
                body.innerHTML += `
            <tr>
                <td>${e.num_orden}</td>
                <td>${e.prepara}</td>
                <td>${e.fecha}</td>
                <td>${suma}</td>
                <td>${e.cliente}</td>
                <td>${e.estado}</td>
                <td>${e.zona}</td>
                <td class="editarOrden" style="color: blue;"  data-bs-toggle="tooltip" data-bs-placement="right" title="${e.notas + " " + e.faltas}">[ EDITAR ]</td>
                <td><input class="borrarPedidoInput" type="checkbox" id="miCheckbox" name="miCheckbox"></td>
            </tr>
            `
            }
            
            
        })
        
    }
}

function agregarCambio(orden){
    pedidos.forEach(e => {
      if(e.num_orden == orden){
        const notas = document.querySelector("#anotaciones"+e.num_orden).value;
        const preparado = document.querySelector("#preparado"+e.num_orden).value;
        const estado = document.querySelector("#estado"+e.num_orden).value;
        const faltas = document.querySelector("#faltas"+e.num_orden).value;
        const pedido = document.querySelector("#pedido"+e.num_orden).value;
        const zona = document.querySelector("#zona"+e.num_orden).value;
        
        //forma de pago
        const local = document.querySelector("#pagoLocal"+e.num_orden).checked;
        const icbc = document.querySelector("#pagoICBC"+e.num_orden).checked;
        const mercadopago = document.querySelector("#pagoMercadopago"+e.num_orden).checked;
        const presupuesto = document.querySelector("#pagoPresupuesto"+e.num_orden).checked;
        let formaDePago = "";

        if(local){
            formaDePago = "local"
        }
        if(icbc){
            formaDePago = "icbc"
        }
        if(mercadopago){
            formaDePago = "mercadopago"
        }
        if(presupuesto){
            formaDePago = "presupuesto"
        }
        //forma de envío
        let envio = "";
        const retiraLocal = document.querySelector("#retiraLocal"+e.num_orden).checked;
        const correo = document.querySelector("#correoArgentino"+e.num_orden).checked;
        const expreso = document.querySelector("#expreso"+e.num_orden).checked;
        const moto = document.querySelector("#moto"+e.num_orden).checked;
        if(retiraLocal){
            envio = "retira"
        }
        if(correo){
            envio = "correo"
        }
        if(expreso){
            envio = "expreso"
        }
        if(moto){
            envio = "moto"
        }

        e.notas = notas;
        e.prepara = preparado;
        e.estado = estado;
        e.faltas = faltas;
        e.pedido = pedido;
        e.forma_de_pago = formaDePago;
        e.envio = envio;
        e.zona = zona
        if(e.num_orden == orden){
            cambios.push(e);
        }
        confirmarCambios();
        return;
    }
    })
  }

  function confirmarCambios(){
    socket.emit("update-pedido-local", pedidos);
    return;
  }

  function editarPedido(orden, old){
    const edit = document.querySelector(".editarPedido");
    edit.innerHTML = "";
    pedidos.forEach(p => {
        if(p.num_orden == orden){
            
            edit.innerHTML = `
  
            <!-- The Modal -->
            <div id="myModal" class="modal" style="margin-top: 2.5rem; margin-left:5%; width: 90%;">
              <!-- Modal content -->
              <div class="modal-content">
                <span id="closeModal">&times;</span>
                <div class="cartaColores"></div>
              </div>
            </div>
            `
            modalCartaColor = document.querySelector(".cartaColores");
            modalCartaColor.style.display = "flex";
            draw.pedido(p, modalCartaColor)
            modal = document.getElementById("myModal");
            modal.style.display = "block";

            var span = document.getElementById("closeModal");
            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
                modal.style.display = "none";
                modalCartaColor.innerHTML = "";
            }

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
                if (event.target.classList == "closeModal") {
                    modal.style.display = "none";
                    modalCartaColor.innerHTML = "";
                }
            }
        }
    })
  }

  socket.on("update-pedido-local-res", res => {
    if(!res){
      alert("ERROR AL ACTUALIZAR");
      return;
    }
    socket.emit("buscar-pedidos-local");  
  });

  function borrarPedido(orden){
    const ok = confirm("DESEA BORRAR EL PEDIDO?");
    if(ok){    
      socket.emit("borrar-pedido-local", orden);
      socket.emit("chequear-pedidos-admin");
    }
  }

  function pedidosAnteriores() {
    socket.emit("pedidos-anteriores")
  }

  socket.on("pedidos-anteriores-res", data => {    
    pedidosTemp = pedidos;
    pedidos = data;
    draw.tabla(pedidos)
    
    document.querySelector(".tablaMensage").innerHTML = `
                    <h1 style="margin-top: 3rem;">PEDIDOS ANTERIORES</h1>                    
                    <input id="busquedaPedidoAnterior" class="form-control buscador my-2" type="text" name="buscar">
                    <button id="boton" class="boton btn btn-primary mb-2 btn-lg" type="submit" onclick="buscarPedidoAnterior()">Buscar</button>
                    
                    `
  })

  function pedidosTabla() {
    if(pedidosTemp != undefined){
        pedidos = pedidosTemp;
        pedidosTemp = undefined;
        draw.tabla(pedidos);        
        return;
    }else{
        draw.tabla(pedidos);        
        return;  
    }
  }
  
//CHATGPT
let tiempoInactividad = 300000; // 5 minutos en milisegundos
let tiempoRecarga = 30000; // 30 segundos en milisegundos
let tiempoUltimaActividad = Date.now();

function inactividad() {
  let tiempoActual = Date.now();
  if (tiempoActual - tiempoUltimaActividad > tiempoInactividad) {
    location.reload();
  }
  setTimeout(inactividad, tiempoRecarga);
}

document.addEventListener('mousemove', function() {
  tiempoUltimaActividad = Date.now();
});

document.addEventListener('keypress', function() {
  tiempoUltimaActividad = Date.now();
});

inactividad();

function buscarPedidoAnterior(){
    
    const query = document.querySelector("#busquedaPedidoAnterior");
    console.log(query.value)  
    if(query.value.length > 0){
        socket.emit("findOld", query.value)
    }else{
        alert("BARRA DE BUSQUEDA VACIA")
    }
}

socket.on("findOld-res", res => {
    pedidos = res
    draw.tabla(res)
    document.querySelector(".tablaMensage").innerHTML = `
                    <h1 style="margin-top: 3rem;">PEDIDOS ANTERIORES</h1>                    
                    <input id="busquedaPedidoAnterior" class="form-control buscador my-2" type="text" name="buscar">
                    <button id="boton" class="boton btn btn-primary mb-2 btn-lg" type="submit" onclick="buscarPedidoAnterior()">Buscar</button>
                    
                    `
    
});

mostrador.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        buscarPedidoAnterior()
    }
});

function imprimirPedidos(){
    window.print()
}

function borrarPedidosXInput(){
    const pedidos = document.querySelectorAll(".borrarPedidoInput")
    const pedidosABorrar = []
    for(const p of pedidos){
        if(p.checked){
            const borrar = {
                orden: p.parentElement.parentElement.children[0].textContent,
                cliente: p.parentElement.parentElement.children[4].textContent
            }
            pedidosABorrar.push(borrar)            
        }        
    } 
    
    let aviso = ""
    if(pedidosABorrar.length > 0){
        for(const p of pedidosABorrar){
            aviso += p.cliente + " | "
        }
    }

    const confirmar = window.confirm("DESEA BORRAR LOS PEDIDOS DE: " + aviso)
    
    if(confirmar){
        for(const p of pedidosABorrar){
            socket.emit("borrar-pedido-local", p.orden);
        }
        alert("PEDIDOS BORRADOS")        
        socket.emit("chequear-pedidos-admin");
    }else{
        for(const p of pedidos){
            p.checked = false
        }
    }    
}



//completar input busqueda con clientes
function completarBusqueda(agenda, input, listado){
    const searchInput = document.getElementById(input);
    const suggestionsContainer = document.getElementById(listado);
    console.log(searchInput, suggestionsContainer)
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim();
        // Simplemente como ejemplo, aquí generamos algunas sugerencias de búsqueda aleatorias.
        const suggestions = generateSuggestions(searchTerm, agenda);
        // Limpiamos el contenedor de sugerencias
        suggestionsContainer.innerHTML = '';

       
        // Mostramos las sugerencias en el contenedor
        suggestions.forEach(suggestion => {
          const suggestionElement = document.createElement('div');
          suggestionElement.classList.add('suggestion');
          suggestionElement.textContent = suggestion;     
          
          // Crear el ícono de cruz
        //   const crossWrap = document.createElement('div');
        //   const crossIcon = document.createElement('i');
        //   crossIcon.classList.add('fas', 'fa-times', 'borrar-lista-cliente');
        //   crossIcon.setAttribute('value', suggestion);
        //   crossIcon.style.position = 'absolute';
        //   crossIcon.style.right = '1rem';
        //   crossIcon.style.top = '1rem';


          // Agregar el ícono al DOM
        //   

          suggestionElement.addEventListener('click', function() {
              // Al hacer clic en una sugerencia, puedes realizar alguna acción, como llenar el campo de búsqueda
              searchInput.value = suggestion

              // También puedes ocultar las sugerencias o realizar otra lógica aquí
              suggestionsContainer.style.display = 'none';
              
          });
        

          suggestionsContainer.appendChild(suggestionElement);
        });

        document.querySelectorAll(".suggestion").forEach(e => {
          
        })

        // Mostramos el contenedor de sugerencias si hay sugerencias disponibles
        if (suggestions.length > 0) {
          suggestionsContainer.style.display = 'block';
        } else {   
            suggestionsContainer.style.display = 'none';            
        }
        console.log(suggestions, suggestionsContainer)

        // Evento de clic en el documento para ocultar la barra de sugerencias
    document.addEventListener('click', function(event) {
      const isClickInsideSearch = searchInput.contains(event.target);
      const isClickInsideSuggestions = suggestionsContainer.contains(event.target);

      if (!isClickInsideSearch && !isClickInsideSuggestions) {
          suggestionsContainer.style.display = 'none';
      }
    });  
    });   
  }

// Función para generar sugerencias de búsqueda
function generateSuggestions(query, clientes) {
    const suggestions = [];
    const check = query.toUpperCase()
    for (const c of clientes) {
        if(c.includes(check))
        suggestions.push(c);
    }
    return suggestions;
}

socket.emit("req-cli")
socket.on("req-cli-res", clientes => completarBusqueda(clientes, "searchInputTareasInicio", "suggestionsContainerTareasInicio"))


// if(mouse.classList.contains("borrar-lista-cliente")){
//     Swal.fire({
//       title: "Queres borrar al cliente de la lista?",
//       text: "",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Si!!, borrar!"
//     }).then((result) => {
//       if (result.isConfirmed) {
//         Swal.fire({
//           title: "Borrado!",
//           text: "El cliente fue borrado.",
//           icon: "success"
//         });
//         const cliente = mouse.parentElement.parentElement.textContent
//         if(cliente){
//           socket.emit("borrar-cliente-lista", cliente)
//         }
//       }
//     });

