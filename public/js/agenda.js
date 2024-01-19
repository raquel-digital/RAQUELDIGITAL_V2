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
    const select = document.getElementById("listadoClientes")
    select.innerHTML = `<option value="" disabled>Seleccionar Cliente</option>`
    data.forEach(e => {
        //const str = e.replace("_", " ")
        select.innerHTML += `<option value="${e}">${e}</option>`
        clientes.push(e)
    })
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
        targetaCliente(mouse.value)
    }
  
    })
    //barra que completa busqueda de clientes
    completarBusqueda()
  }
  
  function entradaAgenda(agenda){
    mostrador.innerHTML = `
    <style>
        body {
        font-family: Arial, sans-serif;
        }

        .search-container {
        position: relative;
        width: 300px;
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

        <div class="search-container">
        <input type="text" class="search-input" id="searchInput" placeholder="Buscar...">
        <div class="suggestions-container" id="suggestionsContainer"></div>
        </div> 
      <h1>Agenda ${crearFecha()}</h1>
      <select id="listadoClientes">
        
      </select>   
      <div class="row">
        <p>Cliente:</p><input id="inputCliente" input value="">
        <h5 class="card-title" style="margin-top: 2rem;">nota:</h5>
        <textarea name="" id="ingresar" cols="6" rows="4"></textarea>
        <button id="ingresarBoton" class="btn btn-success">Ingresar</button>
      </div>
      <div class="row entradasAgenda">
      </div>
    `
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

  function targetaCliente(data){
    const entradasAgenda = document.querySelector(".entradasAgenda")
    entradasAgenda.innerHTML = ""
    entradasAgenda.innerHTML += `
     <div class="cardItem col-4">
        <hr><div class="card border-success">
        <h1>${data}</h1>
        <h4>Fecha ingreso: ${crearFecha()}</h4>
          <div class="card-body">
          <div class="row">
            <textarea name=""></textarea>
          </div>
          <div class="row">
            <button class="botonConfirmar btn btn-primary">CONFIRMAR</button>
            <button class="btn btn-danger borrarCliente" value=${data}>BORRAR</button>
          </div>
         </div>
      </div>
      `
  }
  
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
        console.log(searchTerm)
        // Simplemente como ejemplo, aquí generamos algunas sugerencias de búsqueda aleatorias.
        const suggestions = generateSuggestions(searchTerm);
        console.log(suggestions)
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

   // Función de ejemplo para generar sugerencias de búsqueda aleatorias
function generateSuggestions(query) {
    const suggestions = [];
    const check = query.toUpperCase()
    for (const c of clientes) {
        if(c.includes(check))
        suggestions.push(c);
    }
    return suggestions;
}
  