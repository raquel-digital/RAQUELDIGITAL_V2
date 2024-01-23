const clientes = []
const agenda = []
async function agendaInicio(){
    //document.getElementById("buscadorContainer").innerHTML = ""
    //const mostrador = document.getElementById("buscadorContainer")
    
    //Obtenemos listado de los clientes en sistema
    const data = await fetch("./system/dir/agenda.json")
    .then(response => {
      if (!response.ok) {      
        alert("Archivo agenda no encontrado")
        throw new Error('La solicitud no se pudo completar.');
      }
      return response.json();
    })
    //Obtenemos listado de tareas
    const tareas = await fetch("./system/dir/tareasPendientes.json")
    .then(response => {
      if (!response.ok) {      
        alert("Archivo agenda no encontrado")
        throw new Error('La solicitud no se pudo completar.');
      }
      return response.json();
    })    
    
    data.forEach(e => agenda.push(e))
    
    entradaTareas(tareas, agenda)
    eventosAgenda(agenda, tareas)
    socket.emit("req-cli")
  }

  //obtenemos lista de clientes
  socket.on("req-cli-res", data => {

    data.forEach(e => {
        const str = e.replace(/_/g, " ")
        clientes.push(str)
    })

    //CREA UN SELECT CON TODOS LOS CLIENTES
    const select = document.getElementById("listadoClientes")
    select.innerHTML = `<option value="" disabled>Seleccionar Cliente</option>`;

    const optionsHTML = clientes.map(e => `<option value="${e}">${e}</option>`).join('');
    select.innerHTML += optionsHTML;

  })
  
  function eventosAgenda(agenda, tareas){
    mostrador.addEventListener("click", e => {
      const mouse = e.target
  
      if(mouse.id == "ingresarBoton"){
        const data = {
          nota: document.getElementById("ingresar").value,
          cliente: document.getElementById("inputCliente").value,
          fecha: crearFecha()
        }
        agenda.push(data)
        socket.emit("data-agenda", agenda)
      }
      if(mouse.classList.contains("borrarCliente")){
        console.log(mouse.value)
        const data = clientes.filter(e => e != mouse.value)
        const emit = data.map(e => {           
                const str = e.replace(" ", "_")
                return str
        })
        socket.emit("borrar-cliente", emit)
      }
      if(mouse.id == "listadoClientes"){

          crearTarjetaCliente(mouse.value, agenda)
      }
      
      if(mouse.id == "ingresar-tarea"){

        const tarea = {
          cliente: document.getElementById("searchInputTareas").value,
          tipo_de_tarea: document.getElementById("tipo-tarea").value,
          tarea: document.getElementById("tareaIngreso").value,
          fecha: crearFecha(),
          estado: "pendiente"
        }
        console.log(tarea)
        tareas.push(tarea)
        socket.emit("tarea-nueva", tareas)
      }
    })
    //barra que completa busqueda de clientes
    completarBusqueda(agenda, 'searchInput', 'suggestionsContainer')
    completarBusqueda(agenda, "searchInputTareas", "suggestionsContainerTareas")
  }

  //recibimos las tareas recien ingresadas
  socket.on("tarea-nueva-res", update => {
    entradaTareas(update, agenda)
  })
  
  function entradaTareas(tareas, agenda){
    mostrador.innerHTML = pantallaInicio(agenda)
    const entradasAgenda = document.querySelector(".entradasAgenda")
    entradasAgenda.innerHTML = `
    <h1>TAREAS PENDIENTES:</h1>
      <ul style="list-style-type: none; padding: 0; width: 300px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);"></ul>
      `
    tareas.forEach(e => {      
      entradasAgenda.innerHTML += `
        <li style="padding: 12px; border-bottom: 1px solid #e0e0e0; display: flex; align-items: center;">
            <label style="flex: 1; display: flex; align-items: center; cursor: pointer;">
                CIENTE: ${e.cliente} FECHA: ${e.fecha} Tipo: ${e.tipo_de_tarea} TAREA: ${e.tarea}
                <input type="checkbox" style="margin-left: 10px; cursor: pointer;">
            </label>
        </li>
        `
    })
  }

  // UTILS
  function crearFecha() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;        
    const fecha = dd + '/' + mm + '/' + yyyy;
    return fecha;
  }
  
  socket.on("data-agenda-res", () => {
    agenda()
  })



  //completar input busqueda con clientes
  function completarBusqueda(agenda, input, listado){
    const searchInput = document.getElementById(input);
    const suggestionsContainer = document.getElementById(listado);

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim();
        // Simplemente como ejemplo, aquí generamos algunas sugerencias de búsqueda aleatorias.
        const suggestions = generateSuggestions(searchTerm);
        // Limpiamos el contenedor de sugerencias
        suggestionsContainer.innerHTML = '';

        // Mostramos las sugerencias en el contenedor
        suggestions.forEach(suggestion => {
        const suggestionElement = document.createElement('div');
        suggestionElement.classList.add('suggestion');
        suggestionElement.textContent = suggestion;

        suggestionElement.addEventListener('click', function() {
            // Al hacer clic en una sugerencia, puedes realizar alguna acción, como llenar el campo de búsqueda
            searchInput.value = suggestion;
            // También puedes ocultar las sugerencias o realizar otra lógica aquí
            suggestionsContainer.style.display = 'none';
            //esccribimos la tarjeta
            crearTarjetaCliente(suggestion, agenda)
        });

        suggestionsContainer.appendChild(suggestionElement);
        });

        // Mostramos el contenedor de sugerencias si hay sugerencias disponibles
        if (suggestions.length > 0) {
        suggestionsContainer.style.display = 'block';
        } else {
        suggestionsContainer.style.display = 'none';
        }
    });   
  }

// Función para generar sugerencias de búsqueda
function generateSuggestions(query) {
    const suggestions = [];
    const check = query.toUpperCase()
    for (const c of clientes) {
        if(c.includes(check))
        suggestions.push(c);
    }
    return suggestions;
}

//borrar pedidos todo
function borrarPedido(cliente){
  const check = confirm("Borrar?", cliente)
  if(check){
    alert("MOCK DE BORRADO DE " + cliente)
  }
}

//***********  INNERS HTML ************** */

function crearTarjetaCliente(d, agenda){

  let cliente = agenda.filter(objeto => objeto.cliente === d);  

  if(!cliente){
    cliente = {    
      fecha_ingreso: "Por lista " + crearFecha(),
      fecha: "Por lista " + crearFecha(),        
      cliente: d,
      facturacion_tipo: "",
      contacto: "",      
      nota: " ",
      pedidos_activos: [],
      pedidos_anteriores: [],
      articulos_lleva: []
    }
    notas = " "
    agenda.push(cliente)  
  }


  
  const entradasAgenda = document.querySelector(".entradasAgenda")
  entradasAgenda.innerHTML = `<div class="row">
              <hr>
              <div class="cardItem">
              <hr><div class="card border-success">        
                <div class="card-body">
                <div class="row">
                  <h5 class="col">${cliente.cliente}</h5>
                </div>
                  <hr>
                  <h2 class="card-title">CLIENTE: ${cliente.cliente} FECHA: ${crearFecha()} DIAS EN PREPARACION: TODO FECHA INGRESO: TODO </h2>   
                  <h6></h6>       
                  <hr>
                  <div class="row">
                  <div class="col">
                  <a href="#num${cliente.cliente}colapse" data-bs-toggle="collapse" class=" float-left dropdown-toggle btn-outline-info btn-sm bg-info" style="color: white;">Pedido</a>
                          
                          <div class="collapse" id="num${cliente.cliente}colapse">
                              <hr>
                              <table class="table table-striped table-hover tablaOrden">
                                <thead>
                                <tr>
                                    <th>codigo</th>
                                    <th>titulo</th>
                                    <th>precio unitario</th>
                                    <th>cantidad</th>
                                    <th>total</th>
                                    <th>borrar</th>
                                </tr>
                                </thead>
                                <tbody id="list${cliente.cliente}">
                                    
                                </tbody>
                                <tfoot >
                                    <tr class="total-compra-final">
                                    
                                    </tr>
                                    </tfoot>
                                </table> 
                                                                    
                            </div>
                            <hr>
                  
                    <a href="#faltas${cliente.cliente}colapse" data-bs-toggle="collapse" class=" float-left dropdown-toggle btn-outline-info btn-sm bg-info" style="color: white;">Faltas</a>
                    <hr> 

                            <div class="collapse" id="faltas${cliente.cliente}colapse">
                              <hr>
                              <table class="table table-striped table-hover tablaOrden">
                                <thead>
                                <tr>
                                    <th>codigo</th>
                                    <th>titulo</th>
                                    <th>precio unitario</th>
                                    <th>cantidad</th>
                                    <th>fecha de entrega</th>
                                    <th>borrar</th>
                                </tr>
                                </thead>
                                <tbody id="list-faltas${cliente.cliente}">
                                    
                                </tbody>
                                <tfoot >
                                    <tr class="total-compra-final">
                                    
                                    </tr>
                                    </tfoot>
                                </table> 
                                                                    
                            </div>
                            <h6>Preparado por:</h6>
                    <select name="" id="preparado${cliente.cliente}">
                      <option value="Oscar" selected>Oscar</option>
                      <option value="Javier" >Javier</option>        
                      <option value="Alejandro" >Alejandro</option>
                      <option value="Eric" >Eric</option>
                      <option value="Graciela" >Graciela</option>
                      <option value="Karina" >Karina</option>
                      <option value="Mario" >Mario</option>
                    </select>
                    <hr> 
                    </div>

                    <hr>
                    <h6>Estado</h6>
                    <select name="" id="estado${cliente.cliente}">
                      <option value="Pagado" >Pagado</option>
                      <option value="Pedido Sin Asignar">Pedido Sin Asignar</option>
                      <option value="En preparacion" >En preparacion</option> 
                      <option value="Pasamos faltas" >Pasamos faltas</option> 
                      <option value="Sumando al pedido">Sumando al pedido</option>        
                      <option value="Importe pasado" >Importe pasado</option>
                      <option value="Reiteramos aviso importe">Reiteramos aviso importe</option>
                      <option value="Listo para enviar" >Listo para enviar</option>
                      <option value="Listo para que retire" >Listo para que retire</option>
                      <option value="Salio">Salio</option>
                    </select>
                    <hr>
                    <h6>Notas:</h6>
                    <textarea name="" id="notasText${cliente.cliente}" cols="5" rows="5">${cliente.cliente.nota}</textarea>

                          <div class="card-footer row">
                            <button class="botonConfirmar btn btn-primary" data-cliente="${JSON.stringify(cliente)}" style="margin-right: 20px;">Corfirmar</button>
                            <button class="btn btn-danger" style="" onclick="borrarPedido('${cliente.cliented}')">Borrar</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </div>`

        return
}


function pantallaInicio(agenda){
  const inicio = `
  <style>
      body {
      font-family: Arial, sans-serif;
      }

      .search-container {
      position: relative;
      width: 90%;
      margin: 20px auto;
      }

      .search-input {
      width: 100%;
      padding: 10px;
      font-size: 16px;
      }

      .suggestions-container {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      background-color: #fff;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      z-index: 1;
      }

      .suggestion {
      padding: 10px;
      border-bottom: 1px solid #ddd;
      cursor: pointer;
      }

      .suggestion:hover {
      background-color: #f9f9f9;
      }
    </style>

      <h1>Agenda ${crearFecha()}</h1>
      <div class="row">
        <div class="search-container">
          <input type="text" class="search-input" id="searchInput" placeholder="Buscar...">
          <div class="suggestions-container" id="suggestionsContainer"></div>
        </div> 
      </div>
    
    <select id="listadoClientes">        
    </select>   

    <div class="row entradasAgenda">
    </div>

    <div class="row" style="margin-top: 10%;">
    <div class="card col-6" style="background-color: rgb(195, 195, 195); margin-top: 6rem; width: 60rem;">
          <h5 class="card-title">Ingreso de clientes:</h5>
      <p>Cliente:</p><input id="inputCliente" input value="">
      <h5 class="card-title" style="margin-top: 2rem;">nota:</h5>
      <textarea name="" id="ingresar" cols="6" rows="4"></textarea>
      <button id="ingresarBoton" class="btn btn-success" style="margin-bottom: 1rem;">Ingresar</button>
    </div>
    </div>

    <hr>  

    <div class="ingresoPedido card col-6" style="background-color: rgb(195, 195, 195); margin-top: 6rem; width: 60rem;">
            <h5 class="card-title">Ingreso De Tareas:</h5>
            <div class="card-body">

            <div class="search-container">
            <h4>Cliente:</h4>
              <input type="text" class="search-input" id="searchInputTareas" placeholder="Buscar...">
              <div class="suggestions-container" id="suggestionsContainerTareas"></div>
            </div>
                    
                    <label for="contacto">Tipo de tarea:</label>
                    <select name="" id="tipo-tarea">
                        <option value="Tarea General">Tarea General</option>
                        <option value="Modificaciones en web">Modificaciones en web</option>
                        <option value="Actualizacion Articulos Web">Actualizacion Articulos Web</option>
                        <option value="Encargar Artículo">Encargar Artículo</option>
                    </select>
                    
                    <div class="row">
                        <h5 class="card-title" style="margin-top: 2rem;">Tarea:</h5>
                        <textarea name="" id="tareaIngreso" cols="6" rows="4"></textarea>
                    </div>
                    </div>
                    
                    <button id="ingresar-tarea" class="btn btn-primary" style="width: 30rem; margin-top: 2rem; margin-left: 16rem; margin-bottom: 1rem;">Enviar</button>
                
            </div>
     
        </div>
    
  `
  return inicio
}
  