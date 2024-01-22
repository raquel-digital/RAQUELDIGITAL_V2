const clientes = []

async function agenda(){
    //document.getElementById("buscadorContainer").innerHTML = ""
    //const mostrador = document.getElementById("buscadorContainer")
    
    const data = await fetch("./system/dir/agenda.json")
    .then(response => {
      if (!response.ok) {      
        alert("Archivo agenda no encontrado")
        throw new Error('La solicitud no se pudo completar.');
      }
      return response.json();
    })
      
    const agenda = []
    data.forEach(e => agenda.push(e))
    
    entradaAgenda(agenda)
    eventosAgenda(agenda)
    socket.emit("req-cli")
  }

  //obtenemos lista de clientes
  socket.on("req-cli-res", data => {
    console.log("DATA CLIENTES RECIBIDA")

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
  
  function eventosAgenda(agenda){
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
        let exist = false

        agenda.forEach(e => {
          if(e.cliente == mouse.value){
            exist = true
            crearTarjetaCliente(e.cliente)
          }
        })
        if(!exist){
          const nuevoCliente = {            
            cliente: mouse.value,
            fecha_ingreso: "Por lista " + crearFecha(),
            nota: " ",
          }
          socket.emit("data-agenda", nuevoCliente)
          crearTarjetaCliente(nuevoCliente.cliente)
          //TODO PISA LOS DATOS ANTERIORES ENVIAR AGENDA ENTERA
        }
        
    }
  
    })
    //barra que completa busqueda de clientes
    completarBusqueda()
  }
  
  function entradaAgenda(agenda){
    mostrador.innerHTML = pantallaInicio()
    const entradasAgenda = document.querySelector(".entradasAgenda")
    agenda.forEach(e => {
      entradasAgenda.innerHTML += `
      <div class="cardItem col-4">
      <hr><div class="card border-success">
      <h1>${e.cliente}</h1>
      <h4>Fecha ingreso: ${e.fecha}</h4>
        <div class="card-body">
          <textarea name="" cols="6" rows="4">${e.nota}</textarea>
          <button class="botonConfirmar btn btn-primary">CONFIRMAR</button>
        </div>
      </div>
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
  function completarBusqueda(){
    const searchInput = document.getElementById('searchInput');
    const suggestionsContainer = document.getElementById('suggestionsContainer');

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
            crearTarjetaCliente(suggestion)
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

function crearTarjetaCliente(d){
  const entradasAgenda = document.querySelector(".entradasAgenda")
  entradasAgenda.innerHTML = `<div class="row">
              <hr>
              <div class="cardItem">
              <hr><div class="card border-success">        
                <div class="card-body">
                <div class="row">
                  <h5 class="col">${d}</h5>
                </div>
                  <hr>
                  <h2 class="card-title">CLIENTE: ${d} FECHA: ${crearFecha()} DIAS EN PREPARACION: TODO FECHA INGRESO: TODO </h2>   
                  <h6></h6>       
                  <hr>
                  <div class="row">
                  <div class="col">
                  <a href="#num${d}colapse" data-bs-toggle="collapse" class=" float-left dropdown-toggle btn-outline-info btn-sm bg-info" style="color: white;">Pedido</a>
                          
                          <div class="collapse" id="num${d}colapse">
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
                                <tbody id="list${d}">
                                    
                                </tbody>
                                <tfoot >
                                    <tr class="total-compra-final">
                                    
                                    </tr>
                                    </tfoot>
                                </table> 
                                                                    
                            </div>
                            <hr>
                  
                    <a href="#faltas${d}colapse" data-bs-toggle="collapse" class=" float-left dropdown-toggle btn-outline-info btn-sm bg-info" style="color: white;">Faltas</a>
                    <hr> 

                            <div class="collapse" id="faltas${d}colapse">
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
                                <tbody id="list-faltas${d}">
                                    
                                </tbody>
                                <tfoot >
                                    <tr class="total-compra-final">
                                    
                                    </tr>
                                    </tfoot>
                                </table> 
                                                                    
                            </div>
                            <h6>Preparado por:</h6>
                    <select name="" id="preparado${d}">
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
                    <select name="" id="estado${d}">
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
                    <textarea name="" id="notasText${d}" cols="5" rows="5">${d}</textarea>

                          <div class="card-footer row">
                            <button class="botonConfirmar btn btn-primary" style="margin-right: 20px;">Corfirmar</button>
                            <button class="btn btn-danger" style="" onclick="borrarPedido('${d}')">Borrar</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </div>`

        return
}


function pantallaInicio(){
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
          <h5 class="card-title">Ingreso De Cliente:</h5>
      <p>Cliente:</p><input id="inputCliente" input value="">
      <h5 class="card-title" style="margin-top: 2rem;">nota:</h5>
      <textarea name="" id="ingresar" cols="6" rows="4"></textarea>
      <button id="ingresarBoton" class="btn btn-success" style="margin-bottom: 1rem;">Ingresar</button>
    </div>
    </div>
    
  `

  return inicio
}
  